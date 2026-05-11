const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET manquant (variable d'environnement requise).");
}

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
