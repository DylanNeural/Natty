require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./backend/config/db");
const logger = require("./backend/logs/logger");
const { globalLimiter } = require("./backend/security/ratelimit");

const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");
const adminRoutes = require("./backend/routes/admin.routes");

const app = express();
const isProd = process.env.NODE_ENV === "production";
const trustProxy = isProd || String(process.env.TRUST_PROXY || "").trim() === "1";

app.disable("x-powered-by");
if (trustProxy) {
  // Required behind Render/Vercel/Railway/Nginx/any reverse proxy for `req.secure` and correct client IP.
  app.set("trust proxy", 1);
}

logger.info("ROOT server.js started", {}, "server");

connectDB()
  .then(() => logger.info("MongoDB connected", {}, "database"))
  .catch((err) => logger.error("MongoDB connection error", { error: err.message }, "database"));

const morganStream = {
  write: (msg) => logger.info(msg.trim(), {}, "http"),
};
app.use(morgan("combined", { stream: morganStream }));

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
    frameguard: { action: "deny" },
    // HSTS should be enabled only in production over HTTPS.
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
  })
);
logger.info("Helmet configured", {}, "middleware");

// Redirect HTTP -> HTTPS in production (when TLS is terminated by a proxy).
// Keep local dev on HTTP.
if (isProd && String(process.env.ENFORCE_HTTPS || "1") !== "0") {
  app.use((req, res, next) => {
    if (req.secure) return next();

    const host = req.headers.host;
    if (!host) return next();

    // 308 keeps method and body (safe for POST/PUT).
    return res.redirect(308, `https://${host}${req.originalUrl}`);
  });
}

// -------- CORS --------
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://nattyfront.vercel.app",
];

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);
const isAllowedOrigin = (origin) => !origin || allowedOrigins.has(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      logger.warn("CORS origin refused", { origin }, "security");
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    optionsSuccessStatus: 200,
  })
);
logger.info("CORS configured", { origins: Array.from(allowedOrigins) }, "middleware");

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
logger.info("JSON and URL-encoded parsers enabled", { limit: "5mb" }, "middleware");

// =====================
// GLOBAL RATE LIMIT
// =====================
// Apply to all API routes. Specific limiters (login/chatbot) stay in place and can be stricter.
app.use("/api", globalLimiter);

// =====================
// ROUTES
// =====================
app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", require("./backend/routes/chatbot.routes"));
app.use("/api/articles", require("./backend/routes/articles.routes"));
app.use("/api/challenges", require("./backend/routes/challenges.routes"));
app.use("/api/fridges", require("./backend/routes/fridges.routes"));
app.use("/api", scanRoutes);

logger.info("All API routes loaded", {}, "routes");

app.get("/", (_req, res) => {
  res.send("Natty API online");
});

app.post("/api/_ping_scan", (req, res) => {
  logger.info("_ping_scan called", { body: req.body }, "probe");
  res.json({ ok: true, where: "root server.js", body: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Backend server started on http://localhost:${PORT}`, {}, "server");
});
