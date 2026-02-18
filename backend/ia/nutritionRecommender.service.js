const { generateNattyCoachReply, AppError } = require("./chatbot.service");

/**
 * Façade IA nutrition/chatbot pour compatibilité avec le pôle IA Natty.
 * Entrée:
 *  - message: string (requis)
 *  - history?: [{ role: "user"|"assistant", content: string }]
 *  - userProfile?: object
 *  - productContext?: object
 */
async function getNutritionRecommendation({
  message,
  history = [],
  userProfile = null,
  productContext = null,
} = {}) {
  return generateNattyCoachReply({
    message,
    history,
    userProfile,
    productContext,
  });
}

module.exports = {
  getNutritionRecommendation,
  generateNattyCoachReply,
  AppError,
};
