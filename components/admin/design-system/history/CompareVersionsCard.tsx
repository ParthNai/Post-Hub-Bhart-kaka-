"use client";

import React from "react";
import { RotateCw, ChevronDown } from "lucide-react";
import type { TokenDiffItem, VersionRecord } from "@/lib/version-history";

interface CompareVersionsCardProps {
  records: VersionRecord[];
  baseVersion: string;
  onBaseVersionChange: (ver: string) => void;
  compareVersion: string;
  onCompareVersionChange: (ver: string) => void;
  onCompare: () => void;
  isComparing: boolean;
  diffs: TokenDiffItem[];
}

export const CompareVersionsCard: React.FC<CompareVersionsCardProps> = ({
  records,
  baseVersion,
  onBaseVersionChange,
  compareVersion,
  onCompareVersionChange,
  onCompare,
  isComparing,
  diffs,
}) => {
  const getChangeBadge = (type: TokenDiffItem["changeType"]) => {
    switch (type) {
      case "Modified":
        return { bg: "#FEF3C7", color: "#D97706", label: "Modified" };
      case "Added":
        return { bg: "#EDF7F2", color: "#12805C", label: "Added" };
      case "Removed":
        return { bg: "#FDF2F2", color: "#D9383A", label: "Removed" };
      default:
        return { bg: "#F1EFF4", color: "#777184", label: type };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          margin: 0,
        }}
      >
        Compare versions
      </h3>

      {/* Selectors and Compare Action Button */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "10px",
          alignItems: "flex-end",
        }}
      >
        {/* Base version */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
            Base version
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={baseVersion}
              onChange={(e) => onBaseVersionChange(e.target.value)}
              aria-label="Base version selector"
              style={{
                width: "100%",
                appearance: "none",
                padding: "8px 28px 8px 12px",
                fontSize: "12.5px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="">Select version</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.status})
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              style={{
                position: "absolute",
                right: "9px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Compare with */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-muted, #777184)" }}>
            Compare with
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={compareVersion}
              onChange={(e) => onCompareVersionChange(e.target.value)}
              aria-label="Compare version selector"
              style={{
                width: "100%",
                appearance: "none",
                padding: "8px 28px 8px 12px",
                fontSize: "12.5px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="">Select version</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.status})
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              style={{
                position: "absolute",
                right: "9px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Compare Button */}
        <button
          type="button"
          onClick={onCompare}
          disabled={isComparing || !baseVersion || !compareVersion}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            height: "35px",
            borderRadius: "8px",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#FFFFFF",
            fontSize: "12.5px",
            fontWeight: 600,
            border: "none",
            cursor: isComparing || !baseVersion || !compareVersion ? "not-allowed" : "pointer",
            opacity: isComparing || !baseVersion || !compareVersion ? 0.6 : 1,
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          <RotateCw size={13} className={isComparing ? "animate-spin" : ""} />
          <span>Compare</span>
        </button>
      </div>

      {/* Diff Table */}
      <div style={{ overflowX: "auto", marginTop: "2px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 2px",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--primary, #7956C9)",
              backgroundColor: "#F2EDF8",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            Illustrative sample data
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--text-muted, #777184)" }}>
            {diffs.length} differences identified
          </span>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "12.5px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border, #EAE4EE)",
                color: "var(--text-muted, #777184)",
                fontSize: "11.5px",
                fontWeight: 600,
              }}
            >
              <th style={{ padding: "8px 10px", width: "32%" }}>Token</th>
              <th style={{ padding: "8px 10px", width: "24%" }}>Previous value</th>
              <th style={{ padding: "8px 10px", width: "24%" }}>New value</th>
              <th style={{ padding: "8px 10px", width: "20%", textAlign: "right" }}>Change type</th>
            </tr>
          </thead>
          <tbody>
            {diffs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "24px 10px",
                    textAlign: "center",
                    color: "var(--text-muted, #777184)",
                    fontSize: "12px",
                  }}
                >
                  No differences found between selected versions.
                </td>
              </tr>
            ) : (
              diffs.map((diff) => {
                const badge = getChangeBadge(diff.changeType);
                return (
                  <tr key={diff.tokenId} style={{ borderBottom: "1px solid #F5F1F8" }}>
                    {/* Token */}
                    <td
                      style={{
                        padding: "10px",
                        fontFamily: "var(--font-mono, monospace, sans-serif)",
                        fontWeight: 600,
                        color: "var(--text, #24213A)",
                      }}
                    >
                      {diff.tokenId}
                    </td>

                    {/* Previous Value */}
                    <td style={{ padding: "10px", color: "var(--text-muted, #777184)" }}>
                      {diff.previousValue}
                    </td>

                    {/* New Value */}
                    <td style={{ padding: "10px", fontWeight: 600, color: "var(--text, #24213A)" }}>
                      {diff.newValue}
                    </td>

                    {/* Change Type Badge */}
                    <td style={{ padding: "10px", textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

