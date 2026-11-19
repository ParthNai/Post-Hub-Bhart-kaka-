"use client";

import React, { useState } from "react";
import { X, ShieldCheck, DollarSign, Percent, AlertCircle } from "lucide-react";
import type { BudgetConfig } from "@/lib/ai-analytics";

interface BudgetSettingsModalProps {
  budget: BudgetConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBudget: number, newThreshold: number) => Promise<void>;
}

export function BudgetSettingsModal({
  budget,
  isOpen,
  onClose,
  onSave,
}: BudgetSettingsModalProps) {
  const [configuredBudget, setConfiguredBudget] = useState(
    budget.configuredBudget.toString()
  );
  const [alertThreshold, setAlertThreshold] = useState(
    budget.alertThreshold.toString()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numBudget = parseFloat(configuredBudget) || 0;
  const numThreshold = parseFloat(alertThreshold) || 80;
  const remaining = Math.max(0, numBudget - budget.consumed);
  const percentage = numBudget > 0 ? Math.round((budget.consumed / numBudget) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numBudget <= 0) {
      setError("Budget amount must be greater than $0.");
      return;
    }
    if (numThreshold < 1 || numThreshold > 100) {
      setError("Alert threshold must be between 1% and 100%.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(numBudget, numThreshold);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update budget settings.");
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
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24213A]">
                Budget &amp; Usage Controls
              </h3>
              <p className="text-xs text-[#777184]">
                Configure monthly spending threshold and alerts
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

          {/* Configured Budget Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#24213A] flex items-center gap-1">
              Monthly Budget (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="10"
                max="100000"
                value={configuredBudget}
                onChange={(e) => setConfiguredBudget(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE4EE] text-sm text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
                placeholder="500.00"
              />
            </div>
            <p className="text-[11px] text-[#777184]">
              Current consumption: ${budget.consumed.toFixed(2)}
            </p>
          </div>

          {/* Alert Threshold Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#24213A] flex items-center gap-1">
              Alert Warning Threshold (%) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                step="1"
                min="50"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE4EE] text-sm text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
                placeholder="80"
              />
            </div>
            <p className="text-[11px] text-[#777184]">
              Send automated admin warning notifications when usage exceeds this limit.
            </p>
          </div>

          {/* Preview Box */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#777184]">Projected Remaining:</span>
              <span className="font-bold text-[#24213A]">${remaining.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#777184]">Budget Consumed:</span>
              <span className="font-bold text-[#7956C9]">{percentage}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EAE4EE] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentage > numThreshold ? "bg-red-500" : "bg-[#7956C9]"
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-[#EAE4EE] text-xs font-semibold text-[#777184] hover:bg-[#FAF7F2] hover:text-[#24213A] transition-colors"
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
