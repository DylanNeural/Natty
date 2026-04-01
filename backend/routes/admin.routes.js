const express = require("express");
const User = require("../models/User.model");
const Fridge = require("../models/Fridge.model");
const adminRequired = require("../security/admin.middleware");

const router = express.Router();
router.use(adminRequired);

router.get("/overview", async (_req, res) => {
  try {
    const [usersCount, premiumUsersCount, fridgesCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPremium: true }),
      Fridge.countDocuments(),
    ]);

    return res.json({ usersCount, premiumUsersCount, fridgesCount });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/users", async (_req, res) => {
  try {
    const users = await User.find({}, "name email isPremium createdAt updatedAt").sort({ createdAt: -1 }).lean();

    return res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        isPremium: !!u.isPremium,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total: users.length,
    });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { isPremium } = req.body;
    if (typeof isPremium !== "boolean") {
      return res.status(400).json({ message: "isPremium doit être un booléen" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isPremium } },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({
      message: "Utilisateur mis à jour",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: !!user.isPremium,
      },
    });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({ message: "Utilisateur supprimé" });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/fridges", async (_req, res) => {
  try {
    const fridges = await Fridge.find().sort({ createdAt: -1 }).lean();
    return res.json({
      fridges: fridges.map((f) => ({
        id: f._id,
        name: f.name,
        address: f.address,
        distance: f.distance,
        walkTime: f.walkTime,
        isOpen: !!f.isOpen,
        stockCount: f.stockCount,
        lat: f.lat,
        lng: f.lng,
      })),
      total: fridges.length,
    });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/fridges", async (req, res) => {
  try {
    const { name, address, lat, lng, distance, walkTime, isOpen, stockCount } = req.body;

    if (!name || !address || typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ message: "name, address, lat, lng sont requis" });
    }

    const fridge = await Fridge.create({
      name,
      address,
      lat,
      lng,
      distance: distance || "-",
      walkTime: walkTime || "-",
      isOpen: typeof isOpen === "boolean" ? isOpen : true,
      stockCount: typeof stockCount === "number" ? stockCount : 0,
    });

    return res.status(201).json({
      message: "Frigo créé",
      fridge: {
        id: fridge._id,
        name: fridge.name,
        address: fridge.address,
        distance: fridge.distance,
        walkTime: fridge.walkTime,
        isOpen: !!fridge.isOpen,
        stockCount: fridge.stockCount,
        lat: fridge.lat,
        lng: fridge.lng,
      },
    });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/fridges/:id", async (req, res) => {
  try {
    const allowed = ["name", "address", "lat", "lng", "distance", "walkTime", "isOpen", "stockCount"];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }

    const fridge = await Fridge.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!fridge) {
      return res.status(404).json({ message: "Frigo introuvable" });
    }

    return res.json({
      message: "Frigo mis à jour",
      fridge: {
        id: fridge._id,
        name: fridge.name,
        address: fridge.address,
        distance: fridge.distance,
        walkTime: fridge.walkTime,
        isOpen: !!fridge.isOpen,
        stockCount: fridge.stockCount,
        lat: fridge.lat,
        lng: fridge.lng,
      },
    });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/fridges/:id", async (req, res) => {
  try {
    const deleted = await Fridge.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Frigo introuvable" });
    }

    return res.json({ message: "Frigo supprimé" });
  } catch {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
