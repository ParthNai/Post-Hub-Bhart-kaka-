"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { AiPromptPreset } from "@/lib/ai-presets";

interface DeletePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: AiPromptPreset | null;
  onConfirm: (presetId: string) => Promise<boolean>;
}

export function DeletePresetModal({
  isOpen,
  onClose,
  preset,
  onConfirm,
}: DeletePresetModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !preset) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const ok = await onConfirm(preset.id);
      if (ok) {
        onClose();
      } else {
        setError("Could not delete preset. Please try again.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting preset");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-[#24213A]">Delete Preset</h3>
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
            Are you sure you want to permanently delete the preset{" "}
            <span className="font-bold text-[#24213A]">&ldquo;{preset.name}&rdquo;</span> (ID:{" "}
            {preset.id})?
          </p>
          <p className="text-[11px] text-[#777184] leading-relaxed">
            This action cannot be undone. Posters referencing this preset will
            revert to default global prompt rules.
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
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
