"use client";

import React from "react";
import { ShieldCheck, Settings2, Clock, Calendar } from "lucide-react";
import type { ModerationKpiMetrics } from "@/lib/ai-moderation";

interface ModerationKpiCardsProps {
  metrics: ModerationKpiMetrics;
}

export function ModerationKpiCards({ metrics }: ModerationKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Active Policies */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Active Policies
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {metrics.activePolicies}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {metrics.activePoliciesChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <ShieldCheck className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 2: Enabled Checks */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Enabled Checks
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {metrics.enabledChecks}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {metrics.enabledChecksChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Settings2 className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 3: Pending Review Rules */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Pending Review Rules
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#24213A]">
              {metrics.pendingReviewRules}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              {metrics.pendingReviewRulesChange}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Clock className="w-6 h-6 stroke-[2]" />
        </div>
      </div>

      {/* Card 4: Last Policy Update */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE4EE] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#777184] uppercase tracking-wider block mb-1">
            Last Policy Update
          </span>
          <div className="space-y-1">
            <span className="text-sm font-bold text-[#24213A] block leading-tight">
              {metrics.lastPolicyUpdate}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {metrics.policyStatusBadge}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8DFF5]/60 flex items-center justify-center text-[#7956C9] shrink-0">
          <Calendar className="w-6 h-6 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
