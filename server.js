// Charger les variables d'environnement dès le départ
require("dotenv").config();
console.log("✅ NODE_ENV =", process.env.NODE_ENV);
console.log("✅ PORT =", process.env.PORT);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const connectDB = require("./backend/config/db");

const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");

const app = express();

// TRACEUR
console.log("✅ ROOT server.js est bien lancé");

connectDB();

/**
 * ======================
 * MIDDLEWARES GLOBAUX
 * ======================
 */
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
        optionsSuccessStatus: 200,
    })
);

app.use(cookieParser());

// Accept large payloads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

/**
 * ======================
 * CSRF CONFIG
 * ======================
 */
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
});

// Route pour récupérer le token CSRF
app.get("/api/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

/**
 * ======================
 * ROUTES
 * ======================
 */
app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));

// Routes protégées CSRF
app.use("/api/auth", csrfProtection, authRoutes);
app.use("/api/meals", csrfProtection, mealsRoutes);

// === SCAN ===
console.log("✅ scanRoutes chargé ?", !!scanRoutes);
app.use("/api", csrfProtection, scanRoutes);

// Sonde
app.post("/api/_ping_scan", csrfProtection, (req, res) => {
    res.json({ ok: true, where: "root server.js", body: req.body });
});

app.get("/", (req, res) => {
    res.send("API Natty en ligne ✅");
});

/**
 * ======================
 * GESTION ERREUR CSRF
 * ======================
 */
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
            message: "CSRF token invalide ou manquant",
        });
    }
    next(err);
});

/**
 * ======================
 * GESTION ERREURS GLOBALE (SECURISEE)
 * ======================
 */
app.use((err, req, res, next) => {
    // Log interne (toujours)
    console.error(err);

    // Message générique pour l'utilisateur
    if (process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    } else {
        res.status(500).json({
            message: "Une erreur est survenue, veuillez réessayer plus tard.",
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
app.get("/error-test", (req, res) => {
    throw new Error("Test de stacktrace sécurisée !");
});
