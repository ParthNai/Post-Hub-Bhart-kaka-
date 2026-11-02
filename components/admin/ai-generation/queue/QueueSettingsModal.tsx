"use client";

import React, { useState } from "react";
import { X, Settings, Check, AlertCircle } from "lucide-react";
import type { AiQueueSettings } from "@/lib/ai-queue";

interface QueueSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiQueueSettings;
  onSave: (settings: Partial<AiQueueSettings>) => Promise<boolean>;
}

export function QueueSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: QueueSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <QueueSettingsFormContent
      key={settings.maxConcurrentJobs}
      settings={settings}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

interface QueueSettingsFormContentProps {
  settings: AiQueueSettings;
  onClose: () => void;
  onSave: (settings: Partial<AiQueueSettings>) => Promise<boolean>;
}

function QueueSettingsFormContent({
  settings,
  onClose,
  onSave,
}: QueueSettingsFormContentProps) {
  const [maxConcurrentJobs, setMaxConcurrentJobs] = useState(settings.maxConcurrentJobs);
  const [workerTimeoutSec, setWorkerTimeoutSec] = useState(settings.workerTimeoutSec);
  const [autoRetryFailed, setAutoRetryFailed] = useState(settings.autoRetryFailed);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(settings.maxRetryAttempts);
  const [pollingIntervalSec, setPollingIntervalSec] = useState(settings.pollingIntervalSec);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onSave({
        maxConcurrentJobs,
        workerTimeoutSec,
        autoRetryFailed,
        maxRetryAttempts,
        pollingIntervalSec,
      });
      if (ok) {
        onClose();
      } else {
        setError("Failed to update queue settings.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving queue settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Queue & Worker Settings
              </h3>
              <p className="text-xs text-[#777184]">
                Manage generation workers, concurrency, and retry policies.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Max Concurrent Jobs */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Max Concurrent Worker Jobs
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxConcurrentJobs}
              onChange={(e) => setMaxConcurrentJobs(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
            <p className="text-[11px] text-[#777184] mt-1">
              Controls how many generation requests can be processed simultaneously.
            </p>
          </div>

          {/* Worker Timeout */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Worker Execution Timeout (seconds)
            </label>
            <input
              type="number"
              min={10}
              max={300}
              value={workerTimeoutSec}
              onChange={(e) => setWorkerTimeoutSec(parseInt(e.target.value, 10) || 60)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Max Retry Attempts */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Max Retry Attempts Allowed
            </label>
            <input
              type="number"
              min={0}
              max={5}
              value={maxRetryAttempts}
              onChange={(e) => setMaxRetryAttempts(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Polling Interval */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Live Monitor Polling Interval (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={pollingIntervalSec}
              onChange={(e) => setPollingIntervalSec(parseInt(e.target.value, 10) || 10)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Auto Retry Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl">
            <div>
              <div className="text-xs font-semibold text-[#24213A]">
                Automatic Failure Retry
              </div>
              <div className="text-[11px] text-[#777184]">
                Automatically re-queue jobs that fail due to temporary network timeouts.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoRetryFailed}
              onChange={(e) => setAutoRetryFailed(e.target.checked)}
              className="w-4 h-4 text-[#7956C9] rounded focus:ring-[#7956C9] cursor-pointer"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

