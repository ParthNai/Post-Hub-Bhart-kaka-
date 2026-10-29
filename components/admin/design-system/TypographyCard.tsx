"use client";

import React from "react";
import type { ColorTokens, TypographyTokens } from "@/lib/design-system";

interface TypographyCardProps {
  typography: TypographyTokens;
  colorTokens: ColorTokens;
}

export const TypographyCard: React.FC<TypographyCardProps> = ({
  typography,
  colorTokens,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: `1px solid ${colorTokens.border || "var(--border, #EAE4EE)"}`,
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "150px",
        gap: "18px",
      }}
    >
      {/* Title */}
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: colorTokens.mainText || "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Typography
        </h3>
      </div>

      {/* Typography Preview Examples */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2
          style={{
            fontSize: typography.headlineSize || "24px",
            fontWeight: Number(typography.headlineWeight) || 700,
            color: colorTokens.mainText || "#24213A",
            lineHeight: 1.25,
            letterSpacing: "-0.025em",
          }}
        >
          Create something remarkable.
        </h2>
        <p
          style={{
            fontSize: typography.bodySize || "14.5px",
            color: colorTokens.secondaryText || "#777184",
            lineHeight: typography.bodyLineHeight || "1.5",
          }}
        >
          Design beautiful posters with Post Hub.
        </p>
      </div>

      {/* Brand System Version Spec */}
      <div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colorTokens.secondaryText || "#777184",
          }}
        >
          BRAND SYSTEM / VERSION 01
        </span>
      </div>
    </div>
  );
};
