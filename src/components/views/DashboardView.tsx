'use client';

import React, { useState } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { CalorieRing } from '@/components/ui/CalorieRing';
import { WaterTracker } from '@/components/ui/WaterTracker';
import { DiastasisBadge } from '@/components/ui/DiastasisBadge';
import { AddMealModal } from '@/components/modals/AddMealModal';
import {
  Camera,
  Scale,
  Plus,
  Flame,
  ArrowRight,
  Clock,
  ChevronRight,
  UtensilsCrossed,
  Heart,
  Baby,
} from 'lucide-react';
import { MealType } from '@/types';

export function DashboardView() {
  const {
    userProfile,
    calorieTargets,
    todayCalories,
    remainingCalories,
    todayProtein,
    todayCarbs,
    todayFat,
    todayWaterMl,
    addWaterMl,
    resetWaterMl,
    todayMeals,
    setActiveTab,
  } = useFitness();

  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('snack');

  const weightRemaining = Math.max(0, userProfile.weight - userProfile.goalWeight);
  // Weight progress from 89 starting baseline (or current relative to goal)
  const startingWeight = 89;
  const weightProgressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((startingWeight - userProfile.weight) / (startingWeight - userProfile.goalWeight)) * 100
      )
    )
  );

  const openAddMeal = (type: MealType) => {
    setSelectedMealType(type);
    setIsAddMealOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Status Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Daily Dashboard</h2>
            <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
              <Baby className="h-3 w-3" /> Nursing Mom
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            Nourishing your body and supporting milk supply while working toward {userProfile.goalWeight} kg.
          </p>
        </div>

        {/* Quick Action: Scan Food Button */}
        <button
          onClick={() => setActiveTab('scan')}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
        >
          <Camera className="h-4 w-4" />
          <span>Scan Food</span>
        </button>
      </div>

      {/* Hero Cards Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: Calorie Target & Consumption (Spans 2 cols on desktop) */}
        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Estimated Daily Calorie Target</h3>
                <p className="text-[11px] text-gray-400">
                  Target: <strong className="text-gray-200">{calorieTargets.dailyTarget} kcal</strong> (includes +{calorieTargets.breastfeedingAllowance} kcal lactation allowance)
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('foodlog')}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              <span>Food Log</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <CalorieRing
            consumed={todayCalories}
            target={calorieTargets.dailyTarget}
            remaining={remainingCalories}
            protein={todayProtein}
            carbs={todayCarbs}
            fat={todayFat}
            targetProtein={calorieTargets.macroTargets.proteinG}
            targetCarbs={calorieTargets.macroTargets.carbsG}
            targetFat={calorieTargets.macroTargets.fatG}
            breastfeedingBonus={calorieTargets.breastfeedingAllowance}
          />
        </div>

        {/* Card 2: Weight Milestone Overview */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Weight Progress</h3>
                  <p className="text-[11px] text-gray-400">Postpartum 1 year milestone</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Chart
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between rounded-xl bg-[#161a29] p-3">
                <div>
                  <span className="text-[11px] text-gray-400">Current Weight</span>
                  <p className="text-2xl font-black text-white">{userProfile.weight} <span className="text-xs font-normal text-gray-400">kg</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400">Goal Weight</span>
                  <p className="text-2xl font-black text-emerald-400">{userProfile.goalWeight} <span className="text-xs font-normal text-gray-400">kg</span></p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Journey Progress</span>
                  <span className="font-semibold text-gray-200">
                    {weightRemaining > 0 ? `${weightRemaining} kg to goal` : 'Goal reached!'}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1c2235]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
                    style={{ width: `${Math.max(12, weightProgressPercent)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/10 bg-[#161a29] p-2.5 text-[11px] text-gray-300">
                <span className="text-blue-400 font-semibold">Safe Pacing:</span> Aim for a gentle 0.4–0.5 kg weekly reduction to keep your prolactin hormone and breast milk steady.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#202638] bg-[#161a29] py-2 text-xs font-medium text-gray-300 hover:bg-[#1a2033] hover:text-white"
          >
            <span>View Progress & History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Water Tracker & Diastasis Recti Guideline */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <WaterTracker
          currentMl={todayWaterMl}
          targetMl={calorieTargets.hydrationTargetMl}
          onAdd={addWaterMl}
          onReset={resetWaterMl}
        />

        <div className="flex flex-col justify-between space-y-4">
          <DiastasisBadge />

          {/* Quick Action banner */}
          <div className="flex items-center justify-between rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-[#131622] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Have a meal ready?</h4>
                <p className="text-xs text-gray-400">Take a photo or choose from Nigerian foods</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('scan')}
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-500"
            >
              Scan Food
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Today's Meals Section */}
      <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Today&apos;s Meals</h3>
              <p className="text-[11px] text-gray-400">
                {todayMeals.length} items logged ({todayCalories} kcal)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddMeal('snack')}
              className="flex items-center gap-1.5 rounded-xl border border-[#202638] bg-[#161a29] px-3 py-1.5 text-xs font-medium text-gray-200 hover:border-gray-500 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5 text-blue-400" />
              <span>Log Meal</span>
            </button>
            <button
              onClick={() => setActiveTab('foodlog')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              View Full Log
            </button>
          </div>
        </div>

        {todayMeals.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#202638] p-8 text-center text-xs text-gray-400">
            <p>No meals logged yet today.</p>
            <button
              onClick={() => openAddMeal('breakfast')}
              className="mt-2 text-blue-400 hover:underline"
            >
              Log your first meal
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex flex-col justify-between rounded-xl border border-[#202638] bg-[#161a29] p-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="capitalize font-semibold text-blue-400">
                      {meal.mealType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meal.time}
                    </span>
                  </div>
                  <h4 className="mt-1 font-semibold text-white">{meal.foodName}</h4>
                  <p className="text-[11px] text-gray-400">{meal.portion}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#202638] pt-2">
                  <span className="font-mono font-bold text-white">
                    {meal.calories} kcal
                  </span>
                  <div className="flex gap-1.5 text-[10px] text-gray-400">
                    <span>P: {meal.proteinG}g</span>
                    <span>C: {meal.carbsG}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        initialMealType={selectedMealType}
      />
    </div>
  );
}
