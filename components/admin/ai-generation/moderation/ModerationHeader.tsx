"use client";

import React from "react";
import { Shield, Clock, Eye, Save, Search, Bell, ChevronDown, Menu } from "lucide-react";

interface ModerationHeaderProps {
  onOpenHistory: () => void;
  onOpenPreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  userName?: string;
  userRole?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function ModerationHeader({
  onOpenHistory,
  onOpenPreview,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  userName = "Admin",
  searchQuery = "",
  onSearchChange,
}: ModerationHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Search & User Bar matching reference */}
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
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
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
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shadow-2xs shrink-0">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#24213A] tracking-tight">
              Moderation Rules &amp; Policies
            </h1>
            <p className="text-xs sm:text-sm text-[#777184] font-medium mt-0.5">
              Configure image safety checks, moderation decisions and manual review requirements.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs hover:border-[#7956C9]"
          >
            <Clock className="w-4 h-4 text-[#777184]" />
            <span>Policy History</span>
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs hover:border-[#7956C9]"
          >
            <Eye className="w-4 h-4 text-[#777184]" />
            <span>Preview Rules</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-all shadow-xs hover:shadow-md ${
              isSaving ? "opacity-75 cursor-not-allowed" : ""
            } ${hasUnsavedChanges ? "ring-2 ring-[#7956C9]/40 animate-pulse" : ""}`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
