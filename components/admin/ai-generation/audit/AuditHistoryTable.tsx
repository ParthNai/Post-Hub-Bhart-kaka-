"use client";

import React from "react";
import { Shield } from "lucide-react";
import type { AuditEvent } from "@/lib/ai-audit";

interface AuditHistoryTableProps {
  events: AuditEvent[];
}

export function AuditHistoryTable({ events }: AuditHistoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE4EE] shadow-2xs overflow-hidden mb-6">
      {/* Header */}
      <div className="p-5 flex items-start gap-3 border-b border-[#EAE4EE]">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <Shield className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Administrative Audit History
          </h2>
          <p className="text-xs text-[#777184] font-medium mt-0.5">
            Track administrative actions related to credit management.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 text-[#777184] font-semibold border-b border-[#EAE4EE]">
            <tr>
              <th className="py-3 px-4 font-semibold">Administrator</th>
              <th className="py-3 px-4 font-semibold">Action Performed</th>
              <th className="py-3 px-4 font-semibold">Target User / Credit Plan</th>
              <th className="py-3 px-4 font-semibold">Previous Value</th>
              <th className="py-3 px-4 font-semibold">New Value</th>
              <th className="py-3 px-4 font-semibold">Reason</th>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Audit Event Ref.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#777184]">
                  No administrative audit records available.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                  {/* Administrator */}
                  <td className="py-3 px-4 font-medium text-[#24213A]">
                    {evt.administrator}
                  </td>

                  {/* Action Performed */}
                  <td className="py-3 px-4 font-semibold text-[#24213A]">
                    {evt.actionPerformed}
                  </td>

                  {/* Target User / Credit Plan */}
                  <td className="py-3 px-4 text-[#777184] font-mono text-[11px]">
                    {evt.targetEntity}
                  </td>

                  {/* Previous Value */}
                  <td className="py-3 px-4 text-[#777184]">
                    {evt.previousValue}
                  </td>

                  {/* New Value */}
                  <td className="py-3 px-4 font-bold text-[#24213A]">
                    {evt.newValue}
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-4 text-[#777184] max-w-xs truncate" title={evt.reason}>
                    {evt.reason}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 text-[#777184] whitespace-nowrap">
                    {evt.timestamp}
                  </td>

                  {/* Audit Event Ref */}
                  <td className="py-3 px-4 font-mono font-medium text-[#7956C9]">
                    {evt.id}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
