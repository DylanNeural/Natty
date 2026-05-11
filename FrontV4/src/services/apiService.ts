/**
 * API Service for Natty Backend
 * Handles all authentication and data requests
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

// Prevent mixed-content issues in production (HTTPS frontend calling HTTP backend).
if ((import.meta as any).env.PROD && typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('http://')) {
  throw new Error('VITE_API_URL must be HTTPS in production (mixed content).');
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin?: boolean;
  };
  // JWT is stored server-side in a secure httpOnly cookie (not accessible from JS)
}

export interface AdminOverview {
  usersCount: number;
  premiumUsersCount: number;
  fridgesCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFridge {
  id: string;
  name: string;
  address: string;
  distance: string;
  walkTime: string;
  isOpen: boolean;
  stockCount: number;
  lat: number;
  lng: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Helper for API calls with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      if (response.status === 429) {
        throw {
          message: error.message || 'Trop de requêtes, veuillez patienter avant de réessayer.',
          status: 429,
        };
      }

      throw {
        message: error.message || `HTTP Error ${response.status}`,
        status: response.status,
      };
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: 'Erreur de connexion. Vérifie que le backend est actif.',
      };
    }
    throw error;
  }
}

// ==================== AUTH ENDPOINTS ====================

/**
 * Register a new user
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, captchaToken: 'demo' }),
  });

  // Keep only non-sensitive user info client-side (never JWT)
  localStorage.setItem('natty_user', JSON.stringify(response.user));

  return response;
}

/**
 * Login with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken: 'demo' }),
  });

  // Keep only non-sensitive user info client-side (never JWT)
  localStorage.setItem('natty_user', JSON.stringify(response.user));

  return response;
}

/**
 * Logout (server clears cookie + clear local user cache)
 */
export async function logout(): Promise<void> {
  await apiCall('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem('natty_user');
}

/**
 * Get current user profile
 */
export async function getProfile() {
  return apiCall('/api/profile/me', {
    method: 'GET',
  });
}

// ==================== ARTICLES ====================

/**
 * Get all articles
 */
export async function getArticles() {
  return apiCall<{ articles: any[]; total: number }>('/api/articles', {
    method: 'GET',
  });
}

/**
 * Get a single article
 */
export async function getArticle(id: string) {
  return apiCall(`/api/articles/${id}`, {
    method: 'GET',
  });
}

// ==================== CHALLENGES ====================

/**
 * Get all challenges
 */
export async function getChallenges() {
  return apiCall<{ challenges: any[]; total: number }>('/api/challenges', {
    method: 'GET',
  });
}

/**
 * Get active challenge
 */
export async function getActiveChallenge() {
  return apiCall('/api/challenges/active', {
    method: 'GET',
  });
}

/**
 * Get single challenge
 */
export async function getChallenge(id: string) {
  return apiCall(`/api/challenges/${id}`, {
    method: 'GET',
  });
}

/**
 * Update challenge progress
 */
export async function updateChallengeProgress(id: string, completed: boolean) {
  return apiCall(`/api/challenges/${id}/progress`, {
    method: 'POST',
    body: JSON.stringify({ completed }),
  });
}

// ==================== FRIDGES ====================

export async function getFridges() {
  return apiCall<{ fridges: AdminFridge[]; total: number }>('/api/fridges', {
    method: 'GET',
  });
}

// ==================== ADMIN ====================

export async function adminGetOverview() {
  return apiCall<AdminOverview>('/api/admin/overview', { method: 'GET' });
}

export async function adminGetUsers() {
  return apiCall<{ users: AdminUser[]; total: number }>('/api/admin/users', { method: 'GET' });
}

export async function adminUpdateUserPremium(userId: string, isPremium: boolean) {
  return apiCall(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isPremium }),
  });
}

export async function adminDeleteUser(userId: string) {
  return apiCall(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

export async function adminGetFridges() {
  return apiCall<{ fridges: AdminFridge[]; total: number }>('/api/admin/fridges', { method: 'GET' });
}

export async function adminCreateFridge(payload: {
  name: string;
  address: string;
  lat: number;
  lng: number;
}) {
  return apiCall('/api/admin/fridges', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateFridge(fridgeId: string, payload: Partial<AdminFridge>) {
  return apiCall(`/api/admin/fridges/${fridgeId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteFridge(fridgeId: string) {
  return apiCall(`/api/admin/fridges/${fridgeId}`, {
    method: 'DELETE',
  });
}

// ==================== UTILITY ====================

export function isAuthenticated(): boolean {
  // Cookie-based auth: cannot be inferred reliably without calling backend.
  // This keeps legacy callers stable (none currently), based on cached user only.
  return !!localStorage.getItem('natty_user');
}

export function getStoredUser() {
  const user = localStorage.getItem('natty_user');
  return user ? JSON.parse(user) : null;
}
