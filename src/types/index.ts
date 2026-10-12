export type ActiveTab = 'dashboard' | 'scan' | 'foodlog' | 'progress' | 'profile';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export interface UserProfile {
  age: number;
  weight: number; // in kg (e.g. 85)
  height: number; // in ft (e.g. 5.4)
  goalWeight: number; // in kg (e.g. 65)
  isBreastfeeding: boolean; // Yes
  postpartumDuration: string; // "1 year"
  hasDiastasisRecti: boolean; // Yes
  activityLevel: ActivityLevel;
  dailyWaterTargetMl: number; // in ml, default 3200 for lactation
}

export type FoodCategory =
  | 'grains'
  | 'swallow'
  | 'soup'
  | 'protein'
  | 'sides'
  | 'breakfast';

export interface FoodItem {
  id: string;
  name: string;
  localName?: string;
  category: FoodCategory;
  baseCalories: number; // calories per 1.0 standard portion
  standardPortionName: string; // e.g. "1 medium wrap (200g)", "1 cup cooked (180g)"
  portions: {
    label: string; // e.g. "Small (0.75x)", "Standard (1x)", "Large (1.5x)", "Double (2x)"
    multiplier: number;
  }[];
  proteinG: number;
  carbsG: number;
  fatG: number;
  lactationBenefit?: string;
  diastasisSafe?: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealType: MealType;
  foodName: string;
  portion: string;
  portionMultiplier: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  photoUrl?: string;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export interface DailyWaterLog {
  date: string; // YYYY-MM-DD
  consumedMl: number;
}
