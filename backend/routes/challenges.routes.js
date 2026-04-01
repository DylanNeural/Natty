const express = require("express");
const mongoose = require("mongoose");
const authRequired = require("../security/auth.security");
const Challenge = require("../models/Challenge.model");
const UserChallenge = require("../models/UserChallenge.model");

const router = express.Router();

const mockChallenges = [
  {
    id: "1",
    title: "Hydrate Challenge",
    description: "Bois 2.5L d'eau chaque jour pendant 7 jours",
    icon: "Droplets",
    totalDays: 7,
    currentDay: 3,
    progress: 43,
    reward: 50,
    category: "daily",
    status: "active",
  },
  {
    id: "2",
    title: "Proteine Power",
    description: "Atteins 150g de proteines quotidiennement",
    icon: "Zap",
    totalDays: 14,
    currentDay: 5,
    progress: 36,
    reward: 100,
    category: "weekly",
    status: "active",
  },
  {
    id: "3",
    title: "8h de Sommeil",
    description: "Dors 8 heures chaque nuit pendant la semaine",
    icon: "Moon",
    totalDays: 7,
    currentDay: 2,
    progress: 29,
    reward: 75,
    category: "daily",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Marche Active",
    description: "Fais 10 000 pas par jour",
    icon: "Activity",
    totalDays: 30,
    currentDay: 8,
    progress: 27,
    reward: 150,
    category: "custom",
    status: "active",
  },
];

function serializeChallenge(challenge) {
  return {
    id: challenge._id?.toString?.() || challenge.id,
    title: challenge.title,
    description: challenge.description || "",
    type: challenge.type || challenge.category,
    totalDays: challenge.durationDays ?? challenge.totalDays ?? 0,
    currentDay: challenge.currentDay ?? 0,
    progress: challenge.progress ?? 0,
    reward: challenge.xpReward ?? challenge.reward ?? 0,
    category: challenge.category || challenge.type || "custom",
    status: challenge.status || "upcoming",
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    participantCount: challenge.participantCount ?? 0,
  };
}

async function findChallengeById(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const dbChallenge = await Challenge.findById(id).lean();
    if (dbChallenge) return dbChallenge;
  }

  return mockChallenges.find((challenge) => challenge.id === id) || null;
}

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const dbChallenges = await Challenge.find(filter).sort({ startDate: -1 }).lean();
    const challenges = dbChallenges.length
      ? dbChallenges.map(serializeChallenge)
      : mockChallenges
          .filter((challenge) => !req.query.status || challenge.status === req.query.status)
          .map(serializeChallenge);

    return res.json({ challenges, total: challenges.length });
  } catch (err) {
    console.error("Erreur GET /api/challenges :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/active", async (_req, res) => {
  try {
    const activeChallenge =
      (await Challenge.findOne({ status: "active" }).sort({ startDate: -1 }).lean()) ||
      mockChallenges.find((challenge) => challenge.status === "active") ||
      null;

    if (!activeChallenge) {
      return res.status(404).json({ message: "Aucun challenge actif" });
    }

    return res.json(serializeChallenge(activeChallenge));
  } catch (err) {
    console.error("Erreur GET /api/challenges/active :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/me", authRequired, async (req, res) => {
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

router.put("/me/:id/progress", authRequired, async (req, res) => {
  try {
    const userChallenge = await UserChallenge.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!userChallenge) {
      return res.status(404).json({ message: "Participation introuvable" });
    }

    userChallenge.progress = req.body.progress ?? userChallenge.progress;

    const challenge = await Challenge.findById(userChallenge.challengeId).lean();
    if (challenge && userChallenge.progress >= challenge.durationDays) {
      userChallenge.status = "completed";
      userChallenge.completedAt = new Date();
    }

    await userChallenge.save();
    return res.json({
      message: "Progression mise a jour",
      userChallenge,
    });
  } catch (err) {
    console.error("Erreur PUT /api/challenges/me/:id/progress :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/:id/join", authRequired, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Defi introuvable" });
    }

    const existing = await UserChallenge.findOne({
      userId: req.user.userId,
      challengeId: challenge._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Deja inscrit a ce defi" });
    }

    const userChallenge = await UserChallenge.create({
      userId: req.user.userId,
      challengeId: challenge._id,
    });

    challenge.participantCount += 1;
    await challenge.save();

    return res.status(201).json({
      message: "Inscrit au defi",
      userChallenge,
    });
  } catch (err) {
    console.error("Erreur POST /api/challenges/:id/join :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/:id/progress", authRequired, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouve" });
    }

    let userChallenge = await UserChallenge.findOne({
      userId: req.user.userId,
      challengeId: challenge._id,
    });

    if (!userChallenge) {
      userChallenge = await UserChallenge.create({
        userId: req.user.userId,
        challengeId: challenge._id,
      });
      challenge.participantCount += 1;
      await challenge.save();
    }

    if (req.body.completed && userChallenge.progress < challenge.durationDays) {
      userChallenge.progress += 1;
    } else if (typeof req.body.progress === "number") {
      userChallenge.progress = req.body.progress;
    }

    if (userChallenge.progress >= challenge.durationDays) {
      userChallenge.status = "completed";
      userChallenge.completedAt = new Date();
    }

    await userChallenge.save();
    return res.json({
      challenge: serializeChallenge({
        ...challenge.toObject(),
        progress: userChallenge.progress,
        currentDay: userChallenge.progress,
      }),
      userChallenge,
    });
  } catch (err) {
    console.error("Erreur POST /api/challenges/:id/progress :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const challenge = await findChallengeById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouve" });
    }

    return res.json(serializeChallenge(challenge));
  } catch (err) {
    console.error("Erreur GET /api/challenges/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
