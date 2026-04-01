const mongoose = require("mongoose");

const fastingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    protocol: {
      type: String,
      enum: ["16:8", "18:6", "20:4", "custom"],
      default: "16:8",
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    actualEndTime: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

fastingSessionSchema.index({ userId: 1 });

module.exports =
  mongoose.models.FastingSession ||
  mongoose.model("FastingSession", fastingSessionSchema);
