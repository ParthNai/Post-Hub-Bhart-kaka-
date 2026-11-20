"use client";

import React from "react";
import { Layers, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react";
import { HealthSummaryMetrics } from "@/lib/ai-provider-health";

interface ProviderHealthSummaryCardsProps {
  metrics: HealthSummaryMetrics;
}

export const ProviderHealthSummaryCards: React.FC<ProviderHealthSummaryCardsProps> = ({
  metrics,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Configured Providers */}
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

      {/* 2. Healthy Providers */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Healthy Providers</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.healthyProviders}
          </p>
        </div>
      </div>

      {/* 3. Providers With Issues */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#D97706]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Providers With Issues</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.providersWithIssues}
          </p>
        </div>
      </div>

      {/* 4. Monitoring Coverage */}
      <div className="bg-white rounded-xl p-4 border border-[#EAE4EE] shadow-2xs flex items-center gap-3.5 transition-all hover:shadow-xs">
        <div className="w-11 h-11 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5 text-[#7956C9]" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#777184]">Monitoring Coverage</p>
          <p className="text-xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.monitoringCoverage}
          </p>
        </div>
      </div>
    </div>
  );
};
