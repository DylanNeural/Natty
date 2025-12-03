// src/services/profileApi.ts
import { API_BASE_URL } from "../config";

export type UserProfile = {
  id: string;
  name?: string;
  email: string;
  age?: number | null;
  gender?: "H" | "F" | "Autre" | null;
  height?: number | null;
  weight?: number | null;
  targetWeight?: number | null;
  activityLevel?: "faible" | "moyen" | "élevé" | null;
  goal?: "perte" | "prise" | "maintien" | null;
  dietaryPreferences?: unknown;
  startDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function buildHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleJsonResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function fetchProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const obj = data as { message?: string; error?: string } | string;
    const message =
      typeof obj === "string"
        ? obj
        : obj.message || obj.error || `Erreur ${res.status} profil`;
    throw new Error(message);
  }

  return data as UserProfile;
}

export type ProfileUpdatePayload = Partial<
  Omit<UserProfile, "id" | "email" | "createdAt" | "updatedAt">
>;

export async function updateProfile(
  token: string,
  payload: ProfileUpdatePayload
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const obj = data as { message?: string; error?: string } | string;
    const message =
      typeof obj === "string"
        ? obj
        : obj.message || obj.error || `Erreur ${res.status} update profil`;
    throw new Error(message);
  }

  const obj = data as { user: UserProfile };
  return obj.user;
}
