const rateLimit = require("express-rate-limit");

/**
 * Anti brute-force
 * 5 tentatives / 15 min
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives, réessaie plus tard",
});

/**
 * Chatbot: limite de débit pour éviter l'abus
 */
exports.chatbotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  message: "Trop de messages envoyés au chatbot, réessaie dans 1 minute",
});
