"use client";

import React from "react";
import { Zap, Download, BarChart3, FileSpreadsheet } from "lucide-react";

interface QuickActionsCardProps {
  onExportCsv: () => void;
  onExportUsageReport: () => void;
  onBillingSummary: () => void;
  isExporting?: boolean;
}

export function QuickActionsCard({
  onExportCsv,
  onExportUsageReport,
  onBillingSummary,
  isExporting = false,
}: QuickActionsCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "24px",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <Zap className="w-4 h-4 stroke-[2.2] fill-[#7956C9]/20" />
        </div>
        <h2 className="text-base font-bold text-[#24213A]">
          Quick Actions
        </h2>
      </div>

      {/* 3 Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Button 1: Export CSV */}
        <button
          onClick={onExportCsv}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:border-[#7956C9]/40 hover:text-[#7956C9] active:scale-[0.98] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#7956C9]" />
          <span>Export CSV</span>
        </button>

        {/* Button 2: Export Usage Report */}
        <button
          onClick={onExportUsageReport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:border-[#7956C9]/40 hover:text-[#7956C9] active:scale-[0.98] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-[#7956C9]" />
          <span>Export Usage Report</span>
        </button>

        {/* Button 3: Billing Period Summary */}
        <button
          onClick={onBillingSummary}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:border-[#7956C9]/40 hover:text-[#7956C9] active:scale-[0.98] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#7956C9]" />
          <span>Billing Period Summary</span>
        </button>
      </div>
    </div>
  );
}
