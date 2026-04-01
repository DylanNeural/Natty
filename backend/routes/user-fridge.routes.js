const express = require("express");
const authRequired = require("../security/auth.security");
const UserFridgeItem = require("../models/UserFridgeItem.model");

const router = express.Router();
router.use(authRequired);

/**
 * GET /api/user-fridge
 * Mon inventaire frigo perso
 */
router.get("/", async (req, res) => {
  try {
    const items = await UserFridgeItem.find({ userId: req.user.userId })
      .sort({ expiresAt: 1 })
      .lean();

    return res.json({ items });
  } catch (err) {
    console.error("Erreur GET /api/user-fridge :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/user-fridge
 * Body: { name, category, quantity, expiresAt }
 */
router.post("/", async (req, res) => {
  try {
    const { name, category, quantity, expiresAt } = req.body;

    if (!name) return res.status(400).json({ message: "Nom requis" });

    const item = await UserFridgeItem.create({
      userId: req.user.userId,
      name,
      category: category || "autres",
      quantity: quantity || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return res.status(201).json({ message: "Produit ajouté", item });
  } catch (err) {
    console.error("Erreur POST /api/user-fridge :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * DELETE /api/user-fridge/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const item = await UserFridgeItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!item) return res.status(404).json({ message: "Produit introuvable" });

    return res.json({ message: "Produit supprimé" });
  } catch (err) {
    console.error("Erreur DELETE /api/user-fridge/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
