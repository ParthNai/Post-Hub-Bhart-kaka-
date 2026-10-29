"use client";

import React, { useState } from "react";
import type { DesignSystemConfig } from "@/lib/design-system";
import { X, Smartphone, Monitor, Sparkles, Search, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import Image from "next/image";

interface LivePreviewModalProps {
  isOpen: boolean;
  config: DesignSystemConfig;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  config,
  onClose,
}) => {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  if (!isOpen) return null;

  const colors = config.colorTokens;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          height: "90vh",
          maxHeight: "820px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 24px 48px rgba(36, 33, 58, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                backgroundColor: "var(--secondary, #E8DFF5)",
                color: "var(--primary, #7956C9)",
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              Draft Preview Mode
            </span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text, #24213A)" }}>
              Live Design Tokens Simulator
            </span>
          </div>

          {/* Device Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "inline-flex",
                backgroundColor: "#FAF9FC",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                padding: "2px",
              }}
            >
              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: deviceMode === "mobile" ? "#FFFFFF" : "transparent",
                  color: deviceMode === "mobile" ? "var(--primary, #7956C9)" : "var(--text-muted)",
                  boxShadow: deviceMode === "mobile" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                <Smartphone size={13} /> Mobile App
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("desktop")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: deviceMode === "desktop" ? "#FFFFFF" : "transparent",
                  color: deviceMode === "desktop" ? "var(--primary, #7956C9)" : "var(--text-muted)",
                  boxShadow: deviceMode === "desktop" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                <Monitor size={13} /> Web Platform
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: "var(--text-muted)",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.warmIvory || "#FAF7F2",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          {deviceMode === "mobile" ? (
            /* Mobile Device Frame */
            <div
              style={{
                width: "360px",
                borderRadius: "32px",
                backgroundColor: "#FFFFFF",
                border: "8px solid #24213A",
                boxShadow: "0 20px 50px rgba(36, 33, 58, 0.25)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: "620px",
              }}
            >
              {/* Mobile Status Bar */}
              <div
                style={{
                  height: "26px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: colors.mainText,
                }}
              >
                <span>9:41</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <span>●●●</span>
                </div>
              </div>

              {/* Mobile App Header */}
              <div
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <BrandLogo size="xs" />
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: colors.softLavender,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.primaryViolet,
                    }}
                  >
                    <Search size={14} />
                  </div>
                </div>
              </div>

              {/* Mobile App Body */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                }}
              >
                {/* Hero Banner with draft tokens */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: config.components.borderRadius || "12px",
                    backgroundColor: colors.primaryViolet,
                    color: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", opacity: 0.9 }}>
                    <Sparkles size={12} />
                    <span>AI Creation Suite</span>
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, lineHeight: 1.25 }}>
                    Generate High-Impact Festival Posters in Seconds
                  </h4>
                  <button
                    type="button"
                    style={{
                      alignSelf: "flex-start",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      backgroundColor: "#FFFFFF",
                      color: colors.primaryViolet,
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      marginTop: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>Create Now</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                  {["All", "Festival", "Business", "Events"].map((cat, i) => (
                    <span
                      key={cat}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "16px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        backgroundColor: i === 0 ? colors.primaryViolet : colors.softLavender,
                        color: i === 0 ? "#FFFFFF" : colors.primaryViolet,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Content Card with Pagoda */}
                <div
                  style={{
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ height: "130px", position: "relative", backgroundColor: colors.softLavender }}>
                    <Image
                      src="/assets/pagoda_poster.jpg"
                      alt="Pagoda"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: colors.primaryViolet }}>
                      Trending Poster
                    </span>
                    <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: colors.mainText }}>
                      Festive Heritage Greetings
                    </h5>
                    <p style={{ fontSize: "11.5px", color: colors.secondaryText }}>
                      Customizable typography with AI art engine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Web Platform Specimen */
            <div
              style={{
                width: "100%",
                maxWidth: "720px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: `1px solid ${colors.border}`,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: colors.mainText }}>
                Web Design Token Specimen
              </h3>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: colors.primaryViolet,
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    borderRadius: config.components.borderRadius,
                    border: "none",
                    fontWeight: 600,
                    fontSize: "13.5px",
                  }}
                >
                  Primary Action Button
                </button>

                <button
                  type="button"
                  style={{
                    backgroundColor: colors.softLavender,
                    color: colors.primaryViolet,
                    padding: "10px 20px",
                    borderRadius: config.components.borderRadius,
                    border: "none",
                    fontWeight: 600,
                    fontSize: "13.5px",
                  }}
                >
                  Secondary Accent Button
                </button>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.warmIvory,
                }}
              >
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: colors.mainText }}>
                  Card Container ({config.guidelines.theme} Theme · {config.guidelines.accentColor})
                </h4>
                <p style={{ fontSize: "13px", color: colors.secondaryText, marginTop: "4px" }}>
                  Tone: {config.guidelines.brandTone} | Visual: {config.guidelines.visualStyle}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
