const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    passwordHash: { type: String, required: true, maxlength: 255 },
    age: { type: Number, default: null },
    gender: { type: String, enum: ["male", "female", "other", null], default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    targetWeight: { type: Number, default: null },
    activityLevel: { type: String, default: null },
    goal: { type: String, default: null },
    dietaryPreferences: { type: [String], default: [] },
    startDate: { type: Date, default: null },

    // --- V1 : Objectifs nutritionnels ---
    profilePicture: { type: String, default: null },
    calorieGoal: { type: Number, default: null },
    proteinGoal: { type: Number, default: null },
    carbsGoal: { type: Number, default: null },
    fatGoal: { type: Number, default: null },
    hydrationGoal: { type: Number, default: null },

    // --- V1 : Premium / Gamification ---
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date, default: null },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    // --- V1 : Appareils connectés ---
    connectedDevices: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
