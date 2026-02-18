import React, { useEffect, useMemo, useState } from "react";
import {
  fetchChatbotHistory,
  resetChatbotConversation,
  sendChatbotMessage,
} from "../src/api/chatbot";
import { useAuth } from "../services/AuthContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  onBack: () => void;
  initialProductContext?: unknown;
}

export const ChatbotPage: React.FC<Props> = ({ onBack, initialProductContext }) => {
  const { token } = useAuth();

  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  const hasProductContext = useMemo(
    () => !!initialProductContext && typeof initialProductContext === "object",
    [initialProductContext]
  );

  useEffect(() => {
    if (!token || bootstrapped) return;
    setBootstrapped(true);

    (async () => {
      try {
        const history = await fetchChatbotHistory(token);
        const latest = history.conversations?.[0];
        if (latest?.conversationId) {
          setConversationId(latest.conversationId);
        } else {
          const created = await resetChatbotConversation(token);
          setConversationId(created.conversationId);
        }
      } catch (err: any) {
        setError(err?.message || "Impossible d'initialiser le coach.");
      }
    })();
  }, [token, bootstrapped]);

  useEffect(() => {
    if (!token || !conversationId || !hasProductContext) return;
    if (messages.length > 0) return;

    const autoMessage =
      "Analyse ce produit et dis-moi si c'est cohérent avec mes objectifs. Donne-moi une recommandation directe.";
    sendMessage(autoMessage, initialProductContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, conversationId, hasProductContext]);

  async function sendMessage(message: string, productContext?: unknown) {
    if (!token) return;
    const clean = message.trim();
    if (!clean || loading) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: clean }]);
    setInput("");

    try {
      const resp = await sendChatbotMessage(token, {
        message: clean,
        conversationId: conversationId || undefined,
        productContext,
      });

      if (resp.conversationId && !conversationId) {
        setConversationId(resp.conversationId);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: resp.reply }]);
    } catch (err: any) {
      setError(err?.message || "Le coach ne répond pas pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!token || loading) return;

    try {
      setLoading(true);
      setError(null);
      const created = await resetChatbotConversation(token);
      setConversationId(created.conversationId);
      setMessages([]);
    } catch (err: any) {
      setError(err?.message || "Impossible de réinitialiser la conversation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark pb-24">
      <header className="flex items-center p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800">
        <button onClick={onBack} aria-label="Retour" className="p-2 rounded-full active:bg-gray-200 dark:active:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-text-light dark:text-text-dark" aria-hidden="true">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-text-light dark:text-text-dark">Natty Coach</h1>
        <button onClick={handleReset} className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
          Reset
        </button>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {hasProductContext && (
          <div className="text-xs px-3 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            Contexte scan détecté: le coach va intégrer le produit dans sa réponse.
          </div>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-sm text-gray-500">
              Pose ta question: prise de masse, perte de poids, optimisation repas, motivation.
            </div>
          )}

          {messages.map((m, idx) => (
            <div key={`${m.role}-${idx}`} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "ml-auto bg-primary text-white" : "bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark"}`}>
              {m.content}
            </div>
          ))}

          {loading && <div className="text-sm text-gray-500">Natty Coach réfléchit...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Est-ce adapté à une prise de masse propre ?"
            className="flex-1 h-12 px-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-text-light dark:text-text-dark outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-12 px-4 rounded-2xl bg-primary text-white font-bold disabled:opacity-60"
          >
            Envoyer
          </button>
        </form>
      </main>
    </div>
  );
};

