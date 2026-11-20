"use client";

import React from "react";
import {
  GitBranch,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { ProviderIcon } from "../health/ProviderLogos";

export const FallbackWorkflowCard: React.FC = () => {
  const steps = [
    {
      id: "step-1",
      title: "Generation Request",
      icon: <Sparkles className="w-5 h-5 text-[#7956C9]" />,
      bg: "bg-white",
      border: "border-[#EAE4EE]",
    },
    {
      id: "step-2",
      title: "Primary Provider",
      subtitle: "(OpenAI)",
      icon: <ProviderIcon providerId="openai" size={20} />,
      bg: "bg-white",
      border: "border-[#EAE4EE]",
    },
    {
      id: "step-3",
      title: "Health / Eligibility Check",
      icon: <ShieldCheck className="w-5 h-5 text-[#7956C9]" />,
      bg: "bg-white",
      border: "border-[#EAE4EE]",
    },
    {
      id: "step-4",
      title: "Fallback Provider",
      subtitle: "(Stability AI)",
      icon: <ProviderIcon providerId="stability" size={20} />,
      bg: "bg-white",
      border: "border-[#EAE4EE]",
    },
    {
      id: "step-5",
      title: "Second Fallback",
      subtitle: "(Gemini)",
      icon: <ProviderIcon providerId="gemini" size={20} />,
      bg: "bg-white",
      border: "border-[#EAE4EE]",
    },
    {
      id: "step-6",
      title: "Final Result",
      icon: <CheckCircle2 className="w-6 h-6 text-white" />,
      bg: "bg-[#7956C9]/10",
      border: "border-[#7956C9]/30",
      isFinal: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs mb-6 p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <GitBranch className="w-4 h-4 text-[#7956C9]" />
        <h2 className="text-sm font-bold text-[#24213A] tracking-tight">
          Fallback Workflow
        </h2>
      </div>

      {/* Horizontal Pipeline Chain */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[760px] justify-between gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* Box */}
              <div
                className={`flex-1 min-w-[110px] max-w-[135px] rounded-xl border ${step.border} ${step.bg} p-3.5 flex flex-col items-center text-center justify-center min-h-[92px] shadow-2xs transition-all hover:shadow-xs`}
              >
                <div className="mb-2 flex items-center justify-center">
                  {step.isFinal ? (
                    <div className="w-7 h-7 rounded-full bg-[#7956C9] flex items-center justify-center shadow-2xs">
                      {step.icon}
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-[11px] font-bold text-[#24213A] leading-tight">
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="text-[10px] text-[#777184] font-medium mt-0.5">
                    {step.subtitle}
                  </span>
                )}
              </div>

              {/* Connecting Arrow */}
              {idx < steps.length - 1 && (
                <div className="text-[#7956C9] shrink-0 px-1 opacity-75">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer Notes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5 mt-3 border-t border-[#EAE4EE] text-xs">
        <div className="flex items-center gap-1.5 text-[#7956C9]">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            Fallback will be triggered only if the primary provider is unavailable, times out or returns an error.
          </span>
        </div>
        <div className="text-[#777184] font-semibold text-[11px] shrink-0">
          Max Attempts: 3 | Retry: 30 sec
        </div>
      </div>
    </div>
  );
};
