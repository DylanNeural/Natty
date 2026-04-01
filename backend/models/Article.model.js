const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["nutrition", "sport", "sante", "recettes"],
      default: "nutrition",
    },
    imageUrl: { type: String, default: null },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Article || mongoose.model("Article", articleSchema);
