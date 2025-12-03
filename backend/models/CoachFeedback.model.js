// backend/models/CoachFeedback.model.js
// correspond à coach_feedback

const mongoose = require("mongoose");

const coachFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    comment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

coachFeedbackSchema.index({ userId: 1 });
coachFeedbackSchema.index({ adminId: 1 });

module.exports = mongoose.model("CoachFeedback", coachFeedbackSchema);
