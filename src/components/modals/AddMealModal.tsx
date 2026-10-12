'use client';

import React, { useState, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { NIGERIAN_FOOD_DATABASE } from '@/lib/foodDatabase';
import { MealType, FoodItem } from '@/types';
import { getTodayDateString } from '@/lib/calculator';
import { X, Search, Plus, Utensils, Sparkles } from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMealType?: MealType;
}

export function AddMealModal({
  isOpen,
  onClose,
  initialMealType = 'breakfast',
}: AddMealModalProps) {
  const { addMeal, todayDate } = useFitness();
  const [mealType, setMealType] = useState<MealType>(initialMealType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedPortionMultiplier, setSelectedPortionMultiplier] = useState<number>(1.0);
  const [selectedPortionLabel, setSelectedPortionLabel] = useState<string>('Standard Portion');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [customFoodName, setCustomFoodName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isCustomEntry, setIsCustomEntry] = useState(false);

  // Filter food database
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return NIGERIAN_FOOD_DATABASE.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return NIGERIAN_FOOD_DATABASE.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.localName && f.localName.toLowerCase().includes(q)) ||
        f.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setIsCustomEntry(false);
    setSelectedPortionMultiplier(1.0);
    setSelectedPortionLabel(food.standardPortionName);
  };

  const calculatedCalories = useMemo(() => {
    if (isCustomEntry) {
      return parseInt(customCalories, 10) || 0;
    }
    if (!selectedFood) return 0;
    return Math.round(selectedFood.baseCalories * selectedPortionMultiplier);
  }, [isCustomEntry, customCalories, selectedFood, selectedPortionMultiplier]);

  const calculatedProtein = useMemo(() => {
    if (!selectedFood || isCustomEntry) return 0;
    return Math.round(selectedFood.proteinG * selectedPortionMultiplier);
  }, [selectedFood, selectedPortionMultiplier, isCustomEntry]);

  const calculatedCarbs = useMemo(() => {
    if (!selectedFood || isCustomEntry) return 0;
    return Math.round(selectedFood.carbsG * selectedPortionMultiplier);
  }, [selectedFood, selectedPortionMultiplier, isCustomEntry]);

  const calculatedFat = useMemo(() => {
    if (!selectedFood || isCustomEntry) return 0;
    return Math.round(selectedFood.fatG * selectedPortionMultiplier);
  }, [selectedFood, selectedPortionMultiplier, isCustomEntry]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFoodName = isCustomEntry ? customFoodName.trim() : selectedFood?.name;
    if (!finalFoodName || calculatedCalories <= 0) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    addMeal({
      date: todayDate,
      time: timeStr,
      mealType,
      foodName: finalFoodName,
      portion: isCustomEntry ? '1 custom serving' : selectedPortionLabel,
      portionMultiplier: isCustomEntry ? 1.0 : selectedPortionMultiplier,
      calories: calculatedCalories,
      proteinG: calculatedProtein,
      carbsG: calculatedCarbs,
      fatG: calculatedFat,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-[#202638] bg-[#131622] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#202638] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Utensils className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Food to Log</h3>
              <p className="text-[11px] text-gray-400">Select Nigerian meal or enter custom food</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-[#1a1f33] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Meal Type Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-300">Meal Time</label>
            <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-xs">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setMealType(t)}
                  className={`rounded-xl py-2 capitalize font-medium transition-all ${
                    mealType === t
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-[#202638] bg-[#161a29] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle between Nigerian Database and Custom */}
          <div className="flex rounded-xl border border-[#202638] bg-[#11141e] p-1 text-xs">
            <button
              type="button"
              onClick={() => setIsCustomEntry(false)}
              className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
                !isCustomEntry ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Nigerian Food Database
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCustomEntry(true);
                setSelectedFood(null);
              }}
              className={`flex-1 rounded-lg py-1.5 font-medium transition-colors ${
                isCustomEntry ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Custom Food Entry
            </button>
          </div>

          {!isCustomEntry ? (
            <>
              {/* Search Food */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search e.g. Jollof rice, Egusi, Eba, Titus fish..."
                    className="w-full rounded-xl border border-[#202638] bg-[#161a29] py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Food Results List */}
                <div className="mt-2 max-h-36 overflow-y-auto space-y-1 rounded-xl border border-[#202638] bg-[#11141e] p-1.5">
                  {filteredFoods.map((food) => {
                    const isSelected = selectedFood?.id === food.id;
                    return (
                      <button
                        type="button"
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 text-white border border-blue-500/40'
                            : 'text-gray-300 hover:bg-[#161a29]'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-white">{food.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {food.localName || food.category} • {food.standardPortionName}
                          </p>
                        </div>
                        <span className="font-mono font-medium text-blue-400">
                          {food.baseCalories} kcal
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Portion Selector if food selected */}
              {selectedFood && (
                <div className="rounded-xl border border-[#202638] bg-[#161a29] p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Select Portion</span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {calculatedCalories} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {selectedFood.portions.map((portion) => (
                      <button
                        type="button"
                        key={portion.label}
                        onClick={() => {
                          setSelectedPortionMultiplier(portion.multiplier);
                          setSelectedPortionLabel(portion.label);
                        }}
                        className={`rounded-lg p-2 text-left text-[11px] font-medium transition-colors ${
                          selectedPortionMultiplier === portion.multiplier
                            ? 'border border-blue-500 bg-blue-600/30 text-white'
                            : 'border border-[#202638] bg-[#11141e] text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <p className="truncate font-semibold">{portion.label}</p>
                        <p className="text-[10px] text-gray-400">
                          {Math.round(selectedFood.baseCalories * portion.multiplier)} kcal
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedFood.lactationBenefit && (
                    <div className="flex items-start gap-1.5 rounded-lg bg-blue-950/40 p-2 text-[11px] text-blue-300">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                      <span>{selectedFood.lactationBenefit}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Custom entry fields */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-300">Food Name</label>
                <input
                  type="text"
                  required
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  placeholder="e.g. Avocado Toast with Egg"
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">Estimated Calories (kcal)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="4000"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  placeholder="e.g. 350"
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-300">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hydration after nursing session"
              className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={(!selectedFood && !isCustomEntry) || calculatedCalories <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Food Log (+{calculatedCalories} kcal)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
