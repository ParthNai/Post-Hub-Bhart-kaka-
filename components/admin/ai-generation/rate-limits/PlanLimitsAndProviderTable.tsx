"use client";

import React from "react";
import { Users, Crown, UserCheck, ShieldCheck, Layers } from "lucide-react";
import type { PlanLimitCard, ProviderRateLimitItem } from "@/lib/ai-rate-limits";

interface PlanLimitsAndProviderTableProps {
  planCards: PlanLimitCard[];
  providerLimits: ProviderRateLimitItem[];
}

export const PlanLimitsAndProviderTable: React.FC<PlanLimitsAndProviderTableProps> = ({
  planCards,
  providerLimits,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
      {/* 4 Plan / Exemption Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {planCards.map((card) => {
          let IconComp = Users;
          if (card.id === "card_paid") IconComp = Crown;
          else if (card.id === "card_user_overrides") IconComp = UserCheck;
          else if (card.id === "card_admin_exemptions") IconComp = ShieldCheck;

          let badgeBg = "#F3EFFC";
          let badgeColor = "#7956C9";
          if (card.badgeType === "gray") {
            badgeBg = "#F3F4F6";
            badgeColor = "#6B7280";
          } else if (card.badgeType === "green") {
            badgeBg = "#EAFBF0";
            badgeColor = "#1E824C";
          }

          return (
            <div
              key={card.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE4EE",
                borderRadius: "10px",
                padding: "12px 14px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <IconComp size={14} color="#7956C9" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#24213A" }}>
                    {card.title}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "center", margin: "2px 0" }}>
                <span
                  style={{
                    backgroundColor: badgeBg,
                    color: badgeColor,
                    padding: "2px 10px",
                    borderRadius: "10px",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {card.badge}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px" }}>
                {card.features.map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#544E61" }}>
                    {card.id !== "card_user_overrides" && card.id !== "card_admin_exemptions" && (
                      <span style={{ color: "#10B981", fontWeight: 700, fontSize: "11px" }}>✔</span>
                    )}
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Provider Rate-Limits Table */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAE4EE",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Layers size={15} color="#7956C9" />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#24213A" }}>
            Provider Rate-Limits
          </span>
        </div>

        <div style={{ overflowX: "auto", flex: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11.5px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#FAF9FD", borderBottom: "1px solid #EAE4EE" }}>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Provider</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Model</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Requests per minute</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Concurrent requests</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Provider quota</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Current usage</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Configuration source</th>
                <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {providerLimits.map((item, idx) => {
                const isActive = item.status === "Active";
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom:
                        idx < providerLimits.length - 1 ? "1px solid #F1EDF5" : "none",
                    }}
                  >
                    <td style={{ padding: "9px 10px", color: "#24213A", fontWeight: 600 }}>
                      {item.provider}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#24213A" }}>
                      {item.model}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#777184" }}>
                      {item.requestsPerMinute}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#777184" }}>
                      {item.concurrentRequests}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#777184" }}>
                      {item.providerQuota}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#777184" }}>
                      {item.currentUsage}
                    </td>
                    <td style={{ padding: "9px 10px", color: "#544E61" }}>
                      {item.configurationSource}
                    </td>
                    <td style={{ padding: "9px 10px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: isActive ? "#10B981" : "#D97706",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: isActive ? "#10B981" : "#F59E0B",
                          }}
                        />
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
