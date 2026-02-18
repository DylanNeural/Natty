export type ChatbotMessagePayload = {
  message: string;
  conversationId?: string;
  productContext?: unknown;
};

export type ChatbotMessageResponse = {
  ok: boolean;
  conversationId: string;
  reply: string;
  detectedIntent: string;
  suggestions: string[];
  disclaimer: string;
};

export type ChatbotHistoryItem = {
  conversationId: string;
  updatedAt: string;
  totalMessages: number;
  lastMessage: {
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  } | null;
};

export type ChatbotHistoryResponse = {
  ok: boolean;
  conversations: ChatbotHistoryItem[];
};

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3000";

async function request<T>(path: string, options: RequestInit, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = data?.message || data?.error?.message || `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function sendChatbotMessage(token: string, payload: ChatbotMessagePayload) {
  return request<ChatbotMessageResponse>(
    "/api/chatbot/message",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export function fetchChatbotHistory(token: string) {
  return request<ChatbotHistoryResponse>(
    "/api/chatbot/history",
    { method: "GET" },
    token
  );
}

export function resetChatbotConversation(token: string) {
  return request<{ ok: boolean; conversationId: string }>(
    "/api/chatbot/reset",
    { method: "POST", body: JSON.stringify({}) },
    token
  );
}

