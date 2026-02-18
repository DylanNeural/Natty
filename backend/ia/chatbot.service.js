const OpenAI = require("openai");

let openai = null;

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
const CHAT_TIMEOUT_MS = Number(process.env.OPENAI_CHAT_TIMEOUT_MS || 25000);
const MAX_HISTORY_MESSAGES = Number(process.env.OPENAI_CHAT_MAX_HISTORY || 12);

class AppError extends Error {
  constructor({ status = 500, code = "SERVER_ERROR", message = "Erreur serveur", details = null }) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function trimText(input, maxLen = 1200) {
  const txt = String(input || "").trim();
  if (!txt) return "";
  return txt.length <= maxLen ? txt : `${txt.slice(0, maxLen)}...`;
}

function getOpenAIClient() {
  if (openai) return openai;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AppError({
      status: 503,
      code: "OPENAI_MISSING_KEY",
      message: "OPENAI_API_KEY manquante sur le serveur.",
    });
  }

  openai = new OpenAI({ apiKey });
  return openai;
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: trimText(item.content, 1200),
    }))
    .filter((item) => item.content)
    .slice(-MAX_HISTORY_MESSAGES);
}

function normalizeUserProfile(userProfile) {
  if (!userProfile || typeof userProfile !== "object") return null;
  return {
    name: trimText(userProfile.name, 80),
    age: Number.isFinite(Number(userProfile.age)) ? Number(userProfile.age) : null,
    gender: trimText(userProfile.gender, 30),
    height: Number.isFinite(Number(userProfile.height)) ? Number(userProfile.height) : null,
    weight: Number.isFinite(Number(userProfile.weight)) ? Number(userProfile.weight) : null,
    targetWeight: Number.isFinite(Number(userProfile.targetWeight))
      ? Number(userProfile.targetWeight)
      : null,
    activityLevel: trimText(userProfile.activityLevel, 50),
    goal: trimText(userProfile.goal, 50),
    dietaryPreferences: Array.isArray(userProfile.dietaryPreferences)
      ? userProfile.dietaryPreferences.map((v) => trimText(v, 40)).filter(Boolean).slice(0, 12)
      : [],
  };
}

function normalizeProductContext(productContext) {
  if (!productContext || typeof productContext !== "object") return null;

  const vn = productContext.valeurs_nutritionnelles || {};
  const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

  return {
    type: trimText(productContext.type, 50),
    nom: trimText(productContext.nom, 120),
    marque: trimText(productContext.marque, 80),
    description: trimText(productContext.description, 300),
    ingredients: Array.isArray(productContext.ingredients)
      ? productContext.ingredients.map((x) => trimText(x, 60)).filter(Boolean).slice(0, 40)
      : [],
    allergenes: Array.isArray(productContext.allergenes)
      ? productContext.allergenes.map((x) => trimText(x, 40)).filter(Boolean).slice(0, 20)
      : [],
    valeurs_nutritionnelles: {
      energie_kcal: toNum(vn.energie_kcal),
      proteines_g: toNum(vn.proteines_g),
      glucides_g: toNum(vn.glucides_g),
      dont_sucres_g: toNum(vn.dont_sucres_g),
      lipides_g: toNum(vn.lipides_g),
      dont_satures_g: toNum(vn.dont_satures_g),
      fibres_g: toNum(vn.fibres_g),
      sel_g: toNum(vn.sel_g),
    },
    commentaires: trimText(productContext.commentaires, 300),
  };
}

function buildSystemPrompt() {
  return `
Tu es "Natty Coach", coach nutrition sportif pour l'application Natty.
Style: coach motivant fort, sportif, direct, discipliné.
Positionnement: motivant + crédible (pas académique, pas jargon scientifique).

Priorités:
1) Aider les objectifs sportifs: prise de masse, perte de poids, maintien/performance.
2) Donner des conseils pratiques et actionnables.
3) Garder une ligne réaliste: pas de promesse magique, pas de bullshit.

Comportement attendu:
- Réponds en français.
- Utilise des phrases courtes, percutantes.
- Ton: énergie, responsabilité, passage à l'action.
- Si info manquante, pose 1 à 2 questions ciblées.
- Si productContext est fourni, appuie l'analyse sur ses valeurs nutritionnelles.
- Si userProfile est fourni, personnalise la recommandation.
- En cas d'incertitude, explicite-la.
- Donne des actions concrètes (quoi manger, quand, combien, quoi ajuster).

Règles sécurité:
- Ne remplace pas un professionnel de santé.
- Si sujet médical/pathologique/troubles alimentaires: conseille une consultation pro.
- Pas de protocole dangereux, dopage, privation extrême.

Retourne UNIQUEMENT un JSON valide avec ce schéma:
{
  "reply": "string",
  "detectedIntent": "mass_gain|weight_loss|performance|product_analysis|motivation|general_nutrition|unknown",
  "suggestions": ["string", "string", "string"],
  "disclaimer": "string"
}
`.trim();
}

