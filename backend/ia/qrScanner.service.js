// backend/ia/qrScanner.service.js
const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transforme la réponse OpenFoodFacts vers ton format standard
 */
function mapOFFToResult(off) {
  const p = off.product || {};
  const n = p.nutriments || {};

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
      energie_kcal: n["energy-kcal_100g"] ?? "",
      proteines_g: n.proteins_100g ?? "",
      glucides_g: n.carbohydrates_100g ?? "",
      dont_sucres_g: n.sugars_100g ?? "",
      lipides_g: n.fat_100g ?? "",
      dont_satures_g: n["saturated-fat_100g"] ?? "",
      fibres_g: n.fiber_100g ?? "",
      sel_g: n.salt_100g ?? "",
    },
    commentaires: "",
  };
}

/**
 * BARCODE → OpenFoodFacts
 */
async function scanBarcode(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
    barcode
  )}.json`;

  const { data } = await axios.get(url, { timeout: 10000 });

  if (data?.status === 1) {
    return mapOFFToResult(data);
  }

  return {
    type: "inconnu",
    nom: "",
    marque: "",
    description: "",
    ingredients: [],
    allergenes: [],
    valeurs_nutritionnelles: {
      energie_kcal: "",
      proteines_g: "",
      glucides_g: "",
      dont_sucres_g: "",
      lipides_g: "",
      dont_satures_g: "",
      fibres_g: "",
      sel_g: "",
    },
    commentaires:
      "Produit non trouvé dans OpenFoodFacts. Utiliser une photo du packaging.",
  };
}

/**
 * IMAGE → IA (fallback)
 */
async function scanImage(imageBase64, mimeType = "image/jpeg") {
  const prompt = `
Analyse l'image d'un produit alimentaire.
Retourne UNIQUEMENT un JSON avec:
type, nom, marque, description, ingredients[], allergenes[],
valeurs_nutritionnelles{...}, commentaires.
`.trim();

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(resp.choices[0].message.content);
}

module.exports = {
  scanBarcode,
  scanImage,
};
