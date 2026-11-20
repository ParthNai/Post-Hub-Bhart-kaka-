"use client";

import React, { useState } from "react";
import { BarChart2, Search, Eye } from "lucide-react";
import { ModelPerformanceRecord, ModelHealthStatus } from "@/lib/ai-provider-health";

interface ModelPerformanceTableProps {
  models: ModelPerformanceRecord[];
  onViewModel?: (model: ModelPerformanceRecord) => void;
  search: string;
  onSearchChange: (val: string) => void;
  providerFilter: string;
  onProviderFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export const ModelPerformanceTable: React.FC<ModelPerformanceTableProps> = ({
  models,
  onViewModel,
  search,
  onSearchChange,
  providerFilter,
  onProviderFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [selectedModelForModal, setSelectedModelForModal] =
    useState<ModelPerformanceRecord | null>(null);

  const getStatusBadge = (status: ModelHealthStatus) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            Healthy
          </span>
        );
      case "Degraded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            Degraded
          </span>
        );
      case "Error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            Error
          </span>
        );
      case "Checking":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            Checking
          </span>
        );
      case "Unknown":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
            Unknown
          </span>
        );
    }
  };

  const handleRowClick = (model: ModelPerformanceRecord) => {
    if (onViewModel) {
      onViewModel(model);
    } else {
      setSelectedModelForModal(model);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header & Controls Toolbar */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-4 h-4 text-[#7956C9]" />
          <h2 className="text-sm font-bold text-[#24213A] tracking-tight">
            Model Performance
          </h2>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#777184] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search models..."
              className="pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all w-36 sm:w-44"
            />
          </div>

          {/* Provider selector */}
          <select
            value={providerFilter}
            onChange={(e) => onProviderFilterChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Providers">All Providers</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Anthropic">Anthropic</option>
            <option value="Stability AI">Stability AI</option>
            <option value="Adobe Firefly">Adobe Firefly</option>
            <option value="Gemini">Gemini</option>
          </select>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Degraded">Degraded</option>
            <option value="Error">Error</option>
            <option value="Checking">Checking</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2]/80 border-b border-[#EAE4EE] text-[11px] font-semibold text-[#777184]">
              <th className="py-2.5 px-5">Model Name</th>
              <th className="py-2.5 px-4">Provider</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Average Response</th>
              <th className="py-2.5 px-4">Successful Requests</th>
              <th className="py-2.5 px-4">Failed Requests</th>
              <th className="py-2.5 px-4">Last Health Check</th>
              <th className="py-2.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE] text-xs">
            {models.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[#777184]">
                  No models match the selected filter criteria.
                </td>
              </tr>
            ) : (
              models.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-[#FAF7F2]/50 transition-colors"
                >
                  <td className="py-3 px-5 font-semibold text-[#24213A]">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 text-[#777184]">{m.provider}</td>
                  <td className="py-3 px-4">{getStatusBadge(m.status)}</td>
                  <td className="py-3 px-4 font-medium text-[#24213A]">
                    {m.avgResponseText}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#24213A]">
                    {m.successfulRequests.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#DC2626] font-medium">
                    {m.failedRequests.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#777184]">{m.lastCheckText}</td>
                  <td className="py-3 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => handleRowClick(m)}
                      className="px-2.5 py-1 rounded bg-white text-[#7956C9] border border-[#E8DFF5] hover:bg-[#FAF5FF] text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Model Detail Modal if clicked */}
      {selectedModelForModal && (
        <div className="fixed inset-0 z-50 bg-[#24213A]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
              <h3 className="text-base font-bold text-[#24213A]">
                {selectedModelForModal.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedModelForModal(null)}
                className="text-[#777184] hover:text-[#24213A] p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777184]">Provider</span>
                <span className="font-semibold text-[#24213A]">
                  {selectedModelForModal.provider}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">Status</span>
                <span>{getStatusBadge(selectedModelForModal.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">Average Latency</span>
                <span className="font-semibold text-[#24213A]">
                  {selectedModelForModal.avgResponseText}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">Successful Requests</span>
                <span className="font-semibold text-[#15803D]">
                  {selectedModelForModal.successfulRequests.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">Failed Requests</span>
                <span className="font-semibold text-[#DC2626]">
                  {selectedModelForModal.failedRequests.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#777184] block mb-1">Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {selectedModelForModal.capabilities.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8DFF5] text-[#7956C9] text-[11px] font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-[#EAE4EE] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedModelForModal(null)}
                className="px-4 py-1.5 bg-[#7956C9] text-white text-xs font-semibold rounded-lg hover:bg-[#6846B8] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
