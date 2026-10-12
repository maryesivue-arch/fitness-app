'use client';

import React, { useState } from 'react';
import { WeightEntry } from '@/types';

interface WeightChartProps {
  entries: WeightEntry[];
  goalWeightKg: number;
}

export function WeightChart({ entries, goalWeightKg }: WeightChartProps) {
  const [activeTooltip, setActiveTooltip] = useState<WeightEntry | null>(null);

  if (!entries || entries.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-[#202638] text-xs text-gray-500">
        No weight records logged yet.
      </div>
    );
  }

  // Sort chronological for chart
  const sorted = [...entries].sort((a, b) => (a.date > b.date ? 1 : -1));

  // Determine min and max
  const allWeights = sorted.map((e) => e.weightKg);
  allWeights.push(goalWeightKg);

  const minWeight = Math.floor(Math.min(...allWeights) - 2);
  const maxWeight = Math.ceil(Math.max(...allWeights) + 2);
  const range = maxWeight - minWeight || 1;

  // Chart dimensions
  const width = 580;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  // Calculate coordinates
  const points = sorted.map((entry, index) => {
    const x =
      sorted.length === 1
        ? width / 2
        : paddingX + (index / (sorted.length - 1)) * chartWidth;
    const y =
      paddingTop + chartHeight - ((entry.weightKg - minWeight) / range) * chartHeight;
    return { x, y, entry };
  });

  // Goal line Y
  const goalY =
    paddingTop + chartHeight - ((goalWeightKg - minWeight) / range) * chartHeight;

  // Polyline points string
  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Gradient area path string
  const areaPathStr =
    points.length > 1
      ? `M ${points[0].x},${height - paddingBottom} L ${polylineStr} L ${
          points[points.length - 1].x
        },${height - paddingBottom} Z`
      : '';

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h4 className="text-sm font-bold text-white">Weight Journey</h4>
          <p className="text-xs text-gray-400">Postpartum recovery & gradual progress</p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-gray-300">Recorded Weight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 border-t-2 border-dashed border-emerald-400" />
            <span className="text-gray-300">Goal (65 kg)</span>
          </div>
        </div>
      </div>

      <div className="relative mt-2 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full select-none overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and horizontal values */}
          {[minWeight, Math.round((minWeight + maxWeight) / 2), maxWeight].map(
            (val) => {
              const y =
                paddingTop + chartHeight - ((val - minWeight) / range) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#1c2235"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    fill="#6b7280"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="inherit"
                  >
                    {val}kg
                  </text>
                </g>
              );
            }
          )}

          {/* Goal Line Reference */}
          <line
            x1={paddingX}
            y1={goalY}
            x2={width - paddingX}
            y2={goalY}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text
            x={width - paddingX + 6}
            y={goalY + 3}
            fill="#10b981"
            fontSize="10"
            fontFamily="inherit"
            fontWeight="600"
          >
            {goalWeightKg}kg Goal
          </text>

          {/* Area Fill */}
          {areaPathStr && <path d={areaPathStr} fill="url(#chartGradient)" />}

          {/* Line */}
          {points.length > 1 && (
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr}
            />
          )}

          {/* Points */}
          {points.map((p, idx) => (
            <g
              key={p.entry.id}
              className="cursor-pointer"
              onMouseEnter={() => setActiveTooltip(p.entry)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip(p.entry)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={activeTooltip?.id === p.entry.id ? 7 : 4.5}
                fill="#3b82f6"
                stroke="#090a0f"
                strokeWidth="2"
                className="transition-all"
              />
              {/* Date labels on bottom for first, middle, last */}
              {(idx === 0 || idx === points.length - 1 || idx === Math.floor(points.length / 2)) && (
                <text
                  x={p.x}
                  y={height - 12}
                  fill="#9ca3af"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {p.entry.date.slice(5)}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Floating Tooltip details if active */}
        {activeTooltip && (
          <div className="absolute right-4 top-2 rounded-xl border border-blue-500/30 bg-[#161a29]/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{activeTooltip.weightKg} kg</span>
              <span className="text-[10px] text-gray-400">{activeTooltip.date}</span>
            </div>
            {activeTooltip.note && (
              <p className="mt-0.5 text-[11px] text-blue-300">{activeTooltip.note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
