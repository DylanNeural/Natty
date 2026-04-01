const mongoose = require("mongoose");

const fridgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 255 },
    distance: { type: String, default: "-" },
    walkTime: { type: String, default: "-" },
    isOpen: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Fridge || mongoose.model("Fridge", fridgeSchema);
