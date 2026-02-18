const crypto = require("crypto");
const express = require("express");

const authRequired = require("../security/auth.security");
const { chatbotLimiter } = require("../security/ratelimit");
const User = require("../models/User.model");
const Conversation = require("../models/Conversation.model");
const { generateNattyCoachReply, AppError } = require("../ia/chatbot.service");

const router = express.Router();

function getUserId(req) {
  return req?.user?.userId || req?.user?.id || null;
}

function newConversationId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapHistory(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

router.use(authRequired);

router.post("/message", chatbotLimiter, async (req, res) => {
  const started = Date.now();

  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Utilisateur non authentifié." },
        meta: { ms: Date.now() - started },
      });
    }

    const { message, conversationId, productContext } = req.body || {};
    if (!String(message || "").trim()) {
      return res.status(400).json({
        ok: false,
        error: { code: "INVALID_MESSAGE", message: "Le message est requis." },
        meta: { ms: Date.now() - started },
      });
    }

    let convo = null;
    const cid = String(conversationId || "").trim();
    if (cid) {
      convo = await Conversation.findOne({ userId, conversationId: cid });
    }
    if (!convo) {
      convo = await Conversation.create({
        userId,
        conversationId: cid || newConversationId(),
        messages: [],
      });
    }

    const userProfile = await User.findById(userId).lean();
    const history = mapHistory(convo.messages).slice(-12);

    const ai = await generateNattyCoachReply({
      message,
      history,
      userProfile,
      productContext: productContext || null,
    });

    convo.messages.push(
      { role: "user", content: String(message).trim(), createdAt: new Date() },
      { role: "assistant", content: ai.reply, createdAt: new Date() }
    );
    await convo.save();

    return res.json({
      ok: true,
      conversationId: convo.conversationId,
      reply: ai.reply,
      detectedIntent: ai.detectedIntent,
      suggestions: ai.suggestions,
      disclaimer: ai.disclaimer,
      meta: { ms: Date.now() - started },
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.status).json({
        ok: false,
        error: { code: err.code, message: err.message, details: err.details || undefined },
        meta: { ms: Date.now() - started },
      });
    }

    console.error("CHATBOT /message ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erreur serveur chatbot." },
      meta: { ms: Date.now() - started },
    });
  }
});

router.get("/history", async (req, res) => {
  const started = Date.now();

  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Utilisateur non authentifié." },
        meta: { ms: Date.now() - started },
      });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(30)
      .lean();

    const items = conversations.map((c) => {
      const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
      return {
        conversationId: c.conversationId,
        updatedAt: c.updatedAt,
        totalMessages: c.messages?.length || 0,
        lastMessage: last
          ? { role: last.role, content: last.content, createdAt: last.createdAt }
          : null,
      };
    });

    return res.json({
      ok: true,
      conversations: items,
      meta: { ms: Date.now() - started },
    });
  } catch (err) {
    console.error("CHATBOT /history ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erreur serveur chatbot." },
      meta: { ms: Date.now() - started },
    });
  }
});

router.post("/reset", async (req, res) => {
  const started = Date.now();

  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Utilisateur non authentifié." },
        meta: { ms: Date.now() - started },
      });
    }

    const conversationId = newConversationId();
    await Conversation.create({
      userId,
      conversationId,
      messages: [],
    });

    return res.json({
      ok: true,
      conversationId,
      meta: { ms: Date.now() - started },
    });
  } catch (err) {
    console.error("CHATBOT /reset ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erreur serveur chatbot." },
      meta: { ms: Date.now() - started },
    });
  }
});

module.exports = router;

