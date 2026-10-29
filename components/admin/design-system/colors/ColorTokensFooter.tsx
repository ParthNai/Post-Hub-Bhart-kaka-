"use client";

import React from "react";
import { Info, Bookmark, Loader2 } from "lucide-react";

interface ColorTokensFooterProps {
  isDirty: boolean;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ColorTokensFooter: React.FC<ColorTokensFooterProps> = ({
  isDirty,
  onDiscard,
  onSave,
  isSaving,
}) => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px 10px 4px",
        marginTop: "16px",
        fontSize: "12.5px",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {/* Left: Unsaved changes pill */}
      <div>
        {isDirty ? (
          <span
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "6px",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
            }}
          >
            Unsaved changes
          </span>
        ) : (
          <span style={{ color: "var(--text-muted, #777184)", fontSize: "12px" }}>
            All draft changes persisted.
          </span>
        )}
      </div>

      {/* Right: Disclaimer and Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted, #777184)",
            fontSize: "12px",
          }}
        >
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Changes affect supported components only. Live updates require publishing and app integration.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isDirty && (
            <button
              type="button"
              onClick={onDiscard}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Discard Changes
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
            }}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
            <span>Save Draft</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
