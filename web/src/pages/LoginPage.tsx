// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      const token = data.token as string;
      const user = data.user;

      setAuthData({
        user,
        token,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erreur login :", err);
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
        Connexion
      </h1>
      <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
        Connecte-toi pour accéder à ton dashboard et à tes repas enregistrés.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
            }}
          />
        </label>

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span>Mot de passe</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1rem",
            borderRadius: "999px",
            border: "none",
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            backgroundColor: loading ? "#16a34a80" : "#22c55e",
            color: "#022c22",
            fontSize: "0.95rem",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && (
          <p style={{ color: "#fca5a5", marginTop: "0.5rem" }}>❌ {error}</p>
        )}

        <p style={{ opacity: 0.8, fontSize: "0.9rem", marginTop: "0.75rem" }}>
          Pas encore de compte ?{" "}
          <Link to="/register" style={{ color: "#22c55e" }}>
            Créer un compte
          </Link>
        </p>
      </form>
    </section>
  );
}
