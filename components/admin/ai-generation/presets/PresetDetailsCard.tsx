"use client";

import React from "react";
import { Info, Check } from "lucide-react";
import type { AiPromptPreset } from "@/lib/ai-presets";
import { PresetThumbnail } from "./PresetThumbnail";

interface PresetDetailsCardProps {
  preset: AiPromptPreset | null;
}

export function PresetDetailsCard({ preset }: PresetDetailsCardProps) {
  if (!preset) {
    return (
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Preset Details</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-[#777184]">
          <p className="text-xs">No preset selected</p>
          <p className="text-[11px] text-[#A19DAA] mt-0.5">
            Click any preset in the library to inspect its parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3.5">
        <Info className="w-4 h-4 text-[#7956C9]" />
        <h3 className="text-sm font-bold text-[#24213A]">Preset Details</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Left Thumbnail (vertical aspect matching reference) */}
        <div className="w-28 h-36 shrink-0 rounded-xl overflow-hidden border border-[#EAE4EE] shadow-xs">
          <PresetThumbnail type={preset.thumbnailType} size="full" />
        </div>

        {/* Right Details Grid */}
        <div className="flex-1 space-y-2 text-xs">
          {/* Preset Name & Status */}
          <div>
            <div className="text-[10px] text-[#777184] font-medium">Preset Name</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-[#24213A] text-sm">
                {preset.name}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  preset.status === "active"
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : preset.status === "draft"
                    ? "bg-[#FFEDD5] text-[#EA580C]"
                    : "bg-[#F4F4F5] text-[#71717A]"
                }`}
              >
                {preset.status}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="text-[10px] text-[#777184] font-medium">Category</div>
            <div className="font-semibold text-[#24213A] mt-0.5">
              {preset.category}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-[10px] text-[#777184] font-medium">Description</div>
            <p className="text-[#777184] text-[11px] leading-tight mt-0.5 line-clamp-2">
              {preset.description}
            </p>
          </div>

          {/* Associated Rules */}
          <div>
            <div className="text-[10px] text-[#777184] font-medium mb-1">
              Associated Rules
            </div>
            <div className="space-y-1">
              {(preset.associatedRules || ["Base Prompt", "Design Style", "Color Scheme"]).map(
                (rule) => (
                  <div key={rule} className="flex items-center gap-1.5 text-[11px] text-[#24213A]">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] stroke-[2.5]" />
                    <span>{rule}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Format & Dimensions */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F2EEF6]">
            <div>
              <div className="text-[10px] text-[#777184]">Default Aspect Ratio</div>
              <div className="font-semibold text-[#24213A] text-[11px] mt-0.5">
                {preset.defaultAspectRatio || "1:1"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#777184]">Output Format</div>
              <div className="font-semibold text-[#24213A] text-[11px] mt-0.5">
                {preset.defaultFormat || "PNG, JPG"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
