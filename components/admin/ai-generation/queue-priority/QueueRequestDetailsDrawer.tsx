"use client";

import React from "react";
import { X, Image as ImageIcon, ArrowUp, Eye, XCircle } from "lucide-react";
import type { QueuePriorityItem } from "@/lib/ai-queue-priority";

interface QueueRequestDetailsDrawerProps {
  item: QueuePriorityItem | null;
  onClose: () => void;
  onChangePriority: (item: QueuePriorityItem) => void;
  onViewDetails: (item: QueuePriorityItem) => void;
  onCancelRequest: (item: QueuePriorityItem) => void;
}

export const QueueRequestDetailsDrawer: React.FC<QueueRequestDetailsDrawerProps> = ({
  item,
  onClose,
  onChangePriority,
  onViewDetails,
  onCancelRequest,
}) => {
  if (!item) return null;

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

  const priorityBadge = getPriorityBadge(item.priority);
  const statusDot = getStatusDot(item.status);

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        alignSelf: "flex-start",
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1EDF5",
          paddingBottom: "14px",
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
          Queue Request Details
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Hero Banner Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          backgroundColor: "#FAF7F2",
          border: "1px solid #EAE4EE",
          borderRadius: "10px",
          padding: "14px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "#F3EFFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7956C9",
            flexShrink: 0,
          }}
        >
          <ImageIcon size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#24213A",
              lineHeight: 1.2,
            }}
          >
            {item.id}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#777184",
              marginTop: "2px",
            }}
          >
            by {item.userId}
          </div>
        </div>
      </div>

      {/* Detail Key-Value List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
        {/* Queue Position */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Queue Position:</span>
          <span style={{ fontWeight: 600, color: "#24213A" }}>#{item.queuePosition}</span>
        </div>

        {/* Priority */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Priority:</span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: priorityBadge.bg,
              color: priorityBadge.text,
            }}
          >
            {item.priority}
          </span>
        </div>

        {/* Provider / Model */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Provider / Model:</span>
          <span style={{ fontWeight: 500, color: "#24213A" }}>{item.providerModelFormatted}</span>
        </div>

        {/* Submission Time */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Submission Time:</span>
          <span style={{ color: "#24213A", fontSize: "12px" }}>
            {item.submittedAt.includes("2025") ? item.submittedAt : `Nov 19, 2025, ${item.submittedAt.split(", ")[1] || "10:40 AM"}`}
          </span>
        </div>

        {/* Scheduled Time */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Scheduled Time:</span>
          <span style={{ color: "#24213A", fontSize: "12px" }}>
            {item.scheduledAt || "Not Scheduled"}
          </span>
        </div>

        {/* Current Status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Current Status:</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: statusDot.dot,
              }}
            />
            <span style={{ color: statusDot.text, fontWeight: 600, fontSize: "12px" }}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Attempt Count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Attempt Count:</span>
          <span style={{ fontWeight: 500, color: "#24213A" }}>{item.attemptCount}</span>
        </div>

        {/* Related Job ID */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#777184" }}>Related Job ID:</span>
          <span style={{ fontWeight: 600, color: "#24213A" }}>{item.relatedJobId}</span>
        </div>
      </div>

      <div style={{ height: "1px", backgroundColor: "#F1EDF5", margin: "2px 0" }} />

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Change Priority */}
        <button
          type="button"
          onClick={() => onChangePriority(item)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#7956C9",
            border: "1px solid #7956C9",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
          }}
        >
          <ArrowUp size={15} />
          <span>Change Priority</span>
        </button>

        {/* View Request Details */}
        <button
          type="button"
          onClick={() => onViewDetails(item)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            color: "#24213A",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <Eye size={15} color="#777184" />
          <span>View Request Details</span>
        </button>

        {/* Cancel Request */}
        <button
          type="button"
          onClick={() => onCancelRequest(item)}
          disabled={item.status === "Completed" || item.status === "Cancelled"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #FCA5A5",
            color: "#DC2626",
            fontSize: "13px",
            fontWeight: 600,
            cursor: item.status === "Completed" || item.status === "Cancelled" ? "not-allowed" : "pointer",
            opacity: item.status === "Completed" || item.status === "Cancelled" ? 0.5 : 1,
            transition: "all 0.15s ease",
          }}
        >
          <XCircle size={15} color="#DC2626" />
          <span>Cancel Request</span>
        </button>
      </div>
    </div>
  );
};
