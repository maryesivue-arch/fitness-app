'use client';

import React, { useState, useEffect } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { UserProfile, ActivityLevel } from '@/types';
import { calculateDailyTargets } from '@/lib/calculator';
import {
  User,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Baby,
  Droplets,
  Heart,
  Scale,
  CheckCircle,
} from 'lucide-react';

export function ProfileView() {
  const { userProfile, updateProfile, resetProfileToDefault } = useFitness();

  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  // Live calculated preview based on user edits
  const previewTargets = calculateDailyTargets(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset profile to default preloaded values (Age 32, 85kg, 5.4ft, Goal 65kg, Breastfeeding Yes)?')) {
      resetProfileToDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">User Profile & Nutrition Goals</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Tailored nutrition calculations for nursing mothers with diastasis recti awareness.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-[#202638] bg-[#161a29] px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Editable Form (7 cols) */}
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-7">
          <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-[#202638] pb-3">
              <User className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Age */}
              <div>
                <label className="text-xs font-semibold text-gray-300">Age (years)</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="70"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Height */}
              <div>
                <label className="text-xs font-semibold text-gray-300">Height (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="3.0"
                  max="7.0"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Current Weight */}
              <div>
                <label className="text-xs font-semibold text-gray-300">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="35"
                  max="250"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Goal Weight */}
              <div>
                <label className="text-xs font-semibold text-gray-300">Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="35"
                  max="250"
                  value={formData.goalWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, goalWeight: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Postpartum Timeline */}
            <div>
              <label className="text-xs font-semibold text-gray-300">Postpartum Duration</label>
              <input
                type="text"
                value={formData.postpartumDuration}
                onChange={(e) =>
                  setFormData({ ...formData, postpartumDuration: e.target.value })
                }
                placeholder="e.g. 1 year (12 months)"
                className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-xs font-semibold text-gray-300">Daily Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activityLevel: e.target.value as ActivityLevel,
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="sedentary">Sedentary (mostly desk / resting)</option>
                <option value="light">Lightly Active (infant/toddler care, walking)</option>
                <option value="moderate">Moderately Active (exercise 3-4x/week)</option>
                <option value="active">Very Active (daily workouts & active childcare)</option>
              </select>
            </div>
          </div>

          {/* Maternal Specific Settings */}
          <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-[#202638] pb-3">
              <Baby className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Maternal Health Settings</h3>
            </div>

            {/* Breastfeeding Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-[#202638] bg-[#161a29] p-3.5">
              <div>
                <span className="text-xs font-bold text-white">Currently Breastfeeding</span>
                <p className="text-[11px] text-gray-400">
                  Adds +450 kcal lactation allowance to protect milk volume.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isBreastfeeding: !formData.isBreastfeeding,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isBreastfeeding ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isBreastfeeding ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Diastasis Recti Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-[#202638] bg-[#161a29] p-3.5">
              <div>
                <span className="text-xs font-bold text-white">Diastasis Recti Diagnosis</span>
                <p className="text-[11px] text-gray-400">
                  Tailors abdominal pressure advice and low-bloat meal suggestions.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    hasDiastasisRecti: !formData.hasDiastasisRecti,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.hasDiastasisRecti ? 'bg-amber-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.hasDiastasisRecti ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily Water Target */}
            <div>
              <label className="text-xs font-semibold text-gray-300">
                Daily Water Target (ml)
              </label>
              <input
                type="number"
                step="100"
                required
                min="1500"
                max="6000"
                value={formData.dailyWaterTargetMl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyWaterTargetMl: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Default: 3,200ml (approx. 13 glasses), essential for nursing mothers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 p-3 text-xs text-emerald-300">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Profile settings updated and saved to local storage!</span>
            </div>
          )}
        </form>

        {/* Right Column: Live Calorie Formula Breakdown (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Calorie Formula Card */}
          <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-4">
            <div className="border-b border-[#202638] pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Formula Transparency
              </span>
              <h3 className="text-sm font-bold text-white">Daily Calorie Calculation</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between rounded-xl bg-[#161a29] p-3">
                <span className="text-gray-300">Basal Metabolic Rate (BMR)</span>
                <span className="font-mono font-bold text-white">
                  {previewTargets.bmr} kcal
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-[#161a29] p-3">
                <span className="text-gray-300">Maintenance (TDEE)</span>
                <span className="font-mono font-bold text-white">
                  {previewTargets.maintenanceCalories} kcal
                </span>
              </div>

              <div className="flex justify-between rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 text-blue-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" /> Lactation Allowance
                </span>
                <span className="font-mono font-bold text-blue-300">
                  +{previewTargets.breastfeedingAllowance} kcal
                </span>
              </div>

              <div className="flex justify-between rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-amber-300">
                <span>Safe Deficit for Milk Supply</span>
                <span className="font-mono font-bold text-amber-300">
                  -{previewTargets.safeDeficit} kcal
                </span>
              </div>

              {/* Final target highlight */}
              <div className="flex items-center justify-between rounded-xl border border-blue-500 bg-blue-600/20 p-4">
                <div>
                  <span className="text-xs font-semibold text-blue-200">
                    Recommended Daily Target
                  </span>
                  <p className="text-[11px] text-gray-300">
                    Sustained energy & gentle weight loss
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">
                    {previewTargets.dailyTarget}
                  </span>
                  <span className="block text-[10px] text-blue-300 font-mono">kcal / day</span>
                </div>
              </div>
            </div>

            {/* Recommended Macronutrient Split */}
            <div className="border-t border-[#202638] pt-3 text-xs">
              <span className="font-semibold text-gray-300">Target Macronutrient Split</span>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[#161a29] p-2">
                  <span className="text-[10px] text-gray-400">Protein</span>
                  <p className="font-bold text-emerald-400">{previewTargets.macroTargets.proteinG}g</p>
                </div>
                <div className="rounded-lg bg-[#161a29] p-2">
                  <span className="text-[10px] text-gray-400">Carbs</span>
                  <p className="font-bold text-blue-400">{previewTargets.macroTargets.carbsG}g</p>
                </div>
                <div className="rounded-lg bg-[#161a29] p-2">
                  <span className="text-[10px] text-gray-400">Healthy Fats</span>
                  <p className="font-bold text-amber-400">{previewTargets.macroTargets.fatG}g</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diastasis Recti Guideline Note */}
          {formData.hasDiastasisRecti && (
            <div className="rounded-2xl border border-amber-500/20 bg-[#131622] p-4 text-xs">
              <div className="flex items-center gap-2 pb-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-white">Diastasis Recti Awareness</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-300">
                At 1 year postpartum, your abdominal connective tissue continues to remodel. Focus on diaphragmatic breathing, avoid bearing down during digestion by hitting your {formData.dailyWaterTargetMl}ml water target, and choose gentle, easily digestible Nigerian meals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
