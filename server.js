require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const connectDB = require("./backend/config/db");
const logger = require("./backend/logs/logger");
const { globalLimiter, loginLimiter, chatbotLimiter } = require("./backend/security/ratelimit");

// =====================
// APP
// =====================
const app = express();

// =====================
// CONNEXION DB
// =====================
connectDB()
    .then(() => logger.info("✅ MongoDB connecté", {}, "database"))
    .catch((err) => logger.error("❌ Erreur MongoDB", { error: err.message }, "database"));

// =====================
// LOGS DIR
// =====================
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// =====================
// CSRF
// =====================
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
});

// =====================
// MIDDLEWARES (ordre crucial)
// =====================

// 1. Sécurité headers
app.use(helmet());
logger.info("Helmet chargé", {}, "middleware");

// 2. CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
}));
logger.info("CORS configuré", { origin: process.env.FRONTEND_URL }, "middleware");

// 3. Rate limit global
app.use(globalLimiter);
logger.info("Rate limiter global activé", {}, "middleware");

// 4. Cookie parser (requis avant CSRF)
app.use(cookieParser());

// 5. Logger HTTP
const morganStream = { write: (msg) => logger.info(msg.trim(), {}, "http") };
app.use(morgan("combined", { stream: morganStream }));

// 6. Parsers JSON
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
logger.info("Parsers activés", { limit: "10kb" }, "middleware");

// =====================
// CSRF TOKEN ROUTE
// =====================
app.get("/api/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", loginLimiter, csrfProtection, require("./backend/routes/auth.routes"));
logger.info("Route /api/auth chargée", {}, "routes");

app.use("/api/meals", csrfProtection, require("./backend/routes/meals.routes"));
logger.info("Route /api/meals chargée", {}, "routes");

app.use("/api/chatbot", chatbotLimiter, csrfProtection, require("./backend/routes/chatbot.routes"));
logger.info("Route /api/chatbot chargée", {}, "routes");

app.use("/api/profile", require("./backend/routes/profile.routes"));
logger.info("Route /api/profile chargée", {}, "routes");

app.use("/api/progress", require("./backend/routes/progress.routes"));
logger.info("Route /api/progress chargée", {}, "routes");

app.use("/api", csrfProtection, require("./backend/routes/scan.routes"));
logger.info("Route /api/scan chargée", {}, "routes");

// =====================
// SONDE / TEST
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
// GESTION ERREURS
// =====================
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        logger.warn("CSRF token invalide", { ip: req.ip }, "security");
        return res.status(403).json({ message: "CSRF token invalide ou manquant" });
    }
    logger.error("Erreur non gérée", { error: err.message }, "server");
    res.status(500).json({ message: "Erreur interne du serveur" });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    logger.info(`✅ Serveur démarré sur http://localhost:${PORT}`, {}, "server");
});