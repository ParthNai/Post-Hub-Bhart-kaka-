"use client";

import React from "react";
import { History, ShieldCheck, Check, Info } from "lucide-react";
import { RoutingEventHistory, FailoverConditions } from "@/lib/ai-failover";

interface BottomRoutingSectionProps {
  history: RoutingEventHistory[];
  conditions: FailoverConditions;
  onToggleCondition: (key: keyof FailoverConditions, value: boolean) => void;
  onViewAllHistory: () => void;
}

export const BottomRoutingSection: React.FC<BottomRoutingSectionProps> = ({
  history,
  conditions,
  onToggleCondition,
  onViewAllHistory,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Left: Recent Routing History */}
      <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs p-5 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE4EE]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#7956C9]" />
              <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
                Recent Routing History
              </h3>
            </div>
            <button
              type="button"
              onClick={onViewAllHistory}
              className="text-xs font-semibold text-[#7956C9] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-[11px] font-semibold text-[#777184] border-b border-[#EAE4EE] pb-2">
                  <th className="py-2 pr-3">Event ID</th>
                  <th className="py-2 px-3">Request ID</th>
                  <th className="py-2 px-3">Selected Provider</th>
                  <th className="py-2 px-3 text-center">Fallback?</th>
                  <th className="py-2 px-3">Final Provider</th>
                  <th className="py-2 px-3">Result</th>
                  <th className="py-2 pl-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4EE]">
                {history.slice(0, 3).map((h) => (
                  <tr key={h.eventId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-2.5 pr-3 font-semibold text-[#24213A]">
                      {h.eventId}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#777184]">
                      {h.requestId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#24213A]">
                      {h.selectedProvider}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      {h.fallback ? (
                        <span className="text-[#D97706]">Yes</span>
                      ) : (
                        <span className="text-[#16A34A]">No</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#24213A]">
                      {h.finalProvider}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#16A34A]">
                      {h.result}
                    </td>
                    <td className="py-2.5 pl-3 text-right text-[#777184]">
                      {h.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Right: Failover Conditions */}
      <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EAE4EE]">
            <ShieldCheck className="w-4 h-4 text-[#7956C9]" />
            <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
              Failover Conditions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Checkbox List */}
            <div className="space-y-3">
              {/* Condition 1 */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.providerUnavailable}
                  onChange={(e) =>
                    onToggleCondition("providerUnavailable", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded bg-[#FAF7F2] border border-[#EAE4EE] peer-checked:bg-[#7956C9] peer-checked:border-[#7956C9] flex items-center justify-center shrink-0 mt-0.5 transition-all">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#24213A] block">
                    Provider Unavailable
                  </span>
                  <span className="text-[11px] text-[#777184] block">
                    Provider is offline or not responding
                  </span>
                </div>
              </label>

              {/* Condition 2 */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.providerTimeout}
                  onChange={(e) =>
                    onToggleCondition("providerTimeout", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded bg-[#FAF7F2] border border-[#EAE4EE] peer-checked:bg-[#7956C9] peer-checked:border-[#7956C9] flex items-center justify-center shrink-0 mt-0.5 transition-all">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#24213A] block">
                    Provider Timeout
                  </span>
                  <span className="text-[11px] text-[#777184] block">
                    Response time exceeds threshold
                  </span>
                </div>
              </label>

              {/* Condition 3 */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.rateLimitResponse}
                  onChange={(e) =>
                    onToggleCondition("rateLimitResponse", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded bg-[#FAF7F2] border border-[#EAE4EE] peer-checked:bg-[#7956C9] peer-checked:border-[#7956C9] flex items-center justify-center shrink-0 mt-0.5 transition-all">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#24213A] block">
                    Rate Limit Response
                  </span>
                  <span className="text-[11px] text-[#777184] block">
                    Too many requests (429)
                  </span>
                </div>
              </label>
            </div>

            {/* Right Callout Banner matching reference screenshot */}
            <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8DFF5] flex flex-col items-center text-center justify-center min-h-[120px] space-y-2">
              <div className="w-7 h-7 rounded-full bg-[#7956C9] flex items-center justify-center text-white">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-[#7956C9] font-medium leading-relaxed">
                Fallback will be triggered when any of the selected conditions are met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
