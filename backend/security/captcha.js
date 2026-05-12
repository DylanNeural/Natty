const axios = require("axios");

function getProvider() {
  const explicit = String(process.env.CAPTCHA_PROVIDER || "").trim().toLowerCase();
  if (explicit === "hcaptcha" || explicit === "recaptcha") return explicit;

  // Backward-compatible default: if RECAPTCHA_SECRET_KEY exists, assume recaptcha.
  if (process.env.RECAPTCHA_SECRET_KEY) return "recaptcha";
  return "hcaptcha";
}

function getSecret() {
  return process.env.CAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY || null;
}

function isEnabled() {
  // Backward compatibility with old flags
  if (process.env.RECAPTCHA_BYPASS === "true" && process.env.NODE_ENV !== "production") return false;
  if (process.env.RECAPTCHA_ENABLED === "false") return false;

  const explicit = String(process.env.CAPTCHA_ENABLED || "").trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;

  // Default: enabled when a secret is configured; in production it must be configured.
  const secret = getSecret();
  if (process.env.NODE_ENV === "production") return true;
  return !!secret;
}

async function verifyHcaptcha(secret, token, remoteip) {
  const response = await axios.post("https://hcaptcha.com/siteverify", null, {
    params: { secret, response: token, remoteip },
    timeout: 8000,
  });
  return !!response.data?.success;
}

async function verifyRecaptcha(secret, token, remoteip) {
  const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
    params: { secret, response: token, remoteip },
    timeout: 8000,
  });
  return !!response.data?.success;
}

module.exports = async function verifyCaptcha(token, req) {
  const enabled = isEnabled();
  if (!enabled) return true;

  const secret = getSecret();
  if (!secret) {
    // Fail closed in production.
    return false;
  }

  if (!token) return false;

  const provider = getProvider();
  const remoteip = req?.ip;

  try {
    if (provider === "recaptcha") return await verifyRecaptcha(secret, token, remoteip);
    return await verifyHcaptcha(secret, token, remoteip);
  } catch {
    return false;
  }
};

