"use client";

import React from "react";
import { ImageIcon, Layers, Coins, Calculator } from "lucide-react";
import type { AiAnalyticsOverviewMetrics } from "@/lib/ai-analytics";

interface AnalyticsKpiCardsProps {
  overview?: AiAnalyticsOverviewMetrics;
  metrics?: AiAnalyticsOverviewMetrics;
}

export function AnalyticsKpiCards({ overview, metrics }: AnalyticsKpiCardsProps) {
  const activeOverview = overview || metrics;
  if (!activeOverview) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Images Generated */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Total Images Generated
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {activeOverview.totalImagesGenerated.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {activeOverview.totalImagesChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <ImageIcon className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 2: Total Credits Consumed */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Total Credits Consumed
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {activeOverview.totalCreditsConsumed.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {activeOverview.totalCreditsChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Layers className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 3: Actual Provider Cost */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Actual Provider Cost
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              ${activeOverview.actualProviderCost.toFixed(2)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {activeOverview.actualProviderCostChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Coins className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 4: Average Cost Per Image */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Average Cost Per Image
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              ${activeOverview.averageCostPerImage.toFixed(4)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {activeOverview.averageCostChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Calculator className="w-6 h-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
