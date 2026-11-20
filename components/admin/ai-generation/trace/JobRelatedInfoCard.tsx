"use client";

import React from "react";
import Link from "next/link";
import { Link2, ListFilter, ExternalLink } from "lucide-react";

interface JobRelatedInfoCardProps {
  relatedQueue: string;
  relatedJob: string;
  relatedRequest: string;
}

export const JobRelatedInfoCard: React.FC<JobRelatedInfoCardProps> = ({
  relatedQueue,
  relatedJob,
  relatedRequest,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 18px",
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
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#F3EFFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7956C9",
          }}
        >
          <Link2 size={15} />
        </div>
        <span>Related Information</span>
      </div>

      {/* Key-Value Rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12.5px",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Related Queue:</span>
          <span
            style={{
              backgroundColor: "#F3EFFC",
              color: "#7956C9",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {relatedQueue}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Related Job:</span>
          <span style={{ color: "#24213A", fontWeight: 600, fontFamily: "monospace" }}>
            {relatedJob}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Related Request:</span>
          <Link
            href={`/admin/ai-generation/queue?search=${relatedRequest}`}
            style={{
              color: "#7956C9",
              fontWeight: 600,
              fontFamily: "monospace",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{relatedRequest}</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>

      {/* Bottom Button */}
      <Link
        href="/admin/ai-generation/queue-priority"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          width: "100%",
          padding: "8px 14px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          color: "#24213A",
          border: "1px solid #EAE4EE",
          fontSize: "12.5px",
          fontWeight: 600,
          textDecoration: "none",
          transition: "all 0.15s ease",
        }}
      >
        <ListFilter size={14} color="#777184" />
        <span>View Related Queue</span>
      </Link>
    </div>
  );
};
