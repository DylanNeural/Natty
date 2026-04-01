// web/src/services/mealsApi.ts
import { API_BASE_URL } from "../config";

export type Meal = {
  id: string;          // id du log
  mealId?: string;     // id du Meal de base
  name: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  totalCalories?: number | null;
  date?: string;
  portionEaten?: number;
};

async function handleJsonResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function fetchMeals(token: string): Promise<Meal[]> {
  const res = await fetch(`${API_BASE_URL}/api/meals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de la récupération des repas`;
    throw new Error(message);
  }

  if (data && Array.isArray(data.meals)) {
    return data.meals as Meal[];
  }

  return [];
}

export type MealPayload = {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export async function createMeal(
  token: string,
  payload: MealPayload
): Promise<Meal> {
  const res = await fetch(`${API_BASE_URL}/api/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status} lors de la création du repas`;
    throw new Error(message);
  }

  if (data && data.meal) {
    return data.meal as Meal;
  }

  throw new Error("Réponse API /api/meals invalide (pas de champ meal)");
}
