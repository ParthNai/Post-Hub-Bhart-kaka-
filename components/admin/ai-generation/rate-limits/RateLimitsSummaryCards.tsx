"use client";

import React from "react";
import { Shield, Code, Gauge, BarChart3 } from "lucide-react";
import type { RateLimitSummaryMetrics } from "@/lib/ai-rate-limits";

interface RateLimitsSummaryCardsProps {
  metrics: RateLimitSummaryMetrics;
}

export const RateLimitsSummaryCards: React.FC<RateLimitsSummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      label: "Active Rate-Limit Policies",
      value: metrics.activePolicies,
      icon: <Shield size={18} color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
    {
      label: "Protected API Endpoints",
      value: metrics.protectedEndpoints,
      icon: <Code size={18} color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
    {
      label: "Requests Currently Throttled",
      value: metrics.requestsCurrentlyThrottled,
      icon: <Gauge size={18} color="#EA580C" />,
      iconBg: "#FFF7ED",
    },
    {
      label: "Rate-Limit Events",
      value: metrics.rateLimitEvents,
      icon: <BarChart3 size={18} color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            borderRadius: "12px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: card.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {card.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#777184",
                marginBottom: "4px",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
