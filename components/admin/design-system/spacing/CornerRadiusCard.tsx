"use client";

import React from "react";
import { BorderRadiusTokens, RadiusKey } from "@/lib/spacing-tokens";
import { Image as ImageIcon } from "lucide-react";

interface CornerRadiusCardProps {
  radii: BorderRadiusTokens;
  onChangeRadii: (updated: BorderRadiusTokens) => void;
}

const RADIUS_ITEMS: { key: RadiusKey; label: string }[] = [
  { key: "none", label: "None" },
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
  { key: "extraLarge", label: "Extra large" },
  { key: "pill", label: "Pill" },
];

export const CornerRadiusCard: React.FC<CornerRadiusCardProps> = ({
  radii,
  onChangeRadii,
}) => {
  const activeRadiusVal = radii[radii.activeKey];
  const activeRadiusPx = `${activeRadiusVal}px`;

  const handleSelectRadio = (key: RadiusKey) => {
    onChangeRadii({
      ...radii,
      activeKey: key,
    });
  };

  const handleUpdateValue = (key: RadiusKey, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      onChangeRadii({
        ...radii,
        [key]: num,
      });
    }
  };

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
        Corner radius
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.4fr",
          gap: "28px",
          alignItems: "start",
        }}
        className="corner-radius-grid"
      >
        {/* Left Side: Radio list with numbers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {RADIUS_ITEMS.map((item) => {
            const isSelected = radii.activeKey === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleSelectRadio(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                {/* Radio and Label */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: isSelected
                        ? "5px solid var(--primary, #7956C9)"
                        : "1.5px solid var(--border, #EAE4EE)",
                      backgroundColor: "#FFFFFF",
                      transition: "all 0.15s ease",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: isSelected ? 600 : 500,
                      color: "var(--text, #24213A)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Number Input with px suffix */}
                <div
                  onClick={(e) => e.stopPropagation()}
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
                    min={0}
                    max={999}
                    value={radii[item.key]}
                    onChange={(e) => handleUpdateValue(item.key, e.target.value)}
                    style={{
                      width: "50px",
                      padding: "5px 6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                      color: "var(--text, #24213A)",
                    }}
                  />
                  <span
                    style={{
                      padding: "5px 8px",
                      fontSize: "11.5px",
                      color: "var(--text-muted, #777184)",
                      backgroundColor: "#FAF9FC",
                      borderLeft: "1px solid var(--border, #EAE4EE)",
                    }}
                  >
                    px
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Component examples */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h4
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text-muted, #777184)",
            }}
          >
            Component examples
          </h4>

          {/* Button Example */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>Button</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "var(--primary, #7956C9)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: activeRadiusPx,
                  cursor: "pointer",
                  transition: "border-radius 0.15s ease",
                }}
              >
                Button
              </button>

              <button
                type="button"
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  color: "var(--primary, #7956C9)",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: activeRadiusPx,
                  cursor: "pointer",
                  transition: "border-radius 0.15s ease",
                }}
              >
                Button
              </button>
            </div>
          </div>

          {/* Input Example */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>Input</span>
            <input
              type="text"
              readOnly
              placeholder="Enter text"
              style={{
                width: "100%",
                padding: "8px 14px",
                fontSize: "13px",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: activeRadiusPx,
                outline: "none",
                backgroundColor: "#FFFFFF",
                transition: "border-radius 0.15s ease",
              }}
            />
          </div>

          {/* Card Example */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>Card</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: activeRadiusPx,
                backgroundColor: "#FFFFFF",
                transition: "border-radius 0.15s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  backgroundColor: "var(--secondary, #E8DFF5)",
                  color: "var(--primary, #7956C9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ImageIcon size={20} />
              </div>

              <div>
                <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                  Card title
                </h5>
                <p style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                  This is a sample card with rounded corners to show the radius in action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .corner-radius-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

