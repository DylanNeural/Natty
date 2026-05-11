const rateLimit = require("express-rate-limit");

// =====================
// LOGIN (anti brute-force)
// =====================
const LOGIN_WINDOW_MS = Number(process.env.LOGIN_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_LIMIT_MAX || 5);
const DISABLE_LOGIN_LIMITER = process.env.DISABLE_LOGIN_LIMITER === "true";

// =====================
// CHATBOT
// =====================
const CHATBOT_WINDOW_MS = Number(process.env.CHATBOT_LIMIT_WINDOW_MS || 60 * 1000);
const CHATBOT_MAX = Number(process.env.CHATBOT_LIMIT_MAX || 12);

// =====================
// GLOBAL API LIMITER
// =====================
// Recommended baseline: 100 req / minute / IP
const GLOBAL_WINDOW_MS = Number(process.env.GLOBAL_LIMIT_WINDOW_MS || 60 * 1000);
const GLOBAL_MAX = Number(process.env.GLOBAL_LIMIT_MAX || 100);

const loginLimiterInstance = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: LOGIN_MAX_ATTEMPTS,
  validate: { forwardedHeader: false },
  // Do not expose rate limit internals
  standardHeaders: false,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: "Trop de tentatives, reessaie plus tard." });
  },
});

exports.loginLimiter = (req, res, next) => {
  if (DISABLE_LOGIN_LIMITER) return next();
  return loginLimiterInstance(req, res, next);
};

exports.chatbotLimiter = rateLimit({
  windowMs: CHATBOT_WINDOW_MS,
  max: CHATBOT_MAX,
  validate: { forwardedHeader: false },
  standardHeaders: false,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: "Trop de messages envoyes au chatbot, reessaie dans 1 minute." });
  },
});

exports.globalLimiter = rateLimit({
  windowMs: GLOBAL_WINDOW_MS,
  max: GLOBAL_MAX,
  validate: { forwardedHeader: false },
  standardHeaders: false,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ message: "Trop de requetes, veuillez patienter avant de reessayer." });
  },
});
