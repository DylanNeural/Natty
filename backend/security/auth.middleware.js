const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-natty";

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token; // 👈 lu depuis le cookie

    if (!token) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = authMiddleware;