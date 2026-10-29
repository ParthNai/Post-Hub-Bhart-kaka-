"use client";

import React, { useState } from "react";
import { Tag, ArrowRight } from "lucide-react";
import {
  type GovernanceNamingConfig,
  formatTokenNamingPreview,
} from "@/lib/governance-settings";

interface TokenNamingCardProps {
  naming: GovernanceNamingConfig;
  onChange: (updated: Partial<GovernanceNamingConfig>) => void;
}

export const TokenNamingCard: React.FC<TokenNamingCardProps> = ({ naming, onChange }) => {
  const [previewInput, setPreviewInput] = useState(naming.previewTokenName || "color");

  const previewOutput = formatTokenNamingPreview(previewInput, naming.namingStyle);

  return (
    <div
      id="naming"
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
        <Tag size={18} style={{ color: "var(--primary, #7956C9)" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
          Token naming conventions
        </h2>
      </div>

      {/* Form Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Naming style radios */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Naming style
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* kebab-case */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--text, #24213A)",
              }}
            >
              <input
                type="radio"
                name="namingStyle"
                checked={naming.namingStyle === "kebab-case"}
                onChange={() => onChange({ namingStyle: "kebab-case" })}
                style={{ accentColor: "var(--primary, #7956C9)", cursor: "pointer" }}
              />
              <span>kebab-case</span>
            </label>

            {/* dot notation */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--text, #24213A)",
              }}
            >
              <input
                type="radio"
                name="namingStyle"
                checked={naming.namingStyle === "dot-notation"}
                onChange={() => onChange({ namingStyle: "dot-notation" })}
                style={{ accentColor: "var(--primary, #7956C9)", cursor: "pointer" }}
              />
              <span>dot notation</span>
            </label>
          </div>
        </div>

        {/* Prefix / namespace */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Prefix / namespace
          </label>
          <input
            type="text"
            value={naming.prefixNamespace}
            onChange={(e) => onChange({ prefixNamespace: e.target.value })}
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

        {/* Category naming conventions */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "center" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text, #24213A)" }}>
            Category naming conventions
          </label>
          <select
            value={naming.categoryNamingConvention}
            onChange={(e) => onChange({ categoryNamingConvention: e.target.value })}
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
            <option value="Use lowercase category names">Use lowercase category names</option>
            <option value="Use uppercase category names">Use uppercase category names</option>
            <option value="Use camelCase category names">Use camelCase category names</option>
          </select>
        </div>

        {/* Example token names box */}
        <div
          style={{
            backgroundColor: "#FAF9FC",
            border: "1px solid #ECE7F2",
            borderRadius: "10px",
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text, #24213A)" }}>
              Example token names (as per current configuration)
            </span>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "10px",
                backgroundColor: "#F2EEF8",
                color: "var(--primary, #7956C9)",
                fontWeight: 600,
              }}
            >
              Examples only
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text, #24213A)" }}>
                color.primary
              </span>
              <span style={{ color: "var(--text-muted, #777184)" }}>(color category)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text, #24213A)" }}>
                typography.body
              </span>
              <span style={{ color: "var(--text-muted, #777184)" }}>(typography category)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text, #24213A)" }}>
                spacing.4
              </span>
              <span style={{ color: "var(--text-muted, #777184)" }}>(spacing category)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text, #24213A)" }}>
                radius.medium
              </span>
              <span style={{ color: "var(--text-muted, #777184)" }}>(radius category)</span>
            </div>
          </div>
        </div>

        {/* Live naming preview */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "8px",
            }}
          >
            Live naming preview
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <input
              type="text"
              value={previewInput}
              onChange={(e) => {
                setPreviewInput(e.target.value);
                onChange({ previewTokenName: e.target.value });
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                backgroundColor: "#FFFFFF",
                outline: "none",
              }}
            />
            <ArrowRight size={16} style={{ color: "var(--text-muted, #777184)" }} />
            <div
              style={{
                flex: 1.2,
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "#F7F5FB",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--primary, #7956C9)",
                fontFamily: "monospace",
              }}
            >
              {previewOutput}
            </div>
          </div>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)" }}>
            Preview updates based on your current settings.
          </span>
        </div>
      </div>
    </div>
  );
};
