// backend/routes/challenges.routes.js
const express = require("express");
const router = express.Router();

/**
 * Mock challenges data
 * À remplacer par une vraie base de données si needed
 */
const mockChallenges = [
  {
    id: "1",
    title: "Hydrate Challenge 💧",
    description: "Bois 2.5L d'eau chaque jour pendant 7 jours",
    icon: "Droplets",
    totalDays: 7,
    currentDay: 3,
    progress: 43,
    reward: 50,
    category: "Hydratation"
  },
  {
    id: "2",
    title: "Protéine Power 💪",
    description: "Atteins 150g de protéines quotidiennement",
    icon: "Zap",
    totalDays: 14,
    currentDay: 5,
    progress: 36,
    reward: 100,
    category: "Nutrition"
  },
  {
    id: "3",
    title: "8h de Sommeil 😴",
    description: "Dors 8 heures chaque nuit pendant la semaine",
    icon: "Moon",
    totalDays: 7,
    currentDay: 2,
    progress: 29,
    reward: 75,
    category: "Récupération"
  },
  {
    id: "4",
    title: "Marche Active 🚶",
    description: "Fais 10 000 pas par jour",
    icon: "Activity",
    totalDays: 30,
    currentDay: 8,
    progress: 27,
    reward: 150,
    category: "Mobilité"
  }
];

/**
 * GET /api/challenges
 * Récupère tous les challenges
 */
router.get("/", (req, res) => {
  res.json({
    challenges: mockChallenges,
    total: mockChallenges.length
  });
});

/**
 * GET /api/challenges/active
 * Récupère le challenge actif (en cours)
 */
router.get("/active", (req, res) => {
  const activeChallenge = mockChallenges[0]; // retourne le premier comme actif
  res.json(activeChallenge);
});

/**
 * GET /api/challenges/:id
 * Récupère un challenge spécifique
 */
router.get("/:id", (req, res) => {
  const challenge = mockChallenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: "Challenge non trouvé" });
  }
  res.json(challenge);
});

/**
 * POST /api/challenges/:id/progress
 * Met à jour la progression d'un challenge
 */
router.post("/:id/progress", (req, res) => {
  const challenge = mockChallenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: "Challenge non trouvé" });
  }

  const { completed } = req.body;
  if (completed && challenge.currentDay < challenge.totalDays) {
    challenge.currentDay += 1;
    challenge.progress = Math.round((challenge.currentDay / challenge.totalDays) * 100);
  }

  res.json(challenge);
});

module.exports = router;
