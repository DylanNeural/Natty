require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const csrf = require("csurf");

const connectDB = require("./backend/config/db");
const logger = require("./backend/logs/logger");
const {
    globalLimiter,
    loginLimiter,
    chatbotLimiter,
} = require("./backend/security/ratelimit");

// --- Routes existantes ---
const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");
const adminRoutes = require("./backend/routes/admin.routes");

// --- V1 : nouvelles routes ---
const fridgesRoutes = require("./backend/routes/fridges.routes");
const productsRoutes = require("./backend/routes/products.routes");
const ordersRoutes = require("./backend/routes/orders.routes");
const hydrationRoutes = require("./backend/routes/hydration.routes");
const fastingRoutes = require("./backend/routes/fasting.routes");
const challengesRoutes = require("./backend/routes/challenges.routes");
const socialRoutes = require("./backend/routes/social.routes");
const notificationsRoutes = require("./backend/routes/notifications.routes");
const subscriptionsRoutes = require("./backend/routes/subscriptions.routes");
const articlesRoutes = require("./backend/routes/articles.routes");
const userFridgeRoutes = require("./backend/routes/user-fridge.routes");
const wearablesRoutes = require("./backend/routes/wearables.routes");

const app = express();
const isProd = process.env.NODE_ENV === "production";
const trustProxy = isProd || String(process.env.TRUST_PROXY || "").trim() === "1";

app.disable("x-powered-by");
if (trustProxy) {
    app.set("trust proxy", 1);
}

logger.info("ROOT server.js started", {}, "server");

// =====================
// DATABASE
// =====================
connectDB()
    .then(() => logger.info("MongoDB connected", {}, "database"))
    .catch((err) =>
        logger.error("MongoDB connection error", { error: err.message }, "database")
    );

// =====================
// SECURITY HEADERS (helmet)
// =====================
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
        hsts: isProd
            ? { maxAge: 31536000, includeSubDomains: true, preload: true }
            : false,
        noSniff: true,
        referrerPolicy: { policy: "no-referrer" },
    })
);
logger.info("Helmet configured", {}, "middleware");

// =====================
// HTTPS REDIRECT (prod only)
// =====================
if (isProd && String(process.env.ENFORCE_HTTPS || "1") !== "0") {
    app.use((req, res, next) => {
        if (req.secure) return next();
        const host = req.headers.host;
        if (!host) return next();
        return res.redirect(308, `https://${host}${req.originalUrl}`);
    });
}

// =====================
// CORS
// =====================
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
    "http://localhost:8082",
    "http://10.31.33.125:8082",
    "http://10.31.34.46:3000",
    "https://nattyfront.vercel.app",
];

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);
const isAllowedOrigin = (origin) => !origin || allowedOrigins.has(origin);

app.use(
    cors({
        origin: (origin, callback) => {
            if (isAllowedOrigin(origin)) return callback(null, true);
            logger.warn("CORS origin refused", { origin }, "security");
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "X-Requested-With",
        ],
        optionsSuccessStatus: 200,
    })
);
logger.info("CORS configured", { origins: Array.from(allowedOrigins) }, "middleware");

// =====================
// PARSERS
// =====================
app.use(cookieParser());
app.use("/api/scan", express.json({ limit: "8mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
logger.info("Parsers enabled", {}, "middleware");

// =====================
// HTTP LOGGER
// =====================
const morganStream = { write: (msg) => logger.info(msg.trim(), {}, "http") };
app.use(morgan("combined", { stream: morganStream }));

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
    const authHeader = req.headers.authorization || "";
    const xRequestedWith = (req.headers["x-requested-with"] || "").toString();
    const skipOrigins = ["http://localhost:8082", "http://10.31.33.125:8082"];

    if (authHeader.startsWith("Bearer ")) return next();
    if (xRequestedWith.toLowerCase() === "xmlhttprequest") return next();
    if (skipOrigins.includes(req.headers.origin)) return next();

    return csrfProtection(req, res, next);
}

// =====================
// GLOBAL RATE LIMIT
// =====================
app.use("/api", globalLimiter);

// =====================
// ROUTES
// =====================
app.use("/api/profile", require("./backend/routes/profile.routes"));
logger.info("Route /api/profile chargée", {}, "routes");

app.use("/api/progress", require("./backend/routes/progress.routes"));
logger.info("Route /api/progress chargée", {}, "routes");

app.use("/api/auth", loginLimiter, skipCsrfForNativeRequests, authRoutes);
logger.info("Route /api/auth chargée", {}, "routes");

app.use("/api/meals", skipCsrfForNativeRequests, mealsRoutes);
logger.info("Route /api/meals chargée", {}, "routes");

app.use("/api/admin", adminRoutes);
logger.info("Route /api/admin chargée", {}, "routes");

app.use(
    "/api/chatbot",
    chatbotLimiter,
    skipCsrfForNativeRequests,
    require("./backend/routes/chatbot.routes")
);
logger.info("Route /api/chatbot chargée", {}, "routes");

// --- V1 : nouvelles routes ---
app.use("/api/fridges", fridgesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/hydration", hydrationRoutes);
app.use("/api/fasting", fastingRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/user-fridge", userFridgeRoutes);
app.use("/api/wearables", wearablesRoutes);
logger.info("Routes V1 chargées", {}, "routes");

// --- SCAN ---
app.use("/api", skipCsrfForNativeRequests, scanRoutes);
logger.info("Route /api/scan chargée", {}, "routes");

// =====================
// SONDE / TEST
// =====================
app.post("/api/_ping_scan", (req, res) => {
    logger.info("_ping_scan appelé", { body: req.body }, "probe");
    res.json({ ok: true, where: "root server.js", body: req.body });
});

app.get("/", (req, res) => {
    logger.info("Route racine appelée", {}, "server");
    res.send("API Natty en ligne");
});

// =====================
// ERROR HANDLER
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

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Backend server started on http://localhost:${PORT}`, {}, "server");
});
