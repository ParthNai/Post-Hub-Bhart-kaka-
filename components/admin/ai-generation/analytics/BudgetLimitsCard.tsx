"use client";

import React from "react";
import { ShieldCheck, Settings } from "lucide-react";
import type { BudgetConfig } from "@/lib/ai-analytics";

interface BudgetLimitsCardProps {
  budget: BudgetConfig;
  onConfigureBudget?: () => void;
}

export function BudgetLimitsCard({ budget, onConfigureBudget }: BudgetLimitsCardProps) {
  const percentage = Math.min(100, Math.max(0, budget.consumedPercentage));

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base font-bold text-[#24213A]">
            Budget &amp; Usage Limits
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Within Limit Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Within Limit ✓
          </span>

          {onConfigureBudget && (
            <button
              onClick={onConfigureBudget}
              title="Configure Budget Settings"
              className="p-1.5 rounded-lg text-[#777184] hover:text-[#7956C9] hover:bg-[#FAF7F2] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
        {/* Configured Budget */}
        <div className="space-y-1">
          <p className="text-xs text-[#777184] font-medium">Configured Budget</p>
          <p className="text-xl font-bold text-[#24213A]">
            ${budget.configuredBudget.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Consumed */}
        <div className="space-y-1">
          <p className="text-xs text-[#777184] font-medium">Consumed</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-[#24213A]">
              ${budget.consumed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {/* Progress Bar & 29% */}
          <div className="flex items-center gap-2.5 pt-1">
            <div className="flex-1 h-2 rounded-full bg-[#EAE4EE] overflow-hidden">
              <div
                className="h-full bg-[#7956C9] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#24213A] shrink-0">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Remaining */}
        <div className="space-y-1">
          <p className="text-xs text-[#777184] font-medium">Remaining</p>
          <p className="text-xl font-bold text-[#24213A]">
            ${budget.remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
