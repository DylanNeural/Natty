const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    brand: { type: String, default: null },
    price: { type: Number, required: true },
    calories: { type: Number, default: null },
    protein: { type: Number, default: null },
    carbs: { type: Number, default: null },
    fat: { type: Number, default: null },
    fiber: { type: Number, default: null },
    imageUrl: { type: String, default: null },
    category: {
      type: String,
      enum: ["boissons", "snacks", "repas", "supplements"],
      default: "repas",
    },
    tags: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    ingredients: { type: String, default: null },
    fridgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fridge",
      required: true,
    },
    stock: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ fridgeId: 1 });

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
