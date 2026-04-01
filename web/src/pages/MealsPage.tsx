// src/pages/MealsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  fetchMeals,
  createMeal,
  type Meal,
  type MealPayload,
} from "../services/mealsApi";

export function MealsPage() {
  const { auth } = useAuth();
  const token = auth.token;

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setLoadingError(null);

    fetchMeals(token)
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error("Erreur fetchMeals :", err);
        setLoadingError(err.message || "Erreur lors du chargement des repas");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return (
      <section>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
          Mes repas post-sport
        </h1>
        <p style={{ opacity: 0.8 }}>
          Tu dois être connecté pour voir cette page.{" "}
          <Link to="/login" style={{ color: "#22c55e" }}>
            Se connecter
          </Link>
        </p>
      </section>
    );
  }

  function parseNumberOrUndefined(value: string): number | undefined {
    if (!value.trim()) return undefined;
    const n = Number(value.trim().replace(",", "."));
    if (Number.isNaN(n)) return undefined;
    return n;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    if (!token) {
      setSubmitError("Tu dois être connecté pour ajouter un repas.");
      setSubmitLoading(false);
      return;
    }

    try {
      const payload: MealPayload = {
        name,
        calories: parseNumberOrUndefined(calories),
        protein: parseNumberOrUndefined(protein),
        carbs: parseNumberOrUndefined(carbs),
        fat: parseNumberOrUndefined(fat),
      };

      const newMeal = await createMeal(token, payload);
      setMeals((prev) => [newMeal, ...prev]);

      setName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    } catch (err: any) {
      console.error("Erreur createMeal :", err);
      setSubmitError(err.message || "Erreur lors de l'ajout du repas");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
        Mes repas post-sport
      </h1>

      <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
        Chaque repas enregistré correspond à une entrée dans le log{" "}
        <code>user_meal_log</code> relié à la table <code>meals</code> de ton
        schéma BDD.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
          gap: "1.5rem",
        }}
      >
        {/* Formulaire */}
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Ajouter un repas
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
            >
              <span>Nom du repas *</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #4b5563",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                }}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Calories (kcal)</span>
                <input
                  type="text"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Protéines (g)</span>
                <input
                  type="text"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Glucides (g)</span>
                <input
                  type="text"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Lipides (g)</span>
                <input
                  type="text"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1rem",
                borderRadius: "999px",
                border: "none",
                fontWeight: 600,
                cursor: submitLoading ? "default" : "pointer",
                backgroundColor: submitLoading ? "#16a34a80" : "#22c55e",
                color: "#022c22",
                fontSize: "0.9rem",
              }}
            >
              {submitLoading ? "Ajout en cours..." : "Ajouter le repas"}
            </button>
          </form>

          {submitError && (
            <p style={{ color: "#fca5a5", marginTop: "0.75rem" }}>
              ❌ {submitError}
            </p>
          )}
        </div>

        {/* Liste des repas */}
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Derniers repas
          </h2>

          {loading && <p>Chargement des repas...</p>}
          {loadingError && (
            <p style={{ color: "#fca5a5" }}>❌ {loadingError}</p>
          )}

          {!loading && !loadingError && meals.length === 0 && (
            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
              Aucun repas enregistré pour le moment.
            </p>
          )}

          {!loading && meals.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {meals.map((meal) => (
                <li
                  key={meal.id ?? meal.mealId ?? Math.random().toString(36)}
                  style={{
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #1f2937",
                    backgroundColor: "#020617",
                    fontSize: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{meal.name}</span>
                    <span style={{ opacity: 0.7 }}>
                      {meal.calories != null ? `${meal.calories} kcal` : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "0.25rem",
                      opacity: 0.7,
                      fontSize: "0.8rem",
                    }}
                  >
                    {meal.protein != null && (
                      <span>🥩 {meal.protein} g prot · </span>
                    )}
                    {meal.carbs != null && (
                      <span>🍚 {meal.carbs} g gluc · </span>
                    )}
                    {meal.fat != null && (
                      <span>🥑 {meal.fat} g lip</span>
                    )}
                    {meal.date && (
                      <span style={{ marginLeft: "0.5rem" }}>
                        · {new Date(meal.date).toLocaleString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
