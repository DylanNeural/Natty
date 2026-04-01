const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

friendshipSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });

module.exports =
  mongoose.models.Friendship ||
  mongoose.model("Friendship", friendshipSchema);
