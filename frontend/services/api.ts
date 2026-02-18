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

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:5000";

/**
 * 🔐 Fonction générique sécurisée pour les appels API
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

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
