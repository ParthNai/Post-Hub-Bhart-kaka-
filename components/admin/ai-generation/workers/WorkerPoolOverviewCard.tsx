"use client";

import React from "react";
import { Layers } from "lucide-react";
import type { WorkerPool } from "@/lib/ai-workers";

interface WorkerPoolOverviewCardProps {
  pools: WorkerPool[];
}

export const WorkerPoolOverviewCard: React.FC<WorkerPoolOverviewCardProps> = ({ pools }) => {
  const getPoolStateBadge = (state: string) => {
    switch (state) {
      case "Active":
        return { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" };
      case "Idle":
        return { bg: "#E0F2FE", text: "#0284C7", dot: "#2563EB" };
      case "Unavailable":
        return { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
      default:
        return { bg: "#FEF3C7", text: "#B45309", dot: "#D97706" };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
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
        <Layers size={16} color="#7956C9" />
        <span>Worker Pool Overview</span>
      </div>

      {/* Table */}
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
              <th style={{ padding: "8px 12px 10px 0", fontWeight: 600 }}>Pool Name</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Assigned Queue</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600 }}>Assigned Provider</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600, textAlign: "center" }}>Configured Concurrency</th>
              <th style={{ padding: "8px 12px 10px 12px", fontWeight: 600, textAlign: "center" }}>Current Workers</th>
              <th style={{ padding: "8px 0 10px 12px", fontWeight: 600 }}>Pool State</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => {
              const stateBadge = getPoolStateBadge(pool.poolState);

              return (
                <tr
                  key={pool.id}
                  style={{
                    borderBottom: "1px solid #F8F6FA",
                    color: "#24213A",
                  }}
                >
                  {/* Pool Name */}
                  <td style={{ padding: "12px 12px 12px 0", fontWeight: 600 }}>
                    {pool.poolName}
                  </td>

                  {/* Assigned Queue */}
                  <td style={{ padding: "12px 12px", color: "#544E61" }}>
                    {pool.assignedQueue}
                  </td>

                  {/* Assigned Provider */}
                  <td style={{ padding: "12px 12px", color: "#24213A", fontWeight: 500 }}>
                    {pool.assignedProvider}
                  </td>

                  {/* Configured Concurrency */}
                  <td style={{ padding: "12px 12px", textAlign: "center", color: "#24213A" }}>
                    {pool.configuredConcurrency}
                  </td>

                  {/* Current Workers */}
                  <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: 600, color: "#24213A" }}>
                    {pool.currentWorkers}
                  </td>

                  {/* Pool State */}
                  <td style={{ padding: "12px 0 12px 12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: stateBadge.bg,
                        color: stateBadge.text,
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: stateBadge.dot,
                        }}
                      />
                      {pool.poolState}
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
};
