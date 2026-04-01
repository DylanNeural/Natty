const express = require("express");
const mongoose = require("mongoose");
const Article = require("../models/Article.model");

const router = express.Router();

const mockArticles = [
  {
    id: "1",
    title: "Les 5 aliments essentiels pour les sportifs a Toulouse",
    category: "nutrition",
    description:
      "Decouvre les meilleurs aliments pour optimiser ta performance sportive.",
    imageUrl: "https://picsum.photos/seed/food1/400/200",
    seed: "food1",
    readTime: 5,
    isPremium: false,
  },
  {
    id: "2",
    title: "Optimiser sa recuperation apres une seance de CrossFit",
    category: "sport",
    description: "Techniques eprouvees pour une meilleure recuperation musculaire.",
    imageUrl: "https://picsum.photos/seed/fitness1/400/200",
    seed: "fitness1",
    readTime: 7,
    isPremium: false,
  },
  {
    id: "3",
    title: "Le guide du jeune intermittent pour debutants",
    category: "sante",
    description: "Comprendre et debuter le jeune intermittent de maniere sure.",
    imageUrl: "https://picsum.photos/seed/clock1/400/200",
    seed: "clock1",
    readTime: 8,
    isPremium: false,
  },
  {
    id: "4",
    title: "Hydratation : pourquoi 2L ne suffisent pas toujours",
    category: "nutrition",
    description: "Adapter ton apport en eau selon ton activite et ton metabolisme.",
    imageUrl: "https://picsum.photos/seed/water1/400/200",
    seed: "water1",
    readTime: 4,
    isPremium: false,
  },
];

function serializeArticle(article) {
  return {
    id: article._id?.toString?.() || article.id,
    title: article.title,
    category: article.category,
    description: article.description || article.content || "",
    content: article.content,
    imageUrl: article.imageUrl || article.image,
    readTime: article.readTime,
    isPremium: Boolean(article.isPremium),
  };
}

function filterMockArticles(query) {
  const normalizedCategory = query.category?.toLowerCase();

  return mockArticles.filter((article) => {
    if (normalizedCategory && article.category !== normalizedCategory) return false;
    if (query.premiumOnly === "true" && !article.isPremium) return false;
    return true;
  });
}

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category.toLowerCase();
    if (req.query.premiumOnly === "true") filter.isPremium = true;

    const dbArticles = await Article.find(filter).sort({ createdAt: -1 }).lean();
    const articles = dbArticles.length
      ? dbArticles.map(serializeArticle)
      : filterMockArticles(req.query);

    return res.json({ articles, total: articles.length });
  } catch (err) {
    console.error("Erreur GET /api/articles :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let article = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const dbArticle = await Article.findById(req.params.id).lean();
      if (dbArticle) article = serializeArticle(dbArticle);
    }

    if (!article) {
      article = mockArticles.find((item) => item.id === req.params.id) || null;
    }

    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    return res.json({ article });
  } catch (err) {
    console.error("Erreur GET /api/articles/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
