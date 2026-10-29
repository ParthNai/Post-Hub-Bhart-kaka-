"use client";

import React from "react";
import { Database, Cloud, RotateCcw, Bookmark, Loader2 } from "lucide-react";

interface SettingsFooterProps {
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export const SettingsFooter: React.FC<SettingsFooterProps> = ({
  onCancel,
  onReset,
  onSave,
  isSaving,
  isDirty,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 20px",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--border, #EAE4EE)",
        fontSize: "12px",
        color: "var(--text-muted, #777184)",
        marginTop: "16px",
      }}
    >
      {/* Left status info */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={14} style={{ color: "var(--primary, #7956C9)" }} />
          <span>
            History source:{" "}
            <strong style={{ color: "var(--text, #24213A)" }}>Not configured</strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Cloud size={14} style={{ color: "var(--primary, #7956C9)" }} />
          <span>
            Latest confirmed publication:{" "}
            <strong style={{ color: "var(--text, #24213A)" }}>Not available</strong>
          </span>
        </div>
      </div>

      {/* Right action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={!isDirty || isSaving}
          style={{
            padding: "8px 16px",
            fontSize: "12.5px",
            fontWeight: 600,
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
            opacity: !isDirty || isSaving ? 0.6 : 1,
            transition: "all 0.15s ease",
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isSaving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            fontSize: "12.5px",
            fontWeight: 600,
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <RotateCcw size={13} style={{ color: "#777184" }} />
          <span>Reset to defaults</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            fontSize: "12.5px",
            fontWeight: 600,
            borderRadius: "8px",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#FFFFFF",
            border: "none",
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1,
            boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
            transition: "all 0.15s ease",
          }}
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Bookmark size={13} />}
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </button>
      </div>
    </div>
  );
};
