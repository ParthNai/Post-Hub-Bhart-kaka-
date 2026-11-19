"use client";

import React from "react";
import { Zap, Eye, RefreshCw, XCircle } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";

interface QuickActionsCardProps {
  selectedItem: AiQueueItem | null;
  onViewClick: () => void;
  onRetryClick: () => void;
  onCancelClick: () => void;
  onRefreshStatusClick: () => void;
  isRefreshing?: boolean;
}

export function QuickActionsCard({
  selectedItem,
  onViewClick,
  onRetryClick,
  onCancelClick,
  onRefreshStatusClick,
  isRefreshing = false,
}: QuickActionsCardProps) {
  const hasSelection = Boolean(selectedItem);
  const canRetry = selectedItem?.status === "failed";
  const canCancel =
    selectedItem?.status === "pending" || selectedItem?.status === "processing";

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3.5">
        <Zap className="w-4 h-4 text-[#7956C9]" />
        <h3 className="text-sm font-bold text-[#24213A]">Quick Actions</h3>
      </div>

      {/* Button Stack */}
      <div className="space-y-2">
        {/* 1. View Request */}
        <button
          type="button"
          onClick={onViewClick}
          disabled={!hasSelection}
          className={`w-full py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            hasSelection
              ? "bg-[#7956C9] hover:bg-[#6845B8] text-white shadow-xs cursor-pointer transform active:scale-98"
              : "bg-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>View Request</span>
        </button>

        {/* 2. Retry Failed Request */}
        <button
          type="button"
          onClick={onRetryClick}
          disabled={!canRetry}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            canRetry
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#777184]" />
          <span>Retry Failed Request</span>
        </button>

        {/* 3. Cancel Pending Request */}
        <button
          type="button"
          onClick={onCancelClick}
          disabled={!canCancel}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            canCancel
              ? "bg-white hover:bg-rose-50 border-rose-200 text-rose-600 cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>Cancel Pending Request</span>
        </button>

        {/* 4. Refresh Status */}
        <button
          type="button"
          onClick={onRefreshStatusClick}
          disabled={isRefreshing}
          className="w-full py-2 px-3.5 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#777184] ${
              isRefreshing ? "animate-spin text-[#7956C9]" : ""
            }`}
          />
          <span>Refresh Status</span>
        </button>
      </div>
    </div>
  );
}

