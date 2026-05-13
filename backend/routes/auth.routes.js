// backend/routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const connectDB = require("../config/db");
const { loginLimiter } = require("../security/ratelimit");
const { body } = require("express-validator");
const validate = require("../security/validate");
const verifyCaptcha = require("../security/captcha");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET manquant (variable d'environnement requise).");
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function getCookieSameSite() {
  const raw = String(process.env.COOKIE_SAMESITE || "lax").trim().toLowerCase();
  if (raw === "strict") return "strict";
  if (raw === "lax") return "lax";
  if (raw === "none") return "none";
  return "lax";
}

// =====================
// COOKIE OPTIONS
// =====================
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: getCookieSameSite(),
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en ms
};

if (cookieOptions.sameSite === "none" && cookieOptions.secure !== true) {
  throw new Error("COOKIE_SAMESITE=none requiert NODE_ENV=production (cookie secure).");
}

/**
 * POST /api/auth/register
 * Body JSON : { name, email, password, captchaToken }
 */
router.post(
    "/register",
    [
      body("name")
          .trim()
          .notEmpty()
          .withMessage("Le nom est obligatoire"),
      body("email")
          .isEmail()
          .withMessage("Email invalide"),
      body("password")
          .isLength({ min: 8 })
          .withMessage("Mot de passe trop court"),
    ],
    validate,
    async (req, res) => {
      // 🔐 CAPTCHA VERIFICATION
      const { captchaToken } = req.body;
      const isHuman = await verifyCaptcha(captchaToken, req);
      if (!isHuman) {
        return res.status(captchaToken ? 403 : 400).json({ message: captchaToken ? "Captcha invalide" : "Captcha requis" });
      }

      try {
        await connectDB();

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "Utilisateur déjà existant" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          email,
          passwordHash,
        });

        // 🔐 GENERATE TOKEN + SET COOKIE
        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
          message: "Utilisateur créé",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (err) {
        console.error("Erreur register :", err);
        return res.status(500).json({
          message: "Erreur serveur pendant l'inscription",
          detail: err?.message || "Erreur inconnue",
        });
      }
    }
);

/**
 * POST /api/auth/login
 * Body JSON : { email, password, captchaToken }
 */
router.post(
    "/login",
    loginLimiter,
    [
      body("email")
          .isEmail()
          .withMessage("Email invalide"),
      body("password")
          .isLength({ min: 8 })
          .withMessage("Mot de passe trop court"),
    ],
    validate,
    async (req, res) => {
      // 🔐 CAPTCHA VERIFICATION
      const { captchaToken } = req.body;
      const isHuman = await verifyCaptcha(captchaToken, req);
      if (!isHuman) {
        return res.status(captchaToken ? 403 : 400).json({ message: captchaToken ? "Captcha invalide" : "Captcha requis" });
      }

      try {
        await connectDB();

        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: "Email et mot de passe sont obligatoires" });
        }

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Identifiants invalides" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return res.status(401).json({ message: "Identifiants invalides" });
        }

        // 🔐 GENERATE TOKEN + SET COOKIE
        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.json({
          message: "Connexion réussie",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (err) {
        console.error("Erreur login :", err);
        return res.status(500).json({
          message: "Erreur serveur pendant la connexion",
          detail: err?.message || "Erreur inconnue",
        });
      }
    }
);

/**
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: getCookieSameSite(),
    path: "/",
  });
  return res.json({ message: "Déconnecté" });
});

module.exports = router;
