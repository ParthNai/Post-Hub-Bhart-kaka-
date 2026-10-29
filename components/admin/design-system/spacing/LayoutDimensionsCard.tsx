"use client";

import React from "react";
import { LayoutDimensionTokens } from "@/lib/spacing-tokens";

interface LayoutDimensionsCardProps {
  dimensions: LayoutDimensionTokens;
  onChange: (updated: LayoutDimensionTokens) => void;
}

export const LayoutDimensionsCard: React.FC<LayoutDimensionsCardProps> = ({
  dimensions,
  onChange,
}) => {
  const handleChange = (field: keyof LayoutDimensionTokens, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      onChange({
        ...dimensions,
        [field]: num,
      });
    }
  };

  const fields: { key: keyof LayoutDimensionTokens; label: string }[] = [
    { key: "contentMaxWidth", label: "Content maximum width" },
    { key: "sidebarWidth", label: "Sidebar width" },
    { key: "standardControlHeight", label: "Standard control height" },
    { key: "compactControlHeight", label: "Compact control height" },
    { key: "gridGutter", label: "Grid gutter" },
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
        Layout dimensions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "14px",
        }}
        className="layout-dimensions-grid"
      >
        {fields.map((item) => (
          <div key={item.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "11.5px",
                fontWeight: 500,
                color: "var(--text-muted, #777184)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={item.label}
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
              }}
            >
              <input
                type="number"
                min={1}
                value={dimensions[item.key]}
                onChange={(e) => handleChange(item.key, e.target.value)}
                style={{
                  width: "100%",
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

      <style jsx>{`
        @media (max-width: 900px) {
          .layout-dimensions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .layout-dimensions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

