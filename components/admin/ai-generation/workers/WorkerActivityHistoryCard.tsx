"use client";

import React from "react";
import { History } from "lucide-react";
import type { WorkerActivityEvent } from "@/lib/ai-workers";

interface WorkerActivityHistoryCardProps {
  events: WorkerActivityEvent[];
}

export const WorkerActivityHistoryCard: React.FC<WorkerActivityHistoryCardProps> = ({
  events,
}) => {
  const displayEvents = events.slice(0, 3); // Canonical 3 rows in screenshot

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
          Activity History
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
              <th style={{ padding: "6px 8px 8px 0", fontWeight: 600 }}>Time</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Event</th>
              <th style={{ padding: "6px 8px 8px 8px", fontWeight: 600 }}>Worker ID</th>
              <th style={{ padding: "6px 0 8px 8px", fontWeight: 600 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((evt) => (
              <tr key={evt.id} style={{ borderBottom: "1px solid #F8F6FA" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#777184" }}>
                  {evt.time}
                </td>
                <td style={{ padding: "10px 8px", color: "#24213A", fontWeight: 500 }}>
                  {evt.event}
                </td>
                <td style={{ padding: "10px 8px", color: "#7956C9", fontWeight: 600 }}>
                  {evt.workerId}
                </td>
                <td style={{ padding: "10px 0 10px 8px", color: "#544E61" }}>
                  {evt.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
