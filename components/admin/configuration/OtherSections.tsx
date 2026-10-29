"use client";

import React from "react";
import { AppScreen } from "@/lib/screens";

interface SectionProps {
  config: AppScreen["configData"];
  onChange: (updated: Partial<AppScreen["configData"]>) => void;
}

export const LayoutSection: React.FC<SectionProps> = ({ config, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
          Layout Configuration
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Manage layout structures, container widths, and responsive grid parameters.
        </p>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
          Component Layout Mode
        </label>
        <select
          value={config.defaultLayout || "grid"}
          onChange={(e) => onChange({ defaultLayout: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
          }}
          className="form-control-input"
        >
          <option value="grid">Standard Responsive Grid</option>
          <option value="masonry">Dynamic Masonry Layout</option>
          <option value="carousel_grid">Hero Carousel + Featured Grid</option>
          <option value="split_canvas">Split Interactive Canvas</option>
          <option value="form_sections">Structured Settings Sections</option>
        </select>
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          Defines the default layout hierarchy rendered by client components.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
            Items Per Batch / Page
          </label>
          <input
            type="number"
            min="4"
            max="60"
            value={config.itemsPerPage || 12}
            onChange={(e) => onChange({ itemsPerPage: Number(e.target.value) })}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              padding: "0 12px",
              fontSize: "13px",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
            className="form-control-input"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
            Grid Columns (Desktop)
          </label>
          <select
            value={config.gridColumns || 3}
            onChange={(e) => onChange({ gridColumns: Number(e.target.value) })}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              padding: "0 12px",
              fontSize: "13px",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
            className="form-control-input"
          >
            <option value="2">2 Columns</option>
            <option value="3">3 Columns</option>
            <option value="4">4 Columns</option>
          </select>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
              Show Hero Banner / Carousel
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              Renders the top marketing banner on client startup
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.bannerVisible)}
            onChange={(e) => onChange({ bannerVisible: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
          />
        </label>
      </div>
    </div>
  );
};

export const SectionsSection: React.FC<SectionProps> = ({ config, onChange }) => {
  const sections = config.sections || [
    { id: "hero", title: "Hero Banner", enabled: true, order: 1 },
    { id: "categories", title: "Category Rail", enabled: true, order: 2 },
    { id: "featured_templates", title: "Featured Templates", enabled: true, order: 3 },
    { id: "action_banner", title: "Action Banner", enabled: true, order: 4 },
  ];

  const handleToggle = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onChange({ sections: updated });
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s));
    onChange({ sections: updated });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
          App Sections Management
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Enable, disable, or rename individual content modules rendered within this screen.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sections.map((sec) => (
          <div
            key={sec.id}
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: sec.enabled ? "var(--surface)" : "#FAF7FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <input
                type="checkbox"
                checked={sec.enabled}
                onChange={() => handleToggle(sec.id)}
                style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
              />
              <input
                type="text"
                value={sec.title}
                onChange={(e) => handleTitleChange(sec.id, e.target.value)}
                style={{
                  flex: 1,
                  height: "32px",
                  border: "1px solid transparent",
                  borderRadius: "6px",
                  padding: "0 8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text)",
                  backgroundColor: "transparent",
                }}
                className="section-title-input"
              />
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-light)" }}>Section #{sec.order}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AppearanceSection: React.FC<SectionProps> = ({ config, onChange }) => {
  const COLOR_PALETTES = [
    { label: "Royal Violet", hex: "#7956C9" },
    { label: "Ocean Blue", hex: "#2563EB" },
    { label: "Emerald Green", hex: "#059669" },
    { label: "Ruby Red", hex: "#DC2626" },
    { label: "Amber Gold", hex: "#D97706" },
    { label: "Midnight", hex: "#111827" },
  ];

  const BG_PRESETS = [
    { label: "Pure White", hex: "#FFFFFF" },
    { label: "Soft Lavender", hex: "#F8F7FC" },
    { label: "Warm Cream", hex: "#FAF7F2" },
    { label: "Dark Studio", hex: "#13111C" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
          Appearance & Styling Tokens
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Customize design token presets, brand accent colors, and background theme for this screen.
        </p>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
          Theme Preset Token
        </label>
        <select
          value={config.activeTheme || "default"}
          onChange={(e) => {
            const theme = e.target.value;
            let defaultBg = "#FFFFFF";
            let defaultAccent = config.primaryAccent || "#7956C9";
            if (theme === "dark_studio") {
              defaultBg = "#13111C";
              defaultAccent = "#906CE8";
            } else if (theme === "warm_creative") {
              defaultBg = "#FFFDF9";
              defaultAccent = "#E65100";
            } else if (theme === "lavender_minimal") {
              defaultBg = "#F8F7FF";
              defaultAccent = "#6366F1";
            }
            onChange({
              activeTheme: theme,
              backgroundColor: defaultBg,
              primaryAccent: defaultAccent,
            });
          }}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
          }}
          className="form-control-input"
        >
          <option value="default">Post Hub Default (Clean White & Violet)</option>
          <option value="dark_studio">Dark Studio Contrast (Deep Night & Glow)</option>
          <option value="warm_creative">Warm Creative Studio (Warm Cream & Amber)</option>
          <option value="lavender_minimal">Lavender Minimalist (Soft Indigo & Clean)</option>
        </select>
      </div>

      {/* Primary Accent Color & Palettes */}
      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
          Primary Accent Color
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <input
            type="color"
            value={config.primaryAccent || "#7956C9"}
            onChange={(e) => onChange({ primaryAccent: e.target.value })}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            value={config.primaryAccent || "#7956C9"}
            onChange={(e) => onChange({ primaryAccent: e.target.value })}
            placeholder="#7956C9"
            style={{
              flex: 1,
              height: "38px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              padding: "0 12px",
              fontSize: "13px",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
            className="form-control-input"
          />
        </div>

        {/* Quick color swatches */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {COLOR_PALETTES.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => onChange({ primaryAccent: c.hex })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: config.primaryAccent === c.hex ? `2px solid ${c.hex}` : "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                cursor: "pointer",
                fontSize: "11px",
                color: "var(--text)",
              }}
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Background Color */}
      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
          Full-Page Screen Background
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <input
            type="color"
            value={config.backgroundColor || (config.activeTheme === "dark_studio" ? "#13111C" : "#FFFFFF")}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            value={config.backgroundColor || (config.activeTheme === "dark_studio" ? "#13111C" : "#FFFFFF")}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            placeholder="#FFFFFF"
            style={{
              flex: 1,
              height: "38px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              padding: "0 12px",
              fontSize: "13px",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
            className="form-control-input"
          />
        </div>

        {/* Quick BG Presets */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {BG_PRESETS.map((b) => (
            <button
              key={b.hex}
              type="button"
              onClick={() => onChange({ backgroundColor: b.hex })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: (config.backgroundColor || "#FFFFFF") === b.hex ? "2px solid var(--primary)" : "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                cursor: "pointer",
                fontSize: "11px",
                color: "var(--text)",
              }}
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: b.hex, border: "1px solid #CCC" }} />
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Corner Radius */}
      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
          Component Corner Radius
        </label>
        <select
          value={config.cardRadius || "12px"}
          onChange={(e) => onChange({ cardRadius: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
          }}
          className="form-control-input"
        >
          <option value="0px">0px (Flat / Full Fit Edge-to-Edge)</option>
          <option value="8px">8px (Crisp Subtle)</option>
          <option value="12px">12px (Smooth / Standard)</option>
          <option value="16px">16px (Rounded)</option>
          <option value="24px">24px (Soft Pill)</option>
        </select>
      </div>
    </div>
  );
};

export const NavigationSection: React.FC<SectionProps> = ({ config, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
          Navigation & Deep Links
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Manage client bottom navigation presence, tab ordering, and external deep linking.
        </p>
      </div>

      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
              Show in Bottom Navigation Tab Bar
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              Places a primary icon shortcut on the mobile application bottom bar
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.showInBottomNav ?? true)}
            onChange={(e) => onChange({ showInBottomNav: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
          />
        </label>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
          Client App Deep Link Scheme
        </label>
        <input
          type="text"
          value={config.deepLinkRoute || "posthub://screens/home"}
          onChange={(e) => onChange({ deepLinkRoute: e.target.value })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            fontFamily: "monospace",
          }}
          className="form-control-input"
        />
        <div style={{ fontSize: "11.5px", color: "var(--text-light)", marginTop: "4px" }}>
          Used by push notifications and external web links to jump straight to this screen.
        </div>
      </div>
    </div>
  );
};

export const AdvancedSection: React.FC<SectionProps> = ({ config, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
          Advanced & Caching Options
        </h3>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
          Manage client-side caching timeouts, offline persistence, and telemetry flags.
        </p>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "var(--text)", marginBottom: "5px" }}>
          Client Cache TTL (Seconds)
        </label>
        <input
          type="number"
          min="60"
          max="86400"
          value={config.cacheTtlSeconds || 3600}
          onChange={(e) => onChange({ cacheTtlSeconds: Number(e.target.value) })}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            padding: "0 12px",
            fontSize: "13px",
            color: "var(--text)",
            backgroundColor: "var(--surface)",
          }}
          className="form-control-input"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
              Refresh on App Focus
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              Re-queries remote configuration whenever the user brings the app to foreground
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.refreshOnFocus ?? true)}
            onChange={(e) => onChange({ refreshOnFocus: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
              Enable Offline Cache Storage
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              Allows offline rendering using the last published snapshot
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.offlineFallback ?? true)}
            onChange={(e) => onChange({ offlineFallback: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
          />
        </label>
      </div>
    </div>
  );
};
