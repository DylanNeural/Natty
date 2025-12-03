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
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
