'use client';

import React, { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { MealEntry, MealType } from '@/types';
import { getTodayDateString } from '@/lib/calculator';
import { AddMealModal } from '@/components/modals/AddMealModal';
import { EditMealModal } from '@/components/modals/EditMealModal';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Camera,
} from 'lucide-react';

const MEAL_TYPES: { type: MealType; label: string }[] = [
  { type: 'breakfast', label: 'Breakfast' },
  { type: 'lunch', label: 'Lunch' },
  { type: 'dinner', label: 'Dinner' },
  { type: 'snack', label: 'Snacks' },
];

export function FoodLogView() {
  const { meals, deleteMeal, editMeal, calorieTargets, setActiveTab, todayDate } = useFitness();

  const [selectedDate, setSelectedDate] = useState<string>(todayDate);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  // Sync with context date if initialized
  React.useEffect(() => {
    setSelectedDate(todayDate);
  }, [todayDate]);

  // Filter meals by selected date
  const dateMeals = useMemo(() => {
    return meals.filter((m) => m.date === selectedDate);
  }, [meals, selectedDate]);

  // Daily totals
  const totalCalories = useMemo(
    () => dateMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
    dateMeals
  );
  const totalProtein = useMemo(
    () => dateMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0),
    dateMeals
  );
  const totalCarbs = useMemo(
    () => dateMeals.reduce((acc, m) => acc + (m.carbsG || 0), 0),
    dateMeals
  );
  const totalFat = useMemo(
    () => dateMeals.reduce((acc, m) => acc + (m.fatG || 0), 0),
    dateMeals
  );

  const remainingCalories = Math.max(0, calorieTargets.dailyTarget - totalCalories);

  // Date navigation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayDate;

  const handleOpenAdd = (type: MealType) => {
    setSelectedMealType(type);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Food Log</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Review, add, edit, and track your daily portions and nutrient totals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scan')}
            className="flex items-center gap-1.5 rounded-xl border border-[#202638] bg-[#161a29] px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white"
          >
            <Camera className="h-4 w-4 text-blue-400" />
            <span>Scan Dish</span>
          </button>
          <button
            onClick={() => handleOpenAdd('breakfast')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Date Navigator Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-[#202638] bg-[#131622] p-3 shadow-md">
        <button
          onClick={handlePrevDay}
          className="flex items-center gap-1 rounded-xl p-2 text-xs font-medium text-gray-400 hover:bg-[#181c2c] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous Day</span>
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-bold text-white">
            {isToday ? `Today (${selectedDate})` : selectedDate}
          </span>
          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayDate)}
              className="ml-2 rounded-lg bg-blue-600/20 px-2 py-0.5 text-[11px] font-semibold text-blue-400 hover:bg-blue-600/30"
            >
              Go to Today
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="flex items-center gap-1 rounded-xl p-2 text-xs font-medium text-gray-400 hover:bg-[#181c2c] hover:text-white"
        >
          <span className="hidden sm:inline">Next Day</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Daily Totals Banner Card */}
      <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#202638] pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Daily Calorie & Nutrient Summary</h3>
          </div>
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
            Target: {calorieTargets.dailyTarget} kcal
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-[#161a29] p-3">
            <span className="text-[11px] text-gray-400">Total Calories</span>
            <p className="mt-0.5 text-xl font-bold text-white">{totalCalories} <span className="text-xs font-normal text-gray-400">kcal</span></p>
          </div>
          <div className="rounded-xl bg-[#161a29] p-3">
            <span className="text-[11px] text-gray-400">Remaining</span>
            <p className="mt-0.5 text-xl font-bold text-blue-400">{remainingCalories} <span className="text-xs font-normal text-gray-400">kcal</span></p>
          </div>
          <div className="rounded-xl bg-[#161a29] p-3">
            <span className="text-[11px] text-gray-400">Protein</span>
            <p className="mt-0.5 text-xl font-bold text-emerald-400">{totalProtein}g</p>
          </div>
          <div className="rounded-xl bg-[#161a29] p-3">
            <span className="text-[11px] text-gray-400">Carbs / Fat</span>
            <p className="mt-0.5 text-xl font-bold text-gray-200">
              {totalCarbs}g <span className="text-xs text-gray-400 font-normal">/</span> {totalFat}g
            </p>
          </div>
        </div>
      </div>

      {/* Meal Group Sections */}
      <div className="space-y-4">
        {MEAL_TYPES.map(({ type, label }) => {
          const sectionMeals = dateMeals.filter((m) => m.mealType === type);
          const sectionCalories = sectionMeals.reduce((acc, m) => acc + m.calories, 0);

          return (
            <div
              key={type}
              className="rounded-2xl border border-[#202638] bg-[#131622] p-4 shadow-md"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-[#202638] pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{label}</h3>
                  <span className="rounded-md bg-[#161a29] px-2 py-0.5 text-[11px] font-mono text-gray-400">
                    {sectionCalories} kcal
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAdd(type)}
                  className="flex items-center gap-1 rounded-lg border border-[#202638] bg-[#161a29] px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:border-blue-500 hover:text-white"
                >
                  <Plus className="h-3 w-3 text-blue-400" />
                  <span>Add {label}</span>
                </button>
              </div>

              {/* Meals List */}
              {sectionMeals.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No {label.toLowerCase()} items logged for this date.
                </div>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {sectionMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-[#202638] bg-[#161a29] p-3.5 transition-all sm:flex-row sm:items-center"
                    >
                      {/* Left: Food details and thumbnail */}
                      <div className="flex items-center gap-3">
                        {meal.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={meal.photoUrl}
                            alt={meal.foodName}
                            className="h-12 w-12 rounded-lg object-cover border border-[#202638]"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#202638] text-gray-400">
                            <UtensilsCrossed className="h-5 w-5" />
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-bold text-white">{meal.foodName}</h4>
                          <p className="text-xs text-gray-400">{meal.portion}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-3 w-3" />
                              {meal.time}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-400">P: {meal.proteinG}g</span>
                            <span>•</span>
                            <span className="text-blue-400">C: {meal.carbsG}g</span>
                            <span>•</span>
                            <span className="text-amber-400">F: {meal.fatG}g</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Calories & Edit/Delete Buttons */}
                      <div className="flex items-center justify-between gap-4 border-t border-[#202638] pt-2 sm:border-0 sm:pt-0">
                        <div className="text-right">
                          <span className="font-mono text-base font-black text-white">
                            {meal.calories}
                          </span>
                          <span className="ml-1 text-[11px] text-gray-400">kcal</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingMeal(meal)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#202638] hover:text-white"
                            aria-label={`Edit ${meal.foodName}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                            aria-label={`Delete ${meal.foodName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddMealModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        initialMealType={selectedMealType}
      />

      <EditMealModal
        meal={editingMeal}
        isOpen={Boolean(editingMeal)}
        onClose={() => setEditingMeal(null)}
        onSave={editMeal}
      />
    </div>
  );
}
