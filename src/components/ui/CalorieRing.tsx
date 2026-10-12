'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface CalorieRingProps {
  consumed: number;
  target: number;
  remaining: number;
  protein: number;
  carbs: number;
  fat: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  breastfeedingBonus: number;
}

export function CalorieRing({
  consumed,
  target,
  remaining,
  protein,
  carbs,
  fat,
  targetProtein,
  targetCarbs,
  targetFat,
  breastfeedingBonus,
}: CalorieRingProps) {
  const percent = Math.min(100, Math.round((consumed / target) * 100));

  // SVG circular progress calculation
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-between sm:flex-row sm:items-center sm:justify-around">
      {/* Visual Ring */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#202638"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Remaining
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {remaining}
          </span>
          <span className="text-[11px] font-medium text-blue-400">kcal left</span>
        </div>
      </div>

      {/* Metrics & Macro Breakdown */}
      <div className="mt-6 w-full space-y-4 sm:mt-0 sm:max-w-xs">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#202638] bg-[#161a29] p-3">
            <span className="text-[11px] font-medium text-gray-400">Eaten Today</span>
            <p className="mt-0.5 text-lg font-bold text-white">{consumed} <span className="text-xs text-gray-400 font-normal">kcal</span></p>
          </div>
          <div className="rounded-xl border border-[#202638] bg-[#161a29] p-3">
            <span className="text-[11px] font-medium text-gray-400">Daily Target</span>
            <p className="mt-0.5 text-lg font-bold text-white">{target} <span className="text-xs text-gray-400 font-normal">kcal</span></p>
          </div>
        </div>

        {/* Lactation Energy Boost Pill */}
        {breastfeedingBonus > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-xs text-blue-300">
            <Sparkles className="h-4 w-4 shrink-0 text-blue-400" />
            <span>Includes <strong>+{breastfeedingBonus} kcal</strong> lactation allowance to protect milk supply.</span>
          </div>
        )}

        {/* Macronutrient mini bars */}
        <div className="space-y-2 pt-1 text-xs">
          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>Protein</span>
              <span className="text-gray-200 font-medium">{protein}g / {targetProtein}g</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#202638] overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${Math.min(100, Math.round((protein / targetProtein) * 100))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>Carbs</span>
              <span className="text-gray-200 font-medium">{carbs}g / {targetCarbs}g</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#202638] overflow-hidden">
              <div
                className="h-full bg-blue-400"
                style={{ width: `${Math.min(100, Math.round((carbs / targetCarbs) * 100))}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>Fats</span>
              <span className="text-gray-200 font-medium">{fat}g / {targetFat}g</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#202638] overflow-hidden">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${Math.min(100, Math.round((fat / targetFat) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
