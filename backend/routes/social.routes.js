const express = require("express");
const authRequired = require("../security/auth.security");
const Friendship = require("../models/Friendship.model");
const User = require("../models/User.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/social/friends
 * Liste mes amis (acceptés)
 */
router.get("/friends", async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [
        { requesterId: req.user.userId, status: "accepted" },
        { receiverId: req.user.userId, status: "accepted" },
      ],
    }).lean();

    const friendIds = friendships.map((f) =>
      f.requesterId.toString() === req.user.userId ? f.receiverId : f.requesterId
    );

    const friends = await User.find({ _id: { $in: friendIds } })
      .select("name profilePicture xp level")
      .lean();

    return res.json({ friends });
  } catch (err) {
    console.error("Erreur GET /api/social/friends :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/social/request
 * Envoyer une demande d'ami
 * Body: { receiverId }
 */
router.post("/request", async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: "receiverId requis" });

    const existing = await Friendship.findOne({
      $or: [
        { requesterId: req.user.userId, receiverId },
        { requesterId: receiverId, receiverId: req.user.userId },
      ],
    });
    if (existing) return res.status(400).json({ message: "Demande déjà existante" });

    const friendship = await Friendship.create({
      requesterId: req.user.userId,
      receiverId,
    });

    return res.status(201).json({ message: "Demande envoyée", friendship });
  } catch (err) {
    console.error("Erreur POST /api/social/request :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/social/request/:id/accept
 */
router.put("/request/:id/accept", async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.id,
      receiverId: req.user.userId,
      status: "pending",
    });
    if (!friendship) return res.status(404).json({ message: "Demande introuvable" });

    friendship.status = "accepted";
    await friendship.save();

    return res.json({ message: "Ami accepté", friendship });
  } catch (err) {
    console.error("Erreur PUT /api/social/request/:id/accept :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/social/leaderboard
 * Classement par XP
 */
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name profilePicture xp level")
      .sort({ xp: -1 })
      .limit(50)
      .lean();

    return res.json({ leaderboard: users });
  } catch (err) {
    console.error("Erreur GET /api/social/leaderboard :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
