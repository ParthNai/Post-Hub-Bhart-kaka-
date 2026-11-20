"use client";

import React from "react";
import { History, ArrowRight } from "lucide-react";
import type { CredentialAuditEvent } from "@/lib/ai-credentials";

interface CredentialAuditHistoryTableProps {
  auditEvents: CredentialAuditEvent[];
  onViewAllLogs: () => void;
}

export const CredentialAuditHistoryTable: React.FC<CredentialAuditHistoryTableProps> = ({
  auditEvents,
  onViewAllLogs,
}) => {
  // Display top 3 events matching reference layout
  const displayedEvents = auditEvents.slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #EAE4EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#F4EFFC",
              color: "#7956C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <History size={16} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Credential Audit History
          </h2>
        </div>

        {/* View All Logs Link */}
        <button
          type="button"
          onClick={onViewAllLogs}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#7956C9",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: 0,
          }}
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Timestamp</th>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Administrator / Service</th>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Credential Reference</th>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Action</th>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Result</th>
              <th style={{ padding: "10px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Environment</th>
            </tr>
          </thead>
          <tbody>
            {displayedEvents.map((event) => (
              <tr
                key={event.id}
                style={{
                  borderBottom: "1px solid #EAE4EE",
                  fontSize: "13px",
                }}
              >
                <td style={{ padding: "12px 20px", color: "#24213A" }}>{event.timestamp}</td>
                <td style={{ padding: "12px 20px", color: "#24213A", fontWeight: 500 }}>
                  {event.adminOrService}
                </td>
                <td style={{ padding: "12px 20px", fontFamily: "monospace", fontWeight: 600, color: "#24213A" }}>
                  {event.credentialReference}
                </td>
                <td style={{ padding: "12px 20px", color: "#24213A" }}>{event.action}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor: event.result === "Success" ? "#ECFDF5" : "#FEF2F2",
                      color: event.result === "Success" ? "#059669" : "#DC2626",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: event.result === "Success" ? "#059669" : "#DC2626",
                      }}
                    />
                    {event.result}
                  </span>
                </td>
                <td style={{ padding: "12px 20px", color: "#777184" }}>{event.environment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
