"use client";

import React from "react";
import { ImageIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { AiImageMetrics } from "@/lib/ai-images";

interface ImageKpiCardsProps {
  metrics: AiImageMetrics;
  onFilterClick?: (status: string) => void;
}

export function ImageKpiCards({ metrics, onFilterClick }: ImageKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Generated Images */}
      <div
        onClick={() => onFilterClick?.("All")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#7956C9]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center shrink-0">
          <ImageIcon className="w-6 h-6 text-[#7956C9]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#777184]">
            Total Generated Images
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-bold text-[#24213A] tracking-tight">
              {metrics.totalImages.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
              {metrics.totalChange}
            </span>
          </div>
          <div className="text-[11px] text-[#777184] mt-0.5 truncate">
            All time generated images
          </div>
        </div>
      </div>

      {/* 2. Approved Images */}
      <div
        onClick={() => onFilterClick?.("approved")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#16A34A]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#777184]">Approved Images</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-bold text-[#24213A] tracking-tight">
              {metrics.approvedCount.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
              {metrics.approvedChange}
            </span>
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium mt-0.5 truncate">
            {metrics.approvalRate}
          </div>
        </div>
      </div>

      {/* 3. Pending Review */}
      <div
        onClick={() => onFilterClick?.("pending")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#EA580C]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-[#EA580C]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#777184]">Pending Review</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.pendingCount}
          </div>
          <div className="text-[11px] text-[#EA580C] font-medium mt-0.5 truncate">
            {metrics.pendingRate}
          </div>
        </div>
      </div>

      {/* 4. Rejected Images */}
      <div
        onClick={() => onFilterClick?.("rejected")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-rose-400 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-[#EF4444]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#777184]">Rejected Images</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.rejectedCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5 truncate">
            {metrics.rejectionRate}
          </div>
        </div>
      </div>
    </div>
  );
}

