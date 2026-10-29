"use client";

import React from "react";
import { Info, GitFork, Layers, Smartphone, FileCode2, Sliders } from "lucide-react";
import type { DesignTokenItem } from "@/lib/token-usage";

interface PotentialImpactPanelProps {
  selectedToken: DesignTokenItem | null;
}

export const PotentialImpactPanel: React.FC<PotentialImpactPanelProps> = ({ selectedToken }) => {
  const tokenLabel = selectedToken ? selectedToken.id : "Selected token";

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
        gap: "14px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Potential impact
        </h3>
        <Info size={15} style={{ color: "var(--text-muted, #777184)", cursor: "help" }} />
      </div>

      {/* Dependency Graph Canvas */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "20px 14px",
          backgroundColor: "#FAF9FC",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          minHeight: "180px",
        }}
      >
        {/* Left Column: Consumers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "125px", zIndex: 2 }}>
          {/* Node 1: Components */}
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Layers size={12} style={{ color: "var(--primary, #7956C9)" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Components
              </span>
            </div>
            <span style={{ fontSize: "9.5px", color: "var(--text-muted, #777184)" }}>
              (e.g. Button, Card)
            </span>
          </div>

          {/* Node 2: Screens */}
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Smartphone size={12} style={{ color: "var(--primary, #7956C9)" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Screens
              </span>
            </div>
            <span style={{ fontSize: "9.5px", color: "var(--text-muted, #777184)" }}>
              (e.g. Home, Activity)
            </span>
          </div>
        </div>

        {/* Center: Selected Token Node */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, flex: 1, padding: "0 4px" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1.5px solid var(--primary, #7956C9)",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.15)",
              maxWidth: "160px",
              textAlign: "center",
            }}
          >
            <GitFork size={15} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={tokenLabel}
            >
              {tokenLabel}
            </span>
          </div>
        </div>

        {/* Right Column: Cascading Targets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "135px", zIndex: 2 }}>
          {/* Node 3: Stylesheets */}
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FileCode2 size={12} style={{ color: "var(--primary, #7956C9)" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Stylesheets
              </span>
            </div>
            <span style={{ fontSize: "9.5px", color: "var(--text-muted, #777184)" }}>
              (e.g. main.css, theme.css)
            </span>
          </div>

          {/* Node 4: Other tokens */}
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Sliders size={12} style={{ color: "var(--primary, #7956C9)" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Other tokens
              </span>
            </div>
            <span style={{ fontSize: "9.5px", color: "var(--text-muted, #777184)" }}>
              (e.g. spacing, radius)
            </span>
          </div>
        </div>

        {/* Connecting Arrows SVG Backdrop */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#BFBAC7" />
            </marker>
          </defs>

          {/* Line: Components -> Selected Token */}
          <path
            d="M 125 50 C 155 50, 160 90, 185 90"
            fill="none"
            stroke="#D8D2E1"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* Line: Screens -> Selected Token */}
          <path
            d="M 125 130 C 155 130, 160 90, 185 90"
            fill="none"
            stroke="#D8D2E1"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* Line: Selected Token -> Stylesheets */}
          <path
            d="M 315 90 C 335 90, 340 50, 360 50"
            fill="none"
            stroke="#D8D2E1"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* Line: Selected Token -> Other tokens */}
          <path
            d="M 315 90 C 335 90, 340 130, 360 130"
            fill="none"
            stroke="#D8D2E1"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      </div>

      {/* Caption Footnote */}
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-muted, #777184)",
          textAlign: "center",
        }}
      >
        This is a conceptual example. Actual dependency relationships may vary.
      </span>
    </div>
  );
};
