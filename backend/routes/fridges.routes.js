const express = require("express");
const Fridge = require("../models/Fridge.model");
const Product = require("../models/Product.model");

const router = express.Router();

const DEFAULT_FRIDGES = [
  {
    name: "Natty · Capitole",
    address: "12 Place du Capitole, Toulouse",
    city: "Toulouse",
    distance: "180m",
    walkTime: "2 min",
    isOpen: true,
    stockCount: 12,
    lat: 43.6045,
    lng: 1.4442,
    type: "standard",
  },
  {
    name: "Natty · Saint-Sernin",
    address: "Place Saint-Sernin, Toulouse",
    city: "Toulouse",
    distance: "430m",
    walkTime: "5 min",
    isOpen: false,
    stockCount: 8,
    lat: 43.6085,
    lng: 1.4412,
    type: "slim",
  },
];

function serializeFridge(fridge) {
  const coordinates = fridge.location?.coordinates || [];

  return {
    id: fridge._id?.toString?.() || fridge.id,
    name: fridge.name,
    address: fridge.address,
    city: fridge.city || null,
    distance: fridge.distance || "-",
    walkTime: fridge.walkTime || "-",
    isOpen: fridge.isOpen,
    stockCount: fridge.stockCount ?? 0,
    lat: fridge.lat ?? coordinates[1] ?? null,
    lng: fridge.lng ?? coordinates[0] ?? null,
    type: fridge.type || "standard",
    openingHours: fridge.openingHours || { open: null, close: null },
    bleIdentifier: fridge.bleIdentifier || null,
  };
}

async function ensureDefaultFridges() {
  const count = await Fridge.countDocuments();

  if (!count) {
    await Fridge.insertMany(DEFAULT_FRIDGES);
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureDefaultFridges();

    const { lng, lat, maxDistance, type, openOnly } = req.query;
    const filter = {};

    if (lng && lat) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance, 10) || 5000,
        },
      };
    }

    if (type) filter.type = type;
    if (openOnly === "true") filter.isOpen = true;

    const fridges = await Fridge.find(filter).sort({ createdAt: -1 }).lean();
    const payload = fridges.map(serializeFridge);

    return res.json({ fridges: payload, total: payload.length });
  } catch (err) {
    console.error("Erreur GET /api/fridges :", err);
    return res.status(500).json({
      message: "Erreur serveur lors du chargement des frigos",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const fridge = await Fridge.findById(req.params.id).lean();
    if (!fridge) {
      return res.status(404).json({ message: "Frigo introuvable" });
    }

    const products = await Product.find({
      fridgeId: fridge._id,
      isAvailable: true,
    }).lean();

    return res.json({
      fridge: serializeFridge(fridge),
      products,
    });
  } catch (err) {
    console.error("Erreur GET /api/fridges/:id :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
