"use client";

import React from "react";
import { UserCheck, Info, ChevronDown } from "lucide-react";
import type { ManualReviewConfiguration } from "@/lib/ai-moderation";

interface ManualReviewCardProps {
  config: ManualReviewConfiguration;
  onChange: (updates: Partial<ManualReviewConfiguration>) => void;
}

export function ManualReviewCard({ config, onChange }: ManualReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
          <UserCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24213A]">
            Manual Review Configuration
          </h2>
          <p className="text-xs text-[#777184] font-medium">
            Configure when and how to review content.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3.5 pt-1">
        {/* Review-Required Conditions */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Review-Required Conditions
          </label>
          <div className="relative">
            <select
              value={config.reviewRequiredConditions}
              onChange={(e) =>
                onChange({
                  reviewRequiredConditions: e.target
                    .value as ManualReviewConfiguration["reviewRequiredConditions"],
                })
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
            >
              <option value="On Policy Violation or Uncertain Result">
                On Policy Violation or Uncertain Result
              </option>
              <option value="All Flagged Content">All Flagged Content</option>
              <option value="Random Sample 10%">Random Sample 10%</option>
              <option value="Always">Always</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Reviewer Role */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Reviewer Role
          </label>
          <div className="relative">
            <select
              value={config.reviewerRole}
              onChange={(e) =>
                onChange({
                  reviewerRole: e.target
                    .value as ManualReviewConfiguration["reviewerRole"],
                })
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
            >
              <option value="Content Moderator">Content Moderator</option>
              <option value="Senior Administrator">Senior Administrator</option>
              <option value="Compliance Officer">Compliance Officer</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Review Priority */}
        <div>
          <label className="block text-xs font-semibold text-[#24213A] mb-1">
            Review Priority
          </label>
          <div className="relative">
            <select
              value={config.reviewPriority}
              onChange={(e) =>
                onChange({
                  reviewPriority: e.target
                    .value as ManualReviewConfiguration["reviewPriority"],
                })
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
            >
              <option value="High for Harmful Content">
                High for Harmful Content
              </option>
              <option value="Standard FIFO">Standard FIFO</option>
              <option value="High for Enterprise Users">
                High for Enterprise Users
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Escalation Rules */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <label className="text-xs font-semibold text-[#24213A]">
              Escalation Rules
            </label>
            <span
              title="Automatically bumps queue priority to compliance supervisors if unreviewed."
              className="cursor-help"
            >
              <Info className="w-3.5 h-3.5 text-[#B8B2C4] hover:text-[#7956C9] transition-colors" />
            </span>
          </div>
          <div className="relative">
            <select
              value={config.escalationRules}
              onChange={(e) =>
                onChange({
                  escalationRules: e.target
                    .value as ManualReviewConfiguration["escalationRules"],
                })
              }
              className="w-full appearance-none px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] transition-colors pr-9 shadow-2xs"
            >
              <option value="After 24 Hours">After 24 Hours</option>
              <option value="After 12 Hours">After 12 Hours</option>
              <option value="After 48 Hours">After 48 Hours</option>
              <option value="Immediate for Critical">Immediate for Critical</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#777184] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Review Decision Required Toggle */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <label className="text-xs font-semibold text-[#24213A]">
            Review Decision Required
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.reviewDecisionRequired}
              onChange={(e) =>
                onChange({ reviewDecisionRequired: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
