require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const csrf = require("csurf");

const connectDB = require("./backend/config/db");
const logger = require("./backend/logs/logger");
const { globalLimiter, chatbotLimiter } = require("./backend/security/ratelimit");

const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");
const adminRoutes = require("./backend/routes/admin.routes");

const app = express();
const isProd = process.env.NODE_ENV === "production";
const trustProxy = isProd || String(process.env.TRUST_PROXY || "").trim() === "1";

app.disable("x-powered-by");
if (trustProxy) {
  app.set("trust proxy", 1);
}

logger.info("ROOT server.js started", {}, "server");

connectDB()
  .then(() => logger.info("MongoDB connected", {}, "database"))
  .catch((err) => logger.error("MongoDB connection error", { error: err.message }, "database"));

// =====================
// CORS ORIGINS
// =====================
const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8082",
  "http://127.0.0.1:8082",
  "https://nattyfront.vercel.app",
  "https://tranquil-profiterole-5cdaa6.netlify.app",
];

const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);
const isAllowedOrigin = (origin) => !origin || allowedOrigins.has(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    logger.warn("CORS origin refused", { origin }, "security");
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

// =====================
// MIDDLEWARES (order matters)
// =====================
const morganStream = { write: (msg) => logger.info(msg.trim(), {}, "http") };
app.use(morgan("combined", { stream: morganStream }));

// 1. Helmet — single call with full config
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
  })
);
logger.info("Helmet configured", {}, "middleware");

// 2. HTTPS redirect in production
if (isProd && String(process.env.ENFORCE_HTTPS || "1") !== "0") {
  app.use((req, res, next) => {
    if (req.secure) return next();
    const host = req.headers.host;
    if (!host) return next();
    return res.redirect(308, `https://${host}${req.originalUrl}`);
  });
}

// 3. CORS — explicit preflight handler BEFORE all other middleware so OPTIONS
//    never touches CSRF, rate-limiters, or any route logic.
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
logger.info("CORS configured", { origins: Array.from(allowedOrigins) }, "middleware");

// 4. Cookies + body parsers
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
// Larger limit for the scan route
app.use("/api/scan", express.json({ limit: "8mb" }));
logger.info("Parsers enabled", {}, "middleware");

// 5. Global rate-limit on all /api routes
app.use("/api", globalLimiter);

// =====================
// CSRF
// =====================
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  },
});

function skipCsrfForNativeRequests(req, res, next) {
  // Preflight is already handled above; guard here just in case
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization || "";
  const xRequestedWith = (req.headers["x-requested-with"] || "").toString();
  const skipOrigins = ["http://localhost:8082", "http://10.31.33.125:8082"];

  if (authHeader.startsWith("Bearer ")) return next();
  if (xRequestedWith.toLowerCase() === "xmlhttprequest") return next();
  if (skipOrigins.includes(req.headers.origin)) return next();

  return csrfProtection(req, res, next);
}

// =====================
// ROUTES
// =====================
app.use("/api/auth", skipCsrfForNativeRequests, authRoutes);
logger.info("Route /api/auth loaded", {}, "routes");

app.use("/api/meals", skipCsrfForNativeRequests, mealsRoutes);
logger.info("Route /api/meals loaded", {}, "routes");

app.use("/api/chatbot", chatbotLimiter, skipCsrfForNativeRequests, require("./backend/routes/chatbot.routes"));
logger.info("Route /api/chatbot loaded", {}, "routes");

app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));
app.use("/api/admin", adminRoutes);
app.use("/api/articles", require("./backend/routes/articles.routes"));
app.use("/api/challenges", require("./backend/routes/challenges.routes"));
app.use("/api/fridges", require("./backend/routes/fridges.routes"));
app.use("/api", scanRoutes);

logger.info("All API routes loaded", {}, "routes");

// =====================
// PROBE / TEST
// =====================
app.post("/api/_ping_scan", csrfProtection, (req, res) => {
  logger.info("_ping_scan appelé", { body: req.body }, "probe");
  res.json({ ok: true, where: "root server.js", body: req.body });
});

app.get("/", (req, res) => {
  logger.info("Route racine appelée", {}, "server");
  res.send("API Natty en ligne ✅");
});

// =====================
// ERROR HANDLING
// =====================
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    logger.warn("Payload trop volumineux", { ip: req.ip, path: req.path }, "server");
    return res.status(413).json({ message: "Image trop volumineuse pour le scan" });
  }
  if (err.code === "EBADCSRFTOKEN") {
    logger.warn("CSRF token invalide", { ip: req.ip }, "security");
    return res.status(403).json({ message: "CSRF token invalide ou manquant" });
  }
  logger.error("Erreur non gérée", { error: err.message }, "server");
  res.status(500).json({ message: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Backend server started on http://localhost:${PORT}`, {}, "server");
});
