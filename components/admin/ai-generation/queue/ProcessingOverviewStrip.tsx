"use client";

import React from "react";
import {
  BarChart2,
  Cpu,
  Settings,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react";
import type { AiQueueOverview } from "@/lib/ai-queue";

interface ProcessingOverviewStripProps {
  overview: AiQueueOverview;
}

export function ProcessingOverviewStrip({ overview }: ProcessingOverviewStripProps) {
  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-[#7956C9]" />
        <h2 className="text-sm font-bold text-[#24213A]">Processing Overview</h2>
      </div>

      {/* Overview Container */}
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* 1. Queue Status Box */}
        <div className="bg-[#FAF7FD] border border-[#E8DFF5] rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9] mb-1.5 shadow-2xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-semibold text-[#777184]">Queue Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#7956C9] animate-pulse" />
            <span className="text-xs font-bold text-[#7956C9]">
              {overview.queueStatus}
            </span>
          </div>
          <div className="text-[10px] text-[#777184] mt-0.5">
            All systems operational
          </div>
        </div>

        {/* 2. Active Jobs */}
        <div className="flex flex-col items-center justify-center text-center py-2 border-r border-[#F2EEF6] last:border-r-0">
          <div className="w-8 h-8 rounded-full bg-[#F4F1F7] flex items-center justify-center text-[#7956C9] mb-1">
            <Settings className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-medium text-[#777184]">Active Jobs</div>
          <div className="text-xl font-bold text-[#24213A] mt-0.5">
            {overview.activeJobs}
          </div>
        </div>

        {/* 3. Workers Online */}
        <div className="flex flex-col items-center justify-center text-center py-2 border-r border-[#F2EEF6] last:border-r-0">
          <div className="w-8 h-8 rounded-full bg-[#F4F1F7] flex items-center justify-center text-[#7956C9] mb-1">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-medium text-[#777184]">Workers Online</div>
          <div className="text-xl font-bold text-[#24213A] mt-0.5">
            {overview.workersOnline}
          </div>
        </div>

        {/* 4. Avg. Processing Time */}
        <div className="flex flex-col items-center justify-center text-center py-2 border-r border-[#F2EEF6] last:border-r-0">
          <div className="w-8 h-8 rounded-full bg-[#F4F1F7] flex items-center justify-center text-[#7956C9] mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-medium text-[#777184]">
            Avg. Processing Time
          </div>
          <div className="text-base font-bold text-[#24213A] mt-0.5">
            {overview.avgProcessingTime}
          </div>
        </div>

        {/* 5. Last Queue Update */}
        <div className="flex flex-col items-center justify-center text-center py-2">
          <div className="w-8 h-8 rounded-full bg-[#F4F1F7] flex items-center justify-center text-[#7956C9] mb-1">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-medium text-[#777184]">
            Last Queue Update
          </div>
          <div className="text-xs font-bold text-[#24213A] mt-0.5">
            {overview.lastQueueUpdate}
          </div>
        </div>
      </div>
    </div>
  );
}

