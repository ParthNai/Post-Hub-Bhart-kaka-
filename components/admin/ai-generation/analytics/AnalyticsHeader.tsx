"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  RefreshCw,
  Download,
  ChevronDown,
  Search,
  Bell,
  Menu,
  FileSpreadsheet,
  FileText,
  CreditCard,
} from "lucide-react";

interface AnalyticsHeaderProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onExportCsv: () => void;
  onExportUsageReport: () => void;
  onExportBillingSummary: () => void;
  userName?: string;
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing = false,
  onExportCsv,
  onExportUsageReport,
  onExportBillingSummary,
  userName = "Admin",
}: AnalyticsHeaderProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const timeRangeLabels: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Search & Admin Profile Bar matching reference */}
      <div className="flex items-center justify-between gap-4 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#EAE4EE] shadow-2xs">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            type="button"
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-[#FAF7F2] lg:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search settings, rules, or features..."
              className="w-full pl-9 pr-14 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#777184] bg-white border border-[#EAE4EE] px-1.5 py-0.5 rounded shadow-2xs">
              ⌘ K
            </span>
          </div>
        </div>

        {/* Right side: Notifications & User profile */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-[#FAF7F2] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#EAE4EE]">
            <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              JD
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-xs font-semibold text-[#24213A]">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777184]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shadow-2xs shrink-0">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24213A] tracking-tight">
              AI Usage &amp; Cost Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#777184] font-medium mt-0.5">
              Monitor image-generation consumption, credit usage and actual AI provider costs.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Time Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs hover:border-[#7956C9]"
            >
              <Calendar className="w-4 h-4 text-[#7956C9]" />
              <span>{timeRangeLabels[timeRange] || "Last 30 Days"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777184]" />
            </button>

            {isTimeRangeOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#EAE4EE] rounded-xl shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onTimeRangeChange(key);
                      setIsTimeRangeOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#FAF7F2] flex items-center justify-between ${
                      timeRange === key ? "text-[#7956C9] font-bold bg-purple-50" : "text-[#24213A]"
                    }`}
                  >
                    <span>{label}</span>
                    {timeRange === key && <span className="text-[#7956C9]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs hover:border-[#7956C9]"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#777184] ${
                isRefreshing ? "animate-spin text-[#7956C9]" : ""
              }`}
            />
            <span>Refresh Analytics</span>
          </button>

          {/* Export Report Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-all shadow-xs hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#EAE4EE] rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#EAE4EE]">
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                  <span>Export Full CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportUsageReport();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#7956C9]" />
                  <span>Export Usage Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportBillingSummary();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] flex items-center gap-2.5 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                  <span>Billing Period Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
