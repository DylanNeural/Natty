import React, { useMemo, useState } from "react";

interface Props {
  onBack: () => void;
}

type ChatbotApiResponse = {
  ok?: boolean;
  conversationId?: string;
  reply?: string;
  detectedIntent?: string;
  suggestions?: string[];
  disclaimer?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

export const TestScreen: React.FC<Props> = ({ onBack }) => {
  const apiBaseUrl =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    "http://localhost:5000";

  const [token, setToken] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("Est-ce que ce produit est adapté à une prise de masse propre ?");
  const [productContextText, setProductContextText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatbotApiResponse | null>(null);
  const [history, setHistory] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedProductContext = useMemo(() => {
    if (!productContextText.trim()) return null;
    try {
      return JSON.parse(productContextText);
    } catch {
      return "__INVALID_JSON__";
    }
  }, [productContextText]);

  async function callApi(path: string, method: "GET" | "POST", body?: unknown) {
    if (!token.trim()) {
      throw new Error("Token requis (Bearer JWT).");
    }

    const res = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error?.message || data?.message || `Erreur ${res.status}`);
    }
    return data;
  }

  async function handleSendMessage() {
    if (!message.trim()) return;
    if (parsedProductContext === "__INVALID_JSON__") {
      setError("productContext JSON invalide.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        message: message.trim(),
      };
      if (conversationId.trim()) payload.conversationId = conversationId.trim();
      if (parsedProductContext) payload.productContext = parsedProductContext;

      const data = (await callApi("/api/chatbot/message", "POST", payload)) as ChatbotApiResponse;
      setResponse(data);
      setConversationId(data.conversationId || conversationId);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Erreur message chatbot.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetConversation() {
    setLoading(true);
    setError(null);

    try {
      const data = (await callApi("/api/chatbot/reset", "POST", {})) as ChatbotApiResponse;
      setConversationId(data.conversationId || "");
      setResponse(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Erreur reset chatbot.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadHistory() {
    setLoading(true);
    setError(null);

    try {
      const data = await callApi("/api/chatbot/history", "GET");
      setHistory(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Erreur history chatbot.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 bg-background-light dark:bg-background-dark overflow-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
            Test Chatbot API
          </h1>
          <p className="mt-1 text-xs text-text-light/70 dark:text-text-dark/70">
            Console de test manuelle pour `/api/chatbot/*`
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-full px-4 py-2 bg-primary text-white text-xs font-semibold"
        >
          Retour
        </button>
      </div>

      <label className="text-xs font-semibold text-text-light dark:text-text-dark">
        API base URL
      </label>
      <input
        value={apiBaseUrl}
        readOnly
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800"
      />

      <label className="text-xs font-semibold text-text-light dark:text-text-dark">
        Token JWT (Bearer)
      </label>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Colle ici le token reçu après login"
        className="min-h-20 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs bg-white dark:bg-gray-900"
      />

      <label className="text-xs font-semibold text-text-light dark:text-text-dark">
        Conversation ID (optionnel)
      </label>
      <input
        value={conversationId}
        onChange={(e) => setConversationId(e.target.value)}
        placeholder="Laisse vide pour en créer une"
        className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"
      />

      <label className="text-xs font-semibold text-text-light dark:text-text-dark">
        Message
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-24 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"
      />

      <label className="text-xs font-semibold text-text-light dark:text-text-dark">
        productContext JSON (optionnel)
      </label>
      <textarea
        value={productContextText}
        onChange={(e) => setProductContextText(e.target.value)}
        placeholder='{"nom":"Skyr","valeurs_nutritionnelles":{"proteines_g":10}}'
        className="min-h-24 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs bg-white dark:bg-gray-900"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="rounded-full px-4 py-2 bg-primary text-white text-xs font-semibold disabled:opacity-60"
        >
          Envoyer message
        </button>
        <button
          onClick={handleResetConversation}
          disabled={loading}
          className="rounded-full px-4 py-2 bg-orange-500 text-white text-xs font-semibold disabled:opacity-60"
        >
          Reset conversation
        </button>
        <button
          onClick={handleLoadHistory}
          disabled={loading}
          className="rounded-full px-4 py-2 bg-slate-700 text-white text-xs font-semibold disabled:opacity-60"
        >
          Charger history
        </button>
      </div>

      {error && (
        <pre className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 text-xs whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {response && (
        <pre className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-xs whitespace-pre-wrap overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}

      {history && (
        <pre className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-xs whitespace-pre-wrap overflow-auto">
          {JSON.stringify(history, null, 2)}
        </pre>
      )}
    </div>
  );
};
