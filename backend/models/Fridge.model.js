const mongoose = require("mongoose");

const fridgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    type: {
      type: String,
      enum: ["slim", "standard", "xxl"],
      default: "standard",
    },
    openingHours: {
      open: { type: String, default: null },
      close: { type: String, default: null },
    },
    isOpen: { type: Boolean, default: true },
    bleIdentifier: { type: String, default: null },
  },
  { timestamps: true }
);

fridgeSchema.index({ location: "2dsphere" });

module.exports =
  mongoose.models.Fridge || mongoose.model("Fridge", fridgeSchema);
