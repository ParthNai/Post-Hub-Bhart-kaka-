"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, Bookmark, Loader2 } from "lucide-react";

interface SpacingHeaderProps {
  isDirty: boolean;
  onResetToDefaults: () => void;
  onSaveDraft: () => void;
  isSaving: boolean;
}

export const SpacingHeader: React.FC<SpacingHeaderProps> = ({
  isDirty,
  onResetToDefaults,
  onSaveDraft,
  isSaving,
}) => {
  return (
    <header
      style={{
        padding: "20px 32px 16px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "var(--bg, #FAF7F2)",
        borderBottom: "1px solid var(--border, #EAE4EE)",
      }}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
        }}
      >
        <Link href="/admin/design-system" style={{ color: "inherit", textDecoration: "none" }}>
          Design System
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>
          Spacing & Layout
        </span>
      </nav>

      {/* Title & Actions Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text, #24213A)",
              lineHeight: 1.2,
            }}
          >
            Spacing & Layout Tokens
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              marginTop: "4px",
            }}
          >
            Control spacing, component dimensions and layout consistency across Post Hub.
          </p>
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Draft changes pill */}
          {isDirty && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--secondary, #E8DFF5)",
                color: "var(--primary, #7956C9)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary, #7956C9)",
                }}
              />
              <span>Draft changes</span>
            </span>
          )}

          {/* Reset to defaults */}
          <button
            type="button"
            onClick={onResetToDefaults}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
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
            <RotateCcw size={14} style={{ color: "var(--text-muted, #777184)" }} />
            <span>Reset to defaults</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
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
    </header>
  );
};

