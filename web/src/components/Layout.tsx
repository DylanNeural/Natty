// src/components/Layout.tsx
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type LayoutProps = {
  children?: ReactNode;
};

export function Layout({ children = null }: LayoutProps) {
  const { auth, logout } = useAuth();
  const location = useLocation();

  const isLoggedIn = !!auth.token;
  const displayName =
    auth.user?.name ?? auth.user?.email ?? (isLoggedIn ? "Athlète" : null);

  const currentPath = location.pathname;

  const navLinkStyle = (path: string) => {
    const isActive = currentPath === path;
    return {
      textDecoration: "none",
      color: isActive ? "#22c55e" : "#e5e7eb",
      fontWeight: isActive ? 600 : 400,
      borderBottom: isActive ? "2px solid #22c55e" : "2px solid transparent",
      paddingBottom: "0.1rem",
      fontSize: "0.9rem",
    } as const;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #111827",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
            NATTY
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              border: "1px solid #1f2937",
              borderRadius: "999px",
              padding: "0.1rem 0.4rem",
            }}
          >
            prototype
          </span>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Link to="/" style={navLinkStyle("/")}>
            Accueil
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/dashboard" style={navLinkStyle("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/meals" style={navLinkStyle("/meals")}>
                Repas
              </Link>
              <Link to="/profile" style={navLinkStyle("/profile")}>
                Profil
              </Link>
              <Link to="/progress" style={navLinkStyle("/progress")}>
                Progression
              </Link>
            </>
          )}
        </nav>

        {/* Zone droite */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.85rem",
          }}
        >
          {isLoggedIn && (
            <span style={{ opacity: 0.8 }}>
              {displayName ? `Connecté : ${displayName}` : "Connecté"}
            </span>
          )}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={logout}
              style={{
                borderRadius: "999px",
                border: "1px solid #4b5563",
                background: "transparent",
                color: "#e5e7eb",
                padding: "0.3rem 0.8rem",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                borderRadius: "999px",
                border: "1px solid #4b5563",
                padding: "0.3rem 0.8rem",
                fontSize: "0.8rem",
                textDecoration: "none",
                color: "#e5e7eb",
              }}
            >
              Connexion
            </Link>
          )}
        </div>
      </header>

      {/* Contenu */}
      <main
        style={{
          flex: 1,
          padding: 0,
          width: "100%",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #111827",
          padding: "0.75rem 1.5rem",
          fontSize: "0.8rem",
          opacity: 0.6,
        }}
      >
        Natty · Prototype de suivi nutrition & progression
      </footer>
    </div>
  );
}
