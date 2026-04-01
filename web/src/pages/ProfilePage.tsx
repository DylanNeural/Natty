// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  fetchProfile,
  updateProfile,
  type UserProfile,
  type ProfileUpdatePayload,
} from "../services/profileApi";

export function ProfilePage() {
  const { auth } = useAuth();
  const token = auth.token;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileUpdatePayload>({});

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setLoadingError(null);

    (async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
        setForm({
          name: data.name,
          age: data.age ?? undefined,
          gender: data.gender ?? undefined,
          height: data.height ?? undefined,
          weight: data.weight ?? undefined,
          targetWeight: data.targetWeight ?? undefined,
          activityLevel: data.activityLevel ?? undefined,
          goal: data.goal ?? undefined,
        });
      } catch (e: unknown) {
        const err = e as Error;
        console.error("Erreur fetchProfile :", err);
        setLoadingError(
          err.message || "Erreur lors du chargement du profil"
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
          Profil utilisateur
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

  function handleChange<K extends keyof ProfileUpdatePayload>(
    key: K,
    value: string
  ) {
    if (["age", "height", "weight", "targetWeight"].includes(key as string)) {
      const num = value.trim()
        ? Number(value.trim().replace(",", "."))
        : undefined;
      setForm((prev) => ({
        ...prev,
        [key]: Number.isNaN(num) ? undefined : num,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: value || undefined,
      }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updated = await updateProfile(token, form);
      setProfile(updated);
      setSaveSuccess("Profil mis à jour avec succès.");
    } catch (e: unknown) {
      const err = e as Error;
      console.error("Erreur updateProfile :", err);
      setSaveError(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
        Profil utilisateur
      </h1>

      <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
        Ces données correspondent à la table <code>users</code> dans ton
        schéma BDD (âge, objectif, niveau d’activité, etc.).
      </p>

      {loading && <p>Chargement du profil...</p>}
      {loadingError && (
        <p style={{ color: "#fca5a5" }}>❌ {loadingError}</p>
      )}

      {!loading && profile && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {/* Bloc infos de base */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid #1f2937",
              backgroundColor: "#020617",
            }}
          >
            <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              Infos de base
            </h2>

            <div
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
                }}
              >
                <span>Nom / pseudo</span>
                <input
                  type="text"
                  value={form.name ?? ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </label>

              <p
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.7,
                  marginTop: "0.5rem",
                }}
              >
                <strong>Email :</strong> {profile.email}
              </p>
            </div>
          </div>

          {/* Bloc données physiques */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid #1f2937",
              backgroundColor: "#020617",
            }}
          >
            <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              Données physiques
            </h2>

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
                <span>Âge</span>
                <input
                  type="text"
                  value={form.age?.toString() ?? ""}
                  onChange={(e) => handleChange("age", e.target.value)}
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
                <span>Genre</span>
                <select
                  value={form.gender ?? ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  <option value="">—</option>
                  <option value="H">H</option>
                  <option value="F">F</option>
                  <option value="Autre">Autre</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Taille (cm)</span>
                <input
                  type="text"
                  value={form.height?.toString() ?? ""}
                  onChange={(e) => handleChange("height", e.target.value)}
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
                <span>Poids actuel (kg)</span>
                <input
                  type="text"
                  value={form.weight?.toString() ?? ""}
                  onChange={(e) => handleChange("weight", e.target.value)}
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
                <span>Poids cible (kg)</span>
                <input
                  type="text"
                  value={form.targetWeight?.toString() ?? ""}
                  onChange={(e) => handleChange("targetWeight", e.target.value)}
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
          </div>

          {/* Bloc objectif */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid #1f2937",
              backgroundColor: "#020617",
            }}
          >
            <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
              Objectif & activité
            </h2>

            <div
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
                <span>Objectif</span>
                <select
                  value={form.goal ?? ""}
                  onChange={(e) => handleChange("goal", e.target.value)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  <option value="">—</option>
                  <option value="perte">Perte de poids</option>
                  <option value="prise">Prise de masse</option>
                  <option value="maintien">Maintien</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <span>Niveau d'activité</span>
                <select
                  value={form.activityLevel ?? ""}
                  onChange={(e) =>
                    handleChange("activityLevel", e.target.value)
                  }
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  <option value="">—</option>
                  <option value="faible">Faible</option>
                  <option value="moyen">Moyen</option>
                  <option value="élevé">Élevé</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: "1rem",
                padding: "0.6rem 1rem",
                borderRadius: "999px",
                border: "none",
                fontWeight: 600,
                cursor: saving ? "default" : "pointer",
                backgroundColor: saving ? "#16a34a80" : "#22c55e",
                color: "#022c22",
                fontSize: "0.9rem",
              }}
            >
              {saving ? "Enregistrement..." : "Enregistrer le profil"}
            </button>

            {saveError && (
              <p style={{ color: "#fca5a5", marginTop: "0.5rem" }}>
                ❌ {saveError}
              </p>
            )}
            {saveSuccess && (
              <p style={{ color: "#4ade80", marginTop: "0.5rem" }}>
                ✅ {saveSuccess}
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
