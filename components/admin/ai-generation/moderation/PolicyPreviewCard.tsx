"use client";

import React from "react";
import {
  Eye,
  ImageIcon,
  ShieldCheck,
  ClipboardList,
  Check,
  Clock,
  X,
  Play,
} from "lucide-react";

interface PolicyPreviewCardProps {
  onOpenSimulator?: () => void;
}

export function PolicyPreviewCard({ onOpenSimulator }: PolicyPreviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
              <Eye className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#24213A]">
                Policy Preview
              </h2>
              <p className="text-xs text-[#777184] font-medium">
                Configuration preview (not live status).
              </p>
            </div>
          </div>

          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="flex items-center gap-1 text-[11px] font-bold text-[#7956C9] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded-lg transition-colors"
              title="Test real prompt against active rules"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate</span>
            </button>
          )}
        </div>

        {/* Diagram Flow Container */}
        <div className="bg-[#FAF7F2]/80 border border-[#EAE4EE] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Node 1: Generated Image */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE4EE] shadow-2xs flex items-center justify-center text-[#7956C9]">
              <ImageIcon className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#24213A] max-w-[70px] leading-tight">
              Generated Image
            </span>
          </div>

          {/* Arrow 1 */}
          <div className="hidden sm:block text-[#B8B2C4] font-bold text-lg">→</div>

          {/* Node 2: Moderation Check */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#7956C9] shadow-xs flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-bold text-[#24213A] max-w-[75px] leading-tight">
              Moderation Check
            </span>
          </div>

          {/* Arrow 2 */}
          <div className="hidden sm:block text-[#B8B2C4] font-bold text-lg">→</div>

          {/* Node 3: Policy Evaluation */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE4EE] shadow-2xs flex items-center justify-center text-[#7956C9]">
              <ClipboardList className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-[11px] font-bold text-[#24213A] max-w-[70px] leading-tight">
              Policy Evaluation
            </span>
          </div>

          {/* Branching Lines & Result Badges */}
          <div className="flex flex-col gap-2 pl-2 border-t sm:border-t-0 sm:border-l border-[#EAE4EE] pt-2 sm:pt-0">
            {/* Approved */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full shadow-2xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Approved</span>
            </div>

            {/* Manual Review */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shadow-2xs">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Manual Review</span>
            </div>

            {/* Rejected */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#EF4444] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full shadow-2xs">
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Rejected</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#777184] italic pt-1">
        * Flow illustrates synchronous Vision AI pre-filtering feeding either instant publishing, reviewer queue, or hard rejection.
      </p>
    </div>
  );
}
