const mongoose = require("mongoose");

const userFridgeItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["legumes", "fruits", "proteines", "laitiers", "cereales", "autres"],
      default: "autres",
    },
    quantity: { type: String, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userFridgeItemSchema.index({ userId: 1 });

module.exports =
  mongoose.models.UserFridgeItem ||
  mongoose.model("UserFridgeItem", userFridgeItemSchema);
