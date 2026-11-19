"use client";

import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";
import { PresetThumbnail } from "../presets/PresetThumbnail";

interface FailedRequestsCardProps {
  failedItems: AiQueueItem[];
  onViewItem: (item: AiQueueItem) => void;
  onRetryItem: (item: AiQueueItem) => void;
  onViewAllClick: () => void;
}

export function FailedRequestsCard({
  failedItems,
  onViewItem,
  onRetryItem,
  onViewAllClick,
}: FailedRequestsCardProps) {
  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-[#24213A]">Failed Requests</h3>
        </div>

        <button
          type="button"
          onClick={onViewAllClick}
          className="text-xs font-semibold text-[#7956C9] hover:text-[#6845B8] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EAE4EE] text-[#777184] font-medium">
              <th className="pb-2.5 pl-2 font-medium">Request ID</th>
              <th className="pb-2.5 font-medium">User</th>
              <th className="pb-2.5 font-medium">Reason</th>
              <th className="pb-2.5 font-medium">Error Code</th>
              <th className="pb-2.5 font-medium">Failed At</th>
              <th className="pb-2.5 pr-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EEF6]">
            {failedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-[#777184]">
                  No failed requests recorded. Queue is operating cleanly.
                </td>
              </tr>
            ) : (
              failedItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2] transition-colors">
                  {/* Request ID + Thumbnail */}
                  <td className="py-2.5 pl-2 font-medium text-[#24213A]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#EAE4EE] shrink-0 shadow-2xs">
                        <PresetThumbnail type={item.thumbnailType} size="full" />
                      </div>
                      <span className="font-semibold">{item.id}</span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="py-2.5 text-[#24213A] font-medium">
                    {item.userName}
                  </td>

                  {/* Reason */}
                  <td className="py-2.5 text-rose-600 font-medium max-w-[200px] truncate">
                    {item.errorMessage || "Unknown error"}
                  </td>

                  {/* Error Code */}
                  <td className="py-2.5 text-[#777184]">
                    <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px] rounded">
                      {item.errorCode || "500"}
                    </span>
                  </td>

                  {/* Failed At */}
                  <td className="py-2.5 text-[#777184]">
                    {item.submittedAt}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewItem(item)}
                        className="px-3 py-1 bg-white hover:bg-[#FAF7F2] border border-[#EAE4EE] text-[#24213A] text-xs font-medium rounded-lg shadow-2xs transition-colors"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onRetryItem(item)}
                        className="px-3 py-1 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                      >
                        Retry
                      </button>
                    </div>
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

