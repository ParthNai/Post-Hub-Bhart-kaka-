"use client";

import React from "react";
import { Info, RotateCcw, Pause, Play, Save, Loader2 } from "lucide-react";

interface ConfigFooterBarProps {
  onDiscard: () => void;
  onToggleEnable: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isEnabled: boolean;
  hasUnsavedChanges: boolean;
}

export const ConfigFooterBar: React.FC<ConfigFooterBarProps> = ({
  onDiscard,
  onToggleEnable,
  onSave,
  isSaving = false,
  isEnabled,
  hasUnsavedChanges,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginTop: "8px",
      }}
    >
      {/* Left Info Box */}
      <div
        style={{
          flex: "1 1 360px",
          backgroundColor: "#F3EEFB",
          borderRadius: "10px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: "12.5px",
            color: "var(--foreground)",
            lineHeight: "1.4",
          }}
        >
          <strong>Note:</strong> Changes will take effect immediately after saving. Make sure to test the connection if you update your credentials or model.
        </span>
      </div>

      {/* Right Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Discard Changes */}
        <button
          type="button"
          onClick={onDiscard}
          disabled={!hasUnsavedChanges || isSaving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "var(--surface)",
            color: hasUnsavedChanges ? "var(--foreground)" : "var(--text-muted)",
            border: "1px solid var(--border)",
            cursor: hasUnsavedChanges && !isSaving ? "pointer" : "not-allowed",
            opacity: hasUnsavedChanges ? 1 : 0.6,
            transition: "all 0.15s ease",
          }}
        >
          <RotateCcw size={14} />
          <span>Discard Changes</span>
        </button>

        {/* Disable / Enable Provider */}
        <button
          type="button"
          onClick={onToggleEnable}
          disabled={isSaving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "var(--surface)",
            color: isEnabled ? "#DC2626" : "#137333",
            border: `1px solid ${isEnabled ? "#FCA5A5" : "#86EFAC"}`,
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {isEnabled ? <Pause size={14} /> : <Play size={14} />}
          <span>{isEnabled ? "Disable Provider" : "Enable Provider"}</span>
        </button>

        {/* Save Configuration */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            border: "none",
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
            transition: "all 0.15s ease",
          }}
        >
          {isSaving ? (
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Save size={14} />
          )}
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

