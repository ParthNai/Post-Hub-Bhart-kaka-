"use client";

import React, { useState } from "react";
import type { ColorTokens } from "@/lib/design-system";
import { Check, X } from "lucide-react";

function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

interface ColorTokensCardProps {
  colorTokens: ColorTokens;
  onChange: (updated: ColorTokens) => void;
}

interface TokenDef {
  key: keyof ColorTokens;
  label: string;
  defaultHex: string;
}

const COLOR_DEFS: TokenDef[] = [
  { key: "primaryViolet", label: "Primary Violet", defaultHex: "#7956C9" },
  { key: "softLavender", label: "Soft Lavender", defaultHex: "#E8DFF5" },
  { key: "warmIvory", label: "Warm Ivory", defaultHex: "#FAF7F2" },
  { key: "mainText", label: "Main Text", defaultHex: "#24213A" },
  { key: "secondaryText", label: "Secondary Text", defaultHex: "#777184" },
  { key: "border", label: "Border", defaultHex: "#EAE4EE" },
];

export const ColorTokensCard: React.FC<ColorTokensCardProps> = ({
  colorTokens,
  onChange,
}) => {
  const [editingToken, setEditingToken] = useState<keyof ColorTokens | null>(null);
  const [tempHex, setTempHex] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const startEditing = (tokenKey: keyof ColorTokens) => {
    setEditingToken(tokenKey);
    setTempHex(colorTokens[tokenKey]);
    setErrorMsg("");
  };

  const cancelEditing = () => {
    setEditingToken(null);
    setTempHex("");
    setErrorMsg("");
  };

  const handleSaveColor = (tokenKey: keyof ColorTokens) => {
    let cleanHex = tempHex.trim();
    if (!cleanHex.startsWith("#")) {
      cleanHex = "#" + cleanHex;
    }
    if (!isValidHexColor(cleanHex)) {
      setErrorMsg("Invalid HEX (e.g. #7956C9)");
      return;
    }
    onChange({
      ...colorTokens,
      [tokenKey]: cleanHex.toUpperCase(),
    });
    setEditingToken(null);
  };

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
        gap: "16px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Color Tokens
        </h3>
        <span style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
          Click any swatch to customize
        </span>
      </div>

      {/* 6 Swatches Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
        }}
        className="color-swatches-grid"
      >
        {COLOR_DEFS.map((def) => {
          const currentVal = colorTokens[def.key] || def.defaultHex;
          const isEditing = editingToken === def.key;

          return (
            <div
              key={def.key}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                position: "relative",
              }}
            >
              {/* Color Swatch Box */}
              <button
                type="button"
                onClick={() => (isEditing ? cancelEditing() : startEditing(def.key))}
                title={`Click to edit ${def.label}`}
                style={{
                  width: "100%",
                  height: "76px",
                  borderRadius: "10px",
                  backgroundColor: currentVal,
                  border:
                    def.key === "border" || def.key === "warmIvory"
                      ? "1px solid #D5CCE0"
                      : "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: isEditing ? "2px solid #7956C9" : "none",
                  outlineOffset: "2px",
                }}
                className="color-swatch-box"
              >
                {isEditing && (
                  <span
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#FFFFFF",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    Editing
                  </span>
                )}
              </button>

              {/* Swatch Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "var(--text, #24213A)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={def.label}
                >
                  {def.label}
                </span>
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-muted, #777184)",
                    fontFamily: "monospace",
                    letterSpacing: "0.02em",
                  }}
                >
                  {currentVal}
                </span>
              </div>

              {/* Editing Popover */}
              {isEditing && (
                <div
                  style={{
                    position: "absolute",
                    top: "110px",
                    left: "0",
                    zIndex: 30,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid var(--border, #EAE4EE)",
                    boxShadow: "0 8px 24px rgba(36, 33, 58, 0.15)",
                    padding: "12px",
                    width: "180px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text)" }}>
                      Hex code
                    </span>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={tempHex.startsWith("#") && tempHex.length === 7 ? tempHex : currentVal}
                      onChange={(e) => {
                        setTempHex(e.target.value.toUpperCase());
                        setErrorMsg("");
                      }}
                      style={{
                        width: "28px",
                        height: "28px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                    <input
                      type="text"
                      value={tempHex}
                      onChange={(e) => {
                        setTempHex(e.target.value);
                        setErrorMsg("");
                      }}
                      style={{
                        flex: 1,
                        padding: "4px 6px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        border: "1px solid var(--border, #EAE4EE)",
                        borderRadius: "6px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {errorMsg && (
                    <span style={{ fontSize: "10.5px", color: "var(--error, #D9383A)" }}>
                      {errorMsg}
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleSaveColor(def.key)}
                      style={{
                        flex: 1,
                        padding: "5px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "var(--primary, #7956C9)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <Check size={12} /> Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          ...colorTokens,
                          [def.key]: def.defaultHex,
                        });
                        setEditingToken(null);
                      }}
                      style={{
                        padding: "5px 8px",
                        fontSize: "11px",
                        backgroundColor: "#F4F3F7",
                        color: "var(--text-muted)",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      title="Reset to initial default"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .color-swatches-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .color-swatches-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
