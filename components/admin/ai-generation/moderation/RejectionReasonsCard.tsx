"use client";

import React from "react";
import { Ban, Plus, Edit2, CheckCircle2, XCircle } from "lucide-react";
import type { RejectionReason } from "@/lib/ai-moderation";

interface RejectionReasonsCardProps {
  reasons: RejectionReason[];
  onAddReason: () => void;
  onEditReason: (reason: RejectionReason) => void;
  onToggleStatus: (id: string) => void;
}

export function RejectionReasonsCard({
  reasons,
  onAddReason,
  onEditReason,
  onToggleStatus,
}: RejectionReasonsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header + Add Reason button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Ban className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24213A]">
              Rejection Reasons
            </h2>
            <p className="text-xs text-[#777184] font-medium">
              Manage reasons for rejecting content.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddReason}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-all shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Reason</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#EAE4EE] rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF7F2] text-[#777184] font-semibold border-b border-[#EAE4EE]">
              <th className="py-2.5 px-3">Reason Category</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {reasons.map((reason) => {
              const isActive = reason.status === "Active";

              return (
                <tr
                  key={reason.id}
                  className="hover:bg-[#FAF7F2]/50 transition-colors text-[#24213A]"
                >
                  <td className="py-2 px-3 font-bold">{reason.category}</td>
                  <td className="py-2 px-3 text-[#524D63] font-medium">
                    {reason.description}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? "text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]"
                          : "text-gray-500 bg-gray-100 border-gray-300"
                      }`}
                    >
                      {reason.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onEditReason(reason)}
                      className="p-1 text-[#777184] hover:text-[#7956C9] rounded hover:bg-[#FAF7F2] transition-colors"
                      title="Edit Reason"
                    >
                      <Edit2 className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(reason.id)}
                      className={`p-1 rounded transition-colors ${
                        isActive
                          ? "text-[#10B981] hover:text-[#EF4444] hover:bg-red-50"
                          : "text-gray-400 hover:text-[#10B981] hover:bg-emerald-50"
                      }`}
                      title={isActive ? "Disable Reason" : "Activate Reason"}
                    >
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
