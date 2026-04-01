const express = require("express");
const Article = require("../models/Article.model");

const router = express.Router();

/**
 * GET /api/articles
 * Liste les articles (publics)
 * Query: ?category=nutrition&premiumOnly=true
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.premiumOnly === "true") filter.isPremium = true;

    const articles = await Article.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ articles });
  } catch (err) {
    console.error("Erreur GET /api/articles :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/articles/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) return res.status(404).json({ message: "Article introuvable" });

    return res.json({ article });
  } catch (err) {
    console.error("Erreur GET /api/articles/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
