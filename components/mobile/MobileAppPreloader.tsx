"use client";

import React, { useEffect, useState } from "react";

interface MobileAppPreloaderProps {
  primaryColor?: string;
  secondaryColor?: string;
  durationMs?: number;
  logoUrl?: string;
  title?: string;
  tagline?: string;
  videoUrl?: string;
  mediaType?: "animation" | "video" | string;
  skipButtonEnabled?: boolean;
  backgroundColor?: string;
  onComplete: () => void;
}

export function MobileAppPreloader({
  primaryColor = "#FE8706",
  secondaryColor = "#0055B8",
  durationMs = 2200,
  logoUrl,
  title = "Panchayat Post",
  tagline = "તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર",
  videoUrl,
  mediaType = "animation",
  skipButtonEnabled = true,
  backgroundColor = "#FFFFFF",
  onComplete,
}: MobileAppPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const isVideo = (mediaType === "video" || Boolean(videoUrl)) && Boolean(videoUrl && videoUrl.trim().length > 0);

  useEffect(() => {
    const startTime = Date.now();
    const targetDuration = Math.max(800, durationMs);
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / targetDuration) * 100));
      setProgress(pct);

      if (elapsed >= targetDuration) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: backgroundColor || "#FFFFFF",
        padding: "48px 24px 36px 24px",
        fontFamily: "var(--font-family-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        overflow: "hidden",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      {/* 1. Admin Configured Video Mode */}
      {isVideo ? (
        <>
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
            }}
          />
          {/* Subtle overlay for controls visibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        /* 2. Admin Configured Brand Animation Mode */
        <>
          {/* Decorative Brand Wave Accents */}
          <div
            style={{
              position: "absolute",
              top: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -120,
              right: -120,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${secondaryColor}1A 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Top Bar: Skip Button (Admin controlled) */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", zIndex: 10 }}>
        {skipButtonEnabled && (
          <button
            onClick={onComplete}
            type="button"
            style={{
              padding: "6px 14px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: isVideo ? "#FFFFFF" : "#64748B",
              background: isVideo ? "rgba(0, 0, 0, 0.45)" : "rgba(241, 245, 249, 0.8)",
              border: isVideo ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid #E2E8F0",
              borderRadius: "20px",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
              transition: "all 0.2s ease",
            }}
          >
            Skip ›
          </button>
        )}
      </div>

      {/* Center Brand Identity (Shown for animation mode or overlay) */}
      {!isVideo && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 360,
            marginTop: -20,
            zIndex: 10,
          }}
        >
          {/* Brand Logo / App Icon (From Admin Panel) */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "28px",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
              boxShadow: `0 12px 32px ${secondaryColor}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              marginBottom: 24,
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <img
              src={logoUrl && logoUrl.trim().length > 0 ? logoUrl : "/logo192.png"}
              alt="App Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith("/logo192.png") && !target.src.endsWith("/panchayat_logo.png")) {
                  target.src = "/logo192.png";
                }
              }}
            />
          </div>

          {/* Admin Provided Title */}
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0F172A",
              margin: "0 0 6px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span>{title}</span>
          </h1>

          {/* Admin Provided Tagline */}
          <p
            style={{
              fontSize: "0.88rem",
              color: "#64748B",
              fontWeight: 500,
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            {tagline}
          </p>
        </div>
      )}

      {/* Bottom Loading Arc & Progress (Using Admin Spinner Colors) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          zIndex: 10,
        }}
      >
        {/* Animated Dual-Arc Loading Indicator */}
        <div style={{ position: "relative", width: 44, height: 44 }}>
          <svg
            viewBox="0 0 44 44"
            style={{
              width: "100%",
              height: "100%",
              animation: "dualArcRotate 1.1s linear infinite",
            }}
          >
            {/* Primary Arc (Admin Color) */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={primaryColor}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeDasharray="40 70"
            />
            {/* Secondary Arc (Admin Secondary Color) */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeDasharray="30 80"
              strokeDashoffset="-55"
            />
          </svg>
        </div>

        {/* Loading Progress Bar & Percentage */}
        <div style={{ width: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: "100%",
              height: 4,
              backgroundColor: isVideo ? "rgba(255,255,255,0.3)" : "#F1F5F9",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                borderRadius: 4,
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: isVideo ? "#FFFFFF" : "#94A3B8",
              letterSpacing: "0.05em",
            }}
          >
            {progress}%
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes dualArcRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
