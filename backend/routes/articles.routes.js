// backend/routes/articles.routes.js
const express = require("express");
const router = express.Router();

/**
 * Mock articles data
 * À remplacer par une vraie base de données si needed
 */
const mockArticles = [
  {
    id: "1",
    title: "Les 5 aliments essentiels pour les sportifs à Toulouse",
    category: "Nutrition",
    description: "Découvre les meilleurs aliments pour optimiser ta performance sportive.",
    image: "https://picsum.photos/seed/food1/400/200",
    seed: "food1",
    readTime: 5
  },
  {
    id: "2",
    title: "Optimiser sa récupération après une séance de CrossFit",
    category: "Récupération",
    description: "Techniques éprouvées pour une meilleure récupération musculaire.",
    image: "https://picsum.photos/seed/fitness1/400/200",
    seed: "fitness1",
    readTime: 7
  },
  {
    id: "3",
    title: "Le guide du jeûne intermittent pour débutants",
    category: "Santé",
    description: "Comprendre et débuter le jeûne intermittent de manière sûre.",
    image: "https://picsum.photos/seed/clock1/400/200",
    seed: "clock1",
    readTime: 8
  },
  {
    id: "4",
    title: "Hydratation : pourquoi 2L ne suffisent pas toujours",
    category: "Hydratation",
    description: "Adapter ton apport en eau selon ton activité et ton métabolisme.",
    image: "https://picsum.photos/seed/water1/400/200",
    seed: "water1",
    readTime: 4
  }
];

/**
 * GET /api/articles
 * Récupère tous les articles
 */
router.get("/", (req, res) => {
  res.json({
    articles: mockArticles,
    total: mockArticles.length
  });
});

/**
 * GET /api/articles/:id
 * Récupère un article spécifique
 */
router.get("/:id", (req, res) => {
  const article = mockArticles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ message: "Article non trouvé" });
  }
  res.json(article);
});

module.exports = router;
