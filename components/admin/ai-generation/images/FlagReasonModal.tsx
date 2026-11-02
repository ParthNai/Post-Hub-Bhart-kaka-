"use client";

import React, { useState } from "react";
import { X, Flag, AlertCircle } from "lucide-react";

interface FlagReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string | null;
  onConfirm: (id: string, reason: string) => Promise<boolean>;
}

export function FlagReasonModal({
  isOpen,
  onClose,
  imageId,
  onConfirm,
}: FlagReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState(
    "Flagged for elevated compliance review"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !imageId) return null;

  const flagReasons = [
    "Flagged for elevated compliance review",
    "Requires senior moderator secondary review",
    "Potential copyright similarity concern",
    "Sensitive topic verification",
    "Quality inspection check",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onConfirm(imageId, selectedReason);
      if (ok) {
        onClose();
      } else {
        setError("Failed to flag image. Please try again.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error flagging image");
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
              <Flag className="w-4 h-4 text-[#7956C9]" />
            </div>
            <h3 className="text-base font-bold text-[#24213A]">Flag Image for Review</h3>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#24213A] leading-relaxed">
            Flag image <span className="font-bold text-[#24213A]">{imageId}</span> for
            internal team review. The image will remain pending publication.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Flag Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              {flagReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Flagging..." : "Confirm Flag"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

