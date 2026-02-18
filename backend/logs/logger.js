const fs = require("fs");
const path = require("path");
const winston = require("winston");


const projectRoot = path.resolve(__dirname, "../../");
const logDir = path.join(projectRoot, "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log("✅ Dossier logs créé:", logDir);
}

const logFile = path.join(logDir, "app.log");


const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
            return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: logFile }),
        new winston.transports.Console(),
    ],
});

logger.info("✅ Logger initialisé et prêt à écrire dans app.log");

module.exports = logger;
