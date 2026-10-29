"use client";

import React from "react";
import { Link2 } from "lucide-react";
import type { GovernanceSchemaCompatibilityConfig } from "@/lib/governance-settings";

interface SchemaCompatibilityCardProps {
  schema: GovernanceSchemaCompatibilityConfig;
}

export const SchemaCompatibilityCard: React.FC<SchemaCompatibilityCardProps> = ({ schema }) => {
  const rows: { label: string; value: string; status: string }[] = [
    {
      label: "Current schema version",
      value: schema.currentSchemaVersion,
      status: schema.currentSchemaStatus,
    },
    {
      label: "Supported import schema versions",
      value: schema.supportedImportVersions,
      status: schema.supportedImportStatus,
    },
    {
      label: "Migration availability",
      value: schema.migrationAvailability,
      status: schema.migrationStatus,
    },
    {
      label: "Compatibility policy",
      value: schema.compatibilityPolicy,
      status: schema.compatibilityStatus,
    },
    {
      label: "Last successful validation",
      value: schema.lastSuccessfulValidation,
      status: schema.lastValidationStatus,
    },
  ];

  return (
    <div
      id="schema"
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
        <Link2 size={18} style={{ color: "var(--primary, #7956C9)" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
          Schema & Compatibility
        </h2>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12.5px",
              paddingBottom: idx !== rows.length - 1 ? "12px" : 0,
              borderBottom: idx !== rows.length - 1 ? "1px solid #F0ECF4" : "none",
            }}
          >
            <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>{row.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ color: "var(--text-muted, #777184)" }}>{row.value}</span>
              <span style={{ color: "#A29DB0", fontSize: "11.5px", minWidth: "85px", textAlign: "right" }}>
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

