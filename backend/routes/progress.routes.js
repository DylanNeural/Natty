// backend/routes/progress.routes.js
const express = require("express");
const UserProgress = require("../models/UserProgress.model");
const authRequired = require("../security/auth.security");

const router = express.Router();

router.use(authRequired, (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Non autorisÃ©" });
  req.userId = userId;
  return next();
});

/**
 * GET /api/progress
 * Liste la progression de l'utilisateur (triÃ©e par date desc)
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
      .json({ message: "Erreur serveur lors de la rÃ©cupÃ©ration de la progression" });
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
      message: "EntrÃ©e de progression crÃ©Ã©e",
      entry,
    });
  } catch (err) {
    console.error("Erreur POST /api/progress :", err);
    return res.status(500).json({ message: "Erreur serveur lors de la crÃ©ation de la progression" });
  }
});

module.exports = router;
