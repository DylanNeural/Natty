const DbLog = require("../models/DbLog");

async function dbLog(level, message, context = {}, source = "app") {
    try {
        await DbLog.create({
            level,
            message,
            context: sanitize(context),
            source,
        });
    } catch (err) {
        console.error(" DB log error:", err.message);
    }
}

function sanitize(context) {
    if (!context) return {};

    const clone = { ...context };
    delete clone.password;
    delete clone.token;
    delete clone.authorization;

    return clone;
}

module.exports = dbLog;
