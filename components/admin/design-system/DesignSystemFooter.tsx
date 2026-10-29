"use client";

import React from "react";
import { Info } from "lucide-react";

interface DesignSystemFooterProps {
  status?: "draft" | "published";
  lastSavedAt: string | null;
  isDirty?: boolean;
}

export const DesignSystemFooter: React.FC<DesignSystemFooterProps> = ({
  status = "draft",
  lastSavedAt,
  isDirty = false,
}) => {
  const formatSavedTime = (isoString: string | null) => {
    if (!isoString) return "Not saved yet";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", " + d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px 8px 4px",
        marginTop: "12px",
        fontSize: "12.5px",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {/* Left: Draft Status Pill & Saved At */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "6px",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
          }}
        >
          {isDirty ? "Unsaved Draft" : status === "published" ? "Published" : "Draft"}
        </span>

        <span style={{ color: "var(--text-muted, #777184)" }}>
          Last saved: {formatSavedTime(lastSavedAt)}
        </span>
      </div>

      {/* Right: Connected App Disclaimer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted, #777184)",
        }}
      >
        <Info size={15} style={{ flexShrink: 0 }} />
        <span>Only supported design tokens and components can affect the connected app.</span>
      </div>
    </footer>
  );
};

