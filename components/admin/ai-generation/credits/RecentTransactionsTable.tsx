"use client";

import React from "react";
import { History, ArrowRight } from "lucide-react";
import type { CreditTransaction } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface RecentTransactionsTableProps {
  transactions: CreditTransaction[];
  onViewAll: () => void;
}

export function RecentTransactionsTable({
  transactions,
  onViewAll,
}: RecentTransactionsTableProps) {
  // Show last 5
  const recent = transactions.slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #EAE4EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
            }}
          >
            <History size={16} strokeWidth={2.2} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Recent Credit Transactions
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#7956C9",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#FAF7F2",
                color: "#777184",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderBottom: "1px solid #EAE4EE",
              }}
            >
              <th style={{ padding: "12px 18px" }}>Transaction ID</th>
              <th style={{ padding: "12px 16px" }}>User</th>
              <th style={{ padding: "12px 16px" }}>Transaction Type</th>
              <th style={{ padding: "12px 16px" }}>Credit Change</th>
              <th style={{ padding: "12px 16px" }}>Source</th>
              <th style={{ padding: "12px 16px" }}>Date</th>
              <th style={{ padding: "12px 18px", textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((tx) => {
              const isPositive = tx.creditChange > 0;
              const statusColor =
                tx.status === "Completed" || tx.status === "Success"
                  ? "#10B981"
                  : tx.status === "Failed"
                  ? "#EF4444"
                  : "#F59E0B";

              return (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: "1px solid #F3EDF7",
                    fontSize: "12.5px",
                    color: "#24213A",
                  }}
                >
                  <td style={{ padding: "14px 18px", fontFamily: "monospace", fontSize: "12px", color: "#645D73" }}>
                    {tx.id}
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                    {tx.userName}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {tx.transactionType}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 700,
                      color: isPositive ? "#10B981" : "#EF4444",
                    }}
                  >
                    {isPositive ? `+${formatCredits(tx.creditChange)}` : formatCredits(tx.creditChange)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#645D73" }}>
                    {tx.source}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#777184", fontSize: "12px" }}>
                    {tx.date}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
