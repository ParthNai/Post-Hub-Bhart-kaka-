"use client";

import React from "react";
import { ComponentSpacingTokens } from "@/lib/spacing-tokens";

interface ComponentSpacingCardProps {
  spacing: ComponentSpacingTokens;
  onChange: (updated: ComponentSpacingTokens) => void;
}

export const ComponentSpacingCard: React.FC<ComponentSpacingCardProps> = ({
  spacing,
  onChange,
}) => {
  const handleChange = (field: keyof ComponentSpacingTokens, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      onChange({
        ...spacing,
        [field]: num,
      });
    }
  };

  const fields: { key: keyof ComponentSpacingTokens; label: string }[][] = [
    [
      { key: "buttonPaddingX", label: "Button horizontal padding" },
      { key: "buttonPaddingY", label: "Button vertical padding" },
    ],
    [
      { key: "inputPaddingX", label: "Input horizontal padding" },
      { key: "inputPaddingY", label: "Input vertical padding" },
    ],
    [
      { key: "cardPadding", label: "Card internal padding" },
      { key: "cardGap", label: "Card content gap" },
    ],
    [
      { key: "formFieldGap", label: "Form field gap" },
      { key: "sectionGap", label: "Section gap" },
    ],
  ];

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
        Component spacing
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {fields.map((row, rIdx) => (
          <div
            key={rIdx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
            className="component-spacing-row"
          >
            {row.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text, #24213A)",
                  }}
                >
                  {item.label}
                </label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid var(--border, #EAE4EE)",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={spacing[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    style={{
                      width: "54px",
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
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .component-spacing-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

