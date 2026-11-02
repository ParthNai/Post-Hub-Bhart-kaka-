"use client";

import React from "react";
import { Check, Trash2, Archive } from "lucide-react";

interface BulkActionBarProps {
  allSelected: boolean;
  selectedCount: number;
  onToggleSelectAll: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkArchive: () => void;
}

export function BulkActionBar({
  allSelected,
  selectedCount,
  onToggleSelectAll,
  onBulkApprove,
  onBulkReject,
  onBulkArchive,
}: BulkActionBarProps) {
  const hasSelected = selectedCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      {/* Checkbox Select All */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleSelectAll}
          className="w-4 h-4 rounded text-[#7956C9] focus:ring-[#7956C9] cursor-pointer"
        />
        <span className="text-xs font-semibold text-[#24213A]">Select All</span>
        {hasSelected && (
          <span className="text-[11px] text-[#7956C9] font-medium bg-[#E8DFF5] px-2 py-0.5 rounded-full">
            {selectedCount} selected
          </span>
        )}
      </label>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBulkApprove}
          disabled={!hasSelected}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasSelected
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#7956C9] shadow-2xs cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Approve Selected</span>
        </button>

        <button
          type="button"
          onClick={onBulkReject}
          disabled={!hasSelected}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasSelected
              ? "bg-white hover:bg-rose-50 border-rose-200 text-rose-600 shadow-2xs cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reject Selected</span>
        </button>

        <button
          type="button"
          onClick={onBulkArchive}
          disabled={!hasSelected}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasSelected
              ? "bg-white hover:bg-[#FAF7F2] border-[#EAE4EE] text-[#24213A] shadow-2xs cursor-pointer"
              : "bg-[#FAFAFA] border-[#EAE4EE] text-[#A19DAA] cursor-not-allowed opacity-60"
          }`}
        >
          <Archive className="w-3.5 h-3.5 text-[#777184]" />
          <span>Archive Selected</span>
        </button>
      </div>
    </div>
  );
}

