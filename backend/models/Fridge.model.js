const mongoose = require("mongoose");

const fridgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 255 },
    city: { type: String, default: null, trim: true, maxlength: 120 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
        validate: {
          validator(value) {
            return !value || value.length === 2;
          },
          message: "location.coordinates must contain [lng, lat]",
        },
      },
    },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    distance: { type: String, default: "-" },
    walkTime: { type: String, default: "-" },
    stockCount: { type: Number, default: 0 },
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

fridgeSchema.pre("validate", function syncCoordinates(next) {
  if (
    this.location &&
    Array.isArray(this.location.coordinates) &&
    this.location.coordinates.length === 2
  ) {
    [this.lng, this.lat] = this.location.coordinates;
  } else if (typeof this.lng === "number" && typeof this.lat === "number") {
    this.location = {
      type: "Point",
      coordinates: [this.lng, this.lat],
    };
  }

  next();
});

fridgeSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Fridge || mongoose.model("Fridge", fridgeSchema);
