const express = require("express");
const authRequired = require("../security/auth.security");
const Challenge = require("../models/Challenge.model");
const UserChallenge = require("../models/UserChallenge.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/challenges
 * Liste tous les défis (actifs, à venir, terminés)
 * Query: ?status=active
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const challenges = await Challenge.find(filter).sort({ startDate: -1 }).lean();
    return res.json({ challenges });
  } catch (err) {
    console.error("Erreur GET /api/challenges :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/challenges/:id/join
 * Rejoindre un défi
 */
router.post("/:id/join", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Défi introuvable" });

    const existing = await UserChallenge.findOne({
      userId: req.user.userId,
      challengeId: challenge._id,
    });
    if (existing) return res.status(400).json({ message: "Déjà inscrit à ce défi" });

    const uc = await UserChallenge.create({
      userId: req.user.userId,
      challengeId: challenge._id,
    });

    challenge.participantCount += 1;
    await challenge.save();

    return res.status(201).json({ message: "Inscrit au défi", userChallenge: uc });
  } catch (err) {
    console.error("Erreur POST /api/challenges/:id/join :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/challenges/me
 * Mes défis en cours
 */
router.get("/me", async (req, res) => {
  try {
    const userChallenges = await UserChallenge.find({ userId: req.user.userId })
      .populate("challengeId")
      .sort({ joinedAt: -1 })
      .lean();

    return res.json({ userChallenges });
  } catch (err) {
    console.error("Erreur GET /api/challenges/me :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/challenges/me/:id/progress
 * Mettre à jour la progression d'un défi
 * Body: { progress }
 */
router.put("/me/:id/progress", async (req, res) => {
  try {
    const uc = await UserChallenge.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!uc) return res.status(404).json({ message: "Participation introuvable" });

    uc.progress = req.body.progress ?? uc.progress;

    const challenge = await Challenge.findById(uc.challengeId).lean();
    if (challenge && uc.progress >= challenge.durationDays) {
      uc.status = "completed";
      uc.completedAt = new Date();
    }

    await uc.save();
    return res.json({ message: "Progression mise à jour", userChallenge: uc });
  } catch (err) {
    console.error("Erreur PUT /api/challenges/me/:id/progress :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
