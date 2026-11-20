"use client";

import React, { useState } from "react";
import {
  Settings,
  Search,
  MoreVertical,
  Pause,
  Play,
  Download,
  RotateCw,
  Eye,
} from "lucide-react";
import type { WorkerItem } from "@/lib/ai-workers";

interface WorkerManagementTableProps {
  workers: WorkerItem[];
  selectedWorkerId: string | null;
  onSelectWorker: (worker: WorkerItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPool: string;
  onPoolChange: (p: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  onPauseWorker: (worker: WorkerItem) => void;
  onResumeWorker: (worker: WorkerItem) => void;
  onDrainWorker: (worker: WorkerItem) => void;
  onRestartWorker: (worker: WorkerItem) => void;
}

export const WorkerManagementTable: React.FC<WorkerManagementTableProps> = ({
  workers,
  selectedWorkerId,
  onSelectWorker,
  searchQuery,
  onSearchChange,
  selectedPool,
  onPoolChange,
  selectedStatus,
  onStatusChange,
  onPauseWorker,
  onResumeWorker,
  onDrainWorker,
  onRestartWorker,
}) => {
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" };
      case "Idle":
        return { bg: "#E0F2FE", text: "#0284C7", dot: "#2563EB" };
      case "Draining":
        return { bg: "#FFEDD5", text: "#EA580C", dot: "#F97316" };
      case "Error":
        return { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" };
      case "Paused":
        return { bg: "#FEF3C7", text: "#B45309", dot: "#D97706" };
      default:
        return { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Header & Filter Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "16px 20px",
          borderBottom: "1px solid #F1EDF5",
          gap: "12px",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Settings size={18} color="#7956C9" />
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Worker Management
          </h2>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            <Search size={14} color="#777184" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "12px",
                color: "#24213A",
                width: "100%",
              }}
            />
          </div>

          {/* Pool Filter */}
          <select
            value={selectedPool}
            onChange={(e) => onPoolChange(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF7F2",
              fontSize: "12px",
              color: "#24213A",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="All Pools">All Pools</option>
            <option value="Image Pool">Image Pool</option>
            <option value="Text Pool">Text Pool</option>
            <option value="Creative Pool">Creative Pool</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF7F2",
              fontSize: "12px",
              color: "#24213A",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Running">Running</option>
            <option value="Idle">Idle</option>
            <option value="Draining">Draining</option>
            <option value="Error">Error</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
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
                backgroundColor: "#FAF7F2",
                borderBottom: "1px solid #EAE4EE",
                color: "#777184",
                fontSize: "12px",
              }}
            >
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Worker ID</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Worker Pool</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Assigned Queue</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>AI Provider</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Runtime Status</th>
              <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "center" }}>Current Jobs</th>
              <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "center" }}>Concurrency Capacity</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Last Heartbeat</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Worker Version</th>
              <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: "36px",
                    textAlign: "center",
                    color: "#777184",
                    fontSize: "13px",
                  }}
                >
                  No workers found matching the filters.
                </td>
              </tr>
            ) : (
              workers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                const statusBadge = getStatusBadge(worker.runtimeStatus);

                return (
                  <tr
                    key={worker.id}
                    onClick={() => onSelectWorker(worker)}
                    style={{
                      borderBottom: "1px solid #F1EDF5",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#FBF8FF" : "transparent",
                      transition: "background-color 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#FAFAF9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Worker ID */}
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#24213A" }}>
                      {worker.id}
                    </td>

                    {/* Worker Pool */}
                    <td style={{ padding: "12px 14px", color: "#544E61" }}>
                      {worker.workerPool}
                    </td>

                    {/* Assigned Queue */}
                    <td style={{ padding: "12px 14px", color: "#544E61" }}>
                      {worker.assignedQueue}
                    </td>

                    {/* AI Provider */}
                    <td style={{ padding: "12px 14px", color: "#24213A", fontWeight: 500 }}>
                      {worker.aiProvider}
                    </td>

                    {/* Runtime Status */}
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.text,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: statusBadge.dot,
                          }}
                        />
                        {worker.runtimeStatus}
                      </span>
                    </td>

                    {/* Current Jobs */}
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600, color: "#24213A" }}>
                      {worker.currentJobs}
                    </td>

                    {/* Concurrency Capacity */}
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "#24213A" }}>
                      {worker.concurrencyCapacity}
                    </td>

                    {/* Last Heartbeat */}
                    <td style={{ padding: "12px 14px", color: "#777184", fontSize: "12px" }}>
                      {worker.lastHeartbeat}
                    </td>

                    {/* Worker Version */}
                    <td style={{ padding: "12px 14px", color: "#777184", fontSize: "12px" }}>
                      {worker.workerVersion}
                    </td>

                    {/* Actions Menu */}
                    <td
                      style={{ padding: "12px 14px", textAlign: "right", position: "relative" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionMenuId(openActionMenuId === worker.id ? null : worker.id)
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#777184",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openActionMenuId === worker.id && (
                        <div
                          style={{
                            position: "absolute",
                            right: "14px",
                            top: "36px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #EAE4EE",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            zIndex: 20,
                            minWidth: "160px",
                            padding: "4px 0",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onSelectWorker(worker);
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              border: "none",
                              background: "none",
                              fontSize: "12px",
                              color: "#24213A",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF7F2")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <Eye size={14} color="#777184" />
                            <span>View Details</span>
                          </button>

                          {worker.runtimeStatus === "Paused" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                onResumeWorker(worker);
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                border: "none",
                                background: "none",
                                fontSize: "12px",
                                color: "#16A34A",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF7F2")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <Play size={14} color="#16A34A" />
                              <span>Resume Worker</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                onPauseWorker(worker);
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                border: "none",
                                background: "none",
                                fontSize: "12px",
                                color: "#D97706",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF7F2")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <Pause size={14} color="#D97706" />
                              <span>Pause Worker</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onDrainWorker(worker);
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              border: "none",
                              background: "none",
                              fontSize: "12px",
                              color: "#EA580C",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF7F2")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <Download size={14} color="#EA580C" />
                            <span>Drain Worker</span>
                          </button>

                          <div style={{ height: "1px", backgroundColor: "#F1EDF5", margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onRestartWorker(worker);
                            }}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              border: "none",
                              background: "none",
                              fontSize: "12px",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <RotateCw size={14} color="#DC2626" />
                            <span>Restart Worker</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
