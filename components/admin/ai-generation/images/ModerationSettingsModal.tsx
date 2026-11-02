"use client";

import React, { useState } from "react";
import { X, Settings, ShieldCheck, Save } from "lucide-react";
import type { AiImageModerationSettings } from "@/lib/ai-images";

interface ModerationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiImageModerationSettings;
  onSave: (settings: Partial<AiImageModerationSettings>) => Promise<boolean>;
}

export const ModerationSettingsModal: React.FC<ModerationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <ModerationSettingsForm
      key={JSON.stringify(settings)}
      initialSettings={settings}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

interface FormProps {
  initialSettings: AiImageModerationSettings;
  onClose: () => void;
  onSave: (settings: Partial<AiImageModerationSettings>) => Promise<boolean>;
}

const ModerationSettingsForm: React.FC<FormProps> = ({
  initialSettings,
  onClose,
  onSave,
}) => {
  const [autoApproveSafe, setAutoApproveSafe] = useState(
    initialSettings.autoApproveSafe ?? true
  );
  const [strictnessLevel, setStrictnessLevel] = useState<"high" | "standard" | "relaxed">(
    initialSettings.strictnessLevel || "standard"
  );
  const [flagNudity, setFlagNudity] = useState(initialSettings.flagNudity ?? true);
  const [flagHateSpeech, setFlagHateSpeech] = useState(
    initialSettings.flagHateSpeech ?? true
  );
  const [flagViolence, setFlagViolence] = useState(
    initialSettings.flagViolence ?? true
  );
  const [retentionDays, setRetentionDays] = useState(
    initialSettings.retentionDays || 90
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSave({
      autoApproveSafe,
      strictnessLevel,
      flagNudity,
      flagHateSpeech,
      flagViolence,
      retentionDays: Number(retentionDays) || 90,
    });
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid #EAE4EE",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FAF7F2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#E8DFF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7956C9",
              }}
            >
              <Settings size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#24213A",
                  margin: 0,
                }}
              >
                Moderation Settings
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "#777184",
                  margin: "2px 0 0 0",
                }}
              >
                Configure automated image safety screening and review policies
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#777184",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          {/* Auto-Approval Toggle */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <ShieldCheck size={20} style={{ color: "#7956C9", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#24213A", display: "block" }}>
                  Auto-Approve Safe Generations
                </span>
                <span style={{ fontSize: "11px", color: "#777184", lineHeight: "1.4", display: "block" }}>
                  Images passing all automated safety checks with confidence &gt; 95% are instantly published.
                </span>
              </div>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: "42px", height: "24px", flexShrink: 0, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={autoApproveSafe}
                onChange={(e) => setAutoApproveSafe(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: autoApproveSafe ? "#7956C9" : "#D1D5DB",
                  borderRadius: "24px",
                  transition: "0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "18px",
                    width: "18px",
                    left: autoApproveSafe ? "21px" : "3px",
                    bottom: "3px",
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    transition: "0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </span>
            </label>
          </div>

          {/* Strictness Level */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#24213A",
                marginBottom: "6px",
              }}
            >
              Safety Strictness Level
            </label>
            <select
              value={strictnessLevel}
              onChange={(e) =>
                setStrictnessLevel(e.target.value as "high" | "standard" | "relaxed")
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "#ffffff",
                outline: "none",
              }}
            >
              <option value="high">High — Maximum safety; flags any borderline content</option>
              <option value="standard">Standard (Recommended) — Balanced screening</option>
              <option value="relaxed">Relaxed — Minimal filtering for creative agency prompts</option>
            </select>
          </div>

          {/* Category Filters */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#24213A",
                marginBottom: "8px",
              }}
            >
              Active Detection Filters
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                backgroundColor: "#F9FAFB",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #EAE4EE",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#24213A",
                  cursor: "pointer",
                }}
              >
                <span>Explicit Adult Content &amp; Nudity</span>
                <input
                  type="checkbox"
                  checked={flagNudity}
                  onChange={(e) => setFlagNudity(e.target.checked)}
                  style={{ accentColor: "#7956C9", width: "16px", height: "16px" }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#24213A",
                  cursor: "pointer",
                }}
              >
                <span>Hate Speech, Symbols &amp; Harassment</span>
                <input
                  type="checkbox"
                  checked={flagHateSpeech}
                  onChange={(e) => setFlagHateSpeech(e.target.checked)}
                  style={{ accentColor: "#7956C9", width: "16px", height: "16px" }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#24213A",
                  cursor: "pointer",
                }}
              >
                <span>Gore, Physical Violence &amp; Dangerous Activity</span>
                <input
                  type="checkbox"
                  checked={flagViolence}
                  onChange={(e) => setFlagViolence(e.target.checked)}
                  style={{ accentColor: "#7956C9", width: "16px", height: "16px" }}
                />
              </label>
            </div>
          </div>

          {/* Retention Period */}
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#24213A",
                marginBottom: "6px",
              }}
            >
              Moderation History Retention (Days)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="number"
                min="7"
                max="365"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                style={{
                  width: "120px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: "12px", color: "#777184" }}>
                Keep audit log and rejected image reviews for {retentionDays} days.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#ffffff",
                color: "#777184",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#7956C9",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
              }}
            >
              <Save size={14} />
              <span>{isSubmitting ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

