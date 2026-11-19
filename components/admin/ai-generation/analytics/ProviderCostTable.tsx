"use client";

import React from "react";
import { Database } from "lucide-react";
import type { ProviderCostRecord } from "@/lib/ai-analytics";

interface ProviderCostTableProps {
  providers: ProviderCostRecord[];
}

export function ProviderCostTable({ providers }: ProviderCostTableProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <Database className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Provider Cost Breakdown
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            AI provider usage and cost details
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#EAE4EE] rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF7F2] text-[#777184] font-semibold border-b border-[#EAE4EE]">
              <th className="py-2.5 px-3.5">Provider</th>
              <th className="py-2.5 px-3.5">Model</th>
              <th className="py-2.5 px-3.5 text-right">Images Generated</th>
              <th className="py-2.5 px-3.5 text-right">Usage Units</th>
              <th className="py-2.5 px-3.5 text-right">Total Cost</th>
              <th className="py-2.5 px-3.5 text-right">Billing Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {providers.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-[#FAF7F2]/50 transition-colors text-[#24213A]"
              >
                <td className="py-2.5 px-3.5 font-bold">{p.provider}</td>
                <td className="py-2.5 px-3.5 text-[#524D63] font-medium">
                  {p.model}
                </td>
                <td className="py-2.5 px-3.5 text-right font-medium">
                  {p.imagesGenerated.toLocaleString()}
                </td>
                <td className="py-2.5 px-3.5 text-right font-medium">
                  {p.usageUnits.toLocaleString()}
                </td>
                <td className="py-2.5 px-3.5 text-right font-bold text-[#7956C9]">
                  ${p.totalCost.toFixed(2)}
                </td>
                <td className="py-2.5 px-3.5 text-right text-[#777184]">
                  {p.billingPeriod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
