// services/api.ts

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  targetWeight?: number | null;
  activityLevel?: string | null;
  goal?: string | null;
  dietaryPreferences?: string[];
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

function normalizeApiBaseUrl(rawUrl?: string) {
  const fallback = "http://localhost:5000";
  const value = (rawUrl || fallback).trim();
  return value.replace(/\/+$/, "");
}

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL as string | undefined);

let csrfTokenCache: string | null = null;

async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && csrfTokenCache) {
    return csrfTokenCache;
  }

  const res = await fetch(buildApiUrl("/api/csrf-token"), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Impossible de récupérer le token CSRF (${res.status})`);
  }

  const data = (await res.json()) as { csrfToken?: string };
  if (!data?.csrfToken) {
    throw new Error("Token CSRF manquant dans la réponse serveur");
  }

  csrfTokenCache = data.csrfToken;
  return csrfTokenCache;
}

/**
 * 🔐 Fonction générique sécurisée pour les appels API
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const needsCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (needsCsrf) {
    const csrfToken = await getCsrfToken();
    (headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
  }

  const runFetch = async () =>
    fetch(buildApiUrl(path), {
      ...options,
      headers,
      credentials: "include",
    });

  let res = await runFetch();

  if (needsCsrf && res.status === 403) {
    const csrfToken = await getCsrfToken(true);
    (headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
    res = await runFetch();
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // réponse vide ou non-JSON
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

/**
 * 🔐 AUTH — LOGIN (avec CAPTCHA)
 */
export function login(
  email: string,
  password: string,
  captchaToken: string
) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      captchaToken,
    }),
  });
}

/**
 * 🔐 AUTH — REGISTER (avec CAPTCHA)
 */
export function register(
  name: string,
  email: string,
  password: string,
  captchaToken: string
) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      captchaToken,
    }),
  });
}

/**
 * 🔐 PROFIL — nécessite un token
 */
export function fetchProfile(token: string) {
  return request<User>("/api/profile/me", { method: "GET" }, token);
}

/**
 * 📦 SCAN BARCODE
 */
export function scanBarcode(barcode: string) {
  return request<{ ok: boolean; source: string; data: any }>("/api/scan", {
    method: "POST",
    body: JSON.stringify({ barcode }),
  });
}

/**
 * 🖼️ SCAN IMAGE
 */
export function scanImage(
  imageBase64: string,
  mimeType = "image/jpeg"
) {
  return request<{ ok: boolean; source: string; data: any }>("/api/scan", {
    method: "POST",
    body: JSON.stringify({ imageBase64, mimeType }),
  });
}
