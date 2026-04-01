// backend/routes/profile.routes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-natty";

// même middleware d'auth que dans meals.routes.js
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
    console.error("Erreur JWT /profile :", err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

router.use(authRequired);

/**
 * GET /api/profile/me
 * retourne le profil complet de l'utilisateur courant
 */
router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      targetWeight: user.targetWeight,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dietaryPreferences: user.dietaryPreferences,
      startDate: user.startDate,
      profilePicture: user.profilePicture,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      hydrationGoal: user.hydrationGoal,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      xp: user.xp,
      level: user.level,
      connectedDevices: user.connectedDevices,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Erreur GET /api/profile/me :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du profil" });
  }
});

/**
 * PUT /api/profile/me
 * met à jour des champs du profil
 */
router.put("/me", async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "age",
      "gender",
      "height",
      "weight",
      "targetWeight",
      "activityLevel",
      "goal",
      "dietaryPreferences",
      "startDate",
      "profilePicture",
      "calorieGoal",
      "proteinGoal",
      "carbsGoal",
      "fatGoal",
      "hydrationGoal",
      "connectedDevices",
    ];

    const update = {};
    for (const key of allowedFields) {
      if (key in req.body) {
        update[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: update },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({
      message: "Profil mis à jour",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        targetWeight: user.targetWeight,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dietaryPreferences: user.dietaryPreferences,
        startDate: user.startDate,
        profilePicture: user.profilePicture,
        calorieGoal: user.calorieGoal,
        proteinGoal: user.proteinGoal,
        carbsGoal: user.carbsGoal,
        fatGoal: user.fatGoal,
        hydrationGoal: user.hydrationGoal,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        xp: user.xp,
        level: user.level,
        connectedDevices: user.connectedDevices,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Erreur PUT /api/profile/me :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
});

module.exports = router;
