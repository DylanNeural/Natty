const mongoose = require("mongoose");

const userChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_progress", "completed", "failed"],
      default: "in_progress",
    },
    joinedAt: { type: Date, default: () => new Date() },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userChallengeSchema.index({ userId: 1 });
userChallengeSchema.index({ challengeId: 1 });

module.exports =
  mongoose.models.UserChallenge ||
  mongoose.model("UserChallenge", userChallengeSchema);
