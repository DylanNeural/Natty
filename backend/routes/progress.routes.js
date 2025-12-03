// backend/routes/progress.routes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const UserProgress = require("../models/UserProgress.model");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-natty";

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error("Erreur JWT /progress :", err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

router.use(authRequired);

/**
 * GET /api/progress
 * Liste la progression de l'utilisateur (triée par date desc)
 */
router.get("/", async (req, res) => {
  try {
    const entries = await UserProgress.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    return res.json({ entries });
  } catch (err) {
    console.error("Erreur GET /api/progress :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération de la progression" });
  }
});

/**
 * POST /api/progress
 * Body : { date?, weight?, bodyFat?, muscleMass?, waist?, chest?, notes? }
 */
router.post("/", async (req, res) => {
  try {
    const { date, weight, bodyFat, muscleMass, waist, chest, notes } = req.body;

    const entry = await UserProgress.create({
      userId: req.userId,
      date: date ? new Date(date) : new Date(),
      weight: weight ?? null,
      bodyFat: bodyFat ?? null,
      muscleMass: muscleMass ?? null,
      waist: waist ?? null,
      chest: chest ?? null,
      notes: notes ?? null,
    });

    return res.status(201).json({
      message: "Entrée de progression créée",
      entry,
    });
  } catch (err) {
    console.error("Erreur POST /api/progress :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la progression" });
  }
});

module.exports = router;
