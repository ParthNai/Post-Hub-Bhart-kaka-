"use client";

import React, { useState } from "react";
import { X, Image as ImageIcon, Minus, Plus } from "lucide-react";
import { RoutingRule } from "@/lib/ai-failover";
import { ProviderIcon } from "../health/ProviderLogos";

interface EditRoutingRuleDrawerProps {
  rule: RoutingRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (updated: Partial<RoutingRule>) => Promise<boolean>;
}

interface InnerFormProps {
  rule: RoutingRule;
  onClose: () => void;
  onSaveRule: (updated: Partial<RoutingRule>) => Promise<boolean>;
}

const EditRoutingRuleForm: React.FC<InnerFormProps> = ({
  rule,
  onClose,
  onSaveRule,
}) => {
  const [activeTab, setActiveTab] = useState<"Rule Details" | "Advanced Settings">("Rule Details");

  // Form state initialized directly from rule prop
  const [ruleName, setRuleName] = useState(rule.ruleName);
  const [requestType, setRequestType] = useState<"Image" | "Text" | "Multimodal">(rule.requestType);
  const [modelRequirement, setModelRequirement] = useState(rule.modelRequirement);
  const [preferredProvider, setPreferredProvider] = useState(rule.preferredProvider);
  const [preferredModel, setPreferredModel] = useState(rule.preferredModel);
  const [fallbackProvider, setFallbackProvider] = useState(rule.fallbackProvider || "Stability AI");
  const [fallbackModel, setFallbackModel] = useState(rule.fallbackModel || "Stable Diffusion XL");
  const [healthRequirement, setHealthRequirement] = useState(rule.healthRequirement || "Healthy (>= 90%)");
  const [maxAttempts, setMaxAttempts] = useState(rule.maxAttempts || 3);
  const [rulePriority, setRulePriority] = useState(rule.priority || 1);
  const [enabled, setEnabled] = useState(rule.enabled);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      setErrorMsg("Rule Name is required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const ok = await onSaveRule({
        id: rule.id,
        ruleName,
        requestType,
        modelRequirement,
        preferredProvider,
        preferredProviderId: preferredProvider.toLowerCase().includes("openai")
          ? "openai"
          : preferredProvider.toLowerCase().includes("stability")
          ? "stability"
          : "gemini",
        preferredModel,
        fallbackProvider,
        fallbackModel,
        healthRequirement,
        maxAttempts,
        priority: rulePriority,
        enabled,
      });

      if (ok) {
        onClose();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save rule.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Sub-Tabs */}
      <div className="px-5 border-b border-[#EAE4EE] flex items-center gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("Rule Details")}
          className={`py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "Rule Details"
              ? "border-[#7956C9] text-[#7956C9] font-bold"
              : "border-transparent text-[#777184] hover:text-[#24213A]"
          }`}
        >
          Rule Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("Advanced Settings")}
          className={`py-2.5 border-b-2 transition-all cursor-pointer ${
            activeTab === "Advanced Settings"
              ? "border-[#7956C9] text-[#7956C9] font-bold"
              : "border-transparent text-[#777184] hover:text-[#24213A]"
          }`}
        >
          Advanced Settings
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {activeTab === "Rule Details" ? (
          <>
            {/* 1. Rule Name */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Rule Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9]"
                placeholder="Rule Name"
              />
            </div>

            {/* 2. Request Type */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Request Type <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as RoutingRule["requestType"])}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
                >
                  <option value="Image">Image</option>
                  <option value="Text">Text</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
                <ImageIcon className="w-3.5 h-3.5 text-[#777184] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Required Model Capability */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Required Model Capability
              </label>
              <select
                value={modelRequirement}
                onChange={(e) => setModelRequirement(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
              >
                <option value="DALL·E 3">DALL·E 3</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
                <option value="Imagen 3.0">Imagen 3.0</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            {/* 4. Preferred Provider */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Preferred Provider <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <select
                  value={preferredProvider}
                  onChange={(e) => setPreferredProvider(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
                >
                  <option value="OpenAI">OpenAI</option>
                  <option value="Stability AI">Stability AI</option>
                  <option value="Gemini">Gemini</option>
                </select>
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ProviderIcon providerId={preferredProvider.toLowerCase()} size={14} />
                </div>
              </div>
            </div>

            {/* 5. Preferred Model */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Preferred Model <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
              >
                <option value="GPT-4o">GPT-4o</option>
                <option value="DALL·E 3">DALL·E 3</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="Imagen 3.0">Imagen 3.0</option>
              </select>
            </div>

            {/* 6. Fallback Provider */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Fallback Provider
              </label>
              <div className="relative">
                <select
                  value={fallbackProvider}
                  onChange={(e) => setFallbackProvider(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
                >
                  <option value="Stability AI">Stability AI</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Gemini">Gemini</option>
                </select>
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ProviderIcon providerId={fallbackProvider.toLowerCase()} size={14} />
                </div>
              </div>
            </div>

            {/* 7. Fallback Model */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Fallback Model
              </label>
              <select
                value={fallbackModel}
                onChange={(e) => setFallbackModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
              >
                <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                <option value="DALL·E 2">DALL·E 2</option>
              </select>
            </div>

            {/* 8. Provider Health Requirement */}
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Provider Health Requirement
              </label>
              <select
                value={healthRequirement}
                onChange={(e) => setHealthRequirement(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
              >
                <option value="Healthy (>= 90%)">Healthy (&gt;= 90%)</option>
                <option value="Any Available">Any Available</option>
                <option value="Strict SLA">Strict SLA</option>
              </select>
            </div>

            {/* 9. Maximum Attempts Stepper */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#24213A]">
                Maximum Attempts
              </label>
              <div className="flex items-center border border-[#EAE4EE] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMaxAttempts((prev) => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 text-[#777184] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#24213A]">
                  {maxAttempts}
                </span>
                <button
                  type="button"
                  onClick={() => setMaxAttempts((prev) => Math.min(5, prev + 1))}
                  className="px-2.5 py-1 text-[#777184] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 10. Rule Priority Stepper */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#24213A]">
                Rule Priority
              </label>
              <div className="flex items-center border border-[#EAE4EE] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setRulePriority((prev) => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 text-[#777184] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#24213A]">
                  {rulePriority}
                </span>
                <button
                  type="button"
                  onClick={() => setRulePriority((prev) => Math.min(10, prev + 1))}
                  className="px-2.5 py-1 text-[#777184] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 11. Enable Rule Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#24213A]">
                Enable Rule
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
              </label>
            </div>
          </>
        ) : (
          /* Advanced Settings Tab */
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Fallback Cooldown (seconds)
              </label>
              <input
                type="number"
                defaultValue={30}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#24213A] block mb-1">
                Custom Error Match Expression
              </label>
              <input
                type="text"
                defaultValue="429|503|504|timeout"
                className="w-full px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A]"
              />
            </div>
            <p className="text-[11px] text-[#777184]">
              Advanced rules enforce deterministic failover order while preventing infinite retry loops.
            </p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE4EE]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Rule"}
          </button>
        </div>
      </form>
    </>
  );
};

export const EditRoutingRuleDrawer: React.FC<EditRoutingRuleDrawerProps> = ({
  rule,
  isOpen,
  onClose,
  onSaveRule,
}) => {
  if (!isOpen || !rule) return null;

  return (
    <div className="w-full lg:w-[380px] bg-white rounded-xl border border-[#EAE4EE] shadow-2xs flex flex-col shrink-0 overflow-hidden">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex items-center justify-between bg-white">
        <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
          Edit Routing Rule
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#777184] hover:text-[#24213A] p-1 rounded-md hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          title="Close editor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Render inner form keyed by rule.id so state automatically re-initializes on selection */}
      <EditRoutingRuleForm
        key={rule.id}
        rule={rule}
        onClose={onClose}
        onSaveRule={onSaveRule}
      />
    </div>
  );
};
