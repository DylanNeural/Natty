// backend/routes/meals.routes.js
const express = require("express");
const Meal = require("../models/Meal.model");
const UserMealLog = require("../models/UserMealLog.model");
const authRequired = require("../security/auth.security");

const router = express.Router();

// Toutes les routes de ce router nÃ©cessitent dâ€™Ãªtre connectÃ© (cookie httpOnly)
router.use(authRequired, (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Non autorisÃ©" });
  req.userId = userId;
  return next();
});

/**
 * GET /api/meals
 * Retourne les repas consommÃ©s par l'utilisateur (user_meal_log + meals)
 */
router.get("/", async (req, res) => {
  try {
    const logs = await UserMealLog.find({ userId: req.userId })
      .sort({ date: -1 })
      .populate("mealId");

    const meals = logs.map((log) => {
      const meal = log.mealId;
      return {
        id: log._id, // id du log
        mealId: meal ? meal._id : null,
        name: meal ? meal.name : "Repas supprimÃ©",
        calories: meal ? meal.calories : null,
        protein: meal ? meal.protein : null,
        carbs: meal ? meal.carbs : null,
        fat: meal ? meal.fat : null,
        totalCalories: meal ? meal.totalCalories : null,
        date: log.date,
        portionEaten: log.portionEaten,
      };
    });

    return res.json({ meals });
  } catch (err) {
    console.error("Erreur GET /api/meals :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la rÃ©cupÃ©ration des repas" });
  }
});

/**
 * POST /api/meals
 * Body JSON attendu (du front actuel) :
 * { name, calories?, protein?, carbs?, fat? }
 *
 * Logique :
 * - crÃ©e un Meal correspondant
 * - crÃ©e un UserMealLog liÃ© Ã  ce Meal et au user
 */
router.post("/", async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le nom du repas est obligatoire" });
    }

    const meal = await Meal.create({
      name,
      calories: calories ?? null,
      protein: protein ?? null,
      carbs: carbs ?? null,
      fat: fat ?? null,
      totalCalories: calories ?? null,
    });

    const log = await UserMealLog.create({
      userId: req.userId,
      mealId: meal._id,
      date: new Date(),
      portionEaten: 1.0,
    });

    const result = {
      id: log._id,
      mealId: meal._id,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      totalCalories: meal.totalCalories,
      date: log.date,
      portionEaten: log.portionEaten,
    };

    return res.status(201).json({
      message: "Repas crÃ©Ã©",
      meal: result,
    });
  } catch (err) {
    console.error("Erreur POST /api/meals :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la crÃ©ation du repas" });
  }
});

module.exports = router;
