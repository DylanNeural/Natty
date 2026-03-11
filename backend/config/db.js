// backend/config/db.js
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

// Cache de connexion pour environnement serverless (Vercel)
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI manquant dans les variables d'environnement");
  }

  // Réutilise la connexion existante (important pour serverless)
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
    });
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
    throw error; // Ne pas process.exit() en serverless
  }
}

module.exports = connectDB;

