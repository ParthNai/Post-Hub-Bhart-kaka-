"use client";

import React from "react";
import { Layers, Play, Calendar, AlertTriangle } from "lucide-react";
import type { QueueSummaryMetrics } from "@/lib/ai-queue-priority";

interface QueueSummaryMetricsCardsProps {
  metrics: QueueSummaryMetrics;
}

export const QueueSummaryMetricsCards: React.FC<QueueSummaryMetricsCardsProps> = ({
  metrics,
}) => {
  const cards = [
    {
      id: "total-queued",
      label: "Total Queued Requests",
      value: metrics.totalQueuedRequests.toLocaleString(),
      icon: <Layers size={20} color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
    {
      id: "processing",
      label: "Currently Processing",
      value: metrics.currentlyProcessing.toLocaleString(),
      icon: (
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            backgroundColor: "#22C55E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={11} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: "1px" }} />
        </div>
      ),
      iconBg: "#DCFCE7",
    },
    {
      id: "scheduled",
      label: "Scheduled Requests",
      value: metrics.scheduledRequests.toLocaleString(),
      icon: <Calendar size={20} color="#7956C9" />,
      iconBg: "#F3EFFC",
    },
    {
      id: "failed-blocked",
      label: "Failed / Blocked Requests",
      value: metrics.failedBlockedRequests.toLocaleString(),
      icon: <AlertTriangle size={20} color="#EF4444" />,
      iconBg: "#FEE2E2",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {cards.map((c) => (
        <div
          key={c.id}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            borderRadius: "12px",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: c.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#777184",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#24213A",
                lineHeight: 1.1,
              }}
            >
              {c.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
