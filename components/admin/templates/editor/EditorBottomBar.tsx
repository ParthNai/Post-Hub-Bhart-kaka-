"use client";

import React from "react";
import { RotateCcw, Bookmark, UploadCloud, Loader2 } from "lucide-react";

interface EditorBottomBarProps {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  isDirty,
  isSaving,
  isPublishing,
  onCancel,
  onDiscard,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid var(--border, #EAE4EE)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        zIndex: 30,
        boxShadow: "0 -4px 16px rgba(36, 33, 58, 0.04)",
        marginTop: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Left: Unsaved Changes Status Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isDirty ? "#F59E0B" : "#10B981",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "12.5px",
            fontWeight: 500,
            color: isDirty ? "#B45309" : "var(--text-muted, #777184)",
          }}
        >
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || isPublishing}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: "var(--text, #24213A)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          Cancel
        </button>

        {/* Discard Changes */}
        <button
          type="button"
          onClick={onDiscard}
          disabled={!isDirty || isSaving || isPublishing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: !isDirty ? "#A09BAA" : "var(--text, #24213A)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: !isDirty ? "not-allowed" : "pointer",
            opacity: !isDirty ? 0.65 : 1,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (isDirty) e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          <RotateCcw size={13} />
          <span>Discard Changes</span>
        </button>

        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={!isDirty || isSaving || isPublishing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 18px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: !isDirty ? "#A09BAA" : "var(--text, #24213A)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
            opacity: !isDirty ? 0.65 : 1,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (isDirty) {
              e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
              e.currentTarget.style.borderColor = "var(--primary-light, #D2C4ED)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
          }}
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Bookmark size={13} />}
          <span>Save Draft</span>
        </button>

        {/* Publish Changes */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isSaving || isPublishing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isPublishing ? "not-allowed" : "pointer",
            boxShadow: "0 1px 3px rgba(121, 86, 201, 0.25)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover, #6846B5)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary, #7956C9)")}
        >
          {isPublishing ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={14} />}
          <span>Publish Changes</span>
        </button>
      </div>
    </div>
  );
};
