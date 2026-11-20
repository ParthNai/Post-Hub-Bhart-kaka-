"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Settings,
  History,
  Save,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Home,
  ChevronRight,
} from "lucide-react";

interface RoutingHeaderProps {
  onOpenSettings: () => void;
  onViewHistory: () => void;
  onSaveChanges: () => void;
  isSaving?: boolean;
  adminName?: string;
}

export const RoutingHeader: React.FC<RoutingHeaderProps> = ({
  onOpenSettings,
  onViewHistory,
  onSaveChanges,
  isSaving = false,
  adminName = "Parth Admin",
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Search & Profile Bar matching reference */}
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
              P
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-xs font-semibold text-[#24213A]">{adminName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#777184]" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation breadcrumb */}
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
          Provider Failover &amp; Routing
        </span>
      </nav>

      {/* Main Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[#7956C9]">
              <Zap className="w-6 h-6 fill-[#7956C9]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24213A] tracking-tight">
              Provider Failover &amp; Routing
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777184] mt-0.5">
            Configure provider priority, model routing rules and automatic fallback behavior.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] rounded-lg text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#777184]" />
            <span>Routing Settings</span>
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] rounded-lg text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#777184]" />
            <span>View Routing History</span>
          </button>

          <button
            type="button"
            onClick={onSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
