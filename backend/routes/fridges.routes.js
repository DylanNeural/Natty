const express = require("express");
const Fridge = require("../models/Fridge.model");

const router = express.Router();

const DEFAULT_FRIDGES = [
  {
    name: "Natty · Capitole",
    address: "12 Place du Capitole, Toulouse",
    distance: "180m",
    walkTime: "2 min",
    isOpen: true,
    stockCount: 12,
    lat: 43.6045,
    lng: 1.4442,
  },
  {
    name: "Natty · Saint-Sernin",
    address: "Place Saint-Sernin, Toulouse",
    distance: "430m",
    walkTime: "5 min",
    isOpen: false,
    stockCount: 8,
    lat: 43.6085,
    lng: 1.4412,
  },
];

router.get("/", async (_req, res) => {
  try {
    let fridges = await Fridge.find().sort({ createdAt: -1 }).lean();

    if (!fridges.length) {
      await Fridge.insertMany(DEFAULT_FRIDGES);
      fridges = await Fridge.find().sort({ createdAt: -1 }).lean();
    }

    return res.json({
      fridges: fridges.map((f) => ({
        id: f._id,
        name: f.name,
        address: f.address,
        distance: f.distance,
        walkTime: f.walkTime,
        isOpen: f.isOpen,
        stockCount: f.stockCount,
        lat: f.lat,
        lng: f.lng,
      })),
      total: fridges.length,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur lors du chargement des frigos" });
  }
});

module.exports = router;
