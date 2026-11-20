"use client";

import React, { useState } from "react";
import { Play, CheckCircle2, AlertTriangle, X, RefreshCw } from "lucide-react";
import { ProviderHealthRecord } from "@/lib/ai-provider-health";

interface RunHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: ProviderHealthRecord[];
  onExecute: (targetProviderId: string) => Promise<{
    success: boolean;
    message: string;
    results: Array<{
      providerId: string;
      providerName: string;
      status: string;
      durationMs: number;
      details: string;
    }>;
  }>;
}

export const RunHealthCheckModal: React.FC<RunHealthCheckModalProps> = ({
  isOpen,
  onClose,
  providers,
  onExecute,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    providerId: string;
    providerName: string;
    status: string;
    durationMs: number;
    details: string;
  }> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResults(null);
    try {
      const res = await onExecute(selectedTarget);
      if (res.success) {
        setResults(res.results);
      } else {
        setErrorMsg(res.message || "Health check failed.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Health check failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#24213A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE4EE] shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Run AI Provider Health Check
              </h3>
              <p className="text-xs text-[#777184]">
                Initiate a real-time connectivity and latency verification.
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

        {/* Content */}
        {!results ? (
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#24213A] block mb-1.5">
                Target Provider(s)
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
              >
                <option value="all">All Configured Providers (4)</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#777184] space-y-1">
              <p className="font-semibold text-[#24213A]">Execution Details:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Runs real low-overhead model endpoint ping checks.</li>
                <li>Never exposes private authentication tokens or API secrets.</li>
                <li>Records response latency and appends to persistent monitoring history.</li>
              </ul>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Health checks completed successfully!</span>
            </div>

            <div className="divide-y divide-[#EAE4EE] border border-[#EAE4EE] rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              {results.map((r) => (
                <div
                  key={r.providerId}
                  className="p-3 flex items-center justify-between text-xs bg-white"
                >
                  <div>
                    <span className="font-bold text-[#24213A]">{r.providerName}</span>
                    <p className="text-[11px] text-[#777184] mt-0.5">{r.details}</p>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.status === "Healthy"
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : r.status === "Degraded"
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {r.status}
                    </span>
                    <p className="text-[11px] font-mono text-[#24213A] font-semibold mt-0.5">
                      {r.durationMs}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE4EE]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] cursor-pointer"
          >
            {results ? "Close" : "Cancel"}
          </button>

          {!results && (
            <button
              type="button"
              onClick={handleRun}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>{isLoading ? "Executing Checks..." : "Execute Health Check"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
