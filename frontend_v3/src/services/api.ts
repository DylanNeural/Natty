export function normalizeApiBaseUrl(rawUrl?: string) {
  const fallback = 'http://localhost:5000';
  const value = (rawUrl || fallback).trim();
  return value.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeApiBaseUrl(
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL,
);

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function pingBackend() {
  const response = await fetch(buildApiUrl('/'), {
    method: 'GET',
    credentials: 'omit',
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body: text,
  };
}
