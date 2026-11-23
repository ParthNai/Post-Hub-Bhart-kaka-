"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface MobileAppPreloaderProps {
  primaryColor?: string;
  secondaryColor?: string;
  durationMs?: number;
  logoUrl?: string;
  tagline?: string;
  onComplete: () => void;
}

export function MobileAppPreloader({
  primaryColor = "#FE8706",
  secondaryColor = "#0055B8",
  durationMs = 2200,
  logoUrl,
  tagline = "Create. Celebrate. Share.",
  onComplete,
}: MobileAppPreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed >= durationMs) {
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
        backgroundColor: "#FFFFFF",
        padding: "48px 24px 36px 24px",
        fontFamily: "var(--font-family-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        overflow: "hidden",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      {/* Decorative Brand Wave Accents */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(254, 135, 6, 0.12) 0%, transparent 70%)",
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
          background: "radial-gradient(circle, rgba(0, 85, 184, 0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top spacer & Skip Button */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onComplete}
          type="button"
          style={{
            padding: "6px 14px",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#64748B",
            background: "rgba(241, 245, 249, 0.8)",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "all 0.2s ease",
          }}
        >
          Skip ›
        </button>
      </div>

      {/* Center Brand Identity */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 360,
          marginTop: -20,
        }}
      >
        {/* Brand Logo */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "28px",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
            boxShadow: "0 12px 32px rgba(0, 85, 184, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            marginBottom: 24,
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Panchayat Post Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                // Fallback to default emblem if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <img
              src="/logo192.png"
              alt="Panchayat Post Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Brand Title */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#0F172A",
            margin: "0 0 6px 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Panchayat</span>
          <span style={{ color: secondaryColor }}>Post</span>
        </h1>

        {/* Tagline */}
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

      {/* Bottom Loading Arc & Version */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: "100%",
        }}
      >
        {/* Animated Dual-Arc Spinner */}
        <div
          style={{
            position: "relative",
            width: 44,
            height: 44,
          }}
        >
          <svg
            viewBox="0 0 44 44"
            style={{
              width: "100%",
              height: "100%",
              animation: "spin 1.1s linear infinite",
            }}
          >
            {/* Primary Arc (Orange) */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={primaryColor}
              strokeWidth="3.4"
              strokeDasharray="42 70"
              strokeLinecap="round"
            />
            {/* Secondary Arc (Blue) */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="3.4"
              strokeDasharray="42 70"
              strokeDashoffset="56"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Version info */}
        <div
          style={{
            fontSize: "0.72rem",
            color: "#94A3B8",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          v2.4.0 • Official Digital Panchayat
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
