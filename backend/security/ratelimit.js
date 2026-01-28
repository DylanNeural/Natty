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
