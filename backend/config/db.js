// backend/config/db.js
const dns = require("dns");

try {
  // Apply DNS resolver override early to improve mongodb+srv resolution reliability.
  require("./dns-fix");
  dns.setDefaultResultOrder("ipv4first");
} catch (error) {
  console.warn("⚠️ DNS fix non appliqué:", error.message);
}

const mongoose = require("mongoose");
const { URL, URLSearchParams } = require("url");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_SERVER_SELECTION_TIMEOUT_MS = Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000);
const MONGODB_CONNECT_TIMEOUT_MS = Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 10000);
const MONGODB_SOCKET_TIMEOUT_MS = Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 45000);
const MONGODB_CONNECT_RETRIES = Number(process.env.MONGODB_CONNECT_RETRIES || 0);
const MONGODB_CONNECT_RETRY_DELAY_MS = Number(process.env.MONGODB_CONNECT_RETRY_DELAY_MS || 1000);

async function resolveSrvHosts(hostname) {
  const resolver = new dns.promises.Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  return resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
}

async function buildDirectMongoUri(uriString) {
  if (!uriString.startsWith("mongodb+srv://")) {
    return uriString;
  }

  const uri = new URL(uriString);
  const dbName = uri.pathname === "/" ? "" : uri.pathname.slice(1);
  const username = uri.username ? encodeURIComponent(uri.username) : "";
  const password = uri.password ? encodeURIComponent(uri.password) : "";
  const host = uri.hostname;
  const query = new URLSearchParams(uri.searchParams);

  // Atlas SRV handling fallback
  const srvRecords = await resolveSrvHosts(host);
  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

  // Preserve authSource if present, otherwise use admin
  if (!query.has("authSource")) {
    query.set("authSource", "admin");
  }
  if (!query.has("retryWrites")) {
    query.set("retryWrites", "true");
  }
  if (!query.has("w")) {
    query.set("w", "majority");
  }
  if (!query.has("tls") && !query.has("ssl")) {
    query.set("tls", "true");
  }

  const authority = username ? `${username}:${password}@` : "";
  const dbPath = dbName ? `/${dbName}` : "";
  return `mongodb://${authority}${hosts}${dbPath}?${query.toString()}`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cache de connexion pour environnement serverless (Vercel)
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI_DIRECT || MONGODB_URI;

  if (!mongoUri) {
    throw new Error("❌ MONGODB_URI manquant dans les variables d'environnement");
  }

  // Réutilise la connexion existante (important pour serverless)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let lastError;
      let connectionUri = MONGODB_URI;

      if (connectionUri && connectionUri.startsWith("mongodb+srv://")) {
        try {
          connectionUri = await buildDirectMongoUri(connectionUri);
          console.log("MongoDB: fallback direct URI construit pour contourner SRV.");
        } catch (err) {
          console.warn("MongoDB: impossible de construire URI direct SRV fallback", err.message);
        }
      }

      for (let attempt = 1; attempt <= MONGODB_CONNECT_RETRIES + 1; attempt += 1) {
        try {
          return await mongoose.connect(connectionUri, {
            serverSelectionTimeoutMS: MONGODB_SERVER_SELECTION_TIMEOUT_MS,
            socketTimeoutMS: MONGODB_SOCKET_TIMEOUT_MS,
            connectTimeoutMS: MONGODB_CONNECT_TIMEOUT_MS,
            heartbeatFrequencyMS: 10000,
            maxPoolSize: 10,
            family: 4,
          });
        } catch (error) {
          lastError = error;
          const hasRetryLeft = attempt <= MONGODB_CONNECT_RETRIES;

          if (!hasRetryLeft) {
            break;
          }

          console.warn(
            `⚠️ Tentative MongoDB ${attempt} échouée: ${error.message}. Nouvelle tentative dans ${MONGODB_CONNECT_RETRY_DELAY_MS}ms...`
          );
          await wait(MONGODB_CONNECT_RETRY_DELAY_MS);
        }
      }

      throw lastError;
    })();
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connecté à MongoDB avec succès!");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    if (error.reason) {
      console.error("   Détails réseau:", error.reason.type || error.reason);
    }
    if (error?.reason?.type === "ReplicaSetNoPrimary") {
      console.error(
        "   Vérifie Atlas: cluster actif (non pausé), IP Access List en 0.0.0.0/0, et URI exacte depuis Atlas > Connect > Drivers"
      );
    }
    if (String(error?.message || "").includes("secureConnect")) {
      console.error(
        "   Timeout TLS: vérifie MONGODB_URI dans Vercel, user/mot de passe Atlas, et que le cluster Atlas est bien actif"
      );
    }
    if (String(error?.message || "").includes("querySrv")) {
      console.error(
        "   DNS SRV refusé. Option de contournement: définir MONGODB_URI_DIRECT avec l'URI standard mongodb:// (sans +srv) depuis Atlas > Connect > Drivers"
      );
    }
    throw error; // Ne pas process.exit() en serverless
  }
}

module.exports = connectDB;

