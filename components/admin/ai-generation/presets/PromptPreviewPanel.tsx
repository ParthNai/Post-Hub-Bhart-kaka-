"use client";

import React, { useState } from "react";
import { Eye, ImageIcon, Sparkles, Copy, Check } from "lucide-react";
import type { AiPromptPreset, AiGlobalPromptRules } from "@/lib/ai-presets";
import { composeAiPrompt } from "@/lib/ai-presets";

interface PromptPreviewPanelProps {
  preset: AiPromptPreset | null;
  globalRules: AiGlobalPromptRules;
  onOpenSimulator?: (testPrompt: string) => void;
}

export function PromptPreviewPanel({
  preset,
  globalRules,
  onOpenSimulator,
}: PromptPreviewPanelProps) {
  const [testUserPrompt, setTestUserPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  // If no preset is selected, show the empty state matching the reference photo
  if (!preset) {
    return (
      <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Preview Panel</h3>
        </div>

        {/* Empty state matching reference photo */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-14 rounded-xl bg-[#F4F1F7] border border-[#EAE4EE] flex items-center justify-center text-[#B8B2C4] mb-3">
            <ImageIcon className="w-7 h-7 text-[#A19DAA]" />
          </div>
          <h4 className="text-sm font-bold text-[#24213A]">
            Select a preset to preview
          </h4>
          <p className="text-xs text-[#777184] mt-1 max-w-[240px]">
            See how your prompt rules work with this preset.
          </p>
        </div>
      </div>
    );
  }

  // When preset is selected, calculate composed prompt
  const effectiveUserPrompt =
    testUserPrompt.trim().length > 0
      ? testUserPrompt
      : `Poster for ${preset.name}`;

  const composition = composeAiPrompt(
    effectiveUserPrompt,
    preset,
    globalRules
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(composition.composedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#EAE4EE] rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#F2EEF6]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#7956C9]" />
          <h3 className="text-sm font-bold text-[#24213A]">Preview Panel</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#777184] bg-[#F4F1F7] px-2 py-0.5 rounded">
            ~{composition.estimatedTokens} tokens
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-medium text-[#7956C9] hover:text-[#6845B8] flex items-center gap-1 transition-colors"
            title="Copy composed prompt"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#16A34A]" />
                <span className="text-[#16A34A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1 py-2">
        {/* Test Prompt Input */}
        <div>
          <label className="block text-[11px] font-medium text-[#777184] mb-1">
            Test Subject Prompt
          </label>
          <input
            type="text"
            value={testUserPrompt}
            onChange={(e) => setTestUserPrompt(e.target.value)}
            placeholder={`e.g. Special offer for ${preset.name}...`}
            className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#A19DAA] focus:outline-none focus:border-[#7956C9]"
          />
        </div>

        {/* Live Composed Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[#777184]">
              Composed Prompt Preview
            </span>
          </div>
          <div className="p-2.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-[11px] text-[#24213A] leading-relaxed max-h-24 overflow-y-auto">
            {composition.composedPrompt}
          </div>
        </div>

        {/* Applied Rule Tags */}
        <div>
          <div className="text-[10px] text-[#777184] font-medium mb-1">
            Applied Rule Pipeline:
          </div>
          <div className="flex flex-wrap gap-1">
            {composition.appliedRules.map((rule, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#E8DFF5] text-[#7956C9] px-2 py-0.5 rounded-full"
              >
                ✓ {rule}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Action */}
      {onOpenSimulator && (
        <div className="pt-2 border-t border-[#F2EEF6]">
          <button
            type="button"
            onClick={() => onOpenSimulator(composition.composedPrompt)}
            className="w-full py-1.5 bg-[#E8DFF5]/60 hover:bg-[#E8DFF5] text-[#7956C9] font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Simulate Generation</span>
          </button>
        </div>
      )}
    </div>
  );
}
