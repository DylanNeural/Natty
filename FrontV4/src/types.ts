export type Goal = 'perte-de-poids' | 'prise-de-muscle' | 'boost-energie';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  photo?: string;
  goal: Goal;
  restrictions: string[];
  activityLevel: 'debutant' | 'regulier' | 'athlete';
  isPremium: boolean;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'homme' | 'femme' | 'autre';
  waterIntake: {
    current: number;
    goal: number;
    history: { date: string; amount: number }[];
  };
  fasting: {
    protocol: string;
    isActive: boolean;
    startTime?: string;
    endTime?: string;
  };
  stats: {
    daysActive: number;
    mealsLogged: number;
    challengesCompleted: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    steps: number;
    sleep: number;
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  category: 'boisson' | 'snack' | 'repas' | 'supplement';
  description?: string;
  ingredients?: string[];
  allergens?: string[];
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Fridge {
  id: string;
  name: string;
  address: string;
  distance: string;
  walkTime: string;
  isOpen: boolean;
  stockCount: number;
  products: Product[];
  lat: number;
  lng: number;
}

export type Screen = 
  | 'splash'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'home' 
  | 'map' 
  | 'journal' 
  | 'profile' 
  | 'scan' 
  | 'scan-results'
  | 'fridge-detail' 
  | 'product-detail'
  | 'payment'
  | 'success'
  | 'performance-hub'
  | 'statistics'
  | 'hydration'
  | 'fasting'
  | 'elite'
  | 'settings'
  | 'support'
  | 'social'
  | 'challenges'
  | 'notifications'
  | 'personal-info'
  | 'goals-macros'
  | 'subscription'
  | 'admin';
