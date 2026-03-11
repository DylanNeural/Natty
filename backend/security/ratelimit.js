const rateLimit = require("express-rate-limit");

/**
 * Anti brute-force
 * 5 tentatives / 15 min
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  validate: { forwardedHeader: false },
  message: "Trop de tentatives, réessaie plus tard",
});

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