"use client";

import React from "react";
import { Shield, Copy, ExternalLink } from "lucide-react";
import type { JobOverviewDetails } from "@/lib/ai-job-trace";

interface JobOverviewCardProps {
  overview: JobOverviewDetails;
  onCopyRequestId?: () => void;
  onViewUser?: () => void;
}

export const JobOverviewCard: React.FC<JobOverviewCardProps> = ({
  overview,
  onCopyRequestId,
  onViewUser,
}) => {
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
          marginBottom: "16px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <Shield size={16} color="#7956C9" />
        <span>Job Overview</span>
      </div>

      {/* Row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1.4fr 1fr",
          gap: "16px",
          paddingBottom: "14px",
          borderBottom: "1px solid #F1EDF5",
        }}
      >
        {/* Job ID */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Job ID
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#24213A" }}>
            {overview.jobId}
          </div>
        </div>

        {/* Request ID */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Request ID
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
              {overview.requestId}
            </span>
            <button
              type="button"
              onClick={onCopyRequestId}
              title="Copy Request ID"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#777184",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Copy size={13} />
            </button>
          </div>
        </div>

        {/* User Reference */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            User Reference
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
              {overview.userReference}
            </span>
            <button
              type="button"
              onClick={onViewUser}
              title="View User"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#777184",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Queue Name */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Queue Name
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
            {overview.queueName}
          </div>
        </div>

        {/* Priority */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Priority
          </div>
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: overview.priority === "Critical" ? "#FEE2E2" : "#DCFCE7",
              color: overview.priority === "Critical" ? "#DC2626" : "#16A34A",
            }}
          >
            {overview.priority}
          </span>
        </div>
      </div>

      {/* Row 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr 1.4fr",
          gap: "16px",
          paddingTop: "14px",
        }}
      >
        {/* Status */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Status
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: overview.status === "Processing" ? "#7956C9" : "#16A34A",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: overview.status === "Processing" ? "#7956C9" : "#16A34A",
              }}
            >
              {overview.status}
            </span>
          </div>
        </div>

        {/* Created At */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Created At
          </div>
          <div style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
            {overview.createdAt}
          </div>
        </div>

        {/* Started At */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Started At
          </div>
          <div style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
            {overview.startedAt}
          </div>
        </div>

        {/* Completed At */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Completed At
          </div>
          <div style={{ fontSize: "12px", color: "#777184" }}>
            {overview.completedAt || "—"}
          </div>
        </div>

        {/* Assigned Worker */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Assigned Worker
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
            {overview.assignedWorker}
          </div>
        </div>

        {/* Provider / Model */}
        <div>
          <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500, marginBottom: "4px" }}>
            Provider / Model
          </div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
            {overview.providerModel}
          </div>
        </div>
      </div>
    </div>
  );
};
