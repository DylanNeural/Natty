const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET manquant cÃ´tÃ© serveur" });
  }

  // Full-cookie auth: JWT is stored in a secure httpOnly cookie named "token".
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "AccÃ¨s refusÃ©" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
};
