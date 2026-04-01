const express = require("express");
const Product = require("../models/Product.model");

const router = express.Router();

/**
 * GET /api/products
 * Liste les produits, filtre optionnel par fridgeId, category
 * Query: ?fridgeId=xxx&category=repas
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.fridgeId) filter.fridgeId = req.query.fridgeId;
    if (req.query.category) filter.category = req.query.category;
    filter.isAvailable = true;

    const products = await Product.find(filter).lean();
    return res.json({ products });
  } catch (err) {
    console.error("Erreur GET /api/products :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/products/:id
 * Détail d'un produit
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    return res.json({ product });
  } catch (err) {
    console.error("Erreur GET /api/products/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
