"use client";

import React from "react";
import { Clock, Play, CheckCircle2, AlertCircle } from "lucide-react";
import type { AiQueueMetrics } from "@/lib/ai-queue";

interface QueueKpiCardsProps {
  metrics: AiQueueMetrics;
  onFilterClick?: (status: string) => void;
}

export function QueueKpiCards({ metrics, onFilterClick }: QueueKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Pending Requests */}
      <div
        onClick={() => onFilterClick?.("pending")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#7956C9]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-[#7956C9]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Pending Requests</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.pendingRequests}
          </div>
          <div className="text-[11px] text-[#777184] mt-0.5">
            Waiting in queue
          </div>
        </div>
      </div>

      {/* 2. Processing Requests */}
      <div
        onClick={() => onFilterClick?.("processing")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#2563EB]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
          <Play className="w-5 h-5 text-[#2563EB] fill-[#2563EB] ml-0.5" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Processing Requests</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.processingRequests}
          </div>
          <div className="text-[11px] text-[#2563EB] font-medium mt-0.5">
            Currently processing
          </div>
        </div>
      </div>

      {/* 3. Completed Requests */}
      <div
        onClick={() => onFilterClick?.("completed")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-[#16A34A]/40 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Completed Requests</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.completedRequests24h}
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium mt-0.5">
            Last 24 hours
          </div>
        </div>
      </div>

      {/* 4. Failed Requests */}
      <div
        onClick={() => onFilterClick?.("failed")}
        className="bg-white border border-[#EAE4EE] rounded-xl p-4.5 flex items-center gap-4 shadow-xs hover:border-rose-400 cursor-pointer transition-all hover:shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-[#EF4444]" />
        </div>
        <div>
          <div className="text-xs font-medium text-[#777184]">Failed Requests</div>
          <div className="text-2xl font-bold text-[#24213A] tracking-tight mt-0.5">
            {metrics.failedRequests}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">
            Requires attention
          </div>
        </div>
      </div>
    </div>
  );
}

