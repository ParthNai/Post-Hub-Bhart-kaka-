"use client";

import React from "react";
import { DetailedColorToken, hexToRgb, formatRgbString, isValidHex, normalizeHex } from "@/lib/color-tokens";
import { Copy, Check, ChevronRight, Square, Layers, Link as LinkIcon, CheckCircle2 } from "lucide-react";

interface SelectedColorDetailsCardProps {
  token: DetailedColorToken;
  onUpdateHex: (newHex: string) => void;
  onCopyValue: (val: string, label: string) => void;
  copiedVal: string | null;
}

const ICON_MAP = {
  button: Square,
  navigation: Layers,
  link: LinkIcon,
  control: CheckCircle2,
  badge: CheckCircle2,
  card: Layers,
};

export const SelectedColorDetailsCard: React.FC<SelectedColorDetailsCardProps> = ({
  token,
  onUpdateHex,
  onCopyValue,
  copiedVal,
}) => {
  const rgbObj = hexToRgb(token.hex) || { r: 121, g: 86, b: 201 };
  const rgbString = formatRgbString(rgbObj.r, rgbObj.g, rgbObj.b);
  const rgbCss = `rgb(${rgbString})`;

  const isBorderOrIvory = token.id === "border" || token.id === "warm-ivory";

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
        gap: "22px",
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          letterSpacing: "-0.01em",
        }}
      >
        Selected Color Details
      </h3>

      {/* Top Swatch & Value Controls */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* Large Swatch */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "14px",
            backgroundColor: token.hex,
            border: isBorderOrIvory ? "1px solid #D5CCE0" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Overlay color picker for large swatch */}
          <input
            type="color"
            value={isValidHex(token.hex) && normalizeHex(token.hex).length === 7 ? normalizeHex(token.hex) : "#7956C9"}
            onChange={(e) => onUpdateHex(e.target.value.toUpperCase())}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
            title="Click to pick a color"
          />
        </div>

        {/* Name, Key, and Field Controls */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                lineHeight: 1.2,
              }}
            >
              {token.name}
            </h4>
            <span
              style={{
                fontSize: "12.5px",
                color: "var(--text-muted, #777184)",
                fontFamily: "monospace",
              }}
            >
              {token.key}
            </span>
          </div>

          {/* HEX Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                padding: "6px 10px",
                backgroundColor: "#FFFFFF",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted, #777184)" }}>
                HEX
              </span>
              <input
                type="text"
                value={token.hex}
                onChange={(e) => onUpdateHex(e.target.value)}
                onBlur={(e) => {
                  if (isValidHex(e.target.value)) onUpdateHex(normalizeHex(e.target.value));
                }}
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  border: "none",
                  outline: "none",
                  color: "var(--text, #24213A)",
                }}
              />
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: token.hex,
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              />
              <button
                type="button"
                onClick={() => onCopyValue(token.hex, "HEX")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--text-muted)" }}
                aria-label="Copy hex"
              >
                {copiedVal === token.hex ? <Check size={13} style={{ color: "#12805C" }} /> : <Copy size={13} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onCopyValue(token.hex, "HEX")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Copy size={13} style={{ color: "var(--text-muted)" }} />
              <span>Copy HEX</span>
            </button>
          </div>

          {/* RGB Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                padding: "6px 10px",
                backgroundColor: "#FFFFFF",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted, #777184)" }}>
                RGB
              </span>
              <input
                type="text"
                readOnly
                value={rgbString}
                style={{
                  flex: 1,
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: "var(--text, #24213A)",
                }}
              />
              <button
                type="button"
                onClick={() => onCopyValue(rgbCss, "RGB")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--text-muted)" }}
                aria-label="Copy RGB"
              >
                {copiedVal === rgbCss ? <Check size={13} style={{ color: "#12805C" }} /> : <Copy size={13} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onCopyValue(rgbCss, "RGB")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Copy size={13} style={{ color: "var(--text-muted)" }} />
              <span>Copy RGB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text, #24213A)" }}>
            Usage
          </h4>
          <p style={{ fontSize: "12px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
            This color token is used in the following supported components:
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {token.usage && token.usage.length > 0 ? (
            token.usage.map((item, idx) => {
              const IconComp = ICON_MAP[item.iconType] || Square;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border, #EAE4EE)",
                    backgroundColor: "#FFFFFF",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        backgroundColor: "var(--secondary, #E8DFF5)",
                        color: "var(--primary, #7956C9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={15} />
                    </div>

                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)" }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={15} style={{ color: "var(--text-muted, #777184)" }} />
                </div>
              );
            })
          ) : (
            <div style={{ fontSize: "12px", color: "var(--text-muted, #777184)", padding: "12px 0" }}>
              Custom token. Unmapped to supported core components.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
