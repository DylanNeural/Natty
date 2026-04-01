const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    type: {
      type: String,
      enum: ["weekly", "daily", "custom"],
      default: "weekly",
    },
    durationDays: { type: Number, required: true },
    xpReward: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "upcoming", "archived"],
      default: "upcoming",
    },
    participantCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
