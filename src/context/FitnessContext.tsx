'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  UserProfile,
  MealEntry,
  WeightEntry,
  ActiveTab,
} from '@/types';
import {
  loadUserProfile,
  saveUserProfile,
  loadMeals,
  saveMeals,
  loadWeightEntries,
  saveWeightEntries,
  loadTodayWater,
  saveTodayWater,
  DEFAULT_USER_PROFILE,
} from '@/lib/storage';
import {
  calculateDailyTargets,
  getTodayDateString,
  CalorieBreakdown,
} from '@/lib/calculator';

interface FitnessContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  resetProfileToDefault: () => void;
  calorieTargets: CalorieBreakdown;

  // Dates
  todayDate: string;

  // Meals
  meals: MealEntry[];
  todayMeals: MealEntry[];
  addMeal: (meal: Omit<MealEntry, 'id'>) => void;
  editMeal: (id: string, updated: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;

  // Today totals
  todayCalories: number;
  todayProtein: number;
  todayCarbs: number;
  todayFat: number;
  remainingCalories: number;

  // Water
  todayWaterMl: number;
  addWaterMl: (amount: number) => void;
  resetWaterMl: () => void;

  // Weight
  weightEntries: WeightEntry[];
  addWeightEntry: (weightKg: number, note?: string) => void;
  deleteWeightEntry: (id: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [todayDate, setTodayDate] = useState<string>('2026-10-12');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [todayWaterMl, setTodayWaterMl] = useState<number>(1750);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage only inside client effect after mount
  useEffect(() => {
    const today = getTodayDateString();
    setTodayDate(today);
    setUserProfile(loadUserProfile());
    setMeals(loadMeals(today));
    setWeightEntries(loadWeightEntries(today));
    setTodayWaterMl(loadTodayWater(today));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);
    if (newProfile.weight !== userProfile.weight) {
      addWeightEntry(newProfile.weight, 'Updated from profile settings');
    }
    showToast('Profile updated successfully');
  };

  const resetProfileToDefault = () => {
    setUserProfile(DEFAULT_USER_PROFILE);
    saveUserProfile(DEFAULT_USER_PROFILE);
    showToast('Profile reset to default values');
  };

  const addMeal = (mealData: Omit<MealEntry, 'id'>) => {
    const newMeal: MealEntry = {
      ...mealData,
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [newMeal, ...meals];
    setMeals(updated);
    saveMeals(updated);
    showToast(`Added "${newMeal.foodName}" to Food Log (+${newMeal.calories} kcal)`);
  };

  const editMeal = (id: string, updatedFields: Partial<MealEntry>) => {
    const updated = meals.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
    setMeals(updated);
    saveMeals(updated);
    showToast('Meal updated');
  };

  const deleteMeal = (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    saveMeals(updated);
    showToast('Meal removed from Food Log');
  };

  const addWaterMl = (amount: number) => {
    const nextVal = Math.max(0, todayWaterMl + amount);
    setTodayWaterMl(nextVal);
    saveTodayWater(nextVal, todayDate);
    showToast(amount > 0 ? `+${amount}ml water logged 💧` : 'Water intake adjusted');
  };

  const resetWaterMl = () => {
    setTodayWaterMl(0);
    saveTodayWater(0, todayDate);
    showToast('Today water reset to 0ml');
  };

  const addWeightEntry = (weightKg: number, note?: string) => {
    const newEntry: WeightEntry = {
      id: `w-${Date.now()}`,
      date: todayDate,
      weightKg,
      note: note || 'Weight check-in',
    };
    const updated = [newEntry, ...weightEntries.filter((w) => w.date !== todayDate)];
    updated.sort((a, b) => (a.date < b.date ? 1 : -1));
    setWeightEntries(updated);
    saveWeightEntries(updated);

    if (userProfile.weight !== weightKg) {
      const updatedProf = { ...userProfile, weight: weightKg };
      setUserProfile(updatedProf);
      saveUserProfile(updatedProf);
    }
    showToast(`Weight recorded: ${weightKg} kg`);
  };

  const deleteWeightEntry = (id: string) => {
    const updated = weightEntries.filter((w) => w.id !== id);
    setWeightEntries(updated);
    saveWeightEntries(updated);
    showToast('Weight entry removed');
  };

  // Calculated Calorie Targets
  const calorieTargets = useMemo(() => {
    return calculateDailyTargets(userProfile);
  }, [userProfile]);

  // Today's Meals and Totals
  const todayMeals = useMemo(() => {
    return meals.filter((m) => m.date === todayDate);
  }, [meals, todayDate]);

  const todayCalories = useMemo(() => {
    return todayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  }, [todayMeals]);

  const todayProtein = useMemo(() => {
    return Math.round(todayMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0));
  }, [todayMeals]);

  const todayCarbs = useMemo(() => {
    return Math.round(todayMeals.reduce((acc, m) => acc + (m.carbsG || 0), 0));
  }, [todayMeals]);

  const todayFat = useMemo(() => {
    return Math.round(todayMeals.reduce((acc, m) => acc + (m.fatG || 0), 0));
  }, [todayMeals]);

  const remainingCalories = Math.max(0, calorieTargets.dailyTarget - todayCalories);

  return (
    <FitnessContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateProfile,
        resetProfileToDefault,
        calorieTargets,
        todayDate,
        meals,
        todayMeals,
        addMeal,
        editMeal,
        deleteMeal,
        todayCalories,
        todayProtein,
        todayCarbs,
        todayFat,
        remainingCalories,
        todayWaterMl,
        addWaterMl,
        resetWaterMl,
        weightEntries,
        addWeightEntry,
        deleteWeightEntry,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
