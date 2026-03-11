type ChatRole = "user" | "assistant";

export type ChatbotHistoryResponse = {
  ok: boolean;
  conversations?: Array<{
    conversationId: string;
    updatedAt?: string;
    totalMessages?: number;
    lastMessage?: { role: ChatRole; content: string; createdAt?: string } | null;
  }>;
};

export type ChatbotResetResponse = {
  ok: boolean;
  conversationId: string;
};

export type ChatbotMessageResponse = {
  ok: boolean;
  conversationId: string;
  reply: string;
  detectedIntent?: string;
  suggestions?: string[];
  disclaimer?: string;
};

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000";

async function requestAuthed<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    const message =
      data?.error?.message || data?.message || `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function fetchChatbotHistory(token: string) {
  return requestAuthed<ChatbotHistoryResponse>("/api/chatbot/history", token, {
    method: "GET",
  });
}

export function resetChatbotConversation(token: string) {
  return requestAuthed<ChatbotResetResponse>("/api/chatbot/reset", token, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function sendChatbotMessage(
  token: string,
  payload: { message: string; conversationId?: string; productContext?: unknown }
) {
  return requestAuthed<ChatbotMessageResponse>("/api/chatbot/message", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

