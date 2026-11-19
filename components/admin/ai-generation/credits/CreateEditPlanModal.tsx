"use client";

import React, { useState } from "react";
import { X, Crown, AlertCircle } from "lucide-react";
import type {
  CreditPlan,
  CreditPlanType,
  CreditPlanStatus,
  CreditPlanVisibility,
} from "@/lib/ai-credits";

interface CreateEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CreditPlan | null;
  onSave: (data: Omit<CreditPlan, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

interface PlanFormProps {
  plan: CreditPlan | null;
  onClose: () => void;
  onSave: (data: Omit<CreditPlan, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

function PlanForm({ plan, onClose, onSave }: PlanFormProps) {
  const [name, setName] = useState(plan?.name || "");
  const [description, setDescription] = useState(plan?.description || "");
  const [creditQuantity, setCreditQuantity] = useState<number>(
    plan?.creditQuantity || 500
  );
  const [validityDays, setValidityDays] = useState<number>(
    plan?.validityDays || 30
  );
  const [planType, setPlanType] = useState<CreditPlanType>(
    plan?.planType || "One-time"
  );
  const [status, setStatus] = useState<CreditPlanStatus>(
    plan?.status || "Active"
  );
  const [visibility, setVisibility] = useState<CreditPlanVisibility>(
    plan?.visibility || "Public"
  );
  const [price, setPrice] = useState<number>(plan?.price ?? 9.99);
  const [currency] = useState<string>("USD");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Plan name is required.");
      return;
    }
    if (creditQuantity <= 0) {
      setError("Credit quantity must be greater than zero.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        name: name.trim(),
        description: description.trim(),
        creditQuantity,
        validityDays,
        planType,
        status,
        visibility,
        price,
        currency,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save credit plan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Plan Name */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#24213A]">
          Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Creator Plus"
          className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#24213A]">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief summary of plan benefits"
          className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
        />
      </div>

      {/* Row: Credits Included & Validity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Credits Included <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="10"
            step="50"
            value={creditQuantity}
            onChange={(e) => setCreditQuantity(parseInt(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Validity (Days) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="730"
            value={validityDays}
            onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
            required
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
          />
        </div>
      </div>

      {/* Row: Plan Type & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Plan Type
          </label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value as CreditPlanType)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] bg-white"
          >
            <option value="One-time">One-time</option>
            <option value="Recurring">Recurring</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Price (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
          />
        </div>
      </div>

      {/* Row: Status & Visibility */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CreditPlanStatus)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] bg-white"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#24213A]">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as CreditPlanVisibility)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE4EE] text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] bg-white"
          >
            <option value="Public">Public (Catalog)</option>
            <option value="Private">Private (Direct link)</option>
          </select>
        </div>
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
          {isSaving ? "Saving..." : plan ? "Save Changes" : "Create Plan"}
        </button>
      </div>
    </form>
  );
}

export function CreateEditPlanModal({
  isOpen,
  onClose,
  plan,
  onSave,
}: CreateEditPlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#EAE4EE] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Crown className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24213A]">
                {plan ? "Edit Credit Plan" : "Create Credit Plan"}
              </h3>
              <p className="text-xs text-[#777184]">
                Configure plan details, pricing and credit quota
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

        {/* Form keyed by plan ID */}
        <PlanForm
          key={plan ? plan.id : "new"}
          plan={plan}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
