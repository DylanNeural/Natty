const axios = require("axios");

const verifyRecaptcha = async (token) => {
  if (process.env.RECAPTCHA_BYPASS === "true") {
    return true;
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret || !token) {
    return false;
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch {
    return false;
  }
};

module.exports = verifyRecaptcha;
