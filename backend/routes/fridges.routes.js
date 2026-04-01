const express = require("express");
const Fridge = require("../models/Fridge.model");
const Product = require("../models/Product.model");

const router = express.Router();

/**
 * GET /api/fridges
 * Liste les frigos, avec filtre optionnel par proximité
 * Query: ?lng=1.44&lat=43.60&maxDistance=5000&type=standard&openOnly=true
 */
router.get("/", async (req, res) => {
  try {
    const { lng, lat, maxDistance, type, openOnly } = req.query;
    const filter = {};

    if (lng && lat) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance) || 5000,
        },
      };
    }

    if (type) filter.type = type;
    if (openOnly === "true") filter.isOpen = true;

    const fridges = await Fridge.find(filter).lean();
    return res.json({ fridges });
  } catch (err) {
    console.error("Erreur GET /api/fridges :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/fridges/:id
 * Détail d'un frigo + ses produits
 */
router.get("/:id", async (req, res) => {
  try {
    const fridge = await Fridge.findById(req.params.id).lean();
    if (!fridge) return res.status(404).json({ message: "Frigo introuvable" });

    const products = await Product.find({ fridgeId: fridge._id, isAvailable: true }).lean();

    return res.json({ fridge, products });
  } catch (err) {
    console.error("Erreur GET /api/fridges/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
