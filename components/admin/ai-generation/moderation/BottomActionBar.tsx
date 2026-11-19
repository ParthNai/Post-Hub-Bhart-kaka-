"use client";

import React from "react";
import { Info, RotateCcw, Clock, Save } from "lucide-react";

interface BottomActionBarProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onDiscard: () => void;
  onViewHistory: () => void;
  onSave: () => void;
}

export function BottomActionBar({
  hasUnsavedChanges,
  isSaving,
  onDiscard,
  onViewHistory,
  onSave,
}: BottomActionBarProps) {
  return (
    <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#EAE4EE] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Left Note */}
      <div className="flex items-center gap-2 text-xs text-[#524D63]">
        <Info className="w-4 h-4 text-[#7956C9] shrink-0" />
        <span>
          Changes will be applied to new image generations after saving. Existing content remains unaffected.
        </span>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onDiscard}
          disabled={!hasUnsavedChanges || isSaving}
          className={`flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs ${
            !hasUnsavedChanges ? "opacity-50 cursor-not-allowed" : "hover:border-[#EF4444] hover:text-[#EF4444]"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Discard Changes</span>
        </button>

        <button
          type="button"
          onClick={onViewHistory}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-semibold rounded-xl transition-all shadow-2xs hover:border-[#7956C9]"
        >
          <Clock className="w-3.5 h-3.5 text-[#777184]" />
          <span>View Policy History</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${
            isSaving ? "opacity-75 cursor-not-allowed" : ""
          } ${hasUnsavedChanges ? "ring-2 ring-[#7956C9]/40" : ""}`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Policy"}</span>
        </button>
      </div>
    </div>
  );
}
