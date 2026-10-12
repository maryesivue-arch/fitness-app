'use client';

import React from 'react';
import { Droplets, Plus, Minus, RotateCcw } from 'lucide-react';
import { formatMl } from '@/lib/calculator';

interface WaterTrackerProps {
  currentMl: number;
  targetMl: number;
  onAdd: (amount: number) => void;
  onReset: () => void;
}

export function WaterTracker({
  currentMl,
  targetMl,
  onAdd,
  onReset,
}: WaterTrackerProps) {
  const percent = Math.min(100, Math.round((currentMl / targetMl) * 100));
  const cupsCount = (currentMl / 250).toFixed(1);
  const targetCups = (targetMl / 250).toFixed(0);

  return (
    <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Water Intake</h3>
            <p className="text-xs text-gray-400">Essential for milk supply & energy</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-gray-200"
          title="Reset today's water"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Hydration Gauge */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-extrabold text-white">{formatMl(currentMl)}</span>
            <span className="ml-1 text-xs text-gray-400">/ {formatMl(targetMl)} goal</span>
          </div>
          <span className="font-mono text-sm font-semibold text-cyan-400">{percent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#1c2235]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <span>{cupsCount} / {targetCups} glasses (250ml)</span>
          {percent >= 100 ? (
            <span className="font-medium text-emerald-400">Goal Achieved! Great job!</span>
          ) : (
            <span>{formatMl(Math.max(0, targetMl - currentMl))} remaining</span>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onAdd(250)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 py-2.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/40"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+250 ml (Glass)</span>
        </button>

        <button
          onClick={() => onAdd(500)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 py-2.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/40"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+500 ml (Bottle)</span>
        </button>

        {currentMl > 0 && (
          <button
            onClick={() => onAdd(-250)}
            className="flex items-center justify-center rounded-xl border border-[#202638] bg-[#161a29] px-3 py-2.5 text-xs text-gray-400 transition-colors hover:text-white"
            title="Subtract 250ml"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
