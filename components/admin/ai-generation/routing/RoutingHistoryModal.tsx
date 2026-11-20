"use client";

import React from "react";
import { History, X } from "lucide-react";
import { RoutingEventHistory } from "@/lib/ai-failover";

interface RoutingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RoutingEventHistory[];
}

export const RoutingHistoryModal: React.FC<RoutingHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#24213A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#EAE4EE] shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                AI Routing &amp; Failover History
              </h3>
              <p className="text-xs text-[#777184]">
                Audit trail of recent request routing decisions, failovers, and latency outcomes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#777184] hover:text-[#24213A] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Table */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#EAE4EE] border border-[#EAE4EE] rounded-lg">
          {history.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#777184]">
              No routing events recorded yet.
            </div>
          ) : (
            history.map((h) => (
              <div key={h.eventId} className="p-3 bg-white text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#24213A]">{h.eventId}</span>
                    <span className="font-mono text-[11px] text-[#777184]">({h.requestId})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        h.fallback ? "text-[#D97706]" : "text-[#777184]"
                      }`}
                    >
                      {h.fallback ? "Fallback: Yes" : "Direct Primary"}
                    </span>
                    <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      {h.result}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#777184]">
                  <span>
                    Attempted: <b className="text-[#24213A]">{h.selectedProvider}</b> → Final:{" "}
                    <b className="text-[#24213A]">{h.finalProvider}</b>
                  </span>
                  <span>{h.fullDateTime || h.timestamp}</span>
                </div>

                {h.reason && (
                  <p className="text-[11px] text-[#777184] pt-1">
                    {h.reason}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#EAE4EE]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
