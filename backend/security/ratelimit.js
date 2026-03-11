const rateLimit = require("express-rate-limit");

const LOGIN_WINDOW_MS = Number(process.env.LOGIN_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_LIMIT_MAX || 5);
const DISABLE_LOGIN_LIMITER = process.env.DISABLE_LOGIN_LIMITER === "true";

const loginLimiterInstance = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: LOGIN_MAX_ATTEMPTS,
  validate: { forwardedHeader: false },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: "Trop de tentatives, réessaie plus tard" });
  },
});

/**
 * Anti brute-force
 * 5 tentatives / 15 min
 */
exports.loginLimiter = (req, res, next) => {
  if (DISABLE_LOGIN_LIMITER) {
    return next();
  }

  return loginLimiterInstance(req, res, next);
};

/**
 * Chatbot: limite de débit pour éviter l'abus
 */
exports.chatbotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  validate: { forwardedHeader: false },
  message: "Trop de messages envoyés au chatbot, réessaie dans 1 minute",
});
exports.globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  validate: { forwardedHeader: false },
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ message: "Trop de requêtes" });
  }
});