"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, RefreshCw, Download } from "lucide-react";

interface JobTraceHeaderProps {
  onRefresh: () => void;
  onExportTrace: () => void;
  isRefreshing?: boolean;
}

export const JobTraceHeader: React.FC<JobTraceHeaderProps> = ({
  onRefresh,
  onExportTrace,
  isRefreshing = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#F3EFFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
            }}
          >
            <Zap size={20} fill="#7956C9" />
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Queue Job Details & Execution Trace Viewer
          </h1>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "#777184",
            margin: "4px 0 0 0",
            fontWeight: 400,
          }}
        >
          Inspect individual AI generation jobs, processing stages, worker assignments and execution events.
        </p>
      </div>

      {/* Header Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          href="/admin/ai-generation/queue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            color: "#24213A",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <ArrowLeft size={14} color="#777184" />
          <span>Back to Queue</span>
        </Link>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            color: "#24213A",
            fontSize: "13px",
            fontWeight: 500,
            cursor: isRefreshing ? "wait" : "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <RefreshCw
            size={14}
            style={{
              animation: isRefreshing ? "spin 1s linear infinite" : "none",
              color: "#777184",
            }}
          />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Job Data"}</span>
        </button>

        <button
          type="button"
          onClick={onExportTrace}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 16px",
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
          <Download size={14} />
          <span>Export Trace</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
