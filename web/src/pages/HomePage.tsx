// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function HomePage() {
  const { auth } = useAuth();
  const isLoggedIn = !!auth.token;
  const displayName =
    auth.user?.name ?? auth.user?.email ?? (isLoggedIn ? "Athlète" : null);

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
        Natty – Suivi nutrition et progression
      </h1>

      <p style={{ opacity: 0.85, maxWidth: "700px", marginBottom: "1.5rem" }}>
        Application de suivi pour garder un œil sur tes repas, ton objectif
        (perte / prise / maintien) et ta progression au fil du temps.
      </p>

      {isLoggedIn ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>
            Bienvenue{displayName ? `, ${displayName}` : ""} 👋
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                backgroundColor: "#22c55e",
                color: "#022c22",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Aller au dashboard
            </Link>
            <Link
              to="/meals"
              style={{
                textDecoration: "none",
                borderRadius: "999px",
                padding: "0.5rem 1rem",
                border: "1px solid #4b5563",
                color: "#e5e7eb",
                fontSize: "0.95rem",
              }}
            >
              Gérer mes repas
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              backgroundColor: "#22c55e",
              color: "#022c22",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              borderRadius: "999px",
              padding: "0.5rem 1rem",
              border: "1px solid #4b5563",
              color: "#e5e7eb",
              fontSize: "0.95rem",
            }}
          >
            Créer un compte
          </Link>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Suivi de tes repas
          </h2>
          <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
            Enregistre tes repas post-sport avec calories et macros pour garder
            un historique propre.
          </p>
        </div>

        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Objectif & progression
          </h2>
          <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
            Objectif perte, prise ou maintien. Le dashboard te donnera un
            aperçu de ta situation globale.
          </p>
        </div>

        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Pensé pour le suivi natty
          </h2>
          <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
            Conçu pour un suivi sérieux : structure proche d’une vraie BDD de
            coaching (users, meals, logs, feedback…).
          </p>
        </div>
      </div>
    </section>
  );
}
