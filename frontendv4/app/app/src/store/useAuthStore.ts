import { create } from 'zustand';
import { apiClient } from '../api/api';
import type { User } from '../api/api';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean; // true pendant le bootstrap initial
  signingIn: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<boolean>;
  signUpWithPassword: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,
  signingIn: false,
  error: null,

  bootstrap: async () => {
    try {
      await apiClient.init();
      const isAuth = await apiClient.isAuthenticated();
      if (isAuth) {
        const user = await apiClient.getProfile();
        const token = apiClient.getToken();
        set({ user, token, loading: false });
      } else {
        set({ user: null, token: null, loading: false });
      }
    } catch (err) {
      set({ user: null, token: null, loading: false });
    }
  },

  signInWithPassword: async (email, password) => {
    set({ signingIn: true, error: null });
    try {
      const response = await apiClient.login(email.trim().toLowerCase(), password);
      set({ user: response.user, token: response.token, signingIn: false });
      return true;
    } catch (err: any) {
      const message = humanizeError(err.message || 'Erreur lors de la connexion');
      set({ signingIn: false, error: message });
      return false;
    }
  },

  signUpWithPassword: async (email, password, name) => {
    set({ signingIn: true, error: null });
    try {
      const response = await apiClient.register(name.trim(), email.trim().toLowerCase(), password);
      set({ user: response.user, token: response.token, signingIn: false });
      return true;
    } catch (err: any) {
      const message = humanizeError(err.message || 'Erreur lors de l\'inscription');
      set({ signingIn: false, error: message });
      return false;
    }
  },

  signOut: async () => {
    await apiClient.logout();
    set({ user: null, token: null });
  },

  deleteAccount: async () => {
    try {
      // TODO: Implémenter l'endpoint DELETE /api/auth/delete-account au backend
      set({ user: null, token: null });
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: humanizeError(String(e?.message ?? e)) };
    }
  },

  clearError: () => set({ error: null }),
}));

function humanizeError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid') || m.includes('incorrect')) return 'Email ou mot de passe incorrect.';
  if (m.includes('already')) return 'Cet email a déjà un compte.';
  if (m.includes('password')) return 'Le mot de passe doit faire au moins 8 caractères.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives, réessaie dans quelques minutes.';
  if (m.includes('network') || m.includes('fetch')) return 'Pas de connexion — vérifie ton réseau.';
  return msg;
}
