import { API_BASE_URL } from "../config";

export type RegisterPayload = {
  email: string;
  password: string;
  username?: string; // <- important : username, pas name
};

export type LoginPayload = {
  email: string;
  password: string;
};

async function handleJsonResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function registerUser(payload: RegisterPayload) {
  // On convertit username -> name pour le backend
  const nameFromUsername =
    payload.username && payload.username.trim().length > 0
      ? payload.username.trim()
      : payload.email.split("@")[0]; // fallback propre

  const body = {
    name: nameFromUsername,
    email: payload.email,
    password: payload.password,
  };

  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de l'inscription`;
    throw new Error(message);
  }

  return data;
}

export async function loginUser(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de la connexion`;
    throw new Error(message);
  }

  return data;
}
