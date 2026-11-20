"use client";

import React, { useState } from "react";
import { ListFilter, ChevronDown, ChevronRight } from "lucide-react";
import type { ExecutionTraceEvent } from "@/lib/ai-job-trace";

interface ExecutionTraceTableProps {
  events: ExecutionTraceEvent[];
}

export const ExecutionTraceTable: React.FC<ExecutionTraceTableProps> = ({ events }) => {
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 20px",
          borderBottom: "1px solid #F1EDF5",
        }}
      >
        <ListFilter size={18} color="#7956C9" />
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Execution Trace
        </h2>
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
                backgroundColor: "#FAF7F2",
                borderBottom: "1px solid #EAE4EE",
                color: "#777184",
                fontSize: "12px",
              }}
            >
              <th style={{ padding: "10px 10px 10px 16px", width: "24px" }} />
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Event</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Component</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Worker ID</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Duration</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Result</th>
              <th style={{ padding: "10px 16px 10px 14px", fontWeight: 600 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => {
              const isExpanded = Boolean(expandedRowIds[ev.id]);

              return (
                <React.Fragment key={ev.id}>
                  <tr
                    onClick={() => toggleRow(ev.id)}
                    style={{
                      borderBottom: "1px solid #F1EDF5",
                      cursor: "pointer",
                      backgroundColor: isExpanded ? "#FAF8FC" : "transparent",
                      transition: "background-color 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = "#FAFAF9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Expand icon */}
                    <td style={{ padding: "12px 10px 12px 16px", color: "#777184" }}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>

                    {/* Timestamp */}
                    <td style={{ padding: "12px 14px", color: "#777184", fontSize: "12px" }}>
                      {ev.timestamp}
                    </td>

                    {/* Event */}
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#24213A" }}>
                      {ev.event}
                    </td>

                    {/* Component */}
                    <td style={{ padding: "12px 14px", color: "#544E61" }}>
                      {ev.component}
                    </td>

                    {/* Worker ID */}
                    <td style={{ padding: "12px 14px", color: ev.workerId !== "—" ? "#7956C9" : "#777184", fontWeight: 500 }}>
                      {ev.workerId}
                    </td>

                    {/* Duration */}
                    <td style={{ padding: "12px 14px", color: "#24213A" }}>
                      {ev.duration}
                    </td>

                    {/* Result */}
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: ev.result === "Success" ? "#DCFCE7" : "#FEE2E2",
                          color: ev.result === "Success" ? "#15803D" : "#DC2626",
                        }}
                      >
                        {ev.result}
                      </span>
                    </td>

                    {/* Details */}
                    <td style={{ padding: "12px 16px 12px 14px", color: "#544E61" }}>
                      {ev.details}
                    </td>
                  </tr>

                  {/* Expanded diagnostic drawer row */}
                  {isExpanded && (
                    <tr style={{ backgroundColor: "#FAF8FC", borderBottom: "1px solid #EAE4EE" }}>
                      <td colSpan={8} style={{ padding: "12px 16px 16px 40px", fontSize: "12px" }}>
                        <div
                          style={{
                            padding: "10px 14px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #EAE4EE",
                            borderRadius: "8px",
                            color: "#544E61",
                          }}
                        >
                          <div style={{ fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                            Trace Diagnostics: {ev.id} ({ev.event})
                          </div>
                          <div>Service Component: <code>{ev.component}</code> | Worker Thread: <code>{ev.workerId}</code></div>
                          <div style={{ marginTop: "2px", color: "#777184" }}>Recorded Message: {ev.details}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
