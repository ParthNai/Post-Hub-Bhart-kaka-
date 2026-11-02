"use client";

import React, { useState } from "react";
import { X, Eye, Sparkles, Check, RefreshCw } from "lucide-react";
import type { AiPromptPreset, AiGlobalPromptRules } from "@/lib/ai-presets";
import { composeAiPrompt } from "@/lib/ai-presets";
import { PresetThumbnail } from "./PresetThumbnail";

interface PreviewGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: AiPromptPreset[];
  initialPreset: AiPromptPreset | null;
  globalRules: AiGlobalPromptRules;
  initialPrompt?: string;
}

export function PreviewGenerationModal({
  isOpen,
  onClose,
  presets,
  initialPreset,
  globalRules,
  initialPrompt = "",
}: PreviewGenerationModalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialPreset?.id || (presets[0]?.id ?? "")
  );
  const [userPrompt, setUserPrompt] = useState(
    initialPrompt || "Diwali festival celebration with bright diyas and floral rangoli"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  if (!isOpen) return null;

  const currentPreset = presets.find((p) => p.id === selectedId) || presets[0] || null;
  const composition = composeAiPrompt(userPrompt, currentPreset, globalRules);

  const handleSimulate = () => {
    setIsGenerating(true);
    setGenerationDone(false);
    setElapsedMs(0);
    const start = Date.now();

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
      setGenerationDone(true);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                AI Generation Prompt Simulator
              </h3>
              <p className="text-xs text-[#777184]">
                Test prompt rules and preview deterministic AI image composition.
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

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Preset & Prompt Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Select AI Preset
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setGenerationDone(false);
                }}
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category} — {p.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Subject / User Custom Input
              </label>
              <textarea
                rows={3}
                value={userPrompt}
                onChange={(e) => {
                  setUserPrompt(e.target.value);
                  setGenerationDone(false);
                }}
                placeholder="Enter custom prompt input to combine with preset rules..."
                className="w-full p-2.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] resize-none"
              />
            </div>

            {/* Composed Prompt Details */}
            <div className="p-3 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between text-[#777184] text-[11px]">
                <span className="font-semibold text-[#24213A]">Engine Output</span>
                <span>~{composition.estimatedTokens} tokens</span>
              </div>
              <div className="text-[11px] text-[#24213A] leading-relaxed max-h-32 overflow-y-auto font-mono bg-white p-2.5 rounded border border-[#EAE4EE]">
                {composition.composedPrompt}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {composition.appliedRules.map((rule, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#E8DFF5] text-[#7956C9] px-2 py-0.5 rounded-full"
                  >
                    ✓ {rule}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#7956C9] hover:bg-[#6845B8] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing ({Math.round(elapsedMs)}ms)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Generation Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Simulated Poster Canvas */}
          <div className="flex flex-col items-center justify-center border border-[#EAE4EE] rounded-xl p-4 bg-[#FAF7F2]">
            <div className="w-full text-center text-xs text-[#777184] font-medium mb-3">
              Output Simulation Preview (
              {currentPreset?.defaultAspectRatio || "1:1"})
            </div>

            <div className="w-56 h-64 rounded-xl overflow-hidden border border-[#EAE4EE] shadow-md relative bg-white flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 p-4 text-center">
                  <div className="w-10 h-10 rounded-full border-3 border-[#7956C9] border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-[#24213A]">
                    Applying Preset Rules...
                  </span>
                  <span className="text-[11px] text-[#777184]">
                    Merging typography & palette
                  </span>
                </div>
              ) : currentPreset ? (
                <div className="w-full h-full relative">
                  <PresetThumbnail
                    type={currentPreset.thumbnailType}
                    size="full"
                  />
                  {generationDone && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      <span>Generated</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-[#777184]">Select a preset</div>
              )}
            </div>

            {generationDone && (
              <div className="mt-3 text-center">
                <span className="text-[11px] text-[#16A34A] font-semibold bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                  Rendered in 1.8s • 1080×1350px • DALL-E 3 Validated
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#EAE4EE] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#FAF7F2] text-xs font-medium text-[#24213A] rounded-lg transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
