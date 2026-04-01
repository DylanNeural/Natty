require("dotenv").config();


const path = require("path");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const connectDB = require("./backend/config/db");

// =====================
// LOGGER
// =====================
// Chemin du dossier logs à la racine du projet
const projectRoot = path.resolve(__dirname); // racine du projet
const logDir = path.join(projectRoot, "logs");

// Crée le dossier logs si inexistant
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Fichier de logs
const logFile = path.join(logDir, "app.log");

// Winston logger
const winston = require("winston");
const logger = require("./backend/logs/logger");

// Test simple
logger.info("✅ Serveur backend démarré");
logger.warn("Tentative suspecte", { ip: "192.168.1.10" });
logger.error("Erreur DB", { error: "Timeout Mongo" });


// Log de test à l'init
logger.info("✅ Logger initialisé et prêt à écrire dans app.log");

// =====================
// ROUTES
// =====================
const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");

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

// =====================
// TRACEUR ROOT
// =====================
logger.info("✅ ROOT server.js est bien lancé", {}, "server");

// =====================
// CONNEXION DB
// =====================
connectDB()
    .then(() => logger.info("✅ MongoDB connecté", {}, "database"))
    .catch((err) =>
        logger.error("❌ Erreur connexion MongoDB", { error: err.message }, "database")
    );

// =====================
// MIDDLEWARES
// =====================
// Dans server.js, après les imports
const morgan = require("morgan");
const morganStream = { write: (msg) => logger.info(msg.trim(), {}, "http") };
app.use(morgan("combined", { stream: morganStream }));

// Helmet
app.use(helmet());
logger.info("Helmet middleware chargé", {}, "middleware");

// CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
    })
);
logger.info("CORS middleware configuré", { origin: "http://localhost:3000" }, "middleware");

// JSON parsers
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
logger.info("Parsers JSON et URL-encoded activés", { limit: "100mb" }, "middleware");

// =====================
// ROUTES
// =====================
app.use("/api/profile", require("./backend/routes/profile.routes"));
logger.info("Route /api/profile chargée", {}, "routes");

app.use("/api/progress", require("./backend/routes/progress.routes"));
logger.info("Route /api/progress chargée", {}, "routes");

app.use("/api/auth", authRoutes);
logger.info("Route /api/auth chargée", {}, "routes");

app.use("/api/meals", mealsRoutes);
logger.info("Route /api/meals chargée", {}, "routes");

app.use("/api/chatbot", require("./backend/routes/chatbot.routes"));
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

// =====================
// SCAN ROUTES
// =====================
logger.info("scanRoutes chargé ?", { loaded: !!scanRoutes }, "routes");
app.use("/api", scanRoutes); // => POST /api/scan

// =====================
// SONDE / TEST
// =====================
app.post("/api/_ping_scan", (req, res) => {
    logger.info("_ping_scan appelé", { body: req.body }, "probe");
    res.json({ ok: true, where: "root server.js", body: req.body });
});

app.get("/", (req, res) => {
    logger.info("Route racine / appelée", {}, "server");
    res.send("API Natty en ligne ✅");
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`✅ Serveur backend démarré sur http://localhost:${PORT}`, {}, "server");
});
