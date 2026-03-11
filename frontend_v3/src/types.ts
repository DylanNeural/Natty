export type Page = 
  | 'dashboard' 
  | 'scanner' 
  | 'meal-details' 
  | 'fridge' 
  | 'plan'
  | 'order-confirmation' 
  | 'profile' 
  | 'meal-history' 
  | 'stats' 
  | 'favorites' 
  | 'settings' 
  | 'fridge-locator' 
  | 'onboarding-welcome' 
  | 'onboarding-step1' 
  | 'onboarding-step2' 
  | 'onboarding-step3' 
  | 'onboarding-step4' 
  | 'onboarding-step5' 
  | 'paywall' 
  | 'checkout' 
  | 'premium-confirmation' 
  | 'cart' 
  | 'order-tracking'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-fridges'
  | 'admin-orders';

export interface MacroData {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface Meal {
  id: string;
  type: 'Petit-déjeuner' | 'Déjeuner' | 'Dîner' | 'Collation';
  emoji: string;
  title: string;
  calories: number;
  recommendedRange: string;
  status: 'added' | 'planned' | 'suggestion';
  details?: string;
  location?: string;
}
