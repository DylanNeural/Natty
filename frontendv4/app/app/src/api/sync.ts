import { apiClient } from './api';
import { useUserStore } from '../store/useUserStore';
import { useJournalStore, type JournalEntry } from '../store/useJournalStore';
import { useFavoritesStore, type FavoriteItem } from '../store/useFavoritesStore';
import { useReservationsStore, type Reservation } from '../store/useReservationsStore';
import type { CartItem } from '../types';

// ─── Profile ──────────────────────────────────────────────────────

export async function pullProfile() {
  try {
    const user = await apiClient.getProfile();
    
    // Parse les données selon la structure du backend
    useUserStore.setState({
      name: user.name || 'User',
      email: user.email || '',
      goal: (user.goal || 'muscle') as any,
      restrictions: user.dietaryPreferences || [],
      age: user.age || 25,
      sex: (user.gender || 'M') as any,
      heightCm: user.height || 180,
      weightKg: user.weight || 70,
      targetWeightKg: user.targetWeight || 70,
      activityLevel: (user.activityLevel || 'active') as any,
      hasOnboarded: true,
      weightHistory: [],
      hydrationGoalMl: 2000,
      stepsGoal: 8000,
      weighInDay: 1,
      weighInHour: 8,
      notificationsEnabled: true,
      notifPrefs: { hydration: true, meals: true, weighIn: true, reservations: true },
      unitSystem: 'metric',
      language: 'fr',
      creditsEur: 0,
      hydrationMl: 0,
      hydrationDay: new Date().toISOString().slice(0, 10),
    });
  } catch (err) {
    console.warn('[sync] pullProfile', err);
  }
}

export async function pushProfile() {
  try {
    const s = useUserStore.getState();
    
    const updates = {
      name: s.name,
      age: s.age,
      gender: s.sex,
      height: s.heightCm,
      weight: s.weightKg,
      targetWeight: s.targetWeightKg,
      activityLevel: s.activityLevel,
      goal: s.goal,
      dietaryPreferences: s.restrictions,
    };
    
    await apiClient.updateProfile(updates);
  } catch (err) {
    console.warn('[sync] pushProfile', err);
  }
}

// ─── Journal ──────────────────────────────────────────────────────

const MONGO_ID = /^[a-f0-9]{24}$/i;

export async function pullJournal() {
  try {
    const serverEntries = await apiClient.getJournalEntries();
    useJournalStore.setState((s) => {
      // Garde les entrées locales non encore synced (temp IDs)
      const pending = s.entries.filter((e) => !MONGO_ID.test(e.id));
      return { entries: [...serverEntries, ...pending] };
    });
  } catch (err) {
    console.warn('[sync] pullJournal', err);
  }
}

export async function pushJournalEntry(e: JournalEntry) {
  try {
    await apiClient.createJournalEntry(e);
  } catch (err) {
    console.warn('[sync] pushJournalEntry', err);
  }
}

export async function deleteJournalEntryCloud(entryId: string) {
  if (!/^[a-f0-9]{24}$/i.test(entryId)) return; // temp ID local, pas encore synced
  try {
    await apiClient.deleteJournalEntry(entryId);
  } catch (err) {
    console.warn('[sync] deleteJournalEntryCloud', err);
  }
}

// ─── Reservations ─────────────────────────────────────────────────
// TODO: Implémenter les endpoints backend pour les réservations

export async function pullReservations() {
  // Temporairement : utiliser le store local uniquement
  // À faire : GET /api/reservations (une fois implémenté au backend)
}

export async function pushReservation(r: Reservation) {
  try {
    // TODO: POST /api/reservations avec les données de réservation
    console.log('[sync] Reservation push (not yet implemented)', r.id);
  } catch (err) {
    console.warn('[sync] pushReservation', err);
  }
}

export async function deleteReservationCloud(id: string) {
  try {
    // TODO: DELETE /api/reservations/{id}
    console.log('[sync] Reservation delete (not yet implemented)', id);
  } catch (err) {
    console.warn('[sync] deleteReservationCloud', err);
  }
}
