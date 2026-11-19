"use client";

import React from "react";
import { ListFilter, Plus, Edit2, Trash2 } from "lucide-react";
import type { AutomaticModerationRule, ModerationSeverity } from "@/lib/ai-moderation";

interface AutomaticRulesCardProps {
  rules: AutomaticModerationRule[];
  onToggleRule: (id: string) => void;
  onEditRule: (rule: AutomaticModerationRule) => void;
  onDeleteRule: (id: string) => void;
  onAddRule: () => void;
}

export function AutomaticRulesCard({
  rules,
  onToggleRule,
  onEditRule,
  onDeleteRule,
  onAddRule,
}: AutomaticRulesCardProps) {
  const renderSeverityBadge = (severity: ModerationSeverity) => {
    switch (severity) {
      case "High":
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-[#EF4444] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            Medium
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-[#10B981] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header + Add Rule button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <ListFilter className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24213A]">
              Automatic Moderation Rules
            </h2>
            <p className="text-xs text-[#777184] font-medium">
              Define rules to automatically handle specific content scenarios.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddRule}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-all shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto border border-[#EAE4EE] rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF7F2] text-[#777184] font-semibold border-b border-[#EAE4EE]">
              <th className="py-2.5 px-3.5">Rule Name</th>
              <th className="py-2.5 px-3.5">Trigger Condition</th>
              <th className="py-2.5 px-3.5">Detection Source</th>
              <th className="py-2.5 px-3.5">Severity</th>
              <th className="py-2.5 px-3.5">Resulting Action</th>
              <th className="py-2.5 px-3.5 text-center">Status</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {rules.map((rule) => (
              <tr
                key={rule.id}
                className="hover:bg-[#FAF7F2]/50 transition-colors text-[#24213A]"
              >
                <td className="py-2.5 px-3.5 font-bold">{rule.name}</td>
                <td className="py-2.5 px-3.5 text-[#524D63] font-medium">
                  {rule.triggerCondition}
                </td>
                <td className="py-2.5 px-3.5 text-[#524D63]">
                  {rule.detectionSource}
                </td>
                <td className="py-2.5 px-3.5">{renderSeverityBadge(rule.severity)}</td>
                <td className="py-2.5 px-3.5 font-semibold text-[#24213A]">
                  {rule.resultingAction}
                </td>
                <td className="py-2.5 px-3.5 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => onToggleRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#7956C9]"></div>
                  </label>
                </td>
                <td className="py-2.5 px-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => onEditRule(rule)}
                    className="p-1 text-[#777184] hover:text-[#7956C9] rounded hover:bg-[#FAF7F2] transition-colors"
                    title="Edit Rule"
                  >
                    <Edit2 className="w-3.5 h-3.5 inline" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 text-[#777184] hover:text-[#EF4444] rounded hover:bg-red-50 transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
