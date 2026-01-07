require("dotenv").config();

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

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Accept large payloads for base64 images
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Routes
app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealsRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
