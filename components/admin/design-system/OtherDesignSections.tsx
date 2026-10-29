"use client";

import React from "react";
import type {
  ColorTokens,
  TypographyTokens,
  ComponentTokens,
  IconTokens,
  SpacingTokens,
} from "@/lib/design-system";
import {
  Palette,
  Type,
  Star,
  Layers,
  Grid,
} from "lucide-react";

// 1. Detailed Colors Section
interface ColorsSectionProps {
  colorTokens: ColorTokens;
  onChange: (colors: ColorTokens) => void;
}

export const ColorsSection: React.FC<ColorsSectionProps> = ({
  colorTokens,
  onChange,
}) => {
  const colorRoles = [
    { key: "primaryViolet", label: "Primary Violet", desc: "Main brand color, primary CTAs, active highlights" },
    { key: "softLavender", label: "Soft Lavender", desc: "Subtle backgrounds, selected states, chip fills" },
    { key: "warmIvory", label: "Warm Ivory", desc: "Global page background, canvas backdrop" },
    { key: "mainText", label: "Main Text", desc: "Primary typography, headings, high-contrast labels" },
    { key: "secondaryText", label: "Secondary Text", desc: "Subtitles, secondary body copy, metadata" },
    { key: "border", label: "Border", desc: "Card outlines, dividers, input borders" },
  ] as const;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Palette size={20} style={{ color: "var(--primary)" }} />
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
            Color Token System
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Configure and synchronize semantic color variables across the application and mobile apps.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {colorRoles.map((role) => (
          <div
            key={role.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border, #EAE4EE)",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "220px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  backgroundColor: colorTokens[role.key],
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                  {role.label}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {role.desc}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={colorTokens[role.key]}
                onChange={(e) =>
                  onChange({
                    ...colorTokens,
                    [role.key]: e.target.value.toUpperCase(),
                  })
                }
                style={{
                  width: "32px",
                  height: "32px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={colorTokens[role.key]}
                onChange={(e) =>
                  onChange({
                    ...colorTokens,
                    [role.key]: e.target.value.toUpperCase(),
                  })
                }
                style={{
                  width: "90px",
                  padding: "6px 10px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "6px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Typography Section
interface TypographySectionProps {
  typography: TypographyTokens;
  onChange: (typography: TypographyTokens) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
  typography,
  onChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Type size={20} style={{ color: "var(--primary)" }} />
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
            Typography Specifications
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Define the typographical scale, approved font families, and line-heights.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Font Family
          </label>
          <select
            value={typography.fontFamily}
            onChange={(e) => onChange({ ...typography, fontFamily: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="Inter, -apple-system, sans-serif">Inter (Approved Default)</option>
            <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="system-ui, sans-serif">System UI</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Headline Size
          </label>
          <select
            value={typography.headlineSize}
            onChange={(e) => onChange({ ...typography, headlineSize: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="20px">20px (Compact)</option>
            <option value="24px">24px (Standard)</option>
            <option value="28px">28px (Prominent)</option>
            <option value="32px">32px (Editorial Large)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Headline Weight
          </label>
          <select
            value={typography.headlineWeight}
            onChange={(e) => onChange({ ...typography, headlineWeight: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="600">600 (Semi-bold)</option>
            <option value="700">700 (Bold)</option>
            <option value="800">800 (Extra Bold)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Body Text Size
          </label>
          <select
            value={typography.bodySize}
            onChange={(e) => onChange({ ...typography, bodySize: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="13px">13px (Compact)</option>
            <option value="14px">14px (Default)</option>
            <option value="15px">15px (Relaxed)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// 3. Icons Section
interface IconsSectionProps {
  icons: IconTokens;
  onChange: (icons: IconTokens) => void;
}

export const IconsSection: React.FC<IconsSectionProps> = ({ icons, onChange }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Star size={20} style={{ color: "var(--primary)" }} />
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
            Iconography System
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Configure outline icon presets, default stroke weights, and icon sets.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Active Icon Set
          </label>
          <input
            type="text"
            disabled
            value={icons.iconSet}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              backgroundColor: "#F4F3F7",
              border: "1px solid var(--border, #EAE4EE)",
              color: "var(--text)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Default Icon Sizing
          </label>
          <select
            value={icons.defaultSize}
            onChange={(e) => onChange({ ...icons, defaultSize: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="16px">16px (Dense)</option>
            <option value="18px">18px (Standard)</option>
            <option value="20px">20px (Prominent)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Stroke Weight
          </label>
          <select
            value={icons.strokeWidth}
            onChange={(e) => onChange({ ...icons, strokeWidth: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="1.5px">1.5px (Light Outline)</option>
            <option value="2px">2.0px (Regular Outline)</option>
            <option value="2.5px">2.5px (Bold Accent)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// 4. Components Section
interface ComponentsSectionProps {
  components: ComponentTokens;
  onChange: (components: ComponentTokens) => void;
}

export const ComponentsSection: React.FC<ComponentsSectionProps> = ({
  components,
  onChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Layers size={20} style={{ color: "var(--primary)" }} />
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
            Component Presets
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Manage universal corner radii, card contours, and elevation profiles.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Input & Button Radius
          </label>
          <select
            value={components.borderRadius}
            onChange={(e) => onChange({ ...components, borderRadius: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="6px">6px (Subtle)</option>
            <option value="8px">8px (Standard - Approved)</option>
            <option value="12px">12px (Rounded)</option>
            <option value="999px">999px (Pill)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Card Border Radius
          </label>
          <select
            value={components.cardBorderRadius}
            onChange={(e) => onChange({ ...components, cardBorderRadius: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="12px">12px (Compact)</option>
            <option value="16px">16px (Standard - Approved)</option>
            <option value="20px">20px (Expressive)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Shadow Profile
          </label>
          <select
            value={components.shadowIntensity}
            onChange={(e) =>
              onChange({
                ...components,
                shadowIntensity: e.target.value as "subtle" | "medium" | "elevated",
              })
            }
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="subtle">Subtle (Clean Admin)</option>
            <option value="medium">Medium</option>
            <option value="elevated">Elevated</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// 5. Spacing & Layout Section
interface SpacingSectionProps {
  spacing: SpacingTokens;
  onChange: (spacing: SpacingTokens) => void;
}

export const SpacingSection: React.FC<SpacingSectionProps> = ({
  spacing,
  onChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Grid size={20} style={{ color: "var(--primary)" }} />
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>
            Spacing & Layout System
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Standardize structural grid increments and container constraints.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Base Spacing Unit
          </label>
          <select
            value={spacing.baseUnit}
            onChange={(e) => onChange({ ...spacing, baseUnit: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="4px">4px Grid System (Recommended)</option>
            <option value="8px">8px Grid System</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Container Padding
          </label>
          <select
            value={spacing.containerPadding}
            onChange={(e) => onChange({ ...spacing, containerPadding: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="16px">16px (Mobile Compact)</option>
            <option value="24px">24px (Standard Desktop)</option>
            <option value="32px">32px (Spacious)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
            Card Gap
          </label>
          <select
            value={spacing.cardGap}
            onChange={(e) => onChange({ ...spacing, cardGap: e.target.value })}
            style={{
              padding: "9px 12px",
              fontSize: "13.5px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              outline: "none",
            }}
          >
            <option value="12px">12px</option>
            <option value="16px">16px (Standard)</option>
            <option value="20px">20px</option>
          </select>
        </div>
      </div>
    </div>
  );
};
