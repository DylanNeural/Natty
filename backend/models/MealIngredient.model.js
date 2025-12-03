// backend/models/MealIngredient.model.js
// table de liaison meal_ingredients (many-to-many entre meals et ingredients)

const mongoose = require("mongoose");

const mealIngredientSchema = new mongoose.Schema(
  {
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    quantity: {
      type: Number, // même unité que ton SQL
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// équivalent à la PK composée (meal_id, ingredient_id) en SQL :
mealIngredientSchema.index({ mealId: 1, ingredientId: 1 }, { unique: true });

module.exports = mongoose.model("MealIngredient", mealIngredientSchema);
