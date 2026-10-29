"use client";

import React from "react";
import { Users, FileText, Image as ImageIcon, CreditCard } from "lucide-react";
import { DashboardMetric } from "@/app/api/admin/dashboard/route";

interface MetricCardsProps {
  metrics?: DashboardMetric[];
  realDbUserCount?: number;
}

const DEFAULT_METRICS: DashboardMetric[] = [
  {
    id: "total-users",
    label: "Total Users",
    value: "2,847",
    rawNumber: 2847,
    change: "12%",
    changeType: "increase",
    isDemo: true,
    progressPercent: 32,
  },
  {
    id: "published-templates",
    label: "Published Templates",
    value: "124",
    rawNumber: 124,
    change: "8%",
    changeType: "increase",
    isDemo: true,
    progressPercent: 24,
  },
  {
    id: "ai-images-generated",
    label: "AI Images Generated",
    value: "8,432",
    rawNumber: 8432,
    change: "15%",
    changeType: "increase",
    isDemo: true,
    progressPercent: 38,
  },
  {
    id: "active-subscriptions",
    label: "Active Subscriptions",
    value: "567",
    rawNumber: 567,
    change: "6%",
    changeType: "increase",
    isDemo: true,
    progressPercent: 18,
  },
];

const ICON_MAP = {
  "total-users": Users,
  "published-templates": FileText,
  "ai-images-generated": ImageIcon,
  "active-subscriptions": CreditCard,
};

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics = DEFAULT_METRICS,
  realDbUserCount,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "20px",
        marginBottom: "24px",
      }}
      className="metric-cards-grid"
    >
      {metrics.map((metric) => {
        const IconComponent = ICON_MAP[metric.id as keyof typeof ICON_MAP] || Users;

        return (
          <div
            key={metric.id}
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "20px 22px 18px 22px",
              boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "154px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top row: Icon container, Title, Trend Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={20} strokeWidth={1.9} />
                </div>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {metric.label}
                </span>
              </div>

              {/* Trend Pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--success)",
                }}
              >
                <span>↗</span>
                <span>{metric.change}</span>
              </div>
            </div>

            {/* Middle: Big metric number and Demo data subtitle */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--text)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-light)",
                  marginTop: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Demo data</span>
                {metric.id === "total-users" && realDbUserCount !== undefined && (
                  <span
                    title={`Persisted database has ${realDbUserCount} registered accounts.`}
                    style={{
                      fontSize: "11px",
                      color: "var(--primary)",
                      cursor: "help",
                      borderBottom: "1px dotted var(--primary)",
                    }}
                  >
                    ({realDbUserCount} real accounts in DB)
                  </span>
                )}
              </div>
            </div>

            {/* Bottom accent progress line */}
            <div
              style={{
                width: "100%",
                height: "3.5px",
                backgroundColor: "var(--border)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${metric.progressPercent}%`,
                  height: "100%",
                  backgroundColor: "var(--primary)",
                  borderRadius: "2px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}

      <style jsx global>{`
        @media (max-width: 1200px) {
          .metric-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .metric-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
