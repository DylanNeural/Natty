const axios = require("axios");

const verifyRecaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret || !token) return false;

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret,
          response: token,
        },
        timeout: 8000,
      }
    );

    return !!response?.data?.success;
  } catch (err) {
    // Ne pas bloquer le serveur sur un souci réseau Google; retourne juste "non humain".
    console.error("reCAPTCHA verification error:", err?.message || err);
    return false;
  }
};

module.exports = verifyRecaptcha;
