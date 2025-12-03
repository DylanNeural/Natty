// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile, type UserProfile } from "../services/profileApi";
import {
  fetchProgress,
  type ProgressEntry,
} from "../services/progressApi.ts";
import { fetchMeals, type Meal } from "../services/mealsApi";

export function DashboardPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const token = auth.token;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setLoadingError(null);

    (async () => {
      try {
        const [profileRes, progressRes, mealsRes] = await Promise.all([
          fetchProfile(token).catch((err: unknown) => {
            console.error("Erreur fetchProfile dans Dashboard :", err);
            return null as UserProfile | null;
          }),
          fetchProgress(token).catch((err: unknown) => {
            console.error("Erreur fetchProgress dans Dashboard :", err);
            return [] as ProgressEntry[];
          }),
          fetchMeals(token).catch((err: unknown) => {
            console.error("Erreur fetchMeals dans Dashboard :", err);
            return [] as Meal[];
          }),
        ]);

        if (profileRes) {
          setProfile(profileRes);
        }
        setProgressEntries(progressRes);
        setMeals(mealsRes);
      } catch (e: unknown) {
        const err = e as Error;
        console.error("Erreur globale Dashboard :", err);
        setLoadingError(
          err.message || "Erreur lors du chargement des données du dashboard"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (!token) {
    return (
      <section>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
          Dashboard
        </h1>
        <p style={{ opacity: 0.8 }}>
          Tu dois être connecté pour voir le dashboard.{" "}
          <Link to="/login" style={{ color: "#22c55e" }}>
            Se connecter
          </Link>
        </p>
      </section>
    );
  }

  const userName =
    profile?.name ?? auth.user?.name ?? auth.user?.email ?? "Athlète";

  const lastEntry = progressEntries[0];
  const previousEntry = progressEntries[1];

  const lastWeight = lastEntry?.weight ?? null;
  const previousWeight = previousEntry?.weight ?? null;
  const weightDiff =
    lastWeight != null && previousWeight != null
      ? lastWeight - previousWeight
      : null;

  const mealsCount = meals.length;

  return (
    <section>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
        Dashboard
      </h1>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        Bienvenue, {userName} 👋
      </p>

      {loading && <p>Chargement des données...</p>}
      {loadingError && (
        <p style={{ color: "#fca5a5" }}>❌ {loadingError}</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Carte Profil */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          style={{
            textAlign: "left",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
            cursor: "pointer",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Profil utilisateur
          </h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Nom :</strong> {profile?.name ?? "—"}
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Objectif :</strong>{" "}
            {profile?.goal
              ? profile.goal === "perte"
                ? "Perte de poids"
                : profile.goal === "prise"
                ? "Prise de masse"
                : "Maintien"
              : "—"}
          </p>
          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Niveau d'activité :</strong>{" "}
            {profile?.activityLevel ?? "—"}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              marginTop: "0.5rem",
            }}
          >
            Clique pour modifier âge, poids, taille, objectif, etc.
          </p>
        </button>

        {/* Carte Progression */}
        <button
          type="button"
          onClick={() => navigate("/progress")}
          style={{
            textAlign: "left",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
            cursor: "pointer",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Progression
          </h2>

          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Entrées :</strong> {progressEntries.length}
          </p>

          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Dernier poids :</strong>{" "}
            {lastWeight != null ? `${lastWeight} kg` : "—"}
          </p>

          {weightDiff != null && (
            <p
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
                color:
                  weightDiff < 0
                    ? "#4ade80"
                    : weightDiff > 0
                    ? "#f97373"
                    : "#e5e7eb",
              }}
            >
              Évolution vs précédente :{" "}
              {weightDiff > 0 ? "+" : ""}
              {weightDiff.toFixed(1)} kg
            </p>
          )}

          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              marginTop: "0.5rem",
            }}
          >
            Clique pour voir / ajouter des mesures détaillées (poids, BF,
            mensurations…).
          </p>
        </button>

        {/* Carte Repas */}
        <button
          type="button"
          onClick={() => navigate("/meals")}
          style={{
            textAlign: "left",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            padding: "1rem",
            backgroundColor: "#020617",
            cursor: "pointer",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
            Repas enregistrés
          </h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            <strong>Nombre de repas :</strong> {mealsCount}
          </p>

          {mealsCount > 0 && (
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              <strong>Dernier repas :</strong>{" "}
              {meals[0].name}{" "}
              {meals[0].calories != null
                ? `(${meals[0].calories} kcal)`
                : ""}
            </p>
          )}

          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.7,
              marginTop: "0.5rem",
            }}
          >
            Clique pour gérer tes repas post-sport, liés à{" "}
            <code>user_meal_log</code> et <code>meals</code> dans la BDD.
          </p>
        </button>
      </div>

      <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
        Ce dashboard résume les données des tables <code>users</code>,{" "}
        <code>user_progress</code> et <code>user_meal_log</code> /{" "}
        <code>meals</code> de ton schéma BDD.
      </p>
    </section>
  );
}
