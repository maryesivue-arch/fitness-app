'use client';

import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';

export function DiastasisBadge() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-[#161a25] p-4 text-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Diastasis Recti Aware</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300">
                Active Protocol
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Personalized guidance to protect abdominal linea alba during postpartum recovery
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-lg border border-[#202638] bg-[#11141e] px-2.5 py-1.5 text-[11px] font-medium text-gray-300 hover:text-white"
        >
          <span>{isExpanded ? 'Less' : 'Safe Tips'}</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3.5 space-y-2.5 border-t border-[#202638] pt-3 text-gray-300">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-[#11141e] p-2.5">
              <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Check className="h-3.5 w-3.5" /> What to Focus On
              </p>
              <ul className="mt-1.5 space-y-1 text-[11px] text-gray-300">
                <li>• 360° Diaphragmatic ribcage breathing</li>
                <li>• Gentle pelvic floor & transverse abdominis activation</li>
                <li>• Ample dietary fiber & hydration to prevent intra-abdominal straining</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#11141e] p-2.5">
              <p className="flex items-center gap-1.5 font-semibold text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" /> What to Avoid for Now
              </p>
              <ul className="mt-1.5 space-y-1 text-[11px] text-gray-300">
                <li>• Traditional crunches, sit-ups, and unsupported forward planks</li>
                <li>• Holding breath while lifting the baby or heavy objects</li>
                <li>• Severe low-calorie diets that delay tissue and collagen healing</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
