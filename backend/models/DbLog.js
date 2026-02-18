const mongoose = require("mongoose");

const dbLogSchema = new mongoose.Schema(
    {
        level: {
            type: String,
            enum: ["INFO", "WARN", "ERROR"],
            required: true,
            index: true,
        },

        message: {
            type: String,
            required: true,
        },

        context: {
            type: Object,
            default: {},
        },

        source: {
            type: String,
            default: "app",
        },
    },
    {
        timestamps: true,
    }
);

dbLogSchema.index({ createdAt: -1 });
dbLogSchema.index({ level: 1, createdAt: -1 });


dbLogSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

module.exports =
    mongoose.models.DbLog ||
    mongoose.model("DbLog", dbLogSchema);
