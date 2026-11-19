"use client";

import React from "react";
import { X, FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";
import type { BudgetConfig, ProviderCostRecord } from "@/lib/ai-analytics";

interface BillingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetConfig;
  providers: ProviderCostRecord[];
  onDownloadCsv: () => void;
}

export function BillingSummaryModal({
  isOpen,
  onClose,
  budget,
  providers,
  onDownloadCsv,
}: BillingSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-[#EAE4EE] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24213A]">
                Billing Period Summary
              </h3>
              <p className="text-xs text-[#777184]">
                Cycle: {budget.billingPeriod}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Stat Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4EE]">
              <p className="text-[11px] text-[#777184] font-medium">Actual Incurred</p>
              <p className="text-lg font-bold text-[#24213A]">
                ${budget.consumed.toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Within Limit
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4EE]">
              <p className="text-[11px] text-[#777184] font-medium">Allocated Budget</p>
              <p className="text-lg font-bold text-[#24213A]">
                ${budget.configuredBudget.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#777184]">
                Monthly limit
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4EE]">
              <p className="text-[11px] text-[#777184] font-medium">Unspent Balance</p>
              <p className="text-lg font-bold text-emerald-600">
                ${budget.remaining.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#777184]">
                71% surplus
              </span>
            </div>
          </div>

          {/* Provider Breakdown Line Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#24213A]">
              Itemized Provider Charges
            </h4>
            <div className="border border-[#EAE4EE] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAF7F2] border-b border-[#EAE4EE] text-[#777184] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Provider &amp; Model</th>
                    <th className="py-2.5 px-3 text-right">Generations</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Total Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4EE]">
                  {providers.map((p) => {
                    const unitRate = p.imagesGenerated > 0 ? (p.totalCost / p.imagesGenerated).toFixed(4) : "0.0000";
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/40">
                        <td className="py-2 px-3 font-medium text-[#24213A]">
                          {p.provider} ({p.model})
                        </td>
                        <td className="py-2 px-3 text-right text-[#777184]">
                          {p.imagesGenerated.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right text-[#777184]">
                          ${unitRate}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-[#24213A]">
                          ${p.totalCost.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#FAF7F2]/80 font-bold text-[#24213A]">
                    <td className="py-2.5 px-3">Total</td>
                    <td className="py-2.5 px-3 text-right">
                      {providers.reduce((sum, p) => sum + p.imagesGenerated, 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#777184]">avg $0.0029</td>
                    <td className="py-2.5 px-3 text-right text-[#7956C9]">
                      ${providers.reduce((sum, p) => sum + p.totalCost, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAE4EE] bg-[#FAF7F2]/50">
          <button
            onClick={onDownloadCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#7956C9]" />
            <span>Download Statement CSV</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#7956C9] text-xs font-semibold text-white hover:bg-[#6847B0] transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
