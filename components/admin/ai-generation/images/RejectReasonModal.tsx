"use client";

import React, { useState } from "react";
import { X, Trash2, AlertCircle } from "lucide-react";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: string | null;
  onConfirm: (id: string, reason: string, notes: string) => Promise<boolean>;
}

export function RejectReasonModal({
  isOpen,
  onClose,
  imageId,
  onConfirm,
}: RejectReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState(
    "Text distortion in traditional arch border"
  );
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !imageId) return null;

  const presetReasons = [
    "Text distortion in traditional arch border",
    "Illegible typography or distorted characters",
    "Visual artifacts or pixelation",
    "Violates corporate brand guidelines",
    "Inappropriate or offensive imagery",
    "Copyright or trademark conflict",
    "Other custom reason",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onConfirm(imageId, selectedReason, customNotes);
      if (ok) {
        onClose();
      } else {
        setError("Failed to reject image. Please try again.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error rejecting image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-[#24213A]">Reject Generated Image</h3>
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
            Please specify the reason for rejecting image{" "}
            <span className="font-bold text-[#24213A]">{imageId}</span>. The author
            will receive this feedback.
          </p>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Rejection Reason *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-rose-400 cursor-pointer"
            >
              {presetReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Provide specific details for the creator..."
              className="w-full p-2.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-rose-400 resize-none leading-relaxed"
            />
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Rejecting..." : "Confirm Rejection"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

