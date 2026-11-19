"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Download,
  RefreshCw,
  Filter,
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

interface AuditHeaderProps {
  onExportReport: () => void;
  onRefresh: () => void;
  onToggleFilters?: () => void;
  isRefreshing?: boolean;
  isExporting?: boolean;
  userName?: string;
}

export function AuditHeader({
  onExportReport,
  onRefresh,
  onToggleFilters,
  isRefreshing = false,
  isExporting = false,
  userName = "Admin Panel",
}: AuditHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Search & Profile Bar matching reference image */}
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
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all"
            />
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
            <div className="w-8 h-8 rounded-full bg-[#7956C9] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              AP
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-xs font-semibold text-[#24213A]">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777184]" />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb matching reference: 🏠 > AI Image Generation > Credit Transactions & Audit Trail */}
      <nav className="flex items-center gap-1.5 text-xs text-[#777184]">
        <Link href="/admin/dashboard" className="hover:text-[#24213A] transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A098AE]" />
        <Link href="/admin/ai-generation" className="hover:text-[#7956C9] transition-colors font-medium">
          AI Image Generation
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A098AE]" />
        <span className="font-semibold text-[#24213A]">
          Credit Transactions &amp; Audit Trail
        </span>
      </nav>

      {/* Main Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24213A] tracking-tight">
            Credit Transactions &amp; Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#777184] mt-0.5 font-medium">
            Inspect credit movements, verify transaction history and review administrative actions.
          </p>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export Audit Report */}
          <button
            onClick={onExportReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] hover:border-[#7956C9]/30 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7956C9]" />
            <span>Export Audit Report</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] hover:border-[#7956C9]/30 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#7956C9] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Transaction Filters */}
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7956C9] text-xs font-semibold text-white hover:bg-[#6847B0] active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Transaction Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
