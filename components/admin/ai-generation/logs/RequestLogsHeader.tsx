"use client";

import React from "react";
import { Activity, RefreshCw, Download, Settings } from "lucide-react";

interface RequestLogsHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  onOpenRetentionSettings: () => void;
  isRefreshing?: boolean;
}

export const RequestLogsHeader: React.FC<RequestLogsHeaderProps> = ({
  onRefresh,
  onExport,
  onOpenRetentionSettings,
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
            <Activity size={20} />
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
            AI Generation Request Logs & API Activity Monitor
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
          Monitor generation requests, backend API activity, response status, latency and request-level errors.
        </p>
      </div>

      {/* Header Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Refresh Logs Button */}
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
            cursor: isRefreshing ? "not-allowed" : "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <RefreshCw
            size={14}
            color="#777184"
            style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }}
          />
          <span>Refresh Logs</span>
        </button>

        {/* Export Logs Button */}
        <button
          type="button"
          onClick={onExport}
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
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <Download size={14} color="#777184" />
          <span>Export Logs</span>
        </button>

        {/* Log Retention Settings Button */}
        <button
          type="button"
          onClick={onOpenRetentionSettings}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#7956C9",
            border: "none",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
          }}
        >
          <Settings size={14} />
          <span>Log Retention Settings</span>
        </button>
      </div>
    </div>
  );
};
