const express = require("express");
const authRequired = require("../security/auth.security");
const HydrationLog = require("../models/HydrationLog.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/hydration
 * Logs d'hydratation du jour (ou par ?date=2026-03-31)
 */
router.get("/", async (req, res) => {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(dateParam);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const logs = await HydrationLog.find({
      userId: req.user.userId,
      date: { $gte: start, $lte: end },
    })
      .sort({ date: 1 })
      .lean();

    const totalMl = logs.reduce((sum, l) => sum + l.amount, 0);

    return res.json({ logs, totalMl });
  } catch (err) {
    console.error("Erreur GET /api/hydration :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/hydration
 * Body: { amount } (en ml, ex: 250)
 */
router.post("/", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Quantité invalide" });
    }

    const log = await HydrationLog.create({
      userId: req.user.userId,
      date: new Date(),
      amount,
    });

    return res.status(201).json({ message: "Hydratation ajoutée", log });
  } catch (err) {
    console.error("Erreur POST /api/hydration :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
