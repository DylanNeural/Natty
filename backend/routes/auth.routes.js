// backend/routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { loginLimiter } = require("../security/ratelimit");
const { body } = require("express-validator");
const validate = require("../security/validate");
const verifyRecaptcha = require("../security/recaptcha");


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-natty";

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
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
    .withMessage("Email invalide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Mot de passe trop court"),
],
  validate,
  async (req, res) => {
    try {
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

      return res.status(201).json({
        message: "Utilisateur créé",
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Erreur register :", err);
      return res
        .status(500)
        .json({ message: "Erreur serveur pendant l'inscription" });
    }
  }
);


/**
 * POST /api/auth/login
 * Body JSON : { email, password }
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
  
  const { captchaToken } = req.body;

  const isHuman = await verifyRecaptcha(captchaToken);
  if (!isHuman) {
    return res.status(403).json({ message: "Captcha invalide" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont obligatoires" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = generateToken(user._id);

    return res.json({
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
    return res
      .status(500)
      .json({ message: "Erreur serveur pendant la connexion" });
  }
});


module.exports = router;
