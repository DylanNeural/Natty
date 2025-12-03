// src/pages/ProgressPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  fetchProgress,
  createProgress,
  type ProgressEntry,
  type ProgressPayload,
} from "../services/progressApi.ts";

export function ProgressPage() {
  const { auth } = useAuth();
  const token = auth.token;

  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [weight, setWeight] = useState<string>("");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [muscleMass, setMuscleMass] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [chest, setChest] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setLoadingError(null);

    fetchProgress(token)
      .then((data: ProgressEntry[]) => {
        setEntries(data);
      })
      .catch((err: unknown) => {
        const error = err as Error;
        console.error("Erreur fetchProgress :", err);
        setLoadingError(
          error.message || "Erreur lors du chargement de la progression"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return (
      <section>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
          Progression
        </h1>
        <p style={{ opacity: 0.8 }}>
          Tu dois être connecté pour voir ta progression.{" "}
          <Link to="/login" style={{ color: "#22c55e" }}>
            Se connecter
          </Link>
        </p>
      </section>
    );
  }

  function parseNumber(value: string): number | undefined {
    if (!value.trim()) return undefined;
    const n = Number(value.trim().replace(",", "."));
    if (Number.isNaN(n)) return undefined;
    return n;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSubmitError(null);
    setSubmitLoading(true);

    try {
      const payload: ProgressPayload = {
        date,
        weight: parseNumber(weight),
        bodyFat: parseNumber(bodyFat),
        muscleMass: parseNumber(muscleMass),
        waist: parseNumber(waist),
        chest: parseNumber(chest),
        notes: notes || undefined,
      };

      const newEntry = await createProgress(token, payload);
      setEntries((prev) => [newEntry, ...prev]);

      // reset léger
      setWeight("");
      setBodyFat("");
      setMuscleMass("");
      setWaist("");
      setChest("");
      setNotes("");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erreur createProgress :", err);
      setSubmitError(
        error.message || "Erreur lors de l'ajout de l'entrée de progression"
      );
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
        Progression
      </h1>

      <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
        Ces données correspondent à la table <code>user_progress</code> dans ton
        schéma BDD (poids, BF, mensurations, etc.).
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
            Ajouter une entrée
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
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
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  padding: "0.4rem 0.6rem",
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
                <span>Poids (kg)</span>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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
                <span>Body fat (%)</span>
                <input
                  type="text"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
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
                <span>Masse musculaire (kg)</span>
                <input
                  type="text"
                  value={muscleMass}
                  onChange={(e) => setMuscleMass(e.target.value)}
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
                <span>Tour de taille (cm)</span>
                <input
                  type="text"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
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
                <span>Tour de poitrine (cm)</span>
                <input
                  type="text"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
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

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
              }}
            >
              <span>Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #4b5563",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  resize: "vertical",
                }}
              />
            </label>

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
              {submitLoading ? "Ajout en cours..." : "Ajouter l'entrée"}
            </button>

            {submitError && (
              <p style={{ color: "#fca5a5", marginTop: "0.5rem" }}>
                ❌ {submitError}
              </p>
            )}
          </form>
        </div>

        {/* Liste des entrées */}
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Historique
          </h2>

          {loading && <p>Chargement de la progression...</p>}
          {loadingError && (
            <p style={{ color: "#fca5a5" }}>❌ {loadingError}</p>
          )}

          {!loading && !loadingError && entries.length === 0 && (
            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
              Aucune entrée pour le moment.
            </p>
          )}

          {!loading && entries.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Date
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Poids
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      BF
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Muscles
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Taille
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Poitrine
                    </th>
                    <th style={{ textAlign: "left", padding: "0.35rem" }}>
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {entry.weight != null ? `${entry.weight} kg` : "—"}
                      </td>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {entry.bodyFat != null ? `${entry.bodyFat} %` : "—"}
                      </td>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {entry.muscleMass != null
                          ? `${entry.muscleMass} kg`
                          : "—"}
                      </td>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {entry.waist != null ? `${entry.waist} cm` : "—"}
                      </td>
                      <td style={{ padding: "0.35rem", opacity: 0.9 }}>
                        {entry.chest != null ? `${entry.chest} cm` : "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.35rem",
                          opacity: 0.9,
                          maxWidth: "220px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
