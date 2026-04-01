// src/services/progressApi.ts
import { API_BASE_URL } from "../config";

export type ProgressEntry = {
  _id: string;
  userId: string;
  date: string;
  weight?: number | null;
  bodyFat?: number | null;
  muscleMass?: number | null;
  waist?: number | null;
  chest?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProgressPayload = {
  date?: string; // "YYYY-MM-DD"
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waist?: number;
  chest?: number;
  notes?: string;
};

function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleJsonResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function fetchProgress(
  token: string
): Promise<ProgressEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/progress`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de la récupération de la progression`;
    throw new Error(message);
  }

  if (data && Array.isArray((data as any).entries)) {
    return (data as any).entries as ProgressEntry[];
  }

  return [];
}

export async function createProgress(
  token: string,
  payload: ProgressPayload
): Promise<ProgressEntry> {
  const res = await fetch(`${API_BASE_URL}/api/progress`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de la création de la progression`;
    throw new Error(message);
  }

  if (data && (data as any).entry) {
    return (data as any).entry as ProgressEntry;
  }

  throw new Error("Réponse /api/progress invalide (pas de champ entry)");
}
