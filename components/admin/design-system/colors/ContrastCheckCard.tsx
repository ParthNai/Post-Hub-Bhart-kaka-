"use client";

import React, { useState } from "react";
import { calculateContrastRatio, isValidHex } from "@/lib/color-tokens";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ContrastCheckCardProps {
  primaryViolet: string;
  mainText: string;
}

export const ContrastCheckCard: React.FC<ContrastCheckCardProps> = ({
  primaryViolet,
  mainText,
}) => {
  const [bgHex, setBgHex] = useState(primaryViolet);
  const [textHex, setTextHex] = useState(mainText);

  // Sync when props change if user hasn't explicitly customized
  const effectiveBg = isValidHex(bgHex) ? bgHex : primaryViolet;
  const effectiveText = isValidHex(textHex) ? textHex : mainText;

  const result = calculateContrastRatio(effectiveBg, effectiveText);

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
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          letterSpacing: "-0.01em",
        }}
      >
        Contrast Check
      </h3>

      {/* Main Specimen & Ratio Block */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "18px",
        }}
      >
        {/* Color Pairing Boxes */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Background Box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                width: "82px",
                height: "64px",
                borderRadius: "10px",
                backgroundColor: effectiveBg,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px",
                fontWeight: 700,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              Aa
              <input
                type="color"
                value={effectiveBg}
                onChange={(e) => setBgHex(e.target.value.toUpperCase())}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
                title="Change background color"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
                Background
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text, #24213A)", fontFamily: "monospace" }}>
                {effectiveBg}
              </span>
            </div>
          </div>

          {/* Text Box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                width: "82px",
                height: "64px",
                borderRadius: "10px",
                backgroundColor: effectiveText,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px",
                fontWeight: 700,
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              Aa
              <input
                type="color"
                value={effectiveText}
                onChange={(e) => setTextHex(e.target.value.toUpperCase())}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
                title="Change text color"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
                Text
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text, #24213A)", fontFamily: "monospace" }}>
                {effectiveText}
              </span>
            </div>
          </div>
        </div>

        {/* Ratio & Status Result */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 500, color: "var(--text-muted, #777184)" }}>
            Contrast Ratio
          </span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text, #24213A)",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-family-sans)",
            }}
          >
            {result.ratioFormatted}
          </span>

          {/* WCAG AA Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "16px",
              fontSize: "11.5px",
              fontWeight: 600,
              backgroundColor: result.meetsNormalAA ? "#EDF7F2" : "#FEF3C7",
              color: result.meetsNormalAA ? "#12805C" : "#92400E",
              border: `1px solid ${result.meetsNormalAA ? "#C8E8D7" : "#FDE68A"}`,
            }}
          >
            <span
              style={{
                backgroundColor: result.meetsNormalAA ? "#12805C" : "#D97706",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: 700,
                padding: "1px 5px",
                borderRadius: "4px",
              }}
            >
              AA
            </span>
            <span>{result.statusText}</span>
          </div>
        </div>
      </div>

      {/* Explanatory footnote */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11.5px",
          color: "var(--text-muted, #777184)",
          marginTop: "4px",
        }}
      >
        {result.meetsNormalAA ? (
          <CheckCircle2 size={13} style={{ color: "var(--success, #12805C)", flexShrink: 0 }} />
        ) : (
          <AlertTriangle size={13} style={{ color: "#D97706", flexShrink: 0 }} />
        )}
        <span>
          {result.meetsNormalAA
            ? "Passes WCAG AA standard (4.5:1 minimum) for normal and body text."
            : "The contrast ratio is below the recommended 4.5:1 for normal text."}
        </span>
      </div>
    </div>
  );
};
