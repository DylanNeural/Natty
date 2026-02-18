// backend/routes/auth.routes.js

const express = require("express");
const bcrypt = require("bcrypt"); // <-- bcrypt natif
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { loginLimiter } = require("../security/ratelimit");
const { body } = require("express-validator");
const validate = require("../security/validate");
const verifyRecaptcha = require("../security/recaptcha");


const router = express.Router();

/* ================================
   CONFIG
================================ */

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans le .env");
}

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12; // recommandé 12 en 2026

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * POST /api/auth/register
 * Body JSON : { name, email, password }
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
      .withMessage("Email invalide")
      .normalizeEmail(),

    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Mot de passe trop faible"),
  ],
  validate,
  async (req, res) => {
    // 🔐 CAPTCHA VERIFICATION
    const { captchaToken } = req.body;
    const isHuman = await verifyRecaptcha(captchaToken);
    if (!isHuman) {
      return res.status(403).json({ message: "Captcha invalide" });
    }

    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Utilisateur déjà existant" });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await User.create({
        name,
        email,
        passwordHash,
      });

      // 🔐 GENERATE TOKEN
      const token = generateToken(user._id);

      return res.status(201).json({
        message: "Utilisateur créé",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });

    } catch (err) {
      console.error("Erreur register :", err);
      return res.status(500).json({
        message: "Erreur serveur pendant l'inscription",
      });
    }
  }
);

/* ================================
   LOGIN
================================ */

router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Email invalide"),

    body("password")
      .notEmpty()
      .withMessage("Mot de passe requis"),
  ],
  validate,
  async (req, res) => {

    try {
      const { email, password, captchaToken } = req.body;

      /* ===== reCAPTCHA ===== */
      const isHuman = await verifyRecaptcha(captchaToken);
      if (!isHuman) {
        return res.status(403).json({ message: "Captcha invalide" });
      }

      /* ===== Recherche user ===== */
      const user = await User.findOne({ email });

      // Protection contre timing attack
      const fakeHash =
        "$2b$12$CwTycUXWue0Thq9StjUM0uJ8nQjQjQjQjQjQjQjQjQjQjQjQjQjQj";

      if (!user) {
        await bcrypt.compare(password, fakeHash);
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      /* ===== Vérification mot de passe ===== */
      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      /* ===== Génération JWT ===== */
      const token = generateToken(user._id);

      return res.status(200).json({
        message: "Connexion réussie",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });

    } catch (err) {
      console.error("Erreur login :", err);
      return res.status(500).json({
        message: "Erreur serveur pendant la connexion",
      });
    }
  }
);

module.exports = router;
