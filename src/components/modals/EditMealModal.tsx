'use client';

import React, { useState, useEffect } from 'react';
import { MealEntry, MealType } from '@/types';
import { X, Check } from 'lucide-react';

interface EditMealModalProps {
  meal: MealEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<MealEntry>) => void;
}

export function EditMealModal({
  meal,
  isOpen,
  onClose,
  onSave,
}: EditMealModalProps) {
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (meal) {
      setFoodName(meal.foodName);
      setPortion(meal.portion);
      setCalories(meal.calories);
      setMealType(meal.mealType);
      setNotes(meal.notes || '');
    }
  }, [meal]);

  if (!isOpen || !meal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || calories <= 0) return;
    onSave(meal.id, {
      foodName: foodName.trim(),
      portion: portion.trim(),
      calories: Number(calories),
      mealType,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#202638] pb-3">
          <h3 className="text-base font-bold text-white">Edit Meal</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-300">Food Name</label>
            <input
              type="text"
              required
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300">Meal Time</label>
            <div className="mt-1 grid grid-cols-4 gap-1.5">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setMealType(t)}
                  className={`rounded-lg py-1.5 capitalize font-medium ${
                    mealType === t
                      ? 'bg-blue-600 text-white'
                      : 'border border-[#202638] bg-[#161a29] text-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-300">Portion</label>
            <input
              type="text"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300">Estimated Calories (kcal)</label>
            <input
              type="number"
              min="1"
              required
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-300">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#202638] bg-[#161a29] py-2.5 font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-500"
            >
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
