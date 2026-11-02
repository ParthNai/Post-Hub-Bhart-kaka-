"use client";

import React, { useState } from "react";
import {
  ListFilter,
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";
import { PresetThumbnail } from "../presets/PresetThumbnail";

interface RequestQueueTableProps {
  items: AiQueueItem[];
  selectedItem: AiQueueItem | null;
  onSelectItem: (item: AiQueueItem) => void;
  onViewItem: (item: AiQueueItem) => void;
  onRetryItem: (item: AiQueueItem) => void;
  onCancelItem: (item: AiQueueItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  sortFilter: string;
  setSortFilter: (s: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
}

export function RequestQueueTable({
  items,
  selectedItem,
  onSelectItem,
  onViewItem,
  onRetryItem,
  onCancelItem,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortFilter,
  setSortFilter,
  page,
  totalPages,
  total,
  onPageChange,
}: RequestQueueTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const statuses = [
    "All Statuses",
    "Processing",
    "Pending",
    "Completed",
    "Failed",
    "Cancelled",
  ];

  const sortOptions = ["Newest First", "Oldest First"];

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Request Queue</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Request ID or User..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EAE4EE] text-[#777184] font-medium">
              <th className="pb-3 pl-2 font-medium">Request ID</th>
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Prompt Preview</th>
              <th className="pb-3 font-medium">Provider / Model</th>
              <th className="pb-3 font-medium">Submitted At</th>
              <th className="pb-3 font-medium">Processing Started</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 pr-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EEF6]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#777184]">
                  No queue requests found matching criteria.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isDropdownOpen = openDropdownId === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FAF7FD] border-l-2 border-[#7956C9]"
                        : "hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {/* Request ID + Thumbnail */}
                    <td className="py-3 pl-2 font-medium text-[#24213A]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#EAE4EE] shrink-0 shadow-2xs">
                          <PresetThumbnail type={item.thumbnailType} size="full" />
                        </div>
                        <span className="font-semibold">{item.id}</span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-3 text-[#24213A] font-medium">
                      {item.userName}
                    </td>

                    {/* Prompt Preview */}
                    <td className="py-3 text-[#777184] max-w-[200px] truncate">
                      {item.promptPreview}
                    </td>

                    {/* Provider / Model */}
                    <td className="py-3 text-[#24213A]">
                      {item.provider}
                    </td>

                    {/* Submitted At */}
                    <td className="py-3 text-[#777184]">
                      {item.submittedAt}
                    </td>

                    {/* Processing Started */}
                    <td className="py-3 text-[#777184]">
                      {item.processingStartedAt || "—"}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3">
                      {item.status === "processing" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DBEAFE] text-[#2563EB]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                          Processing
                        </span>
                      ) : item.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8DFF5] text-[#7956C9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7956C9]" />
                          Pending
                        </span>
                      ) : item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          Completed
                        </span>
                      ) : item.status === "failed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="py-3 pr-2 text-right relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(isDropdownOpen ? null : item.id);
                        }}
                        className="p-1 text-[#777184] hover:text-[#24213A] rounded transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {isDropdownOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-8 z-30 w-40 bg-white border border-[#EAE4EE] rounded-xl shadow-lg py-1 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onViewItem(item);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-[#24213A] hover:bg-[#FAF7F2] flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#777184]" />
                            <span>View Details</span>
                          </button>

                          {item.status === "failed" && (
                            <button
                              type="button"
                              onClick={() => {
                                onRetryItem(item);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#7956C9] hover:bg-[#FAF7F2] flex items-center gap-2 font-medium"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Retry Job</span>
                            </button>
                          )}

                          {(item.status === "pending" || item.status === "processing") && (
                            <button
                              type="button"
                              onClick={() => {
                                onCancelItem(item);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel Job</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-3 mt-3 border-t border-[#F2EEF6] flex items-center justify-between text-xs text-[#777184]">
        <div>
          Showing {items.length} of {total} requests
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2.5 py-1 border border-[#EAE4EE] rounded-md disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors"
          >
            Previous
          </button>
          <span className="px-2 font-medium text-[#24213A]">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2.5 py-1 border border-[#EAE4EE] rounded-md disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
