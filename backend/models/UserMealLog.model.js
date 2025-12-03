const mongoose = require("mongoose");

const userMealLogSchema = new mongoose.Schema(
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
      default: () => new Date(),
    },
    portionEaten: {
      type: Number,
      default: 1.0,
    },
    feedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userMealLogSchema.index({ userId: 1 });
userMealLogSchema.index({ mealId: 1 });

module.exports =
  mongoose.models.UserMealLog ||
  mongoose.model("UserMealLog", userMealLogSchema);
