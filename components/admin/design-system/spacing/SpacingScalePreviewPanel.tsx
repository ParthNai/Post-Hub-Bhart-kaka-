"use client";

import React from "react";
import type { SpacingScaleItem } from "@/lib/spacing-tokens";

interface SpacingScalePreviewPanelProps {
  scale: SpacingScaleItem[];
}

export const SpacingScalePreviewPanel: React.FC<SpacingScalePreviewPanelProps> = ({
  scale,
}) => {
  // Focus on representative tokens: Space 2, Space 4, Space 6, Space 8
  const selectedTokenIds = ["space-2", "space-4", "space-6", "space-8"];
  const displayTokens = scale.filter((t) => selectedTokenIds.includes(t.id));

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "20px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          letterSpacing: "-0.01em",
        }}
      >
        Spacing scale preview
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {displayTokens.map((item) => {
          const barWidth = Math.min(item.value * 3.4, 280);

          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 50px 1fr",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                {item.label}
              </span>

              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted, #777184)",
                  fontFamily: "monospace",
                }}
              >
                {item.value}px
              </span>

              <div
                style={{
                  width: `${barWidth}px`,
                  minWidth: "6px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "var(--primary, #7956C9)",
                  opacity: 0.85,
                  transition: "width 0.15s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
