"use client";

import React from "react";
import { Layers, GripVertical, Edit2 } from "lucide-react";
import { ProviderPriorityItem } from "@/lib/ai-failover";
import { ProviderIcon } from "../health/ProviderLogos";

interface ProviderPriorityTableProps {
  items: ProviderPriorityItem[];
  onToggleRouting: (providerId: string, enabled: boolean) => void;
  onEditPriority?: (item: ProviderPriorityItem) => void;
}

export const ProviderPriorityTable: React.FC<ProviderPriorityTableProps> = ({
  items,
  onToggleRouting,
  onEditPriority,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[#7956C9]" />
          <h2 className="text-sm font-bold text-[#24213A] tracking-tight">
            Provider Priority &amp; Routing Configuration
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2]/80 border-b border-[#EAE4EE] text-[11px] font-semibold text-[#777184]">
              <th className="py-2.5 px-4 w-10 text-center"></th>
              <th className="py-2.5 px-4">Priority</th>
              <th className="py-2.5 px-5">Provider</th>
              <th className="py-2.5 px-4">Model</th>
              <th className="py-2.5 px-4">Generation Type</th>
              <th className="py-2.5 px-4">Health Status</th>
              <th className="py-2.5 px-4 text-center">Routing Status</th>
              <th className="py-2.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE] text-xs">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#FAF7F2]/50 transition-colors"
              >
                {/* Drag handle */}
                <td className="py-3 px-4 text-center text-[#A098AE] cursor-grab">
                  <GripVertical className="w-4 h-4 mx-auto" />
                </td>

                {/* Priority */}
                <td className="py-3 px-4 font-bold text-[#24213A]">
                  {item.priority}
                </td>

                {/* Provider Logo & Name */}
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 border border-[#EAE4EE] flex items-center justify-center shrink-0">
                      <ProviderIcon providerId={item.providerId} size={18} />
                    </div>
                    <span className="font-bold text-[#24213A]">
                      {item.providerName}
                    </span>
                  </div>
                </td>

                {/* Model */}
                <td className="py-3 px-4 text-[#24213A] font-medium">
                  {item.model}
                </td>

                {/* Generation Type */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.generationType === "Text + Image"
                        ? "bg-[#EFF6FF] text-[#1E40AF]"
                        : "bg-[#FAF5FF] text-[#6B21A8]"
                    }`}
                  >
                    {item.generationType}
                  </span>
                </td>

                {/* Health Status */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    {item.healthStatus}
                  </span>
                </td>

                {/* Routing Status (Toggle) */}
                <td className="py-3 px-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.routingEnabled}
                      onChange={(e) =>
                        onToggleRouting(item.providerId, e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
                  </label>
                </td>

                {/* Actions */}
                <td className="py-3 px-5 text-right">
                  <button
                    type="button"
                    onClick={() => onEditPriority?.(item)}
                    className="p-1.5 text-[#777184] hover:text-[#7956C9] hover:bg-[#FAF5FF] rounded-md transition-colors cursor-pointer"
                    title="Edit provider settings"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
