// backend/models/UserMealPlan.model.js
// correspond à user_meal_plan

const mongoose = require("mongoose");

const userMealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    date: {
      type: Date,
      default: null,
    },
    portionSize: {
      type: Number,
      default: 1.0,
    },
  },
  {
    timestamps: true,
  }
);

userMealPlanSchema.index({ userId: 1 });
userMealPlanSchema.index({ mealId: 1 });

module.exports = mongoose.model("UserMealPlan", userMealPlanSchema);
