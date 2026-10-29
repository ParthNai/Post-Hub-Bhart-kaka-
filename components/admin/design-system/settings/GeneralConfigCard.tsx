"use client";

import React from "react";
import { Settings, Info } from "lucide-react";
import type { GovernanceGeneralConfig, MeasurementUnit } from "@/lib/governance-settings";

interface GeneralConfigCardProps {
  general: GovernanceGeneralConfig;
  onChange: (updated: Partial<GovernanceGeneralConfig>) => void;
}

export const GeneralConfigCard: React.FC<GeneralConfigCardProps> = ({ general, onChange }) => {
  return (
    <div
      id="general"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Settings size={18} style={{ color: "var(--primary, #7956C9)" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
          General configuration
        </h2>
      </div>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Field 1: Design system name */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Design system name
          </label>
          <input
            type="text"
            value={general.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#FFFFFF",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Field 2: Configuration description */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "start" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)", paddingTop: "8px" }}>
            Configuration description
          </label>
          <textarea
            value={general.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={2}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#FFFFFF",
              outline: "none",
              width: "100%",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Field 3: Token namespace */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Token namespace
          </label>
          <input
            type="text"
            value={general.namespace}
            onChange={(e) => onChange({ namespace: e.target.value })}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#FFFFFF",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Field 4: Default measurement unit */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Default measurement unit
          </label>
          <select
            value={general.defaultUnit}
            onChange={(e) => onChange({ defaultUnit: e.target.value as MeasurementUnit })}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#FFFFFF",
              outline: "none",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="pt">pt</option>
          </select>
        </div>

        {/* Field 5: Active schema version */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Active schema version
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted, #777184)" }}>
            {general.activeSchemaVersion}
          </span>
        </div>

        {/* Field 6: Environment */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Environment
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted, #777184)" }}>
            {general.environment}
          </span>
        </div>
      </div>

      {/* Info Callout Box */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px 16px",
          borderRadius: "10px",
          backgroundColor: "#FAF9FC",
          border: "1px solid #ECE7F2",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <Info size={15} style={{ color: "var(--primary, #7956C9)", marginTop: "2px", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: "var(--text-muted, #777184)", lineHeight: 1.5 }}>
          Changing the design-system name or namespace must not automatically rename existing tokens.
        </span>
      </div>
    </div>
  );
};
