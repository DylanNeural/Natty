// backend/logs/logger.js
// Logger simple compatible serverless (console uniquement, pas de fichiers)

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] ?? levels.info;

function format(level, message, meta = {}, context = "") {
  const ts = new Date().toISOString();
  const ctx = context ? `[${context}] ` : "";
  const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
  return `${ts} ${level.toUpperCase()} ${ctx}${message}${metaStr}`;
}

const logger = {
  error: (message, meta = {}, context = "") => {
    if (currentLevel >= levels.error) console.error(format("error", message, meta, context));
  },
  warn: (message, meta = {}, context = "") => {
    if (currentLevel >= levels.warn) console.warn(format("warn", message, meta, context));
  },
  info: (message, meta = {}, context = "") => {
    if (currentLevel >= levels.info) console.log(format("info", message, meta, context));
  },
  debug: (message, meta = {}, context = "") => {
    if (currentLevel >= levels.debug) console.log(format("debug", message, meta, context));
  },
};

module.exports = logger;
