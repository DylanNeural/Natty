// backend/models/UserProgress.model.js
// correspond à user_progress

const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    bodyFat: {
      type: Number,
      default: null,
    },
    muscleMass: {
      type: Number,
      default: null,
    },
    waist: {
      type: Number,
      default: null,
    },
    chest: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("UserProgress", userProgressSchema);
