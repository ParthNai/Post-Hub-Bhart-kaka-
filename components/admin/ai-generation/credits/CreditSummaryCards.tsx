"use client";

import React from "react";
import { Crown, Gift, CheckCircle2, Coins } from "lucide-react";
import type { CreditSummaryMetrics } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface CreditSummaryCardsProps {
  summary: CreditSummaryMetrics;
}

export function CreditSummaryCards({ summary }: CreditSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Active Credit Plans */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] block mb-1">
            Active Credit Plans
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {summary.activeCreditPlans}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {summary.activePlansChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Crown className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 2: Total Credits Issued */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] block mb-1">
            Total Credits Issued
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {formatCredits(summary.totalCreditsIssued, true)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {summary.totalCreditsChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Gift className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 3: Credits Consumed */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] block mb-1">
            Credits Consumed
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {formatCredits(summary.creditsConsumed)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {summary.creditsConsumedChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 4: Credits Remaining */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] block mb-1">
            Credits Remaining
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {formatCredits(summary.creditsRemaining)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {summary.creditsRemainingChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Coins className="w-6 h-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
