"use client";

import React from "react";
import { FileText, Layers, ShieldCheck, Calendar } from "lucide-react";
import { RoutingSummaryMetrics } from "@/lib/ai-failover";

interface RoutingSummaryCardsProps {
  metrics: RoutingSummaryMetrics;
}

export const RoutingSummaryCards: React.FC<RoutingSummaryCardsProps> = ({
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Routing Rules */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-[#7956C9]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Active Routing Rules</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.activeRoutingRules}
          </p>
        </div>
      </div>

      {/* 2. Configured Providers */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-[#7956C9]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Configured Providers</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.configuredProviders}
          </p>
        </div>
      </div>

      {/* 3. Fallback Rules */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Fallback Rules</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.fallbackRules}
          </p>
        </div>
      </div>

      {/* 4. Last Configuration Update */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-[#7956C9]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Last Configuration Update</p>
          <p className="text-xs font-bold text-[#24213A] tracking-tight mt-1">
            {metrics.lastConfigUpdate}
          </p>
        </div>
      </div>
    </div>
  );
};
