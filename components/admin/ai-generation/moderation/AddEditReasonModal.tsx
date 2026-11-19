"use client";

import React, { useState } from "react";
import { X, Ban, Save } from "lucide-react";
import type { RejectionReason } from "@/lib/ai-moderation";

interface AddEditReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: RejectionReason | null;
  onSave: (data: Omit<RejectionReason, "id">, reasonId?: string) => void;
}

export function AddEditReasonModal({
  isOpen,
  onClose,
  reason,
  onSave,
}: AddEditReasonModalProps) {
  if (!isOpen) return null;

  return (
    <ReasonFormContent
      key={reason?.id || "new"}
      reason={reason}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function ReasonFormContent({
  reason,
  onClose,
  onSave,
}: {
  reason: RejectionReason | null;
  onClose: () => void;
  onSave: (data: Omit<RejectionReason, "id">, reasonId?: string) => void;
}) {
  const isEditing = Boolean(reason);
  const [category, setCategory] = useState(reason?.category || "");
  const [description, setDescription] = useState(reason?.description || "");
  const [status, setStatus] = useState<"Active" | "Disabled">(
    reason?.status || "Active"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      setError("Reason Category is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    onSave(
      {
        category: category.trim(),
        description: description.trim(),
        status,
      },
      reason?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <Ban className="w-4 h-4 text-[#7956C9]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                {isEditing ? "Edit Rejection Reason" : "Add Rejection Reason"}
              </h3>
              <p className="text-xs text-[#777184] font-medium">
                Standardize content moderation feedback
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Reason Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Quality Issue"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Low quality or blurry"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Disabled")}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            >
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#777184] text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? "Save" : "Add Reason"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
