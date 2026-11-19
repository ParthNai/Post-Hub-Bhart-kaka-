"use client";

import React from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import type { UnknownErrorHandling } from "@/lib/ai-moderation";

interface UnknownErrorHandlingCardProps {
  config: UnknownErrorHandling;
  onChange: (updates: Partial<UnknownErrorHandling>) => void;
}

export function UnknownErrorHandlingCard({
  config,
  onChange,
}: UnknownErrorHandlingCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Unknown &amp; Error Handling
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            Configure fallback behavior for edge cases.
          </p>
        </div>
      </div>

      {/* 5 Dropdown Fields */}
      <div className="space-y-3 pt-1">
        {/* Field 1: Moderation Service Unavailable */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Moderation Service Unavailable
          </label>
          <div className="relative">
            <select
              value={config.serviceUnavailable}
              onChange={(e) =>
                onChange({
                  serviceUnavailable: e.target
                    .value as UnknownErrorHandling["serviceUnavailable"],
                })
              }
              className="w-full appearance-none px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-8 shadow-2xs"
            >
              <option value="Allow with Warning">Allow with Warning</option>
              <option value="Flag for Review">Flag for Review</option>
              <option value="Reject">Reject</option>
              <option value="Retry Then Reject">Retry Then Reject</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 2: Timeout */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Timeout
          </label>
          <div className="relative">
            <select
              value={config.timeout}
              onChange={(e) =>
                onChange({
                  timeout: e.target.value as UnknownErrorHandling["timeout"],
                })
              }
              className="w-full appearance-none px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-8 shadow-2xs"
            >
              <option value="Flag for Review">Flag for Review</option>
              <option value="Reject">Reject</option>
              <option value="Allow with Warning">Allow with Warning</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 3: Inconclusive Result */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Inconclusive Result
          </label>
          <div className="relative">
            <select
              value={config.inconclusiveResult}
              onChange={(e) =>
                onChange({
                  inconclusiveResult: e.target
                    .value as UnknownErrorHandling["inconclusiveResult"],
                })
              }
              className="w-full appearance-none px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-8 shadow-2xs"
            >
              <option value="Flag for Review">Flag for Review</option>
              <option value="Treat as Suspicious">Treat as Suspicious</option>
              <option value="Reject">Reject</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 4: Unsupported Format */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Unsupported Format
          </label>
          <div className="relative">
            <select
              value={config.unsupportedFormat}
              onChange={(e) =>
                onChange({
                  unsupportedFormat: e.target
                    .value as UnknownErrorHandling["unsupportedFormat"],
                })
              }
              className="w-full appearance-none px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-8 shadow-2xs"
            >
              <option value="Reject">Reject</option>
              <option value="Flag for Review">Flag for Review</option>
              <option value="Allow">Allow</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 5: Missing Response */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Missing Response
          </label>
          <div className="relative">
            <select
              value={config.missingResponse}
              onChange={(e) =>
                onChange({
                  missingResponse: e.target
                    .value as UnknownErrorHandling["missingResponse"],
                })
              }
              className="w-full appearance-none px-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-8 shadow-2xs"
            >
              <option value="Flag for Review">Flag for Review</option>
              <option value="Reject">Reject</option>
              <option value="Allow with Warning">Allow with Warning</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#777184] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
