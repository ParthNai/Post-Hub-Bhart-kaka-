"use client";

import React from "react";
import { Settings, Info, ChevronDown } from "lucide-react";
import type { GlobalModerationSettings } from "@/lib/ai-moderation";

interface GlobalSettingsCardProps {
  settings: GlobalModerationSettings;
  onChange: (updates: Partial<GlobalModerationSettings>) => void;
}

export function GlobalSettingsCard({
  settings,
  onChange,
}: GlobalSettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-6">
      {/* Card Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <Settings className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Global Moderation Settings
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            Configure overall moderation behavior and defaults.
          </p>
        </div>
      </div>

      {/* Grid: Left Column (Toggles) + Right Column (Selects & Version) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Left Column: 3 Toggles */}
        <div className="space-y-4">
          {/* Toggle 1: Enable Moderation Workflow */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#24213A]">
                  Enable Moderation Workflow
                </span>
                <span
                  title="Turns on or off automated and manual moderation checks for new image generations."
                  className="cursor-help"
                >
                  <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableModerationWorkflow}
                onChange={(e) =>
                  onChange({ enableModerationWorkflow: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
            </label>
          </div>

          {/* Toggle 2: Automatic Moderation Availability */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#24213A]">
                  Automatic Moderation Availability
                </span>
                <span
                  title="Enables automatic Vision AI and content classifier scans prior to manual queues."
                  className="cursor-help"
                >
                  <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.automaticModerationAvailability}
                onChange={(e) =>
                  onChange({ automaticModerationAvailability: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
            </label>
          </div>

          {/* Toggle 3: Manual Review Requirement */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF7F2]/60 border border-[#EAE4EE]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#24213A]">
                  Manual Review Requirement
                </span>
                <span
                  title="Mandates human moderator approval for flagged or borderline policy matches."
                  className="cursor-help"
                >
                  <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.manualReviewRequirement}
                onChange={(e) =>
                  onChange({ manualReviewRequirement: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
            </label>
          </div>
        </div>

        {/* Right Column: 2 Dropdowns & Version */}
        <div className="space-y-4">
          {/* Dropdown 1: Default Moderation Behavior */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-[#24213A]">
                Default Moderation Behavior
              </label>
              <span
                title="Action executed when no specific category or custom rule is triggered."
                className="cursor-help"
              >
                <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
              </span>
            </div>
            <div className="relative">
              <select
                value={settings.defaultModerationBehavior}
                onChange={(e) =>
                  onChange({
                    defaultModerationBehavior: e.target
                      .value as GlobalModerationSettings["defaultModerationBehavior"],
                  })
                }
                className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
              >
                <option value="Flag for Review">Flag for Review</option>
                <option value="Allow">Allow</option>
                <option value="Reject">Reject</option>
                <option value="Escalate to Manual Review">
                  Escalate to Manual Review
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: Unknown Result Handling */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-[#24213A]">
                Unknown Result Handling
              </label>
              <span
                title="Routing logic for inconclusive, unclassified or ambiguous generation scores."
                className="cursor-help"
              >
                <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
              </span>
            </div>
            <div className="relative">
              <select
                value={settings.unknownResultHandling}
                onChange={(e) =>
                  onChange({
                    unknownResultHandling: e.target
                      .value as GlobalModerationSettings["unknownResultHandling"],
                  })
                }
                className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
              >
                <option value="Treat as Suspicious">Treat as Suspicious</option>
                <option value="Flag for Review">Flag for Review</option>
                <option value="Reject">Reject</option>
                <option value="Allow with Warning">Allow with Warning</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Input: Policy Version */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-[#24213A]">
                Policy Version
              </label>
              <span
                title="Current active policy semver revision identifier."
                className="cursor-help"
              >
                <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
              </span>
            </div>
            <input
              type="text"
              readOnly
              value={settings.policyVersion}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#524D63] font-mono font-semibold cursor-not-allowed select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
