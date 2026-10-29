"use client";

import React from "react";
import Link from "next/link";
import { Home, Info, RotateCcw, Bookmark, Loader2 } from "lucide-react";

interface SettingsHeaderProps {
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onReset,
  onSave,
  isSaving,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "24px",
      }}
    >
      <div>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--text-muted, #777184)",
            marginBottom: "8px",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{
              color: "inherit",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Home size={13} style={{ marginRight: "4px" }} />
          </Link>
          <span>/</span>
          <Link
            href="/admin/design-system"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Design System
          </Link>
          <span>/</span>
          <span style={{ color: "var(--primary, #7956C9)", fontWeight: 600 }}>
            Settings & Governance
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 4px 0",
            letterSpacing: "-0.01em",
          }}
        >
          Design System Settings & Governance
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: 0,
          }}
        >
          Define token conventions, validation policies and configuration compatibility.
        </p>
      </div>

      {/* Top Right Action Strip */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Draft changes pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            backgroundColor: "#F2EEF8",
            border: "1px solid #E8DFF5",
            fontSize: "12.5px",
            color: "var(--primary, #7956C9)",
            fontWeight: 600,
          }}
        >
          <Info size={14} />
          <span>Draft changes</span>
        </div>

        {/* Reset to defaults button */}
        <button
          type="button"
          onClick={onReset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <RotateCcw size={14} style={{ color: "#777184" }} />
          <span>Reset to defaults</span>
        </button>

        {/* Save Draft button */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 20px",
            fontSize: "13px",
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
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </button>
      </div>
    </div>
  );
};