function mapOpenAIError(err) {
  const msg = String(err?.message || "");
  const status = err?.status || err?.response?.status;

  if (msg.includes("OPENAI_TIMEOUT_CLIENT") || msg.toLowerCase().includes("timeout")) {
    return new AppError({
      status: 504,
      code: "OPENAI_TIMEOUT",
      message: "OpenAI ne répond pas (timeout).",
    });
  }
  if (status === 401 || msg.includes("401")) {
    return new AppError({
      status: 401,
      code: "OPENAI_UNAUTHORIZED",
      message: "Clé OpenAI invalide ou non autorisée.",
    });
  }
  if (status === 429 || msg.includes("429") || msg.toLowerCase().includes("quota")) {
    return new AppError({
      status: 429,
      code: "OPENAI_RATE_LIMIT",
      message: "Limite OpenAI atteinte. Réessaie plus tard.",
    });
  }
  if (err instanceof SyntaxError) {
    return new AppError({
      status: 502,
      code: "OPENAI_PARSE_ERROR",
      message: "Réponse OpenAI invalide.",
    });
  }

  return new AppError({
    status: 502,
    code: "OPENAI_ERROR",
    message: "Erreur OpenAI pendant la génération chatbot.",
  });
}

function normalizeAssistantJson(json) {
  const intents = new Set([
    "mass_gain",
    "weight_loss",
    "performance",
    "product_analysis",
    "motivation",
    "general_nutrition",
    "unknown",
  ]);

  const reply = trimText(json?.reply, 2200);
  const detectedIntent = intents.has(json?.detectedIntent) ? json.detectedIntent : "unknown";
  const suggestions = Array.isArray(json?.suggestions)
    ? json.suggestions.map((x) => trimText(x, 120)).filter(Boolean).slice(0, 3)
    : [];
  const disclaimer = trimText(
    json?.disclaimer || "Ces conseils sont informatifs et ne remplacent pas un avis médical.",
    220
  );

  if (!reply) {
    throw new AppError({
      status: 502,
      code: "OPENAI_PARSE_ERROR",
      message: "Réponse chatbot incomplète.",
    });
  }

  return { reply, detectedIntent, suggestions, disclaimer };
}

async function generateNattyCoachReply({
  message,
  history = [],
  userProfile = null,
  productContext = null,
} = {}) {
  const userMessage = trimText(message, 1800);
  if (!userMessage) {
    throw new AppError({
      status: 400,
      code: "INVALID_MESSAGE",
      message: "Le message utilisateur est requis.",
    });
  }

  const safeHistory = normalizeHistory(history);
  const safeProfile = normalizeUserProfile(userProfile);
  const safeProduct = normalizeProductContext(productContext);

  const messages = [{ role: "system", content: buildSystemPrompt() }];

  if (safeProfile) {
    messages.push({
      role: "system",
      content: `userProfile JSON: ${JSON.stringify(safeProfile)}`,
    });
  }

  if (safeProduct) {
    messages.push({
      role: "system",
      content: `productContext JSON: ${JSON.stringify(safeProduct)}`,
    });
  }

  for (const msg of safeHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userMessage });

  try {
    const client = getOpenAIClient();
    const resp = await Promise.race([
      client.chat.completions.create({
        model: CHAT_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("OPENAI_TIMEOUT_CLIENT")), CHAT_TIMEOUT_MS)),
    ]);

    const raw = resp?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    return normalizeAssistantJson(parsed);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("OPENAI_ERROR generateNattyCoachReply:", err);
    throw mapOpenAIError(err);
  }
}

module.exports = {
  generateNattyCoachReply,
  AppError,
};
