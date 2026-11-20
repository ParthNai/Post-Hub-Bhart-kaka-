"use client";

import React from "react";
import { ShieldCheck, Settings2, Clock, Calendar } from "lucide-react";
import type { ModerationKpiMetrics } from "@/lib/ai-moderation";

interface ModerationKpiCardsProps {
  metrics: ModerationKpiMetrics;
}

export function ModerationKpiCards({ metrics }: ModerationKpiCardsProps) {
  const cards = [
    {
      label: "Active Policies",
      value: metrics.activePolicies,
      change: metrics.activePoliciesChange,
      changeColor: "#10B981",
      changeBg: "#ECFDF5",
      changeBorder: "#A7F3D0",
      icon: ShieldCheck,
    },
    {
      label: "Enabled Checks",
      value: metrics.enabledChecks,
      change: metrics.enabledChecksChange,
      changeColor: "#10B981",
      changeBg: "#ECFDF5",
      changeBorder: "#A7F3D0",
      icon: Settings2,
    },
    {
      label: "Pending Review Rules",
      value: metrics.pendingReviewRules,
      change: metrics.pendingReviewRulesChange,
      changeColor: "#7956C9",
      changeBg: "#F4EFFC",
      changeBorder: "#DDD2F3",
      icon: Clock,
    },
    {
      label: "Last Policy Update",
      value: metrics.lastPolicyUpdate,
      sublabel: metrics.policyStatusBadge,
      isDate: true,
      icon: Calendar,
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
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              padding: "18px 20px",
              border: "1px solid #EAE4EE",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#777184",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {c.label}
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: c.isDate ? "15px" : "24px",
                    fontWeight: 700,
                    color: "#24213A",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {c.value}
                </span>
                {c.change && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: c.changeColor,
                      backgroundColor: c.changeBg,
                      border: `1px solid ${c.changeBorder}`,
                      padding: "1px 7px",
                      borderRadius: "12px",
                    }}
                  >
                    {c.change}
                  </span>
                )}
                {c.sublabel && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#10B981",
                      backgroundColor: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      padding: "1px 7px",
                      borderRadius: "12px",
                    }}
                  >
                    {c.sublabel}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#F4EFFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7956C9",
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
