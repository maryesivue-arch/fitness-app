'use client';

import React from 'react';
import { useFitness } from '@/context/FitnessContext';
import { ActiveTab } from '@/types';
import {
  LayoutDashboard,
  Camera,
  UtensilsCrossed,
  TrendingUp,
  User,
  Heart,
  Droplets,
  Flame,
} from 'lucide-react';
import { formatMl } from '@/lib/calculator';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scan', label: 'Scan Food', icon: Camera },
  { id: 'foodlog', label: 'Food Log', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    calorieTargets,
    todayCalories,
    todayWaterMl,
  } = useFitness();

  const waterPercent = Math.min(
    100,
    Math.round((todayWaterMl / calorieTargets.hydrationTargetMl) * 100)
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-30 hidden w-64 flex-col justify-between border-r border-[#202638] bg-[#11141e] p-5 md:flex">
      {/* Brand & Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <Heart className="h-5 w-5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Fitness app</h1>
            <p className="text-[11px] font-medium text-blue-400">Postpartum & Nursing</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-gray-400 hover:bg-[#181c2c] hover:text-gray-100'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Widget: Motherhood Health Snapshot */}
      <div className="rounded-2xl border border-[#202638] bg-[#161a29] p-4 text-xs">
        <div className="flex items-center justify-between pb-2">
          <span className="font-semibold text-gray-200">Daily Health Pulse</span>
          {userProfile.isBreastfeeding && (
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
              Lactation Active
            </span>
          )}
        </div>

        {/* Quick Calorie Status */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-400" /> Calories
            </span>
            <span className="font-mono text-gray-200">
              {todayCalories} / {calorieTargets.dailyTarget} kcal
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#202638]">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((todayCalories / calorieTargets.dailyTarget) * 100)
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Quick Hydration Status */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-cyan-400" /> Hydration
            </span>
            <span className="font-mono text-gray-200">
              {formatMl(todayWaterMl)} / {formatMl(calorieTargets.hydrationTargetMl)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#202638]">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>

        {userProfile.hasDiastasisRecti && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>Diastasis Recti Aware</span>
          </div>
        )}
      </div>
    </aside>
  );
}
