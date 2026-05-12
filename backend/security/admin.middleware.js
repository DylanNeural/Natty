const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return secret;
}

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
  const JWT_SECRET = getJwtSecret();
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET manquant cÃ´tÃ© serveur" });
  }

  // Full-cookie auth: JWT is stored in cookie "token".
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    const email = (user.email || "").toLowerCase();
    const adminEmails = getAdminEmails();
    if (!adminEmails.has(email)) {
      return res.status(403).json({ message: "AccÃ¨s admin requis" });
    }

    req.userId = user._id;
    req.userEmail = email;
    req.isAdmin = true;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expirÃ©" });
  }
};
