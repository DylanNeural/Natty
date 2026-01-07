// backend/ia/qrScanner.service.js
const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

class AppError extends Error {
  constructor({ status = 500, code = "SERVER_ERROR", message = "Erreur serveur", details = null }) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function mapOFFToResult(off) {
  const p = off.product || {};
  const n = p.nutriments || {};
  const toInt = (v) => (v === undefined || v === null || v === "" ? 0 : Math.round(Number(v)));

  return {
    type: "produit_industriel",
    nom: p.product_name || "",
    marque: p.brands || "",
    description: p.generic_name || "",
    ingredients: (p.ingredients_text || "")
      .split(/,|;/)
      .map((s) => s.trim())
      .filter(Boolean),
    allergenes: (p.allergens || p.allergens_tags || [])
      .toString()
      .split(/,|;/)
      .map((s) => s.replace(/^en:/, "").trim())
      .filter(Boolean),
    valeurs_nutritionnelles: {
      energie_kcal: toInt(n["energy-kcal_100g"]),
      proteines_g: toInt(n.proteins_100g),
      glucides_g: toInt(n.carbohydrates_100g),
      dont_sucres_g: toInt(n.sugars_100g),
      lipides_g: toInt(n.fat_100g),
      dont_satures_g: toInt(n["saturated-fat_100g"]),
      fibres_g: toInt(n.fiber_100g),
      sel_g: toInt(n.salt_100g),
    },
    commentaires: "",
  };
}

function isValidBarcode(barcode) {
  return typeof barcode === "string" && /^[0-9]{8,14}$/.test(barcode.trim());
}

async function scanBarcode(barcode) {
  const b = (barcode || "").trim();

  if (!isValidBarcode(b)) {
    throw new AppError({
      status: 400,
      code: "INVALID_BARCODE",
      message: "Code-barres invalide. Attendu: 8 à 14 chiffres.",
      details: { barcode },
    });
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(b)}.json`;

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Natty/1.0 (contact: dev@natty.app)" },
    });

    if (data?.status === 1) return mapOFFToResult(data);

    throw new AppError({
      status: 404,
      code: "PRODUCT_NOT_FOUND",
      message: "Produit introuvable dans OpenFoodFacts avec ce code-barres.",
      details: { barcode: b },
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (axios.isAxiosError(err)) {
      const st = err.response?.status;
      if (st === 429) {
        throw new AppError({
          status: 429,
          code: "OFF_RATE_LIMIT",
          message: "Trop de requêtes vers OpenFoodFacts. Réessaie dans quelques secondes.",
        });
      }
      if (st && st >= 500) {
        throw new AppError({
          status: 503,
          code: "OFF_UNAVAILABLE",
          message: "OpenFoodFacts indisponible pour le moment.",
        });
      }
      if (err.code === "ECONNABORTED") {
        throw new AppError({
          status: 504,
          code: "OFF_TIMEOUT",
          message: "OpenFoodFacts ne répond pas (timeout).",
        });
      }
      throw new AppError({
        status: 502,
        code: "OFF_ERROR",
        message: "Erreur de communication avec OpenFoodFacts.",
        details: { status: st || null },
      });
    }
    throw new AppError({
      status: 500,
      code: "SERVER_ERROR",
      message: "Erreur serveur pendant le scan barcode.",
    });
  }
}

async function scanImage(imageBase64, mimeType = "image/jpeg") {
  const img = (imageBase64 || "").trim();
  if (!img) {
    throw new AppError({
      status: 400,
      code: "INVALID_IMAGE",
      message: "imageBase64 est requis.",
    });
  }

  try {
    const prompt = `
Analyse l'image d'un produit alimentaire (packaging/étiquette).
Retourne UNIQUEMENT un JSON avec:
type, nom, marque, description, ingredients[], allergenes[],
valeurs_nutritionnelles{energie_kcal,proteines_g,glucides_g,dont_sucres_g,lipides_g,dont_satures_g,fibres_g,sel_g}, commentaires.
Ne mets pas de décimales (entiers).
Si illisible, explique dans commentaires.
`.trim();

    const { signal, cancel } = withTimeout(25000); // 25s max pour éviter les 504

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${img}` } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      signal,
    });
    cancel();

    const json = JSON.parse(resp.choices[0].message.content);

    const toInt = (v) => (v === undefined || v === null || v === "" ? 0 : Math.round(Number(v)));
    if (json?.valeurs_nutritionnelles) {
      const vn = json.valeurs_nutritionnelles;
      json.valeurs_nutritionnelles = {
        energie_kcal: toInt(vn.energie_kcal),
        proteines_g: toInt(vn.proteines_g),
        glucides_g: toInt(vn.glucides_g),
        dont_sucres_g: toInt(vn.dont_sucres_g),
        lipides_g: toInt(vn.lipides_g),
        dont_satures_g: toInt(vn.dont_satures_g),
        fibres_g: toInt(vn.fibres_g),
        sel_g: toInt(vn.sel_g),
      };
    }

    return json;
  } catch (err) {
    console.error("OPENAI_ERROR scanImage:", err);
    const msg = String(err?.message || "");

    if (msg.includes("401")) {
      throw new AppError({
        status: 401,
        code: "OPENAI_UNAUTHORIZED",
        message: "Clé OpenAI invalide ou non autorisée.",
      });
    }
    if (msg.toLowerCase().includes("quota") || msg.includes("429")) {
      throw new AppError({
        status: 429,
        code: "OPENAI_RATE_LIMIT",
        message: "Limite OpenAI atteinte. Réessaie plus tard.",
      });
    }
    if (msg.toLowerCase().includes("timeout")) {
      throw new AppError({
        status: 504,
        code: "OPENAI_TIMEOUT",
        message: "OpenAI ne répond pas (timeout).",
      });
    }
    if (err.name === "AbortError") {
      throw new AppError({
        status: 504,
        code: "OPENAI_TIMEOUT",
        message: "Analyse trop longue, réessaie avec une image plus légère.",
      });
    }
    if (err instanceof SyntaxError) {
      console.error("OPENAI_PARSE_ERROR:", err);
      throw new AppError({
        status: 502,
        code: "OPENAI_PARSE_ERROR",
        message: "Réponse OpenAI invalide.",
      });
    }
    // cas génériques selon status HTTP retourné par l'SDK OpenAI
    const status = err?.status || err?.response?.status;
    if (status === 429) {
      throw new AppError({
        status: 429,
        code: "OPENAI_RATE_LIMIT",
        message: "Limite OpenAI atteinte. Réessaie plus tard.",
      });
    }
    if (status === 401) {
      throw new AppError({
        status: 401,
        code: "OPENAI_UNAUTHORIZED",
        message: "Clé OpenAI invalide ou non autorisée.",
      });
    }

    throw new AppError({
      status: 502,
      code: "OPENAI_ERROR",
      message: "Erreur OpenAI pendant l'analyse image.",
    });
  }
}

module.exports = { scanBarcode, scanImage, AppError };
