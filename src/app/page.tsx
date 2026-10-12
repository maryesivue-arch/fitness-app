'use client';

import React from 'react';
import { useFitness } from '@/context/FitnessContext';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { DashboardView } from '@/components/views/DashboardView';
import { ScanFoodView } from '@/components/views/ScanFoodView';
import { FoodLogView } from '@/components/views/FoodLogView';
import { ProgressView } from '@/components/views/ProgressView';
import { ProfileView } from '@/components/views/ProfileView';
import { Heart, Baby, Camera, ShieldAlert } from 'lucide-react';

export default function Home() {
  const { activeTab, setActiveTab, userProfile } = useFitness();

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f3f4f6]">
      {/* Fixed Left Sidebar for Desktop and Web */}
      <DesktopSidebar />

      {/* Main Content Area (offset by sidebar width on md+) */}
      <div className="flex min-h-screen flex-col md:pl-64">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#202638] bg-[#11141e]/90 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-600/30">
              <Heart className="h-4 w-4 text-white fill-white/20" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Fitness app</h1>
              <p className="text-[10px] text-blue-400">Postpartum & Nursing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userProfile.hasDiastasisRecti && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                DR Safe
              </span>
            )}
            <button
              onClick={() => setActiveTab('scan')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md active:scale-95"
              aria-label="Scan Food"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Dynamic View Container (pb-28 on mobile guarantees no bottom nav overlap) */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 pb-28 md:pb-12">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'scan' && <ScanFoodView />}
          {activeTab === 'foodlog' && <FoodLogView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Compact Bottom Navigation for Mobile (Never overlaps content due to pb-28) */}
      <MobileBottomNav />
    </div>
  );
}
