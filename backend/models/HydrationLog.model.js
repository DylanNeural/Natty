const mongoose = require("mongoose");

const hydrationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

hydrationLogSchema.index({ userId: 1, date: 1 });

module.exports =
  mongoose.models.HydrationLog ||
  mongoose.model("HydrationLog", hydrationLogSchema);
