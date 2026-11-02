"use client";

import React, { useState } from "react";
import { RefreshCw, X, AlertCircle } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";

interface RetryConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AiQueueItem | null;
  onConfirm: (id: string) => Promise<boolean>;
}

export function RetryConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: RetryConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleRetry = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onConfirm(item.id);
      if (ok) {
        onClose();
      } else {
        setError("Failed to re-queue generation request.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error retrying request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-[#7956C9]" />
            </div>
            <h3 className="text-base font-bold text-[#24213A]">Retry Failed Request</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-[#24213A] leading-relaxed">
            Are you sure you want to re-queue generation job{" "}
            <span className="font-bold text-[#7956C9]">{item.id}</span> for user{" "}
            <span className="font-semibold">{item.userName}</span>?
          </p>

          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            <span className="font-semibold">Original failure:</span>{" "}
            {item.errorMessage || "Rate limit exceeded (HTTP 429)"}
          </div>

          <p className="text-[11px] text-[#777184] leading-relaxed">
            The job will be placed back into the worker queue with highest priority.
            Provider token quotas will be charged upon successful completion.
          </p>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
            <span>{isSubmitting ? "Re-queueing..." : "Confirm Retry"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
