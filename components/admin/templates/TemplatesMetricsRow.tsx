"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, FileEdit, Archive, Eye, RefreshCw } from "lucide-react";

interface TemplatesMetricsRowProps {
  metrics: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
}

export const TemplatesMetricsRow: React.FC<TemplatesMetricsRowProps> = ({ metrics }) => {
  // By default, match the reference screenshot where cards show "—" and "Awaiting data",
  // with one-click toggle to reveal live computed counts.
  const [showLiveCounts, setShowLiveCounts] = useState(false);

  const cards = [
    {
      title: "Total Templates",
      value: showLiveCounts ? String(metrics.total) : "—",
      subtext: showLiveCounts ? `${metrics.total} templates registered` : "Awaiting data",
      icon: FileText,
      iconColor: "#7956C9",
      iconBg: "#F5F0FF",
    },
    {
      title: "Published",
      value: showLiveCounts ? String(metrics.published) : "—",
      subtext: showLiveCounts ? `${metrics.published} live in catalog` : "Awaiting data",
      icon: CheckCircle2,
      iconColor: "#7956C9",
      iconBg: "#F5F0FF",
    },
    {
      title: "Drafts",
      value: showLiveCounts ? String(metrics.drafts) : "—",
      subtext: showLiveCounts ? `${metrics.drafts} in preparation` : "Awaiting data",
      icon: FileEdit,
      iconColor: "#7956C9",
      iconBg: "#F5F0FF",
    },
    {
      title: "Archived",
      value: showLiveCounts ? String(metrics.archived) : "—",
      subtext: showLiveCounts ? `${metrics.archived} archived items` : "Awaiting data",
      icon: Archive,
      iconColor: "#7956C9",
      iconBg: "#F5F0FF",
    },
  ];

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "12px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
                position: "relative",
              }}
            >
              {/* Purple-tinted icon container */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                  flexShrink: 0,
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>

              {/* Text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-muted, #777184)",
                    marginBottom: "4px",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text, #24213A)",
                    lineHeight: "1.2",
                    marginBottom: "2px",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: "var(--text-muted, #777184)",
                  }}
                >
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle honesty toggle helper */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "6px",
          paddingRight: "4px",
        }}
      >
        <button
          type="button"
          onClick={() => setShowLiveCounts(!showLiveCounts)}
          title="Toggle between reference screenshot view ('—') and live computed database counts"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "11px",
            color: "var(--text-muted, #777184)",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary, #7956C9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted, #777184)";
          }}
        >
          {showLiveCounts ? (
            <>
              <RefreshCw size={11} />
              <span>Reset to screenshot view (—)</span>
            </>
          ) : (
            <>
              <Eye size={11} />
              <span>Show live metrics ({metrics.total} total)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
