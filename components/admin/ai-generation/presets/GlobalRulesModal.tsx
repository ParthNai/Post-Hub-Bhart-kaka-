"use client";

import React, { useState } from "react";
import { X, Settings, Check, AlertCircle } from "lucide-react";
import type { AiGlobalPromptRules } from "@/lib/ai-presets";

interface GlobalRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: AiGlobalPromptRules;
  onSave: (rules: Partial<AiGlobalPromptRules>) => Promise<boolean>;
}

export function GlobalRulesModal({
  isOpen,
  onClose,
  rules,
  onSave,
}: GlobalRulesModalProps) {
  if (!isOpen) return null;

  return (
    <GlobalRulesFormContent
      key={rules.updatedAt}
      onClose={onClose}
      rules={rules}
      onSave={onSave}
    />
  );
}

interface GlobalRulesFormContentProps {
  onClose: () => void;
  rules: AiGlobalPromptRules;
  onSave: (rules: Partial<AiGlobalPromptRules>) => Promise<boolean>;
}

function GlobalRulesFormContent({
  onClose,
  rules,
  onSave,
}: GlobalRulesFormContentProps) {
  const [basePrompt, setBasePrompt] = useState(rules.basePromptInstructions);
  const [designStyle, setDesignStyle] = useState(rules.designStyleInstructions);
  const [typography, setTypography] = useState(rules.typographyGuidance);
  const [colorGuidance, setColorGuidance] = useState(rules.colorGuidance);
  const [layoutGuidance, setLayoutGuidance] = useState(rules.layoutGuidance || "");
  const [negativePrompts, setNegativePrompts] = useState(rules.negativePrompts || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onSave({
        basePromptInstructions: basePrompt,
        designStyleInstructions: designStyle,
        typographyGuidance: typography,
        colorGuidance: colorGuidance,
        layoutGuidance,
        negativePrompts,
      });
      if (ok) {
        onClose();
      } else {
        setError("Failed to save rules. Please verify values.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving rules";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Global Prompt Rules & Governance
              </h3>
              <p className="text-xs text-[#777184]">
                Applied across all AI poster generation prompts system-wide.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Base Instructions */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Base Prompt Instructions *
            </label>
            <textarea
              rows={3}
              required
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] leading-relaxed resize-none"
            />
          </div>

          {/* Design Style */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Design Style Instructions
            </label>
            <input
              type="text"
              value={designStyle}
              onChange={(e) => setDesignStyle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Typography */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Typography Guidance
            </label>
            <input
              type="text"
              value={typography}
              onChange={(e) => setTypography(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Color Guidance */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Color Guidance
            </label>
            <input
              type="text"
              value={colorGuidance}
              onChange={(e) => setColorGuidance(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Layout Guidance */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Layout & Composition Guidance
            </label>
            <input
              type="text"
              value={layoutGuidance}
              onChange={(e) => setLayoutGuidance(e.target.value)}
              placeholder="e.g. Ensure clear visual hierarchy and mobile focus points"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Negative Prompts */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Negative Prompts Filter (Forbidden Artifacts)
            </label>
            <input
              type="text"
              value={negativePrompts}
              onChange={(e) => setNegativePrompts(e.target.value)}
              placeholder="e.g. blurry, distorted text, low quality, watermarks"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Metadata info */}
          <div className="pt-2 text-[11px] text-[#777184] flex items-center justify-between">
            <span>Last Updated: {rules.updatedAt}</span>
            <span>By: {rules.updatedBy}</span>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save Global Rules"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
