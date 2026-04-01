const express = require("express");
const authRequired = require("../security/auth.security");
const WearableLog = require("../models/WearableLog.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/wearables
 * Données wearable du jour (ou par ?date=2026-03-31)
 */
router.get("/", async (req, res) => {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(dateParam);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const logs = await WearableLog.find({
      userId: req.user.userId,
      date: { $gte: start, $lte: end },
    }).lean();

    return res.json({ logs });
  } catch (err) {
    console.error("Erreur GET /api/wearables :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/wearables
 * Body: { date, steps, activeCalories, sleepMinutes, source }
 */
router.post("/", async (req, res) => {
  try {
    const { date, steps, activeCalories, sleepMinutes, source } = req.body;

    if (!source) return res.status(400).json({ message: "Source requise" });

    const log = await WearableLog.create({
      userId: req.user.userId,
      date: date ? new Date(date) : new Date(),
      steps: steps ?? null,
      activeCalories: activeCalories ?? null,
      sleepMinutes: sleepMinutes ?? null,
      source,
    });

    return res.status(201).json({ message: "Données enregistrées", log });
  } catch (err) {
    console.error("Erreur POST /api/wearables :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
