import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type AuthUser = {
  id?: string;        // _id côté backend, mappé en id dans la réponse
  name?: string;
  email?: string;
  // au cas où ton backend renvoie d'autres champs (age, goal, etc.)
  [key: string]: unknown;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

type AuthContextValue = {
  auth: AuthState;
  setAuthData: (data: { user: AuthUser; token: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "natty_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
  });

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    try {
      // côté Vite on est toujours dans le navigateur, mais on check par sécurité
      if (typeof window === "undefined") return;

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<AuthState> | null;

      if (parsed && typeof parsed === "object") {
        setAuth({
          user: (parsed.user as AuthUser) ?? null,
          token: typeof parsed.token === "string" ? parsed.token : null,
        });
      }
    } catch {
      // on ignore les erreurs de parsing
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!auth.token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  function setAuthData(data: { user: AuthUser; token: string }) {
    setAuth({
      user: data.user,
      token: data.token,
    });
  }

  function logout() {
    setAuth({
      user: null,
      token: null,
    });
  }

  const value: AuthContextValue = {
    auth,
    setAuthData,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
