"use client";

import React, { useState } from "react";
import { Settings, X, Save } from "lucide-react";
import { FailoverConditions } from "@/lib/ai-failover";

interface RoutingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: FailoverConditions;
  onSave: (updated: Partial<FailoverConditions>) => Promise<boolean>;
}

export const RoutingSettingsModal: React.FC<RoutingSettingsModalProps> = ({
  isOpen,
  onClose,
  conditions,
  onSave,
}) => {
  const [maxAttempts, setMaxAttempts] = useState(conditions.maxAttempts || 3);
  const [retryInterval, setRetryInterval] = useState(
    conditions.retryIntervalSeconds || 30
  );
  const [providerUnavailable, setProviderUnavailable] = useState(
    conditions.providerUnavailable
  );
  const [providerTimeout, setProviderTimeout] = useState(
    conditions.providerTimeout
  );
  const [rateLimitResponse, setRateLimitResponse] = useState(
    conditions.rateLimitResponse
  );
  const [temporaryServerError, setTemporaryServerError] = useState(
    conditions.temporaryServerError
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const ok = await onSave({
        maxAttempts: Number(maxAttempts),
        retryIntervalSeconds: Number(retryInterval),
        providerUnavailable,
        providerTimeout,
        rateLimitResponse,
        temporaryServerError,
      });
      if (ok) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#24213A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Global Routing &amp; Failover Settings
              </h3>
              <p className="text-xs text-[#777184]">
                Configure maximum attempt counts and retry thresholds.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 py-1 text-xs">
          <div>
            <label className="font-bold text-[#24213A] block mb-1">
              Maximum Failover Attempts
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A]"
            />
          </div>

          <div>
            <label className="font-bold text-[#24213A] block mb-1">
              Retry Backoff Cooldown (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={retryInterval}
              onChange={(e) => setRetryInterval(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A]"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-[#EAE4EE]">
            <span className="font-bold text-[#24213A] block">
              Active Trigger Conditions
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={providerUnavailable}
                onChange={(e) => setProviderUnavailable(e.target.checked)}
                className="rounded text-[#7956C9]"
              />
              <span className="text-[#24213A]">Trigger on Provider Unavailable (503 / Offline)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={providerTimeout}
                onChange={(e) => setProviderTimeout(e.target.checked)}
                className="rounded text-[#7956C9]"
              />
              <span className="text-[#24213A]">Trigger on Gateway Timeout (504 / &gt;10s)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rateLimitResponse}
                onChange={(e) => setRateLimitResponse(e.target.checked)}
                className="rounded text-[#7956C9]"
              />
              <span className="text-[#24213A]">Trigger on Rate Limit Response (429)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={temporaryServerError}
                onChange={(e) => setTemporaryServerError(e.target.checked)}
                className="rounded text-[#7956C9]"
              />
              <span className="text-[#24213A]">Trigger on Temporary Internal Server Error (500)</span>
            </label>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE4EE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#777184] hover:text-[#24213A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
