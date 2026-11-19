"use client";

import React from "react";
import { Coins, Check, RotateCcw, Clock, Info } from "lucide-react";
import type { AuditSummaryMetrics } from "@/lib/ai-audit";

interface AuditSummaryCardsProps {
  summary: AuditSummaryMetrics;
}

export function AuditSummaryCards({ summary }: AuditSummaryCardsProps) {
  return (
    <div className="space-y-2 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#777184] block mb-1">
              Total Transactions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
                {summary.totalTransactions.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
            <Coins className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Card 2: Successful Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#777184] block mb-1">
              Successful Transactions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
                {summary.successfulTransactions.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] shrink-0">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 3: Reversed Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#777184] block mb-1">
              Reversed Transactions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
                {summary.reversedTransactions.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] shrink-0">
            <RotateCcw className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Card 4: Pending Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#777184] block mb-1">
              Pending Transactions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
                {summary.pendingTransactions.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
            <Clock className="w-6 h-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Illustrative sample data note */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#777184] pt-1 pl-1">
        <Info className="w-3.5 h-3.5 text-[#777184]" />
        <span>Illustrative sample data</span>
      </div>
    </div>
  );
}
