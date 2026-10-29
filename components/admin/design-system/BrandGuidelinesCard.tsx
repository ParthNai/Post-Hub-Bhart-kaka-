"use client";

import React from "react";
import type { BrandGuidelines } from "@/lib/design-system";
import { FileText, ChevronDown } from "lucide-react";

interface BrandGuidelinesCardProps {
  guidelines: BrandGuidelines;
  onChange: (updated: BrandGuidelines) => void;
}

export const BrandGuidelinesCard: React.FC<BrandGuidelinesCardProps> = ({
  guidelines,
  onChange,
}) => {
  const handleChange = (field: keyof BrandGuidelines, val: string) => {
    onChange({
      ...guidelines,
      [field]: val,
    });
  };

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
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FileText size={17} style={{ color: "var(--text-muted, #777184)" }} />
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Brand Guidelines
        </h3>
      </div>

      {/* 4 Form Controls Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "14px",
        }}
      >
        {/* Brand Tone */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="guidelines-brand-tone"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
            }}
          >
            Brand tone
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="guidelines-brand-tone"
              value={guidelines.brandTone}
              onChange={(e) => handleChange("brandTone", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 30px 8px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text, #24213A)",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Professional">Professional</option>
              <option value="Creative & Bold">Creative & Bold</option>
              <option value="Playful & Friendly">Playful & Friendly</option>
              <option value="Minimal & Clean">Minimal & Clean</option>
              <option value="Authoritative">Authoritative</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted, #777184)",
              }}
            />
          </div>
        </div>

        {/* Visual Style */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="guidelines-visual-style"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
            }}
          >
            Visual style
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="guidelines-visual-style"
              value={guidelines.visualStyle}
              onChange={(e) => handleChange("visualStyle", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 30px 8px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text, #24213A)",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Clean and editorial">Clean and editorial</option>
              <option value="Modern Vibrant">Modern Vibrant</option>
              <option value="Corporate Minimal">Corporate Minimal</option>
              <option value="Artistic Festival">Artistic Festival</option>
              <option value="Bold Typography">Bold Typography</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted, #777184)",
              }}
            />
          </div>
        </div>

        {/* Theme */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="guidelines-theme"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
            }}
          >
            Theme
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="guidelines-theme"
              value={guidelines.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 30px 8px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text, #24213A)",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="Auto / System">Auto / System</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted, #777184)",
              }}
            />
          </div>
        </div>

        {/* Accent Color */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="guidelines-accent-color"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
            }}
          >
            Accent color
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="guidelines-accent-color"
              value={guidelines.accentColor}
              onChange={(e) => handleChange("accentColor", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 30px 8px 12px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text, #24213A)",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                appearance: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Violet">Violet</option>
              <option value="Indigo">Indigo</option>
              <option value="Electric Purple">Electric Purple</option>
              <option value="Emerald">Emerald</option>
              <option value="Amber">Amber</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted, #777184)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
