"use client";

import React from "react";
import { Database, Link2, Smartphone, Clock } from "lucide-react";
import type { TokenUsageSummary } from "@/lib/token-usage";

interface TokenUsageMetricsRowProps {
  summary: TokenUsageSummary;
}

export const TokenUsageMetricsRow: React.FC<TokenUsageMetricsRowProps> = ({ summary }) => {
  const cards = [
    {
      id: "tokens-indexed",
      label: "Tokens indexed",
      value: summary.tokensIndexed !== null ? summary.tokensIndexed.toString() : "Not available",
      icon: Database,
    },
    {
      id: "components-linked",
      label: "Components linked",
      value: summary.componentsLinked !== null ? summary.componentsLinked.toString() : "Not available",
      icon: Link2,
    },
    {
      id: "screens-referenced",
      label: "Screens referenced",
      value: summary.screensReferenced !== null ? summary.screensReferenced.toString() : "Not available",
      icon: Smartphone,
    },
    {
      id: "last-scan",
      label: "Last scan",
      value: summary.lastScan || "Not available",
      icon: Clock,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
              gap: "14px",
              boxShadow: "0 2px 8px -1px rgba(36, 33, 58, 0.02)",
            }}
          >
            {/* Icon Container */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "var(--secondary, #E8DFF5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--primary, #7956C9)",
              }}
            >
              <Icon size={19} />
            </div>

            {/* Label and Value */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--text-muted, #777184)",
                  letterSpacing: "-0.01em",
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
