"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Settings, Download, ChevronRight, Bell } from "lucide-react";

interface QueueHeaderProps {
  onRefresh: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
  isRefreshing?: boolean;
  userName?: string;
  userRole?: string;
}

export function QueueHeader({
  onRefresh,
  onOpenSettings,
  onExport,
  isRefreshing = false,
  userName = "Parth Patel",
  userRole = "Administrator",
}: QueueHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Meta Bar: Breadcrumbs & Admin Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#777184] font-medium">
          <Link href="/admin" className="hover:text-[#7956C9] transition-colors">
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B2C4]" />
          <Link
            href="/admin/ai-generation"
            className="hover:text-[#7956C9] transition-colors"
          >
            AI Image Generation
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B2C4]" />
          <span className="text-[#24213A] font-semibold">Queue Monitor</span>
        </div>

        {/* User badge & Bell */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 text-[#777184] hover:text-[#24213A] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-xs flex items-center justify-center border border-[#7956C9]/20 shadow-xs">
              {userName.charAt(0)}
            </div>
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-xs font-semibold text-[#24213A]">{userName}</div>
              <div className="text-[10px] text-[#777184]">{userRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Action Buttons Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#24213A]">
            Generation Queue Monitor
          </h1>
          <p className="text-sm text-[#777184] mt-0.5">
            Monitor image-generation requests, processing activity and request failures.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] hover:border-[#7956C9]/40 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#777184] ${
                isRefreshing ? "animate-spin text-[#7956C9]" : ""
              }`}
            />
            <span>Refresh Queue</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] hover:border-[#7956C9]/40 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#777184]" />
            <span>Queue Settings</span>
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] hover:border-[#7956C9]/40 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#777184]" />
            <span>Export Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
