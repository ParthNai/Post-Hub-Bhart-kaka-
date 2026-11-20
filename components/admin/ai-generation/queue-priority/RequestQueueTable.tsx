"use client";

import React, { useState } from "react";
import {
  ListFilter,
  Search,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Eye,
  Pause,
  Play,
  XCircle,
} from "lucide-react";
import type { QueuePriorityItem } from "@/lib/ai-queue-priority";

interface RequestQueueTableProps {
  items: QueuePriorityItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  selectedRequestId: string | null;
  onSelectRequest: (item: QueuePriorityItem) => void;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (t: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  onChangePriorityClick: (item: QueuePriorityItem) => void;
  onViewDetailsClick: (item: QueuePriorityItem) => void;
  onTogglePauseClick: (item: QueuePriorityItem) => void;
  onCancelRequestClick: (item: QueuePriorityItem) => void;
}

export const RequestQueueTable: React.FC<RequestQueueTableProps> = ({
  items,
  totalItems,
  currentPage,
  totalPages,
  selectedRequestId,
  onSelectRequest,
  onPageChange,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onChangePriorityClick,
  onViewDetailsClick,
  onTogglePauseClick,
  onCancelRequestClick,
}) => {
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return { bg: "#FEE2E2", text: "#DC2626" };
      case "High":
        return { bg: "#FFEDD5", text: "#EA580C" };
      case "Normal":
        return { bg: "#DCFCE7", text: "#16A34A" };
      case "Low":
        return { bg: "#E0F2FE", text: "#0284C7" };
      default:
        return { bg: "#F3EFFC", text: "#7956C9" };
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Processing":
        return { dot: "#7956C9", text: "#7956C9" };
      case "Waiting":
        return { dot: "#2563EB", text: "#2563EB" };
      case "Scheduled":
        return { dot: "#16A34A", text: "#16A34A" };
      case "Paused":
        return { dot: "#D97706", text: "#D97706" };
      case "Failed":
        return { dot: "#DC2626", text: "#DC2626" };
      default:
        return { dot: "#777184", text: "#777184" };
    }
  };

  const startIndex = (currentPage - 1) * 5 + 1;
  const endIndex = Math.min(startIndex + items.length - 1, totalItems);

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
      {/* Table Header & Toolbar */}
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
          <ListFilter size={18} color="#7956C9" />
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Request Queue
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
              placeholder="Search requests..."
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

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
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
            <option value="All Types">All Types</option>
            <option value="Image">Image</option>
            <option value="Text">Text</option>
            <option value="Multimodal">Multimodal</option>
          </select>

          {/* Status Dropdown */}
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
            <option value="Processing">Processing</option>
            <option value="Waiting">Waiting</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Paused">Paused</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Filter icon button */}
          <button
            type="button"
            title="Advanced Filters"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF7F2",
              color: "#777184",
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={14} />
          </button>
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
              <th style={{ padding: "10px 14px", fontWeight: 600, width: "90px" }}>Queue Position</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Request ID</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>User</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Generation Type</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Provider / Model</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Priority</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Submitted At</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Scheduled At</th>
              <th style={{ padding: "10px 14px", fontWeight: 600 }}>Current Status</th>
              <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
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
                  No requests found matching the current filters.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedRequestId === item.id;
                const priorityBadge = getPriorityBadge(item.priority);
                const statusDot = getStatusDot(item.status);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectRequest(item)}
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
                    {/* Queue Position */}
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#24213A" }}>
                      {item.queuePosition}
                    </td>

                    {/* Request ID */}
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#24213A" }}>
                      {item.id}
                    </td>

                    {/* User */}
                    <td style={{ padding: "12px 14px", color: "#544E61" }}>
                      {item.userId}
                    </td>

                    {/* Generation Type */}
                    <td style={{ padding: "12px 14px", color: "#24213A" }}>
                      {item.generationType}
                    </td>

                    {/* Provider / Model */}
                    <td style={{ padding: "12px 14px", color: "#24213A" }}>
                      {item.providerModelFormatted}
                    </td>

                    {/* Priority */}
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: priorityBadge.bg,
                          color: priorityBadge.text,
                        }}
                      >
                        {item.priority}
                      </span>
                    </td>

                    {/* Submitted At */}
                    <td style={{ padding: "12px 14px", color: "#777184", fontSize: "12px" }}>
                      {item.submittedAt}
                    </td>

                    {/* Scheduled At */}
                    <td style={{ padding: "12px 14px", color: "#777184", fontSize: "12px" }}>
                      {item.scheduledAt || "—"}
                    </td>

                    {/* Current Status */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: statusDot.dot,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: statusDot.text,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td
                      style={{ padding: "12px 14px", textAlign: "right", position: "relative" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionMenuId(openActionMenuId === item.id ? null : item.id)
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

                      {openActionMenuId === item.id && (
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
                              onChangePriorityClick(item);
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
                            <ArrowUp size={14} color="#7956C9" />
                            <span>Change Priority</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onViewDetailsClick(item);
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

                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onTogglePauseClick(item);
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
                            {item.status === "Paused" ? (
                              <>
                                <Play size={14} color="#16A34A" />
                                <span>Resume Request</span>
                              </>
                            ) : (
                              <>
                                <Pause size={14} color="#D97706" />
                                <span>Pause Request</span>
                              </>
                            )}
                          </button>

                          <div style={{ height: "1px", backgroundColor: "#F1EDF5", margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onCancelRequestClick(item);
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
                            <XCircle size={14} color="#DC2626" />
                            <span>Cancel Request</span>
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

      {/* Pagination Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderTop: "1px solid #F1EDF5",
          fontSize: "12px",
          color: "#777184",
        }}
      >
        <div>
          Showing {totalItems > 0 ? `${startIndex}-${endIndex}` : "0"} of {totalItems} requests
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
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
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pg) => {
            const isActive = pg === currentPage;
            return (
              <button
                key={pg}
                type="button"
                onClick={() => onPageChange(pg)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: isActive ? "1px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: isActive ? "#7956C9" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#24213A",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {pg}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
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
              opacity: currentPage >= totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
