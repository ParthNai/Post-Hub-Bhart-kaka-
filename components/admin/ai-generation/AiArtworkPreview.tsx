"use client";

import React from "react";
import type { AiGenerationRequest } from "@/lib/ai-generation";

interface AiArtworkPreviewProps {
  request: AiGenerationRequest;
  size?: "thumb" | "full" | "medium";
  className?: string;
  style?: React.CSSProperties;
}

export const AiArtworkPreview: React.FC<AiArtworkPreviewProps> = ({
  request,
  size = "thumb",
  style,
}) => {
  const { id, prompt, headline, subheadline, themeColor } = request;

  const isFull = size === "full";

  // Specific high-fidelity artwork matching the reference image for REQ-001247 (Diwali Festival)
  if (id === "REQ-001247" || prompt.toLowerCase().includes("diwali")) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at 50% 65%, #6d281e 0%, #3a0d08 45%, #180503 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isFull ? "32px 24px" : "8px 6px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        {/* Ornate Mandala Arch in background */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: isFull ? "380px" : "120px",
            height: isFull ? "380px" : "120px",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 3" />
            <path
              d="M100 10 L108 30 L130 30 L112 44 L119 65 L100 52 L81 65 L88 44 L70 30 L92 30 Z"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Ambient Warm Golden Glow */}
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: isFull ? "280px" : "90px",
            height: isFull ? "160px" : "50px",
            background: "radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(217,119,6,0.15) 50%, transparent 80%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }}
        />

        {/* Header Text */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: isFull ? "16px" : "2px" }}>
          <div
            style={{
              fontSize: isFull ? "13px" : "6px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#fcd34d",
              textTransform: "uppercase",
              marginBottom: isFull ? "8px" : "2px",
            }}
          >
            ✧ Happy ✧
          </div>
          <div
            style={{
              fontSize: isFull ? "36px" : "12px",
              fontWeight: 800,
              fontFamily: "Georgia, serif",
              lineHeight: 1.1,
              background: "linear-gradient(180deg, #fffbeb 0%, #fef08a 40%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
              marginBottom: isFull ? "10px" : "2px",
            }}
          >
            Diwali
          </div>
          <div
            style={{
              fontSize: isFull ? "12px" : "5.5px",
              color: "#fed7aa",
              maxWidth: isFull ? "280px" : "100%",
              margin: "0 auto",
              lineHeight: 1.35,
              opacity: 0.9,
            }}
          >
            {isFull ? "May the festival of lights bring happiness and prosperity" : "Festival of Lights"}
          </div>
        </div>

        {/* Diyas Illustration: 3 Clay Lamps */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: isFull ? "20px" : "6px",
            marginBottom: isFull ? "24px" : "4px",
          }}
        >
          {/* Left Diya */}
          <div style={{ transform: isFull ? "scale(0.85)" : "scale(0.75)" }}>
            <DiyaSvg isFull={isFull} />
          </div>

          {/* Center Main Diya */}
          <div style={{ transform: isFull ? "scale(1.2)" : "scale(1)" }}>
            <DiyaSvg isFull={isFull} />
          </div>

          {/* Right Diya */}
          <div style={{ transform: isFull ? "scale(0.85)" : "scale(0.75)" }}>
            <DiyaSvg isFull={isFull} />
          </div>
        </div>
      </div>
    );
  }

  // REQ-001246: Business growth banner
  if (id === "REQ-001246" || prompt.toLowerCase().includes("business")) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isFull ? "24px" : "8px 6px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "60%",
            height: "80%",
            opacity: 0.28,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="none">
            <rect x="15" y="30" width="22" height="90" fill="#38bdf8" />
            <rect x="42" y="10" width="28" height="110" fill="#0284c7" />
            <rect x="74" y="45" width="20" height="75" fill="#bae6fd" />
          </svg>
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: isFull ? "11px" : "6px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>
            Corporate Growth
          </div>
          <div style={{ fontSize: isFull ? "20px" : "10px", fontWeight: 800, lineHeight: 1.2, marginTop: "2px" }}>
            Grow Your Business
          </div>
          <div style={{ fontSize: isFull ? "12px" : "6px", color: "#cbd5e1" }}>
            with Smart Solutions
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <span
            style={{
              display: "inline-block",
              background: "#0284c7",
              color: "#fff",
              fontSize: isFull ? "11px" : "6px",
              padding: isFull ? "6px 14px" : "2px 6px",
              borderRadius: "4px",
              fontWeight: 600,
            }}
          >
            Get Started
          </span>
        </div>
      </div>
    );
  }

  // REQ-001245: Education admission poster
  if (id === "REQ-001245" || prompt.toLowerCase().includes("education")) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(150deg, #042f2e 0%, #115e59 55%, #134e4a 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isFull ? "24px" : "8px 6px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: isFull ? "11px" : "6px", color: "#5eead4", fontWeight: 700, textTransform: "uppercase" }}>
            Academic Session 2026
          </div>
          <div style={{ fontSize: isFull ? "22px" : "10px", fontWeight: 800, lineHeight: 1.15, marginTop: "4px" }}>
            ADMISSION OPEN
          </div>
          <div style={{ fontSize: isFull ? "12px" : "6px", color: "#ccfbf1", marginTop: "2px" }}>
            Build Your Future
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              background: "#f59e0b",
              color: "#1e293b",
              fontSize: isFull ? "11px" : "6px",
              padding: isFull ? "6px 14px" : "2px 6px",
              borderRadius: "4px",
              fontWeight: 700,
            }}
          >
            Enroll Now
          </span>
        </div>
      </div>
    );
  }

  // REQ-001244: Big Sale offer poster
  if (id === "REQ-001244" || prompt.toLowerCase().includes("sale")) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 50% 50%, #dc2626 0%, #991b1b 60%, #450a0a 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: isFull ? "24px" : "8px 6px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            background: "#fef08a",
            color: "#991b1b",
            fontSize: isFull ? "12px" : "6px",
            fontWeight: 800,
            padding: isFull ? "4px 14px" : "2px 6px",
            borderRadius: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: isFull ? "8px" : "2px",
          }}
        >
          Special Offer
        </div>
        <div
          style={{
            fontSize: isFull ? "38px" : "14px",
            fontWeight: 900,
            lineHeight: 1,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          BIG SALE
        </div>
        <div
          style={{
            fontSize: isFull ? "18px" : "8px",
            fontWeight: 800,
            color: "#fef08a",
            marginTop: isFull ? "6px" : "2px",
          }}
        >
          UP TO 50% OFF
        </div>
      </div>
    );
  }

  // REQ-001243: New year greeting with fireworks
  if (id === "REQ-001243" || prompt.toLowerCase().includes("new year")) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #0f172a 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: isFull ? "24px" : "8px 6px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            fontSize: isFull ? "12px" : "6px",
            letterSpacing: "0.2em",
            color: "#a5b4fc",
            textTransform: "uppercase",
            marginBottom: isFull ? "6px" : "2px",
          }}
        >
          ✦ Welcome ✦
        </div>
        <div
          style={{
            fontSize: isFull ? "28px" : "11px",
            fontWeight: 800,
            fontFamily: "Georgia, serif",
            background: "linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Happy New Year
        </div>
        <div
          style={{
            fontSize: isFull ? "20px" : "9px",
            fontWeight: 700,
            color: "#f59e0b",
            marginTop: isFull ? "4px" : "2px",
          }}
        >
          2027
        </div>
      </div>
    );
  }

  // General fallback vector canvas
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${themeColor || "#24213a"} 0%, #171526 100%)`,
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isFull ? "24px" : "8px 6px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div>
        <div style={{ fontSize: isFull ? "11px" : "6px", color: "rgba(255,255,255,0.7)" }}>
          {request.style}
        </div>
        <div style={{ fontSize: isFull ? "18px" : "9px", fontWeight: 700, marginTop: "2px" }}>
          {headline || request.id}
        </div>
      </div>
      <div style={{ fontSize: isFull ? "11px" : "6px", color: "rgba(255,255,255,0.8)" }}>
        {subheadline || request.provider}
      </div>
    </div>
  );
};

