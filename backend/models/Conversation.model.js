const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, conversationId: 1 }, { unique: true });
conversationSchema.index({ userId: 1, updatedAt: -1 });

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

