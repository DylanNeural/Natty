// backend/models/Meal.model.js
const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
    },

    // total_calories (SQL)
    totalCalories: {
      type: Number,
      default: null,
    },

    // meal_type (SQL)
    mealType: {
      type: String,
      enum: ["petit-dejeuner", "dejeuner", "diner", "collation", null],
      default: null,
    },

    // Dénormalisation pour coller à ton front actuel
    calories: {
      type: Number,
      default: null,
    },
    protein: {
      type: Number,
      default: null,
    },
    carbs: {
      type: Number,
      default: null,
    },
    fat: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ évite OverwriteModelError si le fichier est chargé plusieurs fois
module.exports =
  mongoose.models.Meal || mongoose.model("Meal", mealSchema);
