"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit3, Info, Check, Sparkles } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface PosterPreviewPanelProps {
  template: PosterTemplate;
  revision?: string;
}

export const PosterPreviewPanel: React.FC<PosterPreviewPanelProps> = ({
  template,
  revision = "v1.2",
}) => {
  const [zoom, setZoom] = useState<string>("100%");
  const dimensions = template.assetDimensions || "1024 × 1365 px";
  const format = template.format || "3:4";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Toolbar */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Template Preview
          </h3>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {format}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              fontFamily: "monospace",
            }}
          >
            {dimensions}
          </span>
        </div>

        {/* Right Tools: Zoom + Open in Editor */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "12px",
              backgroundColor: "#FAF7F2",
              color: "var(--text, #24213A)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="100%">100%</option>
            <option value="90%">90%</option>
            <option value="80%">80%</option>
          </select>

          <Link
            href={`/admin/templates/${template.id}/edit`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            className="hover:bg-slate-50"
          >
            <Edit3 size={14} style={{ color: "var(--primary, #7956C9)" }} />
            <span>Open in Editor</span>
          </Link>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        style={{
          padding: "24px",
          backgroundColor: "#F8F6F2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "480px",
        }}
      >
        {/* Rendered Poster Artwork Canvas */}
        <div
          style={{
            width: "320px",
            height: "426px", // 3:4 aspect ratio
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(36, 33, 58, 0.15)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(0,0,0,0.06)",
            transform: zoom === "90%" ? "scale(0.9)" : zoom === "80%" ? "scale(0.8)" : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          {/* Subtle lavender polygonal background gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "180px",
              height: "220px",
              background: "linear-gradient(135deg, rgba(232, 223, 245, 0.7) 0%, rgba(200, 185, 235, 0.2) 100%)",
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              zIndex: 1,
            }}
          />

          {/* Top Logo / Header */}
          <div
            style={{
              padding: "16px 20px 0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "6px",
                  backgroundColor: "var(--primary, #7956C9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <Sparkles size={12} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "var(--text, #24213A)",
                }}
              >
                POST HUB
              </span>
            </div>

            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary, #E8DFF5)",
              }}
            />
          </div>

          {/* Main Content Area */}
          <div
            style={{
              padding: "16px 20px 10px 20px",
              zIndex: 2,
              flex: 1,
            }}
          >
            {/* Headline */}
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#1E1B4B",
                lineHeight: 1.05,
                margin: "0 0 4px 0",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              {template.headline || "GROW YOUR BUSINESS"}
            </h2>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--primary, #7956C9)",
                margin: "0 0 14px 0",
              }}
            >
              {template.subheadline || "Smart Solutions for your Business"}
            </p>

            {/* Feature Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
              {[
                "High Quality Solutions",
                "Fast Delivery",
                "24/7 Support",
                "Free Consultation",
              ].map((bullet, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary, #7956C9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={9} strokeWidth={3} />
                  </div>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.3)",
              }}
            >
              {template.ctaText || "Get Started"}
            </div>
          </div>

          {/* Illustrated Figure: Professional Business Figure with Folded Arms */}
          <div
            style={{
              position: "absolute",
              right: "-5px",
              bottom: 0,
              width: "165px",
              height: "220px",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            {/* SVG Illustration of Professional Business Person with Arms Crossed */}
            <svg
              viewBox="0 0 200 280"
              style={{
                width: "100%",
                height: "100%",
                filter: "drop-shadow(-4px 4px 8px rgba(0,0,0,0.12))",
              }}
            >
              <defs>
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              {/* Head & Hair */}
              <circle cx="100" cy="52" r="28" fill="url(#skinGrad)" />
              {/* Hair */}
              <path
                d="M72 45 C72 25, 128 25, 128 45 C128 32, 72 32, 72 45 Z"
                fill="#27272A"
              />
              <path
                d="M72 45 C70 58, 74 65, 78 68 C76 56, 78 45, 78 45 Z"
                fill="#27272A"
              />
              <path
                d="M128 45 C130 58, 126 65, 122 68 C124 56, 122 45, 122 45 Z"
                fill="#27272A"
              />

              {/* Beard & Mustache */}
              <path
                d="M86 64 C94 72, 106 72, 114 64 C110 75, 90 75, 86 64 Z"
                fill="#3F3F46"
              />

              {/* Neck & Collar */}
              <rect x="92" y="76" width="16" height="18" fill="url(#skinGrad)" />
              {/* White Shirt Collar */}
              <polygon points="90,92 100,105 100,92" fill="#FFFFFF" />
              <polygon points="110,92 100,105 100,92" fill="#FFFFFF" />
              {/* Dark Navy Tie */}
              <polygon points="98,95 102,95 104,135 100,140 96,135" fill="#1D4ED8" />

              {/* Suit Jacket & Torso */}
              <path
                d="M60 96 L88 94 L97 145 L103 145 L112 94 L140 96 C155 108, 160 145, 160 190 L160 280 L40 280 L40 190 C40 145, 45 108, 60 96 Z"
                fill="url(#suitGrad)"
              />
              {/* Suit Lapels */}
              <polygon points="75,95 98,145 92,145 68,102" fill="#334155" />
              <polygon points="125,95 102,145 108,145 132,102" fill="#334155" />

              {/* Arms Crossed */}
              {/* Left Arm across */}
              <path
                d="M48 130 C45 160, 80 185, 135 170 C140 155, 130 145, 115 145 C85 145, 60 140, 48 130 Z"
                fill="#1E293B"
              />
              {/* Right Arm across */}
              <path
                d="M152 130 C155 160, 120 185, 65 170 C60 155, 70 145, 85 145 C115 145, 140 140, 152 130 Z"
                fill="#0F172A"
              />

              {/* Hands tucked */}
              <ellipse cx="68" cy="168" rx="8" ry="6" fill="url(#skinGrad)" />
              <ellipse cx="132" cy="168" rx="8" ry="6" fill="url(#skinGrad)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Info Strip */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border, #EAE4EE)",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "12.5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ color: "var(--text-muted, #777184)" }}>Current Revision: </span>
            <strong style={{ color: "var(--text, #24213A)" }}>{revision} (Draft)</strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted, #777184)" }}>Canvas: </span>
            <span style={{ fontFamily: "monospace", color: "var(--text, #24213A)" }}>{dimensions}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#FAF7F2",
            color: "var(--text-muted, #777184)",
            fontSize: "12px",
          }}
        >
          <Info size={14} style={{ color: "var(--primary, #7956C9)", flexShrink: 0 }} />
          <span>Validation was run on the current working draft. Publish will deploy this exact version.</span>
        </div>
      </div>
    </div>
  );
};
