'use client';

import React, { useEffect, useState } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { Download, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { toastMessage } = useFitness();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('PWA ServiceWorker registered:', reg.scope);
          })
          .catch((err) => {
            console.log('PWA ServiceWorker registration failed:', err);
          });
      });
    }

    // Capture install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBanner(false);
    }
  };

  return (
    <>
      {children}

      {/* Global Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-blue-500/40 bg-[#131622]/95 px-4 py-3 text-sm text-gray-100 shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PWA Install Banner (Subtle & Dismissible) */}
      {showInstallBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-blue-500/30 bg-[#131622] p-3.5 shadow-2xl md:bottom-6 md:left-auto md:right-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Install Fitness app</p>
                <p className="text-[11px] text-gray-400">Add to home screen for 1-tap tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleInstallClick}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
