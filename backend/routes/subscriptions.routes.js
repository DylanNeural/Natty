const express = require("express");
const authRequired = require("../security/auth.security");
const Subscription = require("../models/Subscription.model");
const User = require("../models/User.model");

const router = express.Router();
router.use(authRequired);

const PLANS = {
  monthly: { price: 4.99, durationDays: 30 },
  yearly: { price: 39.99, durationDays: 365 },
};

/**
 * GET /api/subscriptions/me
 * Mon abonnement actif
 */
router.get("/me", async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.userId,
      status: "active",
    }).lean();

    return res.json({ subscription });
  } catch (err) {
    console.error("Erreur GET /api/subscriptions/me :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/subscriptions
 * Body: { plan, paymentMethod }
 */
router.post("/", async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ message: "Plan invalide (monthly ou yearly)" });
    }

    const existing = await Subscription.findOne({
      userId: req.user.userId,
      status: "active",
    });
    if (existing) {
      return res.status(400).json({ message: "Abonnement déjà actif" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + PLANS[plan].durationDays * 24 * 60 * 60 * 1000);

    const subscription = await Subscription.create({
      userId: req.user.userId,
      plan,
      price: PLANS[plan].price,
      startDate,
      endDate,
      paymentMethod: paymentMethod || null,
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $set: { isPremium: true, premiumExpiresAt: endDate },
    });

    return res.status(201).json({ message: "Abonnement Natty Elite activé", subscription });
  } catch (err) {
    console.error("Erreur POST /api/subscriptions :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /api/subscriptions/me
 * Annuler mon abonnement
 */
router.delete("/me", async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.userId,
      status: "active",
    });
    if (!subscription) {
      return res.status(404).json({ message: "Aucun abonnement actif" });
    }

    subscription.status = "cancelled";
    await subscription.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $set: { isPremium: false, premiumExpiresAt: null },
    });

    return res.json({ message: "Abonnement annulé", subscription });
  } catch (err) {
    console.error("Erreur DELETE /api/subscriptions/me :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
