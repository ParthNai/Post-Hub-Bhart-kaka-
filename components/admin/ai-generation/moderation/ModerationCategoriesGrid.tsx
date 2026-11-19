"use client";

import React from "react";
import {
  LayoutGrid,
  AlertTriangle,
  Users,
  Flame,
  Copyright,
  Megaphone,
  Lock,
  MoreHorizontal,
} from "lucide-react";
import type { ModerationCategory, CategoryResultingAction } from "@/lib/ai-moderation";

interface ModerationCategoriesGridProps {
  categories: ModerationCategory[];
  onToggleCategory: (id: string) => void;
  onUpdateAction: (id: string, action: CategoryResultingAction) => void;
}

export function ModerationCategoriesGrid({
  categories,
  onToggleCategory,
  onUpdateAction,
}: ModerationCategoriesGridProps) {
  // Render icon based on iconType
  const renderIcon = (type: ModerationCategory["iconType"]) => {
    switch (type) {
      case "unsafe":
        return (
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "explicit":
        return (
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-extrabold text-[10px]">
            18+
          </div>
        );
      case "hate":
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#7956C9]">
            <Users className="w-4 h-4" />
          </div>
        );
      case "violence":
        return (
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Flame className="w-4 h-4" />
          </div>
        );
      case "copyright":
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#7956C9]">
            <Copyright className="w-4 h-4" />
          </div>
        );
      case "misleading":
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Megaphone className="w-4 h-4" />
          </div>
        );
      case "sensitive":
        return (
          <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700">
            <Lock className="w-4 h-4" />
          </div>
        );
      case "other":
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Card Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Moderation Categories
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            Configure policy for different content types.
          </p>
        </div>
      </div>

      {/* 2 Rows × 4 Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
        {categories.map((cat) => {
          const isReject = cat.resultingAction === "Reject";

          return (
            <div
              key={cat.id}
              className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                cat.enabled
                  ? "bg-[#FAF7F2]/70 border-[#EAE4EE] hover:border-[#7956C9]/40 hover:bg-[#FAF7F2]"
                  : "bg-gray-50/70 border-gray-200 opacity-60"
              }`}
            >
              <div>
                {/* Icon & Title */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <div className="shrink-0">{renderIcon(cat.iconType)}</div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#24213A] truncate leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#777184] line-clamp-1">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 my-2">
                  <button
                    type="button"
                    onClick={() => onToggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      cat.enabled
                        ? "text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0] hover:bg-[#D1FAE5]"
                        : "text-gray-500 bg-gray-100 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cat.enabled ? "bg-[#10B981]" : "bg-gray-400"
                      }`}
                    />
                    {cat.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-2 border-t border-[#EAE4EE]/60 flex items-center justify-between text-[11px]">
                <span className="text-[#777184] font-medium">
                  Review: <strong className="text-[#24213A]">{cat.reviewRequired ? "Yes" : "No"}</strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateAction(cat.id, isReject ? "Flag" : "Reject")
                  }
                  title="Click to toggle Action (Reject ↔ Flag)"
                  className={`font-semibold cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                    isReject
                      ? "text-[#EF4444] bg-red-50 hover:bg-red-100"
                      : "text-[#7956C9] bg-purple-50 hover:bg-purple-100"
                  }`}
                >
                  Action: {cat.resultingAction}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
