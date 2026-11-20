"use client";

import React from "react";
import { History } from "lucide-react";
import type { QueueActivityEvent } from "@/lib/ai-queue-priority";

interface QueueActivityHistoryCardProps {
  events: QueueActivityEvent[];
}

export const QueueActivityHistoryCard: React.FC<QueueActivityHistoryCardProps> = ({
  events,
}) => {
  const displayEvents = events.slice(0, 3); // Screenshot shows exactly top 3 rows

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <History size={16} color="#7956C9" />
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Queue Activity History
        </h3>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #F1EDF5",
                color: "#777184",
                fontWeight: 600,
                fontSize: "11px",
              }}
            >
              <th style={{ padding: "6px 8px 8px 0", fontWeight: 600 }}>Event ID</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Request ID</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Action</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Priority Flow</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Action By</th>
              <th style={{ padding: "6px 0 8px 8px", fontWeight: 600, textAlign: "right" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((evt) => (
              <tr key={evt.eventId} style={{ borderBottom: "1px solid #F8F6FA" }}>
                {/* Event ID */}
                <td style={{ padding: "10px 8px 10px 0", color: "#24213A", fontWeight: 600 }}>
                  {evt.eventId}
                </td>

                {/* Request ID */}
                <td style={{ padding: "10px 8px", color: "#544E61" }}>
                  {evt.requestId}
                </td>

                {/* Event Type / Action */}
                <td style={{ padding: "10px 8px", color: "#24213A" }}>
                  {evt.eventType}
                </td>

                {/* Priority Flow */}
                <td style={{ padding: "10px 8px", color: "#7956C9", fontWeight: 500 }}>
                  {evt.previousPriority} → {evt.newPriority}
                </td>

                {/* Action By */}
                <td style={{ padding: "10px 8px", color: "#544E61" }}>
                  {evt.actionBy}
                </td>

                {/* Timestamp */}
                <td style={{ padding: "10px 0 10px 8px", color: "#777184", textAlign: "right" }}>
                  {evt.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
