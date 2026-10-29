"use client";

import React from "react";
import { FileText, CloudUpload, Clock, ChevronRight } from "lucide-react";
import type { VersionHistorySummary } from "@/lib/version-history";

interface HistoryMetricsRowProps {
  summary: VersionHistorySummary;
}

export const HistoryMetricsRow: React.FC<HistoryMetricsRowProps> = ({ summary }) => {
  const cards = [
    {
      id: "current-draft",
      label: "Current draft",
      value: summary.currentDraft,
      icon: FileText,
    },
    {
      id: "last-published",
      label: "Last published version",
      value: summary.lastPublishedVersion,
      icon: CloudUpload,
    },
    {
      id: "total-changes",
      label: "Total recorded changes",
      value: summary.totalRecordedChanges,
      icon: Clock,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            style={{
              backgroundColor: "var(--surface, #FFFFFF)",
              borderRadius: "14px",
              border: "1px solid var(--border, #EAE4EE)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px -1px rgba(36, 33, 58, 0.02)",
              cursor: "pointer",
              transition: "transform 0.1s ease, box-shadow 0.15s ease",
            }}
            className="history-metric-card"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Icon Container */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--secondary, #E8DFF5)",
                  color: "var(--primary, #7956C9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={19} />
              </div>

              {/* Title & Value */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-muted, #777184)",
                  }}
                >
                  {card.label}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text, #24213A)",
                  }}
                >
                  {card.value}
                </span>
              </div>
            </div>

            <ChevronRight size={17} style={{ color: "#BFBAC7" }} />
          </div>
        );
      })}
    </div>
  );
};

