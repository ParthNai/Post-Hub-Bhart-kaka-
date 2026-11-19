"use client";

import React, { useState } from "react";
import { X, ListFilter, Save } from "lucide-react";
import type {
  AutomaticModerationRule,
  ModerationDetectionSource,
  ModerationSeverity,
  ModerationAction,
} from "@/lib/ai-moderation";

interface AddEditRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: AutomaticModerationRule | null;
  onSave: (ruleData: Omit<AutomaticModerationRule, "id">, ruleId?: string) => void;
}

export function AddEditRuleModal({
  isOpen,
  onClose,
  rule,
  onSave,
}: AddEditRuleModalProps) {
  if (!isOpen) return null;

  return (
    <RuleFormContent
      key={rule?.id || "new"}
      rule={rule}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function RuleFormContent({
  rule,
  onClose,
  onSave,
}: {
  rule: AutomaticModerationRule | null;
  onClose: () => void;
  onSave: (ruleData: Omit<AutomaticModerationRule, "id">, ruleId?: string) => void;
}) {
  const isEditing = Boolean(rule);
  const [name, setName] = useState(rule?.name || "");
  const [triggerCondition, setTriggerCondition] = useState(rule?.triggerCondition || "");
  const [detectionSource, setDetectionSource] = useState<ModerationDetectionSource>(
    rule?.detectionSource || "Vision AI"
  );
  const [severity, setSeverity] = useState<ModerationSeverity>(rule?.severity || "Medium");
  const [resultingAction, setResultingAction] = useState<ModerationAction>(
    rule?.resultingAction || "Flag for Review"
  );
  const [enabled, setEnabled] = useState(rule ? rule.enabled : true);
  const [description, setDescription] = useState(rule?.description || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Rule Name is required.");
      return;
    }
    if (!triggerCondition.trim()) {
      setError("Trigger Condition is required.");
      return;
    }

    onSave(
      {
        name: name.trim(),
        triggerCondition: triggerCondition.trim(),
        detectionSource,
        severity,
        resultingAction,
        enabled,
        description: description.trim(),
      },
      rule?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-[#7956C9]">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center">
              <ListFilter className="w-4 h-4 text-[#7956C9]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                {isEditing ? "Edit Moderation Rule" : "Add Moderation Rule"}
              </h3>
              <p className="text-xs text-[#777184] font-medium">
                {isEditing ? `Modifying ${rule?.name}` : "Create a new automatic policy rule"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Explicit Content Rule"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Trigger Condition *
            </label>
            <input
              type="text"
              value={triggerCondition}
              onChange={(e) => {
                setTriggerCondition(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Adult content detected"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Detection Source
              </label>
              <select
                value={detectionSource}
                onChange={(e) =>
                  setDetectionSource(e.target.value as ModerationDetectionSource)
                }
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                <option value="Vision AI">Vision AI</option>
                <option value="Vision AI + NLP">Vision AI + NLP</option>
                <option value="NLP / Text Filter">NLP / Text Filter</option>
                <option value="Hash Match / Blocklist">Hash Match / Blocklist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as ModerationSeverity)
                }
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Resulting Action
            </label>
            <select
              value={resultingAction}
              onChange={(e) =>
                setResultingAction(e.target.value as ModerationAction)
              }
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            >
              <option value="Reject">Reject</option>
              <option value="Flag for Review">Flag for Review</option>
              <option value="Allow">Allow</option>
              <option value="Escalate to Manual Review">Escalate to Manual Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of policy trigger..."
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-[#24213A]">
              Enable Rule Immediately
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#EAE4EE] hover:bg-[#FAF7F2] text-[#777184] text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? "Save Changes" : "Create Rule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
