"use client";

import React from "react";
import { Layers, CheckCircle2, FileText, Star } from "lucide-react";
import type { AiPresetMetrics } from "@/lib/ai-presets";

interface PresetKpiCardsProps {
  metrics: AiPresetMetrics;
  onFilterClick?: (status: string) => void;
}

export function PresetKpiCards({ metrics, onFilterClick }: PresetKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Presets */}
      <div
        onClick={() => onFilterClick?.("All")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#7956C9]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6 text-[#7956C9]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Total Presets</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.totalPresets}
          </div>
          <div className="text-[11px] text-[#777184] mt-0.5">
            All preset templates
          </div>
        </div>
      </div>

      {/* 2. Active Presets */}
      <div
        onClick={() => onFilterClick?.("active")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#16A34A]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Active Presets</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.activePresets}
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium mt-0.5">
            {metrics.activePercentage}
          </div>
        </div>
      </div>

      {/* 3. Draft Presets */}
      <div
        onClick={() => onFilterClick?.("draft")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#EA580C]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-[#EA580C]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Draft Presets</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.draftPresets}
          </div>
          <div className="text-[11px] text-[#EA580C] font-medium mt-0.5">
            Under review
          </div>
        </div>
      </div>

      {/* 4. Default Prompt Rules */}
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center shrink-0">
          <Star className="w-6 h-6 text-[#7956C9] fill-[#7956C9]/20" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Default Prompt Rules</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.defaultPromptRules}
          </div>
          <div className="text-[11px] text-[#777184] mt-0.5">
            Global rules set
          </div>
        </div>
      </div>
    </div>
  );
}
