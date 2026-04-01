const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-natty";

function getAdminEmails() {
  const fromEnv = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  // Requested primary admin account + env override support.
  const defaults = ["dylan-psupp@outlook.fr"];
  return new Set([...defaults, ...fromEnv]);
}

module.exports = async function adminRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const email = (user.email || "").toLowerCase();
    const adminEmails = getAdminEmails();
    if (!adminEmails.has(email)) {
      return res.status(403).json({ message: "Accès admin requis" });
    }

    req.userId = user._id;
    req.userEmail = email;
    req.isAdmin = true;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
