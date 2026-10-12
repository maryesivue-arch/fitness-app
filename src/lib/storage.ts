import {
  UserProfile,
  MealEntry,
  WeightEntry,
  DailyWaterLog,
} from '@/types';
import { getTodayDateString } from './calculator';

export const STORAGE_KEYS = {
  PROFILE: 'fitness_app_profile_v1',
  MEALS: 'fitness_app_meals_v1',
  WEIGHT: 'fitness_app_weight_v1',
  WATER: 'fitness_app_water_v1',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  age: 32,
  weight: 85, // kg
  height: 5.4, // ft
  goalWeight: 65, // kg
  isBreastfeeding: true,
  postpartumDuration: '1 year',
  hasDiastasisRecti: true,
  activityLevel: 'light',
  dailyWaterTargetMl: 3200,
};

export function createInitialMealsSeed(date: string): MealEntry[] {
  return [
    {
      id: 'seed-meal-1',
      date,
      time: '08:30',
      mealType: 'breakfast',
      foodName: 'Pap / Ogi / Akamu',
      portion: '1 Standard Bowl (approx. 250ml)',
      portionMultiplier: 1.0,
      calories: 150,
      proteinG: 3,
      carbsG: 32,
      fatG: 1.2,
      notes: 'Warm morning bowl to stimulate milk flow',
    },
    {
      id: 'seed-meal-2',
      date,
      time: '08:35',
      mealType: 'breakfast',
      foodName: 'Hard Boiled Egg',
      portion: '2 Large Eggs',
      portionMultiplier: 2.0,
      calories: 156,
      proteinG: 12.6,
      carbsG: 1.2,
      fatG: 10.6,
      notes: 'Protein boost with choline for baby',
    },
    {
      id: 'seed-meal-3',
      date,
      time: '13:15',
      mealType: 'lunch',
      foodName: 'Jollof Rice',
      portion: 'Standard Plate (approx. 200g)',
      portionMultiplier: 1.0,
      calories: 330,
      proteinG: 6,
      carbsG: 58,
      fatG: 9,
    },
    {
      id: 'seed-meal-4',
      date,
      time: '13:20',
      mealType: 'lunch',
      foodName: 'Grilled Mackerel / Titus Fish',
      portion: '1 Medium Cut (approx. 120g)',
      portionMultiplier: 1.0,
      calories: 220,
      proteinG: 23,
      carbsG: 0,
      fatG: 14,
      notes: 'Omega 3 DHA fatty acids',
    },
  ];
}

export function createInitialWeightSeed(today: string): WeightEntry[] {
  return [
    {
      id: 'w-1',
      date: '2026-06-15',
      weightKg: 89.0,
      note: 'Baseline weight at 8 months postpartum',
    },
    {
      id: 'w-2',
      date: '2026-07-28',
      weightKg: 87.5,
      note: 'Increased hydration and fiber',
    },
    {
      id: 'w-3',
      date: '2026-09-10',
      weightKg: 86.2,
      note: 'Gentle core breathing & portion awareness',
    },
    {
      id: 'w-4',
      date: today,
      weightKg: 85.0,
      note: 'Current weight check-in at 1 year postpartum',
    },
  ];
}

// Helper to safely access localStorage in browser
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function loadUserProfile(): UserProfile {
  return getFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE);
}

export function saveUserProfile(profile: UserProfile): void {
  setToStorage(STORAGE_KEYS.PROFILE, profile);
}

export function loadMeals(today: string): MealEntry[] {
  return getFromStorage<MealEntry[]>(STORAGE_KEYS.MEALS, createInitialMealsSeed(today));
}

export function saveMeals(meals: MealEntry[]): void {
  setToStorage(STORAGE_KEYS.MEALS, meals);
}

export function loadWeightEntries(today: string): WeightEntry[] {
  return getFromStorage<WeightEntry[]>(
    STORAGE_KEYS.WEIGHT,
    createInitialWeightSeed(today)
  );
}

export function saveWeightEntries(entries: WeightEntry[]): void {
  setToStorage(STORAGE_KEYS.WEIGHT, entries);
}

export function loadTodayWater(today: string): number {
  const waterLogs = getFromStorage<DailyWaterLog[]>(STORAGE_KEYS.WATER, [
    { date: today, consumedMl: 1750 },
  ]);
  const entry = waterLogs.find((w) => w.date === today);
  return entry ? entry.consumedMl : 0;
}

export function saveTodayWater(amountMl: number, today: string): void {
  const waterLogs = getFromStorage<DailyWaterLog[]>(STORAGE_KEYS.WATER, []);
  const filtered = waterLogs.filter((w) => w.date !== today);
  filtered.push({ date: today, consumedMl: amountMl });
  setToStorage(STORAGE_KEYS.WATER, filtered);
}
