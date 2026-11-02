"use client";

import React from "react";
import { Image as ImageIcon, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { AiGenerationMetrics } from "@/lib/ai-generation";

interface AiGenerationMetricsCardsProps {
  metrics: AiGenerationMetrics;
  isLoading?: boolean;
}

export const AiGenerationMetricsCards: React.FC<AiGenerationMetricsCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  const cards = [
    {
      id: "total",
      label: "Total Generation Requests",
      value: metrics.totalRequests.toLocaleString(),
      change: metrics.totalChange,
      changeType: "increase",
      detail: "vs last 30 days",
      icon: ImageIcon,
      iconBg: "#F1ECF9",
      iconColor: "#7956C9",
    },
    {
      id: "completed",
      label: "Completed Generations",
      value: metrics.completedCount.toLocaleString(),
      change: metrics.completedChange,
      changeType: "increase",
      detail: `${metrics.successRate} success rate`,
      icon: CheckCircle2,
      iconBg: "#E6F4EA",
      iconColor: "#137333",
    },
    {
      id: "failed",
      label: "Failed Requests",
      value: metrics.failedCount.toLocaleString(),
      change: metrics.failedChange,
      changeType: "decrease",
      detail: `${metrics.failureRate} failure rate`,
      icon: AlertCircle,
      iconBg: "#FCE8E6",
      iconColor: "#C5221F",
    },
    {
      id: "pending",
      label: "Pending Requests",
      value: metrics.pendingCount.toLocaleString(),
      change: metrics.pendingChange,
      changeType: "increase",
      detail: metrics.pendingLabel || "Waiting for processing",
      icon: Clock,
      iconBg: "#EEF2FF",
      iconColor: "#4F46E5",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isIncrease = card.changeType === "increase";

        return (
          <div
            key={card.id}
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {/* Left Icon Container */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: card.iconBg,
                color: card.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconComponent size={22} strokeWidth={2.2} />
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.label}
              </div>

              {/* Number Value */}
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                }}
              >
                {isLoading ? "—" : card.value}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isIncrease ? "#137333" : "#C5221F",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {card.change}
                </span>
              </div>

              {/* Detail label */}
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                {card.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

