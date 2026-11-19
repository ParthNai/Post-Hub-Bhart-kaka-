"use client";

import React from "react";
import {
  Coins,
  Download,
  Settings,
  Plus,
  Search,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

interface CreditPlansHeaderProps {
  onExportTransactions: () => void;
  onOpenSettings: () => void;
  onCreatePlan: () => void;
  userName?: string;
  isExporting?: boolean;
}

export function CreditPlansHeader({
  onExportTransactions,
  onOpenSettings,
  onCreatePlan,
  userName = "Admin",
  isExporting = false,
}: CreditPlansHeaderProps) {
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

      {/* Main Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0 shadow-2xs">
            <Coins className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24213A] tracking-tight">
              Credit Plans &amp; User Allocation
            </h1>
            <p className="text-xs sm:text-sm text-[#777184] mt-0.5 font-medium">
              Configure generation credits, manage user balances and review credit transactions.
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export Transactions Button */}
          <button
            onClick={onExportTransactions}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] hover:border-[#7956C9]/30 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7956C9]" />
            <span>Export Transactions</span>
          </button>

          {/* Credit Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] hover:border-[#7956C9]/30 transition-all shadow-2xs cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#7956C9]" />
            <span>Credit Settings</span>
          </button>

          {/* Create Credit Plan Button */}
          <button
            onClick={onCreatePlan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7956C9] text-xs font-semibold text-white hover:bg-[#6847B0] active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Credit Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
