"use client";

import React from "react";
import { Lock } from "lucide-react";
import type { GovernanceChangeProtectionConfig } from "@/lib/governance-settings";

interface ChangeProtectionCardProps {
  protection: GovernanceChangeProtectionConfig;
  onChange: (updated: Partial<GovernanceChangeProtectionConfig>) => void;
}

export const ChangeProtectionCard: React.FC<ChangeProtectionCardProps> = ({
  protection,
  onChange,
}) => {
  const protectionItems: {
    key: keyof GovernanceChangeProtectionConfig;
    title: string;
    description: string;
    statusKey: keyof GovernanceChangeProtectionConfig;
  }[] = [
    {
      key: "protectPublished",
      title: "Protect published configuration from direct draft edits",
      description: "Prevents changes to published settings without confirmation.",
      statusKey: "protectPublishedStatus",
    },
    {
      key: "confirmDestructiveRemoval",
      title: "Require confirmation for destructive token removal",
      description: "Adds an extra step before removing tokens.",
      statusKey: "confirmDestructiveRemovalStatus",
    },
    {
      key: "preserveHistoricalVersions",
      title: "Preserve historical versions when supported",
      description: "Keeps version history for rollback and audit.",
      statusKey: "preserveHistoricalVersionsStatus",
    },
    {
      key: "auditConfigurationChanges",
      title: "Audit configuration changes when supported",
      description: "Tracks and logs configuration changes.",
      statusKey: "auditConfigurationChangesStatus",
    },
  ];

  return (
    <div
      id="protection"
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
        <Lock size={18} style={{ color: "var(--primary, #7956C9)" }} />
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
          Change Protection
        </h2>
      </div>

      {/* Toggles List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {protectionItems.map((item) => {
          const isChecked = !!protection[item.key];
          const statusText = String(protection[item.statusKey]);

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
                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={() => onChange({ [item.key]: !isChecked })}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "12px",
                    backgroundColor: isChecked ? "var(--primary, #7956C9)" : "#D5CEE0",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.2s ease",
                    padding: 0,
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

                {/* Status pill */}
                <div style={{ minWidth: "85px", textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: "#F1EDF5",
                      color: "#777184",
                    }}
                  >
                    {statusText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
