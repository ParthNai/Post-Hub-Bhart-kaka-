"use client";

import React from "react";
import { ListFilter, Search, Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiRequestLog } from "@/lib/ai-request-logs";

interface RequestLogsTableProps {
  logs: ApiRequestLog[];
  selectedLogId: string | null;
  onSelectLog: (log: ApiRequestLog) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedEndpoint: string;
  onEndpointChange: (ep: string) => void;
  selectedMethod: string;
  onMethodChange: (m: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (t: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export const RequestLogsTable: React.FC<RequestLogsTableProps> = ({
  logs,
  selectedLogId,
  onSelectLog,
  searchQuery,
  onSearchChange,
  selectedEndpoint,
  onEndpointChange,
  selectedMethod,
  onMethodChange,
  selectedStatus,
  onStatusChange,
  selectedTimeRange,
  onTimeRangeChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
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
      {/* Title & Filters Bar */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #EAE4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ListFilter size={16} color="#7956C9" />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>
            API Request Logs
          </span>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF9FD",
              width: "180px",
            }}
          >
            <Search size={13} color="#777184" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Request ID..."
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

          {/* Endpoints Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedEndpoint}
              onChange={(e) => onEndpointChange(e.target.value)}
              style={{
                appearance: "none",
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE4EE",
                borderRadius: "6px",
                padding: "5px 24px 5px 10px",
                fontSize: "12px",
                color: "#24213A",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All Endpoints">All Endpoints</option>
              <option value="/api/generate-image">/api/generate-image</option>
              <option value="/api/edit-image">/api/edit-image</option>
              <option value="/api/status">/api/status</option>
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Methods Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedMethod}
              onChange={(e) => onMethodChange(e.target.value)}
              style={{
                appearance: "none",
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE4EE",
                borderRadius: "6px",
                padding: "5px 24px 5px 10px",
                fontSize: "12px",
                color: "#24213A",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All Methods">All Methods</option>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{
                appearance: "none",
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE4EE",
                borderRadius: "6px",
                padding: "5px 24px 5px 10px",
                fontSize: "12px",
                color: "#24213A",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All Status">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Retry">Retry</option>
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Date Filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FFFFFF",
              fontSize: "12px",
              color: "#24213A",
            }}
          >
            <Calendar size={13} color="#777184" />
            <select
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                fontSize: "12px",
                color: "#24213A",
                cursor: "pointer",
              }}
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last Hour">Last Hour</option>
              <option value="Last 7 Days">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12.5px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#FAF9FD", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Request ID</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>API Endpoint</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>HTTP Method</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Response Code</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Latency</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Request Source</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Related Job ID</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "10px 14px", color: "#777184", fontWeight: 600, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    padding: "32px 14px",
                    textAlign: "center",
                    color: "#777184",
                    fontStyle: "italic",
                  }}
                >
                  No API request logs match the selected filter criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isSelected = selectedLogId === log.id;

                // Response Code Pill styling
                let codeBg = "#EAFBF0";
                let codeColor = "#1E824C";
                if (log.responseCode >= 500) {
                  codeBg = "#FEE2E2";
                  codeColor = "#DC2626";
                } else if (log.responseCode >= 400) {
                  codeBg = "#FEF3C7";
                  codeColor = "#D97706";
                }

                // Status Indicator
                let statusDotColor = "#10B981";
                if (log.status === "Failed") statusDotColor = "#EF4444";
                else if (log.status === "Retry") statusDotColor = "#F59E0B";

                return (
                  <tr
                    key={log.id}
                    onClick={() => onSelectLog(log)}
                    style={{
                      borderBottom: "1px solid #F1EDF5",
                      backgroundColor: isSelected ? "#FBF9FE" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "12px 14px", color: "#777184", whiteSpace: "nowrap" }}>
                      {log.timestamp}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#24213A",
                        fontWeight: 600,
                        fontFamily: "monospace",
                      }}
                    >
                      {log.id}
                    </td>

                    <td style={{ padding: "12px 14px", color: "#24213A", fontFamily: "monospace" }}>
                      {log.endpoint}
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          backgroundColor: "#F3EFFC",
                          color: "#7956C9",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {log.method}
                      </span>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          backgroundColor: codeBg,
                          color: codeColor,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {log.responseCode}
                      </span>
                    </td>

                    <td style={{ padding: "12px 14px", color: "#24213A", fontWeight: 500 }}>
                      {log.latency}
                    </td>

                    <td style={{ padding: "12px 14px", color: "#544E61" }}>
                      {log.requestSource}
                    </td>

                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#7956C9",
                        fontWeight: 600,
                        fontFamily: "monospace",
                      }}
                    >
                      {log.relatedJobId}
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: statusDotColor,
                          }}
                        />
                        <span style={{ fontWeight: 600, color: "#24213A" }}>{log.status}</span>
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLog(log);
                        }}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "1px solid #EAE4EE",
                          backgroundColor: "#FFFFFF",
                          color: "#24213A",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "6px",
          borderTop: "1px solid #F1EDF5",
        }}
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            color: "#777184",
            opacity: currentPage <= 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          const isActive = currentPage === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: isActive ? "none" : "1px solid #EAE4EE",
                backgroundColor: isActive ? "#7956C9" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#24213A",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
            color: "#777184",
            opacity: currentPage >= totalPages ? 0.5 : 1,
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
