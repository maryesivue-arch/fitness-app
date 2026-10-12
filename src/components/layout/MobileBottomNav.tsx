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
} from 'lucide-react';

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

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useFitness();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#202638] bg-[#11141e]/95 backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-colors ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
