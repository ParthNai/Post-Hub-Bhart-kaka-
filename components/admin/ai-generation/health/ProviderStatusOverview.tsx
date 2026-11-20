"use client";

import React from "react";
import { Server, AlertTriangle } from "lucide-react";
import { ProviderHealthRecord, ProviderHealthStatus } from "@/lib/ai-provider-health";
import { ProviderIcon } from "./ProviderLogos";

interface ProviderStatusOverviewProps {
  providers: ProviderHealthRecord[];
  selectedProviderId: string;
  onSelectProvider: (providerId: string) => void;
}

export const ProviderStatusOverview: React.FC<ProviderStatusOverviewProps> = ({
  providers,
  selectedProviderId,
  onSelectProvider,
}) => {
  const getStatusBadge = (status: ProviderHealthStatus) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            Healthy
          </span>
        );
      case "Degraded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            Degraded
          </span>
        );
      case "Checking":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            Checking
          </span>
        );
      case "Unavailable":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            Unavailable
          </span>
        );
      case "Unknown":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-[#7956C9]" />
          <h2 className="text-sm font-bold text-[#24213A] tracking-tight">
            Provider Status Overview
          </h2>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#EAE4EE]">
        {providers.map((p) => {
          const isSelected = selectedProviderId === p.id;
          return (
            <div
              key={p.id}
              className={`px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                isSelected ? "bg-[#FAF7FD]" : "hover:bg-[#FAF7F2]/60"
              }`}
            >
              {/* Left: Logo & Name */}
              <div className="flex items-center gap-3.5 min-w-[180px]">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-[#EAE4EE] flex items-center justify-center shrink-0 shadow-2xs">
                  <ProviderIcon providerId={p.id} size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#24213A]">{p.name}</h3>
                </div>
              </div>

              {/* Status Badge */}
              <div className="min-w-[100px]">{getStatusBadge(p.status)}</div>

              {/* Models count */}
              <div className="text-xs text-[#777184] min-w-[80px]">
                {p.modelCount} models
              </div>

              {/* Last Check */}
              <div className="text-xs text-[#777184] min-w-[140px]">
                {p.lastCheckText}
              </div>

              {/* Response */}
              <div className="text-xs text-[#24213A] font-medium min-w-[120px]">
                {p.responseTimeText}
              </div>

              {/* Errors / Warnings */}
              <div className="min-w-[100px]">
                {p.hasError ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {p.recentError || "API Errors"}
                  </span>
                ) : p.recentError === "No Data" ? (
                  <span className="text-xs text-[#64748B]">No Data</span>
                ) : (
                  <span className="text-xs text-[#777184]">—</span>
                )}
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onSelectProvider(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#7956C9] text-white border-[#7956C9]"
                      : "bg-white text-[#7956C9] border-[#E8DFF5] hover:bg-[#FAF5FF]"
                  }`}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
