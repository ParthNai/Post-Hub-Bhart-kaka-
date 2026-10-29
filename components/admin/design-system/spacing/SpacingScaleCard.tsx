"use client";

import React from "react";
import { SpacingScaleItem } from "@/lib/spacing-tokens";

interface SpacingScaleCardProps {
  scale: SpacingScaleItem[];
  onUpdateScale: (id: string, newValue: number) => void;
}

export const SpacingScaleCard: React.FC<SpacingScaleCardProps> = ({
  scale,
  onUpdateScale,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          letterSpacing: "-0.01em",
        }}
      >
        Spacing scale
      </h3>

      {/* Table Structure */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.3fr 2.5fr",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-muted, #777184)",
            borderBottom: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <span>Token</span>
          <span>Value</span>
          <span>Visual preview</span>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {scale.map((item, idx) => {
            const barWidth = Math.min(item.value * 3, 220);

            return (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.3fr 2.5fr",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderBottom: idx === scale.length - 1 ? "none" : "1px solid #F5F3F7",
                }}
              >
                {/* Token Label */}
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--text, #24213A)",
                  }}
                >
                  {item.label}
                </span>

                {/* Number Input with Suffix */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid var(--border, #EAE4EE)",
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                      overflow: "hidden",
                    }}
                  >
                    <input
                      type="number"
                      min={1}
                      max={256}
                      value={item.value}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        if (!isNaN(parsed) && parsed >= 0) {
                          onUpdateScale(item.id, parsed);
                        }
                      }}
                      style={{
                        width: "56px",
                        padding: "6px 8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: "none",
                        outline: "none",
                        textAlign: "center",
                        color: "var(--text, #24213A)",
                      }}
                    />
                    <span
                      style={{
                        padding: "6px 10px",
                        fontSize: "12px",
                        color: "var(--text-muted, #777184)",
                        backgroundColor: "#FAF9FC",
                        borderLeft: "1px solid var(--border, #EAE4EE)",
                      }}
                    >
                      px
                    </span>
                  </div>
                </div>

                {/* Visual Preview Bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted, #777184)",
                      fontFamily: "monospace",
                    }}
                  >
                    {item.value}px
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

