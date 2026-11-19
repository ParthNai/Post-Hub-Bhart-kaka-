"use client";

import React, { useState } from "react";
import { Sparkles, Star, Layers, Palette, Wand2, CheckCircle2 } from "lucide-react";

export const AppShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"templates" | "ai" | "brand">("templates");

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        padding: "36px 48px 30px 48px",
        background: "linear-gradient(155deg, #151125 0%, #221A3D 45%, #130E22 100%)",
        color: "#FFFFFF",
        overflow: "hidden",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        boxSizing: "border-box",
      }}
    >
      {/* Background Decorative Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-15%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(121, 86, 201, 0.4) 0%, rgba(121, 86, 201, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 196, 204, 0.28) 0%, rgba(0, 196, 204, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Section with Studio Brand */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7956C9 0%, #9065ED 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "20px",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px rgba(121, 86, 201, 0.4)",
              }}
            >
              P
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
                Post Hub <span style={{ color: "#A78BFA", fontWeight: 400 }}>Studio</span>
              </div>
              <div style={{ fontSize: "10px", color: "#A6A0BC", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                The Modern Canva Alternative
              </div>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(10px)",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#E2D9F7",
            }}
          >
            <Sparkles size={12} color="#F7D070" />
            <span>Creative Suite 2.0</span>
          </div>
        </div>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            marginBottom: "10px",
          }}
        >
          Design anything.{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #A78BFA 0%, #38BDF8 50%, #F472B6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Publish anywhere in seconds.
          </span>
        </h1>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.5,
            color: "#C4BFD6",
            maxWidth: "580px",
            letterSpacing: "-0.01em",
          }}
        >
          Create show-stopping festival banners, social media posts, marketing flyers, and AI-powered posters with zero design experience required.
        </p>

        {/* Quick Showcase Selector Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {[
            { id: "templates", label: "Poster & Flyer Templates", icon: Palette },
            { id: "ai", label: "AI Magic Generator", icon: Wand2 },
            { id: "brand", label: "1-Click Brand Kit", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: isSelected ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.05)",
                  border: isSelected ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
                  color: isSelected ? "#FFFFFF" : "#A6A0BC",
                }}
              >
                <Icon size={13} color={isSelected ? "#A78BFA" : "#A6A0BC"} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Interactive Canvas Mockups */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "20px 0",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "240px",
        }}
      >
        {activeTab === "templates" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              height: "230px",
            }}
          >
            {/* Primary Main Canvas Card (Centered) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "250px",
                height: "216px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #FF6B4A 0%, #7928CA 100%)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "2px solid rgba(255,255,255,0.25)",
                zIndex: 3,
                animation: "fadeIn 0.3s ease",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span
                  style={{
                    backgroundColor: "rgba(0,0,0,0.35)",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  🎉 Festival Special
                </span>
                <span style={{ fontSize: "10px", opacity: 0.85 }}>1080 × 1080</span>
              </div>

              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.1, marginBottom: "2px" }}>
                  DIWALI & NEW YEAR
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: 0.9 }}>
                  Mega Flash Sale · Flat 50% Off
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#1E1A33",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  SHOP NOW →
                </div>
                <span style={{ fontSize: "10px", opacity: 0.8 }}>#FFST-24</span>
              </div>
            </div>

            {/* Overlapping Secondary Card (Left: Cold Brew Flyer) */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "12px",
                width: "140px",
                height: "185px",
                borderRadius: "12px",
                background: "linear-gradient(160deg, #0F172A 0%, #1E293B 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 2,
                opacity: 0.92,
                transform: "rotate(-6deg)",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  backgroundColor: "#00C4CC",
                  color: "#0F172A",
                  padding: "2px 5px",
                  borderRadius: "4px",
                  fontSize: "8.5px",
                  fontWeight: 700,
                  width: "fit-content",
                }}
              >
                PROMOTION
              </span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#38BDF8" }}>Cold Brew Fest</div>
                <div style={{ fontSize: "9.5px", color: "#94A3B8" }}>Handcrafted roast</div>
              </div>
              <div style={{ fontSize: "8.5px", color: "#64748B" }}>3:4 Poster Ratio</div>
            </div>

            {/* Overlapping Third Card (Right: 9:16 Social Story) */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "12px",
                width: "135px",
                height: "185px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #3B0764 0%, #701A75 100%)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 2,
                opacity: 0.94,
                transform: "rotate(6deg)",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  backgroundColor: "#F472B6",
                  color: "#500724",
                  padding: "2px 5px",
                  borderRadius: "4px",
                  fontSize: "8.5px",
                  fontWeight: 700,
                  width: "fit-content",
                }}
              >
                STORY · 9:16
              </span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#FDF2F8" }}>Neon Night</div>
                <div style={{ fontSize: "9.5px", color: "#FBCFE8" }}>Live Music Launch</div>
              </div>
              <div style={{ fontSize: "8.5px", color: "#F472B6" }}>Instant Resize ✨</div>
            </div>

            {/* Floating Selection Box Indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(30, 26, 51, 0.94)",
                border: "1px solid #7956C9",
                borderRadius: "8px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                zIndex: 4,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#EDE9FE" }}>
                Auto-Snap Grid Enabled
              </span>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={15} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700 }}>AI Prompt-to-Poster</div>
                <div style={{ fontSize: "11px", color: "#A6A0BC" }}>Generate in 3.2 seconds</div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "11.5px",
                color: "#E2D9F7",
                fontFamily: "monospace",
                marginBottom: "12px",
              }}
            >
              &ldquo;Cyberpunk street food night market banner, neon glow, 4k detail&rdquo;
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(167, 139, 250, 0.2)",
                  color: "#C4B5FD",
                }}
              >
                16:9 Banner
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(56, 189, 248, 0.2)",
                  color: "#7DD3FC",
                }}
              >
                Neon Style
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(244, 114, 182, 0.2)",
                  color: "#F9A8D4",
                }}
              >
                3D Render
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  color: "#6EE7B7",
                }}
              >
                4K UHD Instant Export
              </span>
            </div>
          </div>
        )}

        {activeTab === "brand" && (
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "3px" }}>
              Synced with Admin Design Tokens
            </div>
            <div style={{ fontSize: "11px", color: "#A6A0BC", marginBottom: "12px" }}>
              All brand assets, colors, and typography stay synchronized across every poster.
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {["#7956C9", "#00C4CC", "#FF6B4A", "#F7D070", "#1E1A33"].map((color) => (
                <div
                  key={color}
                  style={{
                    flex: 1,
                    height: "32px",
                    borderRadius: "6px",
                    backgroundColor: color,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11.5px",
                color: "#10B981",
              }}
            >
              <CheckCircle2 size={14} />
              <span>Connected to Live Design System API</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Feature Proof Row */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={13} fill="#F7D070" color="#F7D070" />
            ))}
          </div>
          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#E2D9F7" }}>
            4.9/5 from 250k+ Creators
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", color: "#A6A0BC" }}>
          <span>✓ Free Forever</span>
          <span>✓ Commercial License</span>
        </div>
      </div>
    </div>
  );
};
