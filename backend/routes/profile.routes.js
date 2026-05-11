// backend/routes/profile.routes.js
const express = require("express");
const User = require("../models/User.model");
const authRequired = require("../security/auth.security");

const router = express.Router();

router.use(authRequired, (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Non autorisÃ©" });
  req.userId = userId;
  return next();
});

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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Erreur GET /api/profile/me :", err);
    return res.status(500).json({ message: "Erreur serveur lors de la rÃ©cupÃ©ration du profil" });
  }
});

/**
 * PUT /api/profile/me
 * met Ã  jour des champs du profil
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
    ];

    const update = {};
    for (const key of allowedFields) {
      if (key in req.body) {
        update[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true }).lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({
      message: "Profil mis Ã  jour",
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Erreur PUT /api/profile/me :", err);
    return res.status(500).json({ message: "Erreur serveur lors de la mise Ã  jour du profil" });
  }
});

module.exports = router;
