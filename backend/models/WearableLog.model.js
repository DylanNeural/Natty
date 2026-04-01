const mongoose = require("mongoose");

const wearableLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    steps: { type: Number, default: null },
    activeCalories: { type: Number, default: null },
    sleepMinutes: { type: Number, default: null },
    source: {
      type: String,
      enum: ["apple_health", "garmin"],
      required: true,
    },
  },
  { timestamps: true }
);

wearableLogSchema.index({ userId: 1, date: 1 });

module.exports =
  mongoose.models.WearableLog ||
  mongoose.model("WearableLog", wearableLogSchema);
