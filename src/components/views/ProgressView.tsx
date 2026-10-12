'use client';

import React, { useState } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { WeightChart } from '@/components/ui/WeightChart';
import { getTodayDateString } from '@/lib/calculator';
import {
  TrendingDown,
  Scale,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  Baby,
  ShieldCheck,
} from 'lucide-react';

export function ProgressView() {
  const {
    userProfile,
    weightEntries,
    addWeightEntry,
    deleteWeightEntry,
    todayDate,
  } = useFitness();

  const [inputWeight, setInputWeight] = useState<string>('');
  const [inputNote, setInputNote] = useState<string>('');
  const [isLoggingWeight, setIsLoggingWeight] = useState<boolean>(false);

  // Compute progress numbers
  const initialWeight = weightEntries.length > 0
    ? weightEntries[weightEntries.length - 1].weightKg
    : userProfile.weight;
  const currentWeight = userProfile.weight;
  const goalWeight = userProfile.goalWeight;
  const totalLost = Math.max(0, Number((initialWeight - currentWeight).toFixed(1)));
  const remainingToGoal = Math.max(0, Number((currentWeight - goalWeight).toFixed(1)));

  const handleLogWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (!val || val <= 30 || val >= 300) return;
    addWeightEntry(val, inputNote.trim() || undefined);
    setInputWeight('');
    setInputNote('');
    setIsLoggingWeight(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Weight & Postpartum Progress</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Gradual, healthy progress to protect milk supply and heal core diastasis recti.
          </p>
        </div>

        <button
          onClick={() => setIsLoggingWeight(!isLoggingWeight)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          <span>Record Weight</span>
        </button>
      </div>

      {/* Log Weight Inline Panel */}
      {isLoggingWeight && (
        <form
          onSubmit={handleLogWeightSubmit}
          className="rounded-2xl border border-blue-500/30 bg-[#131622] p-4 text-xs shadow-xl"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="font-semibold text-white">Check-in Weight for Today ({todayDate})</span>
            <button
              type="button"
              onClick={() => setIsLoggingWeight(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium text-gray-300">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                min="40"
                max="250"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="e.g. 84.8"
                className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-300">Note (Optional)</label>
              <input
                type="text"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                placeholder="e.g. Drank full 3.2L water, feeling energetic"
                className="mt-1 w-full rounded-xl border border-[#202638] bg-[#161a29] p-2.5 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Save Weight Entry
            </button>
          </div>
        </form>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-4">
          <span className="text-[11px] text-gray-400">Current Weight</span>
          <p className="mt-1 text-2xl font-black text-white">{currentWeight} <span className="text-xs font-normal text-gray-400">kg</span></p>
          <span className="text-[10px] text-gray-400">Updated from profile</span>
        </div>

        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-4">
          <span className="text-[11px] text-gray-400">Goal Weight</span>
          <p className="mt-1 text-2xl font-black text-emerald-400">{goalWeight} <span className="text-xs font-normal text-gray-400">kg</span></p>
          <span className="text-[10px] text-emerald-300 font-medium">Target destination</span>
        </div>

        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-4">
          <span className="text-[11px] text-gray-400">Progress So Far</span>
          <p className="mt-1 text-2xl font-black text-blue-400">
            -{totalLost} <span className="text-xs font-normal text-gray-400">kg</span>
          </p>
          <span className="text-[10px] text-blue-300">From 89 kg baseline</span>
        </div>

        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-4">
          <span className="text-[11px] text-gray-400">Remaining to Goal</span>
          <p className="mt-1 text-2xl font-black text-amber-400">
            {remainingToGoal} <span className="text-xs font-normal text-gray-400">kg</span>
          </p>
          <span className="text-[10px] text-amber-300">Sustainable pace</span>
        </div>
      </div>

      {/* SVG Weight Chart */}
      <WeightChart entries={weightEntries} goalWeightKg={userProfile.goalWeight} />

      {/* Postpartum & Maternal Health Milestones */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Core & Postpartum Check-in */}
        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Baby className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Postpartum Milestones</h3>
              <p className="text-[11px] text-gray-400">1 Year Postpartum & Nursing Journey</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 rounded-xl bg-[#161a29] p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <span className="font-semibold text-white">12 Months Lactation Longevity</span>
                <p className="text-[11px] text-gray-400">
                  You have sustained milk production for 1 year. Your body responds well to sufficient hydration and calorie intake.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#161a29] p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <span className="font-semibold text-white">Diastasis Recti Core Care</span>
                <p className="text-[11px] text-gray-400">
                  Prioritizing non-bloating foods (plain okra, garden egg, steamed fish) keeps intra-abdominal pressure low for healing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#161a29] p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <div>
                <span className="font-semibold text-white">Optimal Hydration Habit</span>
                <p className="text-[11px] text-gray-400">
                  Consuming 3.2L of water daily keeps fatigue minimal while stimulating steady oxytocin letdown.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Log History */}
        <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Weight Check-in History</h3>
            </div>
            <span className="text-xs text-gray-400">{weightEntries.length} records</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {weightEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-[#202638] bg-[#161a29] p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{entry.weightKg} kg</span>
                    <span className="text-[11px] text-gray-400">{entry.date}</span>
                  </div>
                  {entry.note && (
                    <p className="mt-0.5 text-[11px] text-gray-300">{entry.note}</p>
                  )}
                </div>

                {weightEntries.length > 1 && (
                  <button
                    onClick={() => deleteWeightEntry(entry.id)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-rose-500/20 hover:text-rose-400"
                    title="Delete entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