// Reusable Diya SVG with glowing golden flame
const DiyaSvg: React.FC<{ isFull: boolean }> = ({ isFull }) => {
  const width = isFull ? 56 : 22;
  const height = isFull ? 48 : 20;

  return (
    <svg width={width} height={height} viewBox="0 0 60 50" fill="none">
      {/* Flame Outer Glow */}
      <circle cx="30" cy="18" r="14" fill="rgba(251,191,36,0.35)" filter="blur(4px)" />

      {/* Flame Body */}
      <path
        d="M30 4 C34 12, 38 18, 30 25 C22 18, 26 12, 30 4 Z"
        fill="url(#flameGradient)"
      />

      {/* Flame Inner Core */}
      <path
        d="M30 10 C32 14, 34 18, 30 22 C26 18, 28 14, 30 10 Z"
        fill="#ffffff"
      />

      {/* Terracotta Clay Lamp Base */}
      <path
        d="M10 28 Q30 31 50 28 Q46 44 30 44 Q14 44 10 28 Z"
        fill="url(#clayGradient)"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Lamp Rim */}
      <ellipse cx="30" cy="28" rx="20" ry="4" fill="#92400e" />
      <ellipse cx="30" cy="28" rx="16" ry="2.5" fill="#f59e0b" opacity="0.6" />

      {/* Lamp Stand */}
      <ellipse cx="30" cy="44" rx="10" ry="2.5" fill="#451a03" />

      <defs>
        <linearGradient id="flameGradient" x1="30" y1="4" x2="30" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#fef08a" />
          <stop offset="0.7" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="clayGradient" x1="30" y1="28" x2="30" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b45309" />
          <stop offset="0.6" stopColor="#78350f" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
      </defs>
    </svg>
  );
};

