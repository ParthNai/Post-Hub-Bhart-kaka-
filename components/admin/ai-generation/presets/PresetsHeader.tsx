"use client";

import React from "react";
import Link from "next/link";
import { Plus, Settings, Eye, ChevronRight } from "lucide-react";

interface PresetsHeaderProps {
  onCreateClick: () => void;
  onRulesClick: () => void;
  onPreviewClick: () => void;
  userName?: string;
  userRole?: string;
}

export function PresetsHeader({
  onCreateClick,
  onRulesClick,
  onPreviewClick,
  userName = "Parth Patel",
  userRole = "Administrator",
}: PresetsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb & User profile bar */}
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
          <span className="text-[#24213A] font-semibold">Prompt Rules & Presets</span>
        </div>

        {/* User badge */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-xs flex items-center justify-center border border-[#7956C9]/20 shadow-xs">
            {userName.charAt(0)}
          </div>
          <div className="text-right leading-tight">
            <div className="text-xs font-semibold text-[#24213A]">{userName}</div>
            <div className="text-[10px] text-[#777184]">{userRole}</div>
          </div>
        </div>
      </div>

      {/* Main Title & Action Buttons Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#24213A]">
            Prompt Rules & Presets
          </h1>
          <p className="text-sm text-[#777184] mt-0.5">
            Manage reusable AI poster styles, prompt instructions and generation presets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm transition-all transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Preset</span>
          </button>

          <button
            type="button"
            onClick={onRulesClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] hover:border-[#7956C9]/40 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#777184]" />
            <span>Prompt Rules</span>
          </button>

          <button
            type="button"
            onClick={onPreviewClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#24213A] border border-[#EAE4EE] hover:border-[#7956C9]/40 text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#777184]" />
            <span>Preview Generation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
