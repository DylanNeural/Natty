const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fridgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fridge",
      required: true,
    },
    status: {
      type: String,
      enum: ["reserved", "paid", "picked_up", "expired", "cancelled"],
      default: "reserved",
    },
    pickupCode: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["apple_pay", "google_pay", "card", null],
      default: null,
    },
    amount: { type: Number, required: true },
    reservedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, required: true },
    pickedUpAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ fridgeId: 1 });
orderSchema.index({ pickupCode: 1 });

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
