"use client";

import React, { useState } from "react";
import { X, Server, Activity, Cpu } from "lucide-react";
import type { WorkerItem } from "@/lib/ai-workers";

interface WorkerDetailsDrawerProps {
  worker: WorkerItem | null;
  onClose: () => void;
}

export const WorkerDetailsDrawer: React.FC<WorkerDetailsDrawerProps> = ({
  worker,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"Overview" | "Activity" | "Diagnostics">("Overview");

  if (!worker) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return { bg: "#DCFCE7", text: "#15803D" };
      case "Idle":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "Draining":
        return { bg: "#FFEDD5", text: "#EA580C" };
      case "Error":
        return { bg: "#FEE2E2", text: "#DC2626" };
      case "Paused":
        return { bg: "#FEF3C7", text: "#B45309" };
      default:
        return { bg: "#F1F5F9", text: "#64748B" };
    }
  };

  const statusBadge = getStatusBadge(worker.runtimeStatus);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1EDF5",
          paddingBottom: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Worker Details
        </h3>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#777184",
            padding: "4px",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Hero Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF7F2",
          border: "1px solid #EAE4EE",
          borderRadius: "10px",
          padding: "12px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              backgroundColor: "#F3EFFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
            }}
          >
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500 }}>Worker ID</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#24213A" }}>{worker.id}</div>
          </div>
        </div>

        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: statusBadge.bg,
            color: statusBadge.text,
          }}
        >
          {worker.runtimeStatus}
        </span>
      </div>

      {/* Sub Tabs */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          borderBottom: "1px solid #F1EDF5",
          paddingBottom: "8px",
          fontSize: "13px",
        }}
      >
        {(["Overview", "Activity", "Diagnostics"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                padding: "4px 2px",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#7956C9" : "#777184",
                borderBottom: isActive ? "2px solid #7956C9" : "2px solid transparent",
                marginBottom: "-9px",
                transition: "all 0.15s ease",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Worker Pool</span>
              <span style={{ fontWeight: 500, color: "#24213A" }}>{worker.workerPool}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Assigned Queue</span>
              <span style={{ fontWeight: 500, color: "#24213A" }}>{worker.assignedQueue}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>AI Provider</span>
              <span style={{ fontWeight: 500, color: "#24213A" }}>{worker.aiProvider}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Current Jobs</span>
              <span style={{ fontWeight: 600, color: "#24213A" }}>{worker.currentJobs}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Concurrency Capacity</span>
              <span style={{ fontWeight: 500, color: "#24213A" }}>{worker.concurrencyCapacity}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Last Heartbeat</span>
              <span style={{ color: "#24213A", fontSize: "12px" }}>{worker.lastHeartbeat}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Worker Version</span>
              <span style={{ color: "#24213A", fontSize: "12px" }}>{worker.workerVersion}</span>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#F1EDF5", margin: "4px 0" }} />

          {/* Recent Activity Timeline */}
          <div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#24213A",
                margin: "0 0 10px 0",
              }}
            >
              Recent Activity
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(worker.recentActivity || [
                { time: "10:45 AM", event: "Job Claimed" },
                { time: "10:44 AM", event: "Job Completed" },
                { time: "10:43 AM", event: "Heartbeat Received" },
              ]).map((act, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#7956C9",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#777184", minWidth: "55px" }}>{act.time}</span>
                  <span style={{ color: "#24213A", fontWeight: 500 }}>{act.event}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Activity */}
      {activeTab === "Activity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7956C9", fontWeight: 600 }}>
            <Activity size={14} />
            <span>Active Job Executions</span>
          </div>
          {worker.activeJobIds && worker.activeJobIds.length > 0 ? (
            worker.activeJobIds.map((job) => (
              <div
                key={job}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#FAF7F2",
                  border: "1px solid #EAE4EE",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 600 }}>{job}</span>
                <span style={{ color: "#16A34A" }}>Processing</span>
              </div>
            ))
          ) : (
            <div style={{ color: "#777184", padding: "10px 0" }}>No jobs actively running on this worker.</div>
          )}
        </div>
      )}

      {/* Tab 3: Diagnostics */}
      {activeTab === "Diagnostics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7956C9", fontWeight: 600 }}>
            <Cpu size={14} />
            <span>Worker Node Metrics</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ padding: "8px", backgroundColor: "#FAF7F2", borderRadius: "6px" }}>
              <div style={{ color: "#777184", fontSize: "10px" }}>UPTIME</div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>{worker.diagnostics?.uptime || "48h 12m"}</div>
            </div>
            <div style={{ padding: "8px", backgroundColor: "#FAF7F2", borderRadius: "6px" }}>
              <div style={{ color: "#777184", fontSize: "10px" }}>MEMORY</div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>{worker.diagnostics?.memoryUsage || "482 MB"}</div>
            </div>
            <div style={{ padding: "8px", backgroundColor: "#FAF7F2", borderRadius: "6px" }}>
              <div style={{ color: "#777184", fontSize: "10px" }}>CPU LOAD</div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>{worker.diagnostics?.cpuUsage || "34%"}</div>
            </div>
            <div style={{ padding: "8px", backgroundColor: "#FAF7F2", borderRadius: "6px" }}>
              <div style={{ color: "#777184", fontSize: "10px" }}>LATENCY</div>
              <div style={{ fontWeight: 600, color: "#24213A" }}>{worker.diagnostics?.networkLatency || "42ms"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
