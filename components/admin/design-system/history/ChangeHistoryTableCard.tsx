"use client";

import React from "react";
import { ChevronRight, Clock } from "lucide-react";
import type { VersionRecord } from "@/lib/version-history";

interface ChangeHistoryTableCardProps {
  records: VersionRecord[];
  selectedVersionId: string | null;
  onSelectVersion: (record: VersionRecord) => void;
}

export const ChangeHistoryTableCard: React.FC<ChangeHistoryTableCardProps> = ({
  records,
  selectedVersionId,
  onSelectVersion,
}) => {
  const getStatusBadge = (status: VersionRecord["status"]) => {
    switch (status) {
      case "draft":
        return { bg: "#F3EFFC", color: "#7956C9", label: "Draft" };
      case "published":
        return { bg: "#EDF7F2", color: "#12805C", label: "Published" };
      case "archived":
        return { bg: "#F1EFF4", color: "#777184", label: "Archived" };
      case "failed":
        return { bg: "#FDF2F2", color: "#D9383A", label: "Failed" };
      default:
        return { bg: "#F1EFF4", color: "#777184", label: status };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
      }}
    >
      {/* Header and Subtitle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Change history
          </h3>
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "14px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
            }}
          >
            Illustrative sample data
          </span>
        </div>

        <span
          style={{
            fontSize: "11.5px",
            color: "var(--text-muted, #777184)",
          }}
        >
          This is sample data. Actual change records will appear here once the version history is available.
        </span>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border, #EAE4EE)",
                color: "var(--text-muted, #777184)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <th style={{ padding: "10px 12px", width: "16%" }}>Version</th>
              <th style={{ padding: "10px 12px", width: "34%" }}>Change summary</th>
              <th style={{ padding: "10px 12px", width: "14%" }}>Author</th>
              <th style={{ padding: "10px 12px", width: "12%" }}>Timestamp</th>
              <th style={{ padding: "10px 12px", width: "12%" }}>Status</th>
              <th style={{ padding: "10px 12px", width: "12%", textAlign: "right" }}>Changed tokens</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => {
              const isSelected = selectedVersionId === rec.id;
              const badge = getStatusBadge(rec.status);

              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectVersion(rec)}
                  style={{
                    borderBottom: "1px solid #F5F1F8",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "rgba(121, 86, 201, 0.06)" : "transparent",
                    transition: "background-color 0.12s ease",
                  }}
                  className="version-row"
                >
                  {/* Version */}
                  <td style={{ padding: "14px 12px", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <ChevronRight
                        size={14}
                        style={{
                          color: isSelected ? "var(--primary, #7956C9)" : "#BFBAC7",
                          transform: isSelected ? "rotate(90deg)" : "none",
                          transition: "transform 0.15s ease",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace, sans-serif)",
                          color: isSelected ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                        }}
                      >
                        {rec.id}
                      </span>
                    </div>
                  </td>

                  {/* Summary */}
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "var(--text, #24213A)",
                      fontWeight: 500,
                    }}
                  >
                    {rec.summary}
                  </td>

                  {/* Author */}
                  <td style={{ padding: "14px 12px", color: "var(--text-muted, #777184)" }}>
                    {rec.author}
                  </td>

                  {/* Timestamp */}
                  <td style={{ padding: "14px 12px", color: "var(--text-muted, #777184)" }}>
                    {rec.timestamp}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: "14px 12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                  </td>

                  {/* Changed Tokens */}
                  <td
                    style={{
                      padding: "14px 12px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "var(--text, #24213A)",
                    }}
                  >
                    {rec.changedTokensCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State Box matching reference image */}
      <div
        style={{
          marginTop: "16px",
          padding: "32px 24px",
          borderRadius: "12px",
          border: "1px dashed var(--border, #EAE4EE)",
          backgroundColor: "#FAF9FC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4px",
          }}
        >
          <Clock size={20} />
        </div>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          No change history available
        </h4>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted, #777184)",
            margin: 0,
            maxWidth: "420px",
            lineHeight: "1.45",
          }}
        >
          There are no recorded changes yet. Once changes are made to the design system, they will appear here.
        </p>
      </div>
    </div>
  );
};
