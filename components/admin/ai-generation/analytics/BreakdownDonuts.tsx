"use client";

import React from "react";
import { PieChart } from "lucide-react";
import type { ImageBreakdownData } from "@/lib/ai-analytics";

interface BreakdownDonutsProps {
  breakdown: ImageBreakdownData;
}

export function BreakdownDonuts({ breakdown }: BreakdownDonutsProps) {
  // Helper to calculate SVG stroke-dasharray for donut slices
  const radius = 28;
  const circumference = 2 * Math.PI * radius; // ~175.9

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "24px",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <PieChart className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Image Format &amp; Category Breakdown
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            Distribution by aspect ratio, format, categories and presets
          </p>
        </div>
      </div>

      {/* 4 Donut Visuals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {/* Donut 1: Aspect Ratio */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE] flex flex-col items-center text-center">
          <span className="text-xs font-bold text-[#24213A] mb-2 block">
            Aspect Ratio
          </span>
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
              {/* Segment 1: 1:1 (52%) -> purple */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#7956C9"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.aspectRatio.ratio1_1 / 100) * circumference} ${circumference}`}
                strokeDashoffset="0"
              />
              {/* Segment 2: 9:16 (34%) -> light blue */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#93C5FD"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.aspectRatio.ratio9_16 / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${(breakdown.aspectRatio.ratio1_1 / 100) * circumference}`}
              />
              {/* Segment 3: 16:9 (14%) -> dark purple / indigo */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#C4B5FD"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.aspectRatio.ratio16_9 / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${((breakdown.aspectRatio.ratio1_1 + breakdown.aspectRatio.ratio9_16) / 100) * circumference}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-[#24213A]">
              100%
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-1 text-[11px] font-semibold text-[#524D63] w-full">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7956C9]" />
                1:1
              </span>
              <span>{breakdown.aspectRatio.ratio1_1}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />
                9:16
              </span>
              <span>{breakdown.aspectRatio.ratio9_16}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C4B5FD]" />
                16:9
              </span>
              <span>{breakdown.aspectRatio.ratio16_9}%</span>
            </div>
          </div>
        </div>

        {/* Donut 2: Image Format */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE] flex flex-col items-center text-center">
          <span className="text-xs font-bold text-[#24213A] mb-2 block">
            Image Format
          </span>
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
              {/* Segment 1: JPG (68%) -> purple */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#7956C9"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.imageFormat.jpg / 100) * circumference} ${circumference}`}
                strokeDashoffset="0"
              />
              {/* Segment 2: PNG (32%) -> peach / tan */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#FED7AA"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.imageFormat.png / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${(breakdown.imageFormat.jpg / 100) * circumference}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-[#24213A]">
              100%
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-1 text-[11px] font-semibold text-[#524D63] w-full">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7956C9]" />
                JPG
              </span>
              <span>{breakdown.imageFormat.jpg}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FED7AA]" />
                PNG
              </span>
              <span>{breakdown.imageFormat.png}%</span>
            </div>
          </div>
        </div>

        {/* Donut 3: Categories */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE] flex flex-col items-center text-center">
          <span className="text-xs font-bold text-[#24213A] mb-2 block">
            Categories
          </span>
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
              {/* Festival (40%) -> purple */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#7956C9"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.categories.festival / 100) * circumference} ${circumference}`}
                strokeDashoffset="0"
              />
              {/* Business (35%) -> peach / orange */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#FDBA74"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.categories.business / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${(breakdown.categories.festival / 100) * circumference}`}
              />
              {/* Other (25%) -> lavender */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#C4B5FD"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.categories.other / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${((breakdown.categories.festival + breakdown.categories.business) / 100) * circumference}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-[#24213A]">
              100%
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-1 text-[11px] font-semibold text-[#524D63] w-full">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7956C9]" />
                Festival
              </span>
              <span>{breakdown.categories.festival}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FDBA74]" />
                Business
              </span>
              <span>{breakdown.categories.business}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C4B5FD]" />
                Other
              </span>
              <span>{breakdown.categories.other}%</span>
            </div>
          </div>
        </div>

        {/* Donut 4: Preset Usage */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE] flex flex-col items-center text-center">
          <span className="text-xs font-bold text-[#24213A] mb-2 block">
            Preset Usage
          </span>
          <div className="relative w-20 h-20 mb-2">
            <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
              {/* Templates (60%) -> deep purple */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#7956C9"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.presetUsage.templates / 100) * circumference} ${circumference}`}
                strokeDashoffset="0"
              />
              {/* AI Prompt (40%) -> peach */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                fill="none"
                stroke="#FDBA74"
                strokeWidth="9"
                strokeDasharray={`${(breakdown.presetUsage.aiPrompt / 100) * circumference} ${circumference}`}
                strokeDashoffset={`-${(breakdown.presetUsage.templates / 100) * circumference}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-[#24213A]">
              100%
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-1 text-[11px] font-semibold text-[#524D63] w-full">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7956C9]" />
                Templates
              </span>
              <span>{breakdown.presetUsage.templates}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FDBA74]" />
                AI Prompt
              </span>
              <span>{breakdown.presetUsage.aiPrompt}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
