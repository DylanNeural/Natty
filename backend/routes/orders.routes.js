const crypto = require("crypto");
const express = require("express");
const authRequired = require("../security/auth.security");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

const router = express.Router();
router.use(authRequired);

function generatePickupCode() {
  const n = crypto.randomInt(100000, 999999);
  return `${String(n).slice(0, 3)}-${String(n).slice(3)}`;
}

/**
 * GET /api/orders
 * Historique commandes de l'utilisateur
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate("fridgeId")
      .lean();

    return res.json({ orders });
  } catch (err) {
    console.error("Erreur GET /api/orders :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * POST /api/orders
 * Body: { productId, fridgeId, paymentMethod }
 */
router.post("/", async (req, res) => {
  try {
    const { productId, fridgeId, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable || product.stock <= 0) {
      return res.status(400).json({ message: "Produit indisponible" });
    }

    const reservedAt = new Date();
    const expiresAt = new Date(reservedAt.getTime() + 30 * 60 * 1000);

    const order = await Order.create({
      userId: req.user.userId,
      productId,
      fridgeId,
      paymentMethod: paymentMethod || null,
      amount: product.price,
      pickupCode: generatePickupCode(),
      reservedAt,
      expiresAt,
    });

    product.stock -= 1;
    if (product.stock <= 0) product.isAvailable = false;
    await product.save();

    return res.status(201).json({ message: "Commande créée", order });
  } catch (err) {
    console.error("Erreur POST /api/orders :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * PUT /api/orders/:id/pickup
 * Confirme le retrait du produit
 */
router.put("/:id/pickup", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    if (order.status !== "reserved" && order.status !== "paid") {
      return res.status(400).json({ message: "Commande non récupérable" });
    }

    order.status = "picked_up";
    order.pickedUpAt = new Date();
    await order.save();

    return res.json({ message: "Produit récupéré", order });
  } catch (err) {
    console.error("Erreur PUT /api/orders/:id/pickup :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
