// backend/routes/meals.routes.js
const express = require("express");
const Meal = require("../models/Meal.model");
const UserMealLog = require("../models/UserMealLog.model");
const authRequired = require("../security/auth.security");

const router = express.Router();

router.use(authRequired, (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Non autorisé" });
  req.userId = userId;
  return next();
});

// GET /api/meals — entrées du journal de l'utilisateur
router.get("/", async (req, res) => {
  try {
    const logs = await UserMealLog.find({ userId: req.userId })
      .sort({ date: -1 })
      .populate("mealId");

    const entries = logs.map((log) => {
      const meal = log.mealId;
      return {
        id: log._id,
        source: meal?.source ?? "manual",
        timestamp: log.date ? new Date(log.date).getTime() : log.createdAt.getTime(),
        food: meal?.name ?? "Repas supprimé",
        emoji: meal?.emoji ?? "🍽️",
        kcal: meal?.calories ?? 0,
        prot: meal?.protein ?? 0,
        glu: meal?.carbs ?? 0,
        lip: meal?.fat ?? 0,
      };
    });

    return res.json({ entries });
  } catch (err) {
    console.error("Erreur GET /api/meals :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/meals — ajouter une entrée au journal
router.post("/", async (req, res) => {
  try {
    const { food, kcal, prot, glu, lip, emoji, source, timestamp } = req.body;

    if (!food) {
      return res.status(400).json({ message: "Le nom de l'aliment est obligatoire" });
    }

    const meal = await Meal.create({
      name: food,
      calories: kcal ?? null,
      protein: prot ?? null,
      carbs: glu ?? null,
      fat: lip ?? null,
      totalCalories: kcal ?? null,
      emoji: emoji ?? null,
      source: source ?? "manual",
    });

    const log = await UserMealLog.create({
      userId: req.userId,
      mealId: meal._id,
      date: timestamp ? new Date(timestamp) : new Date(),
      portionEaten: 1.0,
    });

    return res.status(201).json({
      entry: {
        id: log._id,
        source: meal.source,
        timestamp: new Date(log.date).getTime(),
        food: meal.name,
        emoji: meal.emoji ?? "🍽️",
        kcal: meal.calories ?? 0,
        prot: meal.protein ?? 0,
        glu: meal.carbs ?? 0,
        lip: meal.fat ?? 0,
      },
    });
  } catch (err) {
    console.error("Erreur POST /api/meals :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/meals/:id — supprimer une entrée du journal
router.delete("/:id", async (req, res) => {
  try {
    const log = await UserMealLog.findOne({ _id: req.params.id, userId: req.userId });
    if (!log) return res.status(404).json({ message: "Entrée introuvable" });

    await Meal.deleteOne({ _id: log.mealId });
    await log.deleteOne();

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erreur DELETE /api/meals :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
