"use client";

import React, { useState } from "react";
import { XCircle, X, AlertTriangle } from "lucide-react";
import type { AiQueueItem } from "@/lib/ai-queue";

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AiQueueItem | null;
  onConfirm: (id: string, reason: string) => Promise<boolean>;
}

export function CancelConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: CancelConfirmModalProps) {
  const [reason, setReason] = useState("Administrative cancellation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleCancel = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onConfirm(item.id, reason);
      if (ok) {
        onClose();
      } else {
        setError("Failed to cancel job. The job may have already finished.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error cancelling job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-rose-50/60">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-[#24213A]">Cancel Queue Job</h3>
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
            Are you sure you want to cancel the job{" "}
            <span className="font-bold text-[#24213A]">{item.id}</span> (User:{" "}
            <span className="font-semibold">{item.userName}</span>)?
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Cancellation Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-rose-400"
            />
          </div>

          <p className="text-[11px] text-[#777184] leading-relaxed">
            The worker process will abort synthesis immediately. If tokens were
            consumed, they will be refunded to the user.
          </p>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              {error}
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
            Go Back
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Cancelling..." : "Confirm Cancellation"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

