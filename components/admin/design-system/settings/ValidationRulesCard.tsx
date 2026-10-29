"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { GovernanceValidationRulesConfig } from "@/lib/governance-settings";

interface ValidationRulesCardProps {
  rules: GovernanceValidationRulesConfig;
  onChange: (updated: Partial<GovernanceValidationRulesConfig>) => void;
}

export const ValidationRulesCard: React.FC<ValidationRulesCardProps> = ({ rules, onChange }) => {
  const toggleItems: {
    key: keyof GovernanceValidationRulesConfig;
    title: string;
    description: string;
    status: "Supported" | "Required" | "Unavailable";
    disabled?: boolean;
  }[] = [
    {
      key: "rejectDuplicateTokens",
      title: "Reject duplicate token identifiers",
      description: "Prevents tokens with the same identifier from being added.",
      status: "Supported",
    },
    {
      key: "validateSchemaValues",
      title: "Validate token values against the active schema",
      description: "Ensures values match the expected format and rules.",
      status: "Required",
      disabled: true, // Always locked as required
    },
    {
      key: "rejectUnsupportedCategories",
      title: "Reject unsupported token categories",
      description: "Blocks tokens from non-allowed categories.",
      status: "Supported",
    },
    {
      key: "validateAliases",
      title: "Validate aliases when supported",
      description: "Checks alias references for validity.",
      status: "Unavailable",
      disabled: true,
    },
    {
      key: "requireImportConfirmation",
      title: "Require explicit confirmation before importing",
      description: "Prevents accidental imports of unvalidated configurations.",
      status: "Supported",
    },
  ];

  const renderBadge = (status: "Supported" | "Required" | "Unavailable") => {
    if (status === "Supported") {
      return (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "12px",
            backgroundColor: "#EBF8F2",
            color: "#1E8E5A",
          }}
        >
          Supported
        </span>
      );
    }
    if (status === "Required") {
      return (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "12px",
            backgroundColor: "#FCE8E6",
            color: "#D93025",
          }}
        >
          Required
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "12px",
          backgroundColor: "#F1EDF5",
          color: "#777184",
        }}
      >
        Unavailable
      </span>
    );
  };

  return (
    <div
      id="validation"
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
        <ShieldCheck size={18} style={{ color: "var(--primary, #7956C9)" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
          Validation rules
        </h2>
      </div>

      {/* Rules List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {toggleItems.map((item) => {
          const isChecked = !!rules[item.key];
          return (
            <div
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "14px",
                borderBottom: "1px solid #F0ECF4",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted, #777184)", marginTop: "2px" }}>
                  {item.description}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Toggle switch button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      onChange({ [item.key]: !isChecked });
                    }
                  }}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "12px",
                    backgroundColor: isChecked ? "var(--primary, #7956C9)" : "#D5CEE0",
                    border: "none",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    position: "relative",
                    transition: "all 0.2s ease",
                    padding: 0,
                    opacity: item.disabled ? 0.75 : 1,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: isChecked ? "18px" : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease",
                    }}
                  />
                </button>

                {/* Status Badge */}
                <div style={{ minWidth: "75px", textAlign: "right" }}>
                  {renderBadge(item.status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
