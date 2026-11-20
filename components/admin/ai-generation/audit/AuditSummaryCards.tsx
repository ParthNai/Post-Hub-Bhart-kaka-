"use client";

import React from "react";
import { Coins, Check, RotateCcw, Clock } from "lucide-react";
import type { AuditSummaryMetrics } from "@/lib/ai-audit";

interface AuditSummaryCardsProps {
  summary: AuditSummaryMetrics;
}

export function AuditSummaryCards({ summary }: AuditSummaryCardsProps) {
  const cards = [
    {
      label: "Total Transactions",
      value: summary.totalTransactions.toLocaleString(),
      icon: Coins,
      iconColor: "#7956C9",
      iconBg: "#F4EFFC",
    },
    {
      label: "Successful Transactions",
      value: summary.successfulTransactions.toLocaleString(),
      icon: Check,
      iconColor: "#10B981",
      iconBg: "#ECFDF5",
    },
    {
      label: "Reversed Transactions",
      value: summary.reversedTransactions.toLocaleString(),
      icon: RotateCcw,
      iconColor: "#F59E0B",
      iconBg: "#FEF3C7",
    },
    {
      label: "Last Reconciliation",
      value: summary.lastReconciliation,
      icon: Clock,
      iconColor: "#7956C9",
      iconBg: "#F4EFFC",
      isDate: true,
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
              <span
                style={{
                  fontSize: c.isDate ? "15px" : "26px",
                  fontWeight: 700,
                  color: "#24213A",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.value}
              </span>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: c.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.iconColor,
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
