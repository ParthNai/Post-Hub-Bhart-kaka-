"use client";

import React from "react";
import {
  Zap,
  Plus,
  Edit2,
  Copy,
  Power,
  Archive,
  Trash2,
} from "lucide-react";
import type { AiPromptPreset } from "@/lib/ai-presets";

interface PresetActionsCardProps {
  selectedPreset: AiPromptPreset | null;
  onCreateClick: () => void;
  onEditClick: () => void;
  onDuplicateClick: () => void;
  onToggleStatusClick: () => void;
  onArchiveClick: () => void;
  onDeleteClick: () => void;
}

export function PresetActionsCard({
  selectedPreset,
  onCreateClick,
  onEditClick,
  onDuplicateClick,
  onToggleStatusClick,
  onArchiveClick,
  onDeleteClick,
}: PresetActionsCardProps) {
  const hasSelection = Boolean(selectedPreset);
  const isActive = selectedPreset?.status === "active";

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-[#7956C9]" />
        <h3 className="text-sm font-bold text-[#24213A]">
          Preset Management Actions
        </h3>
      </div>

      {/* Button Stack */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {/* 1. Create Preset */}
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full py-2 px-3.5 bg-[#7956C9] hover:bg-[#6845B8] text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Preset</span>
        </button>

        {/* 2. Edit Preset */}
        <button
          type="button"
          onClick={onEditClick}
          disabled={!hasSelection}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            hasSelection
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed"
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Preset</span>
        </button>

        {/* 3. Duplicate Preset */}
        <button
          type="button"
          onClick={onDuplicateClick}
          disabled={!hasSelection}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            hasSelection
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed"
          }`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate Preset</span>
        </button>

        {/* 4. Activate / Deactivate */}
        <button
          type="button"
          onClick={onToggleStatusClick}
          disabled={!hasSelection}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            hasSelection
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>
            {hasSelection
              ? isActive
                ? "Deactivate Preset"
                : "Activate Preset"
              : "Activate / Deactivate"}
          </span>
        </button>

        {/* 5. Archive Preset */}
        <button
          type="button"
          onClick={onArchiveClick}
          disabled={!hasSelection || selectedPreset?.status === "archived"}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            hasSelection && selectedPreset?.status !== "archived"
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archive Preset</span>
        </button>

        {/* 6. Delete Preset */}
        <button
          type="button"
          onClick={onDeleteClick}
          disabled={!hasSelection}
          className={`w-full py-2 px-3.5 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            hasSelection
              ? "bg-white hover:bg-rose-50 border-rose-200 text-rose-600 cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Delete Preset</span>
        </button>
      </div>
    </div>
  );
}
