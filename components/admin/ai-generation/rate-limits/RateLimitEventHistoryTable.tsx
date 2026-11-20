"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, ExternalLink } from "lucide-react";
import type { RateLimitEvent } from "@/lib/ai-rate-limits";

interface RateLimitEventHistoryTableProps {
  events: RateLimitEvent[];
}

export const RateLimitEventHistoryTable: React.FC<RateLimitEventHistoryTableProps> = ({ events }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title & View All Logs Link */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #EAE4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={16} color="#7956C9" />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>
            Rate-Limit Event History
          </span>
        </div>

        <Link
          href="/admin/ai-generation/logs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "#7956C9",
            fontSize: "12.5px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#FAF9FD", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>User/Client Reference</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Endpoint</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Applied Policy</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Request Count</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Enforcement Action</th>
              <th style={{ padding: "10px 16px", color: "#777184", fontWeight: 600 }}>Related Request ID</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => {
              let actionColor = "#D97706";
              if (evt.enforcementAction === "Rejected") actionColor = "#DC2626";
              else if (evt.enforcementAction === "Delayed") actionColor = "#7956C9";

              return (
                <tr key={evt.id} style={{ borderBottom: "1px solid #F1EDF5" }}>
                  <td style={{ padding: "12px 16px", color: "#544E61" }}>
                    {evt.timestamp}
                  </td>

                  <td style={{ padding: "12px 16px", color: "#24213A", fontWeight: 600 }}>
                    {evt.userClientReference}
                  </td>

                  <td style={{ padding: "12px 16px", color: "#24213A", fontFamily: "monospace" }}>
                    {evt.endpoint}
                  </td>

                  <td style={{ padding: "12px 16px", color: "#24213A", fontWeight: 500 }}>
                    {evt.appliedPolicy}
                  </td>

                  <td style={{ padding: "12px 16px", color: "#24213A", fontWeight: 600 }}>
                    {evt.requestCount.toLocaleString()}
                  </td>

                  <td style={{ padding: "12px 16px", color: actionColor, fontWeight: 600 }}>
                    {evt.enforcementAction}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/admin/ai-generation/logs?search=${encodeURIComponent(evt.relatedRequestId)}`}
                      style={{
                        color: "#7956C9",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{evt.relatedRequestId}</span>
                      <ExternalLink size={11} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
