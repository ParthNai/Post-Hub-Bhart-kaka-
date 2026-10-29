"use client";

import React from "react";
import { PosterTemplate } from "@/lib/templates";

interface PosterArtworkProps {
  template: PosterTemplate;
  className?: string;
  style?: React.CSSProperties;
}

export const PosterArtwork: React.FC<PosterArtworkProps> = ({ template, style }) => {
  const { id, name, category, format, headline, subheadline, ctaText } = template;

  // We render tailored vector artwork matching the reference posters
  switch (id) {
    case "TPL-001":
      // Business Promotion Poster - Corporate skyscrapers & "Grow Your Business with Smart Solutions"
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          {/* Architectural building vector silhouette in background */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "55%",
              height: "85%",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="none">
              <rect x="10" y="25" width="22" height="95" fill="#60a5fa" />
              <rect x="36" y="10" width="28" height="110" fill="#93c5fd" />
              <rect x="68" y="35" width="25" height="85" fill="#3b82f6" />
              {/* Windows grid pattern */}
              <line x1="40" y1="18" x2="60" y2="18" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="28" x2="60" y2="28" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="38" x2="60" y2="38" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="48" x2="60" y2="48" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="58" x2="60" y2="58" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="68" x2="60" y2="68" stroke="#1e293b" strokeWidth="2" />
              <line x1="40" y1="78" x2="60" y2="78" stroke="#1e293b" strokeWidth="2" />
            </svg>
          </div>

          {/* Foreground content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#60a5fa",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Enterprise Growth
            </div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 800,
                lineHeight: "1.2",
                color: "#ffffff",
                marginBottom: "4px",
              }}
            >
              Grow Your Business
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              with Smart Solutions
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <div
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: "4px",
                display: "inline-block",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
              }}
            >
              Get Started
            </div>
            <div
              style={{
                fontSize: "8.5px",
                color: "#94a3b8",
                lineHeight: "1.2",
              }}
            >
              ★ Top Rated 2025
            </div>
          </div>
        </div>
      );

    case "TPL-002":
      // Diwali Festival Greeting - Deep warm night, glowing golden diya lamp & light bokeh
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at 50% 65%, #78350f 0%, #451a03 55%, #1c0902 100%)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 12px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            textAlign: "center",
            ...style,
          }}
        >
          {/* Bokeh particles */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 20%), radial-gradient(circle at 80% 30%, rgba(245, 158, 11, 0.25) 0%, transparent 25%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2, marginTop: "8px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#fde68a",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              Happy
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                color: "#fbbf24",
                textShadow: "0 2px 10px rgba(251, 191, 36, 0.5)",
                fontFamily: "serif",
              }}
            >
              Diwali
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#fef3c7",
                opacity: 0.9,
                fontWeight: 500,
              }}
            >
              Festival of Lights
            </div>
          </div>

          {/* Diya Oil Lamp SVG */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: "8px" }}>
            <svg width="68" height="48" viewBox="0 0 68 48">
              {/* Flame glow */}
              <circle cx="34" cy="14" r="14" fill="#fbbf24" opacity="0.3" filter="blur(4px)" />
              {/* Flame flame */}
              <path d="M34 4 C31 12 28 17 34 23 C40 17 37 12 34 4 Z" fill="#f59e0b" />
              <path d="M34 7 C32.5 12 30.5 16 34 21 C37.5 16 35.5 12 34 7 Z" fill="#fef08a" />
              {/* Diya clay bowl */}
              <ellipse cx="34" cy="30" rx="26" ry="10" fill="#9a3412" />
              <ellipse cx="34" cy="28" rx="24" ry="7" fill="#c2410c" />
              {/* Base */}
              <ellipse cx="34" cy="34" rx="14" ry="4" fill="#7c2d12" />
            </svg>
          </div>
        </div>
      );

    case "TPL-003":
      // Education Admission Poster - Clean light blue & white, student notebook
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
            color: "#0369a1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <span
              style={{
                backgroundColor: "#0284c7",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              2025 - 2026 BATCH
            </span>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#0c4a6e",
                lineHeight: "1.2",
                marginBottom: "3px",
              }}
            >
              ADMISSION OPEN
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#0284c7",
              }}
            >
              Build Your Future
            </div>
          </div>

          {/* Education Graphic Icon */}
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
              {/* Graduation Cap */}
              <path d="M30 16 L46 24 L30 32 L14 24 Z" fill="#0284c7" />
              <path d="M21 28.5 V36 C21 40 39 40 39 36 V28.5" stroke="#0284c7" strokeWidth="2" fill="none" />
              <path d="M43 25 V33" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="43" cy="34" r="2" fill="#f59e0b" />
            </svg>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "8px 10px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.12)",
              fontSize: "9px",
              color: "#334155",
            }}
          >
            <div style={{ fontWeight: 700, color: "#0c4a6e", marginBottom: "2px" }}>✓ Quality Education</div>
            <div>✓ Expert Faculty • Modern Campus</div>
          </div>
        </div>
      );

    case "TPL-004":
      // Product Promotion Poster - Minimal sleek studio, headphones
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            color: "#0f172a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: "1.2",
              }}
            >
              Premium Headphones
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                fontWeight: 500,
                marginTop: "2px",
              }}
            >
              Sound That Moves You
            </div>
          </div>

          {/* Headphones vector graphic */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <svg width="74" height="74" viewBox="0 0 80 80" fill="none">
              {/* Headband */}
              <path
                d="M18 48 C16 22 64 22 62 48"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left ear cup */}
              <rect x="10" y="42" width="16" height="24" rx="8" fill="#334155" />
              <rect x="13" y="45" width="10" height="18" rx="5" fill="#0f172a" />
              {/* Right ear cup */}
              <rect x="54" y="42" width="16" height="24" rx="8" fill="#334155" />
              <rect x="57" y="45" width="10" height="18" rx="5" fill="#0f172a" />
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "8.5px",
              color: "#475569",
              borderTop: "1px solid #cbd5e1",
              paddingTop: "6px",
            }}
          >
            <span>Hi-Fi Sound</span>
            <span>40h Battery</span>
            <span>All Day Comfort</span>
          </div>
        </div>
      );

    case "TPL-005":
      // Summer Sale Poster - Warm beach aesthetic, palm leaf accents, sunglasses
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(150deg, #ffedd5 0%, #fed7aa 60%, #fdba74 100%)",
            color: "#9a3412",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 12px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            textAlign: "center",
            ...style,
          }}
        >
          {/* Palm Silhouette graphic */}
          <div style={{ position: "absolute", top: -10, right: -10, opacity: 0.25, pointerEvents: "none" }}>
            <svg width="90" height="90" viewBox="0 0 100 100" fill="#c2410c">
              <path d="M90 10 C60 15 30 50 10 90 C40 70 75 40 90 10 Z" />
              <path d="M85 5 C65 25 45 60 25 85 C55 65 80 40 85 5 Z" />
            </svg>
          </div>

          <div style={{ position: "relative", zIndex: 2, marginTop: "6px" }}>
            <div
              style={{
                fontSize: "19px",
                fontWeight: 900,
                color: "#c2410c",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
              }}
            >
              Summer Sale
            </div>
            <div
              style={{
                backgroundColor: "#ea580c",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "999px",
                display: "inline-block",
                marginTop: "6px",
                boxShadow: "0 2px 6px rgba(234, 88, 12, 0.3)",
              }}
            >
              UP TO 50% OFF
            </div>
          </div>

          {/* Sunglasses graphic */}
          <div style={{ position: "relative", zIndex: 2, margin: "6px 0" }}>
            <svg width="68" height="28" viewBox="0 0 68 28" fill="none">
              <path d="M12 8 Q34 14 56 8" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              {/* Left Lens */}
              <path d="M8 8 C8 20 28 20 28 8 Z" fill="#1c1917" stroke="#7c2d12" strokeWidth="2" />
              {/* Right Lens */}
              <path d="M40 8 C40 20 60 20 60 8 Z" fill="#1c1917" stroke="#7c2d12" strokeWidth="2" />
            </svg>
          </div>

          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#7c2d12",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Shop Now →
          </div>
        </div>
      );

    case "TPL-006":
      // Real Estate Poster - Luxury villa exterior, modern architecture
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(155deg, #f8fafc 0%, #e2e8f0 100%)",
            color: "#1e293b",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: "1.2",
              }}
            >
              Find Your Dream Home
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#059669",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              Modern Living Spaces
            </div>
          </div>

          {/* Modern Villa Vector House */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="84" height="60" viewBox="0 0 90 65" fill="none">
              {/* Sky background */}
              <rect x="0" y="0" width="90" height="52" fill="#e0f2fe" rx="3" />
              {/* House main structure */}
              <rect x="15" y="16" width="60" height="34" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
              <rect x="12" y="12" width="66" height="5" fill="#334155" rx="1" />
              {/* Glass windows */}
              <rect x="20" y="22" width="22" height="24" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="1" />
              <line x1="31" y1="22" x2="31" y2="46" stroke="#ffffff" strokeWidth="1" />
              {/* Wooden door */}
              <rect x="48" y="26" width="12" height="24" fill="#b45309" />
              {/* Lawn Grass */}
              <rect x="0" y="50" width="90" height="15" fill="#10b981" />
            </svg>
          </div>

          <div
            style={{
              backgroundColor: "#065f46",
              color: "#ffffff",
              fontSize: "8.5px",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            Exclusive Properties Available
          </div>
        </div>
      );

    case "TPL-007":
      // Tech Conference Poster - Cyber geometric polygons & "Innovate Build Grow"
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          {/* Cyber geometric angles */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,60 100,100 0,100" fill="#4338ca" />
              <polygon points="0,40 100,90 100,100 0,100" fill="#6366f1" />
            </svg>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "#818cf8",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              TECH SUMMIT 2025
            </div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: "1.2",
              }}
            >
              Innovate Build Grow
            </div>
            <div
              style={{
                fontSize: "9.5px",
                color: "#c7d2fe",
                fontWeight: 500,
                marginTop: "3px",
              }}
            >
              Technology for a connected future
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "8.5px",
              color: "#a5b4fc",
            }}
          >
            <span>Oct 24 - 26</span>
            <span
              style={{
                backgroundColor: "#6366f1",
                color: "#ffffff",
                padding: "3px 8px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              Live Keynote
            </span>
          </div>
        </div>
      );

    case "TPL-008":
      // Home Decor Poster - Cozy living room furniture & "Modern Home Living"
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(150deg, #fef2f2 0%, #fdf2e9 50%, #f5ebe0 100%)",
            color: "#451a03",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#451a03",
                lineHeight: "1.2",
              }}
            >
              Modern Home Living
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#b45309",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              Style Meets Comfort
            </div>
          </div>

          {/* Living room sofa graphic */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="78" height="46" viewBox="0 0 80 46" fill="none">
              {/* Wall art frame behind sofa */}
              <rect x="28" y="4" width="24" height="16" fill="#fde68a" stroke="#d97706" strokeWidth="1" rx="1" />
              {/* Sofa back */}
              <rect x="14" y="16" width="52" height="18" rx="4" fill="#a16207" />
              {/* Sofa seat cushion */}
              <rect x="12" y="24" width="56" height="12" rx="3" fill="#ca8a04" />
              {/* Sofa armrests */}
              <rect x="8" y="20" width="8" height="16" rx="4" fill="#854d0e" />
              <rect x="64" y="20" width="8" height="16" rx="4" fill="#854d0e" />
              {/* Sofa legs */}
              <line x1="16" y1="36" x2="14" y2="44" stroke="#451a03" strokeWidth="2.5" />
              <line x1="64" y1="36" x2="66" y2="44" stroke="#451a03" strokeWidth="2.5" />
            </svg>
          </div>

          <div
            style={{
              fontSize: "8.5px",
              color: "#78350f",
              textAlign: "center",
              fontWeight: 600,
              borderTop: "1px solid #fed7aa",
              paddingTop: "5px",
            }}
          >
            New Autumn Furniture Collection
          </div>
        </div>
      );

    default:
      // Generic / Custom Poster
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${template.primaryColor || "#7956C9"} 0%, ${template.accentColor || "#24213A"} 100%)`,
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            ...style,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.8,
                marginBottom: "4px",
              }}
            >
              {category}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                lineHeight: "1.2",
              }}
            >
              {headline || name}
            </div>
            <div
              style={{
                fontSize: "10px",
                opacity: 0.85,
                marginTop: "3px",
              }}
            >
              {subheadline || format}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "8.5px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {ctaText || "View Details"}
          </div>
        </div>
      );
  }
};
