"use client";

import React, { useState } from "react";
import { Edit3, Check, Save, RotateCcw } from "lucide-react";
import type { AiGlobalPromptRules } from "@/lib/ai-presets";

interface PromptRulesEditorCardProps {
  initialRules: AiGlobalPromptRules;
  onSaveRules: (rules: Partial<AiGlobalPromptRules>) => Promise<boolean>;
  onResetToDefaults?: () => void;
}

export function PromptRulesEditorCard({
  initialRules,
  onSaveRules,
  onResetToDefaults,
}: PromptRulesEditorCardProps) {
  return (
    <PromptRulesForm
      key={initialRules.updatedAt}
      initialRules={initialRules}
      onSaveRules={onSaveRules}
      onResetToDefaults={onResetToDefaults}
    />
  );
}

interface PromptRulesFormProps {
  initialRules: AiGlobalPromptRules;
  onSaveRules: (rules: Partial<AiGlobalPromptRules>) => Promise<boolean>;
  onResetToDefaults?: () => void;
}

function PromptRulesForm({
  initialRules,
  onSaveRules,
  onResetToDefaults,
}: PromptRulesFormProps) {
  const [basePrompt, setBasePrompt] = useState(initialRules.basePromptInstructions);
  const [designStyle, setDesignStyle] = useState(initialRules.designStyleInstructions);
  const [typography, setTypography] = useState(initialRules.typographyGuidance);
  const [colorGuidance, setColorGuidance] = useState(initialRules.colorGuidance);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    val: string
  ) => {
    setter(val);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await onSaveRules({
      basePromptInstructions: basePrompt,
      designStyleInstructions: designStyle,
      typographyGuidance: typography,
      colorGuidance: colorGuidance,
    });
    setIsSaving(false);
    if (ok) {
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F2EEF6]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#7956C9]" />
            <h2 className="text-sm font-bold text-[#24213A]">
              Prompt Rules Editor
            </h2>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* 1. Base Prompt Instructions */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
            Base Prompt Instructions
          </label>
          <textarea
            rows={3}
            value={basePrompt}
            onChange={(e) => handleChange(setBasePrompt, e.target.value)}
            className="w-full p-2.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9] leading-relaxed resize-none"
            placeholder="Enter global base prompt instructions..."
          />
        </div>

        {/* 2. Design Style Instructions */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
            Design Style Instructions
          </label>
          <input
            type="text"
            value={designStyle}
            onChange={(e) => handleChange(setDesignStyle, e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
            placeholder="e.g. Use a clean and premium design style."
          />
        </div>

        {/* 3. Typography Guidance */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
            Typography Guidance
          </label>
          <input
            type="text"
            value={typography}
            onChange={(e) => handleChange(setTypography, e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
            placeholder="e.g. Use clear and bold fonts, modern and readable."
          />
        </div>

        {/* 4. Color Guidance */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
            Color Guidance
          </label>
          <input
            type="text"
            value={colorGuidance}
            onChange={(e) => handleChange(setColorGuidance, e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
            placeholder="e.g. Use brand colors: purple, white and elegant tones."
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-4 border-t border-[#F2EEF6] flex items-center justify-between">
        {onResetToDefaults && (
          <button
            type="button"
            onClick={onResetToDefaults}
            className="inline-flex items-center gap-1 text-[11px] text-[#777184] hover:text-[#24213A] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            hasChanges
              ? "bg-[#7956C9] hover:bg-[#6845B8] text-white shadow-xs cursor-pointer"
              : "bg-[#EAE4EE] text-[#777184] cursor-not-allowed opacity-70"
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Rules"}</span>
        </button>
      </div>
    </div>
  );
}
