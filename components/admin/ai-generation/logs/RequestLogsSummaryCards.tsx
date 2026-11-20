"use client";

import React from "react";
import { Zap, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { LogSummaryMetrics } from "@/lib/ai-request-logs";

interface RequestLogsSummaryCardsProps {
  metrics: LogSummaryMetrics;
}

export const RequestLogsSummaryCards: React.FC<RequestLogsSummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      label: "Total Requests",
      value: metrics.totalRequests,
      icon: <Zap size={18} fill="#7956C9" color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
    {
      label: "Successful Responses",
      value: metrics.successfulResponses,
      icon: <CheckCircle2 size={18} color="#10B981" />,
      iconBg: "#ECFDF5",
    },
    {
      label: "Failed Requests",
      value: metrics.failedRequests,
      icon: <AlertTriangle size={18} color="#EF4444" />,
      iconBg: "#FEF2F2",
    },
    {
      label: "Average API Latency",
      value: metrics.averageApiLatency,
      icon: <Clock size={18} color="#7956C9" />,
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
                fontSize: "20px",
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
