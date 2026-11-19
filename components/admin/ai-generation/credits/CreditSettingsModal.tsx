"use client";

import React, { useState } from "react";
import { X, Settings, AlertCircle } from "lucide-react";
import type { CreditSettings } from "@/lib/ai-credits";

interface CreditSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CreditSettings;
  onSave: (updated: Partial<CreditSettings>) => Promise<void>;
}

export function CreditSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: CreditSettingsModalProps) {
  const [defaultCostPerImage, setDefaultCostPerImage] = useState<number>(
    settings.defaultCostPerImage
  );
  const [promotionalExpiryDays, setPromotionalExpiryDays] = useState<number>(
    settings.promotionalExpiryDays
  );
  const [maxPromotionalPerUser, setMaxPromotionalPerUser] = useState<number>(
    settings.maxPromotionalPerUser
  );
  const [maxAdminAllocationPerDay, setMaxAdminAllocationPerDay] =
    useState<number>(settings.maxAdminAllocationPerDay);
  const [refundOnFailure, setRefundOnFailure] = useState<boolean>(
    settings.refundOnFailure
  );
  const [rolloverAllowed, setRolloverAllowed] = useState<boolean>(
    settings.rolloverAllowed
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        defaultCostPerImage,
        promotionalExpiryDays,
        maxPromotionalPerUser,
        maxAdminAllocationPerDay,
        refundOnFailure,
        rolloverAllowed,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save credit settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#EAE4EE] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Settings className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24213A]">
                Credit System Configuration
              </h3>
              <p className="text-xs text-[#777184]">
                Manage consumption limits, expiry rules and refund behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Default Cost Per Image */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#24213A]">
              Default Generation Credit Cost
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={defaultCostPerImage}
              onChange={(e) => setDefaultCostPerImage(parseInt(e.target.value) || 1)}
              required
              className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
            <p className="text-[11px] text-[#777184]">
              Credits deducted per single image generation.
            </p>
          </div>

          {/* Promotional Expiry Days */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#24213A]">
              Promotional Credit Validity (Days)
            </label>
            <input
              type="number"
              min="7"
              max="365"
              value={promotionalExpiryDays}
              onChange={(e) => setPromotionalExpiryDays(parseInt(e.target.value) || 90)}
              required
              className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Max Promotional Credits Per User */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#24213A]">
              Max Promotional Balance Per User
            </label>
            <input
              type="number"
              min="100"
              step="500"
              value={maxPromotionalPerUser}
              onChange={(e) => setMaxPromotionalPerUser(parseInt(e.target.value) || 2000)}
              required
              className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Max Admin Allocation Per Day */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#24213A]">
              Max Admin Allocation Daily Limit
            </label>
            <input
              type="number"
              min="100"
              step="1000"
              value={maxAdminAllocationPerDay}
              onChange={(e) => setMaxAdminAllocationPerDay(parseInt(e.target.value) || 50000)}
              required
              className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#24213A]">
                Auto-Refund on Generation Failure
              </span>
              <input
                type="checkbox"
                checked={refundOnFailure}
                onChange={(e) => setRefundOnFailure(e.target.checked)}
                className="w-4 h-4 text-[#7956C9] accent-[#7956C9] rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#24213A]">
                Allow Credit Rollover on Plan Renewal
              </span>
              <input
                type="checkbox"
                checked={rolloverAllowed}
                onChange={(e) => setRolloverAllowed(e.target.checked)}
                className="w-4 h-4 text-[#7956C9] accent-[#7956C9] rounded"
              />
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE4EE]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-[#EAE4EE] text-xs font-semibold text-[#777184] hover:bg-[#FAF7F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#7956C9] text-xs font-semibold text-white hover:bg-[#6847B0] transition-colors shadow-2xs disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
