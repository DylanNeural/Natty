// errorMiddleware.js
function errorHandler(err, req, res, next) {
    // Log interne pour les devs / audit
    console.error(err); // Peut être remplacé par un logger comme Winston ou Pino

    // Message générique pour l'utilisateur
    res.status(500).json({
        message: "Une erreur est survenue, veuillez réessayer plus tard."
    });
}

module.exports = errorHandler;
