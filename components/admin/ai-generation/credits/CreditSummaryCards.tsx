"use client";

import React from "react";
import { Crown, Gift, CheckCircle2, Coins } from "lucide-react";
import type { CreditSummaryMetrics } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface CreditSummaryCardsProps {
  summary: CreditSummaryMetrics;
}

export function CreditSummaryCards({ summary }: CreditSummaryCardsProps) {
  const cards = [
    {
      label: "Active Credit Plans",
      value: summary.activeCreditPlans,
      change: summary.activePlansChange,
      icon: Crown,
    },
    {
      label: "Total Credits Issued",
      value: formatCredits(summary.totalCreditsIssued, true),
      change: summary.totalCreditsChange,
      icon: Gift,
    },
    {
      label: "Credits Consumed",
      value: formatCredits(summary.creditsConsumed),
      change: summary.creditsConsumedChange,
      icon: CheckCircle2,
    },
    {
      label: "Credits Remaining",
      value: formatCredits(summary.creditsRemaining),
      change: summary.creditsRemainingChange,
      icon: Coins,
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
              padding: "20px 22px",
              border: "1px solid #EAE4EE",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#777184",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                {c.label}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "26px",
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
                      color: "#10B981",
                      backgroundColor: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      padding: "1px 7px",
                      borderRadius: "12px",
                    }}
                  >
                    {c.change}
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
              <Icon size={22} strokeWidth={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
