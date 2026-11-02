"use client";

import React from "react";
import { Info, ImageIcon } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";
import { PresetThumbnail } from "../presets/PresetThumbnail";

interface ProcessingDetailsCardProps {
  selectedItem: AiQueueItem | null;
}

export function ProcessingDetailsCard({ selectedItem }: ProcessingDetailsCardProps) {
  if (!selectedItem) {
    return (
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Processing Details</h3>
        </div>
        <div className="py-12 text-center text-xs text-[#777184]">
          Select any queue request to inspect detailed parameters.
        </div>
      </div>
    );
  }

  const isCompleted = selectedItem.status === "completed";

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#F2EEF6]">
          <Info className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Processing Details</h3>
        </div>

        {/* Key-Value List */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[#777184] font-medium shrink-0">Request ID:</span>
            <span className="font-bold text-[#7956C9]">{selectedItem.id}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#777184] font-medium">Full Prompt:</span>
            <p className="text-[#24213A] bg-[#FAF7F2] p-2 rounded-lg text-[11px] leading-relaxed max-h-20 overflow-y-auto border border-[#EAE4EE]">
              {selectedItem.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Preset:</span>
            <span className="font-semibold text-[#24213A]">
              {selectedItem.presetName || "Default Rules"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Provider / Model:</span>
            <span className="font-semibold text-[#24213A]">
              {selectedItem.provider}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Submitted At:</span>
            <span className="text-[#24213A]">{selectedItem.submittedAt}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Processing Started:</span>
            <span className="text-[#24213A]">
              {selectedItem.processingStartedAt || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Completed At:</span>
            <span className="text-[#24213A]">
              {selectedItem.completedAt || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#777184] font-medium">Duration:</span>
            <span className="text-[#24213A]">
              {selectedItem.durationSec ? `${selectedItem.durationSec}s` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="mt-4 pt-3 border-t border-[#F2EEF6]">
        {isCompleted ? (
          <div className="w-full h-44 rounded-xl overflow-hidden border border-[#EAE4EE] shadow-sm relative">
            <PresetThumbnail type={selectedItem.thumbnailType} size="full" />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
              Completed Result
            </div>
          </div>
        ) : (
          <div className="w-full h-44 rounded-xl bg-[#FAF7F2] border border-[#EAE4EE] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-10 rounded-lg bg-[#EFEAF6] flex items-center justify-center text-[#B8B2C4] mb-2">
              <ImageIcon className="w-6 h-6 text-[#A19DAA]" />
            </div>
            <div className="text-xs font-bold text-[#24213A]">No result yet</div>
            <p className="text-[11px] text-[#777184] mt-0.5 max-w-[200px] leading-tight">
              Result will appear here once processing is complete.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
