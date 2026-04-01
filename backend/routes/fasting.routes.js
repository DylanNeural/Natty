const express = require("express");
const authRequired = require("../security/auth.security");
const FastingSession = require("../models/FastingSession.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/fasting
 * Session active + historique
 */
router.get("/", async (req, res) => {
  try {
    const sessions = await FastingSession.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const active = sessions.find((s) => s.status === "active") || null;

    return res.json({ active, sessions });
  } catch (err) {
    console.error("Erreur GET /api/fasting :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/fasting
 * Body: { protocol, startTime }
 * Calcule endTime selon le protocole
 */
router.post("/", async (req, res) => {
  try {
    const { protocol, startTime } = req.body;

    const existing = await FastingSession.findOne({
      userId: req.user.userId,
      status: "active",
    });
    if (existing) {
      return res.status(400).json({ message: "Un jeûne est déjà en cours" });
    }

    const start = startTime ? new Date(startTime) : new Date();
    const fastHours = { "16:8": 16, "18:6": 18, "20:4": 20 };
    const hours = fastHours[protocol] || 16;
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    const session = await FastingSession.create({
      userId: req.user.userId,
      protocol: protocol || "16:8",
      startTime: start,
      endTime: end,
    });

    return res.status(201).json({ message: "Jeûne démarré", session });
  } catch (err) {
    console.error("Erreur POST /api/fasting :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/fasting/:id/stop
 * Arrêter le jeûne en cours
 */
router.put("/:id/stop", async (req, res) => {
  try {
    const session = await FastingSession.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      status: "active",
    });
    if (!session) return res.status(404).json({ message: "Session introuvable" });

    session.actualEndTime = new Date();
    session.status = session.actualEndTime >= session.endTime ? "completed" : "cancelled";
    await session.save();

    return res.json({ message: "Jeûne arrêté", session });
  } catch (err) {
    console.error("Erreur PUT /api/fasting/:id/stop :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
