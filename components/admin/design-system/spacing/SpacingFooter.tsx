"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface SpacingFooterProps {
  onOpenUsage: () => void;
  lastPublished?: string;
}

export const SpacingFooter: React.FC<SpacingFooterProps> = ({
  onOpenUsage,
  lastPublished = "Not available",
}) => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px 10px 4px",
        marginTop: "16px",
        fontSize: "12px",
        color: "var(--text-muted, #777184)",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {/* Left Metadata */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>Token scope: Global UI</span>
        <span style={{ color: "var(--border, #EAE4EE)" }}>|</span>
        <span>Last published: {lastPublished}</span>
      </div>

      {/* Right Link */}
      <div>
        <button
          type="button"
          onClick={onOpenUsage}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "none",
            border: "none",
            color: "var(--primary, #7956C9)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            padding: "2px",
          }}
        >
          <span>View token usage</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </footer>
  );
};

