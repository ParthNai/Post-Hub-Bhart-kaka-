"use client";

import React, { useState } from "react";
import { X, Play, CheckCircle2, AlertCircle, XCircle, ShieldCheck } from "lucide-react";
import { evaluatePolicyRules, ModerationCategory, AutomaticModerationRule } from "@/lib/ai-moderation";

interface RulePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
}

export function RulePreviewModal({
  isOpen,
  onClose,
  categories,
  rules,
}: RulePreviewModalProps) {
  const [testPrompt, setTestPrompt] = useState(
    "Diwali celebration poster with decorative oil lamps, warm golden light and festive greetings"
  );
  const [evaluation, setEvaluation] = useState<ReturnType<
    typeof evaluatePolicyRules
  > | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;
    const result = evaluatePolicyRules(testPrompt, categories, rules);
    setEvaluation(result);
  };

  const samplePrompts = [
    {
      label: "Safe Festive Poster",
      prompt: "Diwali celebration poster with decorative oil lamps, warm golden light and festive greetings",
    },
    {
      label: "Violent Content Trigger",
      prompt: "Poster of action warriors with weapons, battlefield blood and explosive warfare",
    },
    {
      label: "Explicit Content Trigger",
      prompt: "Adult glamour model photo with explicit nude styling and suggestive background",
    },
    {
      label: "Copyright Brand Trigger",
      prompt: "Modern sneaker advertisement featuring Nike swoosh logo and branded headline",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#7956C9]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Rule Flow Simulator &amp; Policy Preview
              </h3>
              <p className="text-xs text-[#777184] font-medium">
                Test prompts and analyze active policy decision paths
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-semibold text-[#777184] block mb-1.5 uppercase tracking-wider">
              Quick Test Examples
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setTestPrompt(s.prompt);
                    const res = evaluatePolicyRules(s.prompt, categories, rules);
                    setEvaluation(res);
                  }}
                  className="text-xs bg-[#FAF7F2] hover:bg-[#E8DFF5]/60 text-[#24213A] border border-[#EAE4EE] px-2.5 py-1 rounded-lg transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEvaluate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Prompt / Content Text
              </label>
              <textarea
                rows={3}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter prompt description to simulate policy evaluation..."
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Policy Evaluation</span>
            </button>
          </form>

          {/* Result Card */}
          {evaluation && (
            <div className="p-4 rounded-xl border border-[#EAE4EE] bg-[#FAF7F2] space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#777184]">
                  Simulated Outcome:
                </span>
                {evaluation.decision === "Approved" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    Approved for Publishing
                  </span>
                )}
                {evaluation.decision === "Manual Review" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    Routed to Manual Review
                  </span>
                )}
                {evaluation.decision === "Rejected" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EF4444] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4" />
                    Rejected by Policy
                  </span>
                )}
              </div>

              {/* Matched Rules */}
              <div>
                <span className="text-[11px] font-bold text-[#24213A] block mb-1">
                  Triggered Rules:
                </span>
                {evaluation.matchedRules.length === 0 ? (
                  <p className="text-xs text-[#10B981] font-medium">
                    ✓ No policy violations or risk triggers found. Safe for instant publishing.
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs">
                    {evaluation.matchedRules.map((r, i) => (
                      <li
                        key={r.id}
                        className="p-2 rounded-lg bg-white border border-[#EAE4EE] flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-[#24213A]">{r.name}</strong>
                          <span className="text-[11px] text-[#777184] block">
                            {evaluation.reasons[i] || r.triggerCondition}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-[#524D63]">
                          Action: {r.resultingAction}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#EAE4EE] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#F2EDF7] text-[#24213A] text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
