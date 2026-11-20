"use client";

import React from "react";
import { Monitor, Layers } from "lucide-react";
import type { QueueMonitorInfo } from "@/lib/ai-queue-priority";

interface QueueMonitorCardProps {
  monitor: QueueMonitorInfo;
}

export const QueueMonitorCard: React.FC<QueueMonitorCardProps> = ({ monitor }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <Monitor size={16} color="#7956C9" />
        <span>Queue Monitor</span>
      </div>

      {/* Monitor Table / Data Strip */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #F1EDF5",
                color: "#777184",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              <th style={{ padding: "8px 12px 10px 0", fontWeight: 600 }}>Queue Name</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Current Position</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Request Count</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Priority Level</th>
              <th style={{ padding: "8px 0 10px 12px", fontWeight: 600 }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ color: "#24213A" }}>
              {/* Queue Name */}
              <td style={{ padding: "12px 12px 4px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      backgroundColor: "#F3EFFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7956C9",
                    }}
                  >
                    <Layers size={14} />
                  </div>
                  <span style={{ fontWeight: 600, color: "#24213A" }}>
                    {monitor.queueName}
                  </span>
                </div>
              </td>

              {/* Current Position */}
              <td style={{ padding: "12px 12px 4px 12px", color: "#24213A", fontWeight: 500 }}>
                {monitor.currentPosition}
              </td>

              {/* Request Count */}
              <td style={{ padding: "12px 12px 4px 12px", color: "#24213A", fontWeight: 600 }}>
                {monitor.requestCount}
              </td>

              {/* Status */}
              <td style={{ padding: "12px 12px 4px 12px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    backgroundColor: monitor.status === "Active" ? "#DCFCE7" : "#FEF3C7",
                    color: monitor.status === "Active" ? "#15803D" : "#B45309",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: monitor.status === "Active" ? "#16A34A" : "#D97706",
                    }}
                  />
                  {monitor.status}
                </span>
              </td>

              {/* Priority Level */}
              <td style={{ padding: "12px 12px 4px 12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#F3EFFC",
                    color: "#7956C9",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {monitor.priorityLevel}
                </span>
              </td>

              {/* Last Updated */}
              <td style={{ padding: "12px 0 4px 12px", color: "#777184", fontSize: "12px" }}>
                {monitor.lastUpdated}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
