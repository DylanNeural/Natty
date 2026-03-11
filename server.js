require("dotenv").config();

const helmet = require("helmet");
const express = require("express");
const cors = require("cors");

const connectDB = require("./backend/config/db");

const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");
const scanRoutes = require("./backend/routes/scan.routes");

const app = express();

// TRACEUR: si tu ne vois pas ce log, ce n'est pas ce fichier qui tourne
console.log("✅ ROOT server.js est bien lancé");

connectDB();

// === MIDDLEWARES (ordre est CRUCIAL) ===
app.use(helmet());

// CORS (local + Vercel)
const defaultAllowedOrigins = [
  "http://localhost:5001",
  "http://localhost:3000",
  "http://localhost:3001",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    try {
      const hostname = new URL(origin).hostname;
      if (hostname.endsWith(".vercel.app")) {
        return callback(null, true);
      }
    } catch (_) {
      return callback(new Error("Origin invalide"));
    }

    return callback(new Error(`Origin non autorisée par CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Parsers JSON
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// === ROUTES ===
app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/chatbot", require("./backend/routes/chatbot.routes"));

// === SCAN ===
console.log("✅ scanRoutes chargé ?", !!scanRoutes);
app.use("/api", scanRoutes); // => POST /api/scan

// Sonde (si celle-ci marche, Express est OK)
app.post("/api/_ping_scan", (req, res) => {
  res.json({ ok: true, where: "root server.js", body: req.body });
});

app.get("/", (req, res) => {
  res.send("API Natty en ligne ✅");
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
