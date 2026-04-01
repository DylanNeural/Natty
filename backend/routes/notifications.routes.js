const express = require("express");
const authRequired = require("../security/auth.security");
const Notification = require("../models/Notification.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/notifications
 * Liste mes notifications
 * Query: ?unreadOnly=true
 */
router.get("/", async (req, res) => {
  try {
    const filter = { userId: req.user.userId };
    if (req.query.unreadOnly === "true") filter.isRead = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ notifications });
  } catch (err) {
    console.error("Erreur GET /api/notifications :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Marquer une notification comme lue
 */
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification introuvable" });

    return res.json({ notification: notif });
  } catch (err) {
    console.error("Erreur PUT /api/notifications/:id/read :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/notifications/read-all
 * Tout marquer comme lu
 */
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ message: "Toutes les notifications lues" });
  } catch (err) {
    console.error("Erreur PUT /api/notifications/read-all :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
