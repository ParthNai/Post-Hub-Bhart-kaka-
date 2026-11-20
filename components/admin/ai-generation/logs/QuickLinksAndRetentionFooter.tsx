"use client";

import React from "react";
import Link from "next/link";
import { Settings, Download, ExternalLink } from "lucide-react";

interface QuickLinksAndRetentionFooterProps {
  retentionPolicy: number;
  onRetentionPolicyChange: (days: number) => void;
  exportFormat: "CSV" | "JSON";
  onExportFormatChange: (fmt: "CSV" | "JSON") => void;
  onExportLogs: () => void;
  isExporting?: boolean;
}

export const QuickLinksAndRetentionFooter: React.FC<QuickLinksAndRetentionFooterProps> = ({
  retentionPolicy,
  onRetentionPolicyChange,
  exportFormat,
  onExportFormatChange,
  onExportLogs,
  isExporting = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 20px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Left: Quick Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#24213A" }}>
          Quick Links:
        </span>

        <Link
          href="/admin/ai-generation/trace"
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: "#FAF9FD",
            border: "1px solid #EAE4EE",
            color: "#544E61",
            fontSize: "12px",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
        >
          <span>View in Screen 32: Queue Job Details</span>
          <ExternalLink size={11} color="#777184" />
        </Link>

        <Link
          href="/admin/ai-generation/queue"
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: "#FAF9FD",
            border: "1px solid #EAE4EE",
            color: "#544E61",
            fontSize: "12px",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
        >
          <span>View in Screen 21: Request Queue Monitor</span>
          <ExternalLink size={11} color="#777184" />
        </Link>

        <Link
          href="/admin/ai-generation/failed-requests"
          style={{
            padding: "5px 12px",
            borderRadius: "6px",
            backgroundColor: "#FAF9FD",
            border: "1px solid #EAE4EE",
            color: "#544E61",
            fontSize: "12px",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.15s ease",
          }}
        >
          <span>View in Screen 27: Failed Requests</span>
          <ExternalLink size={11} color="#777184" />
        </Link>
      </div>

      {/* Right: Log Retention & Export */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#24213A", fontWeight: 600 }}>
          <Settings size={14} color="#7956C9" />
          <span>Log Retention & Export</span>
        </div>

        {/* Retention Policy Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <span style={{ color: "#777184" }}>Retention Policy:</span>
          <select
            value={retentionPolicy}
            onChange={(e) => onRetentionPolicyChange(parseInt(e.target.value, 10))}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FFFFFF",
              fontSize: "12px",
              color: "#24213A",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>

        {/* Export Format Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <span style={{ color: "#777184" }}>Export Format:</span>
          <select
            value={exportFormat}
            onChange={(e) => onExportFormatChange(e.target.value as "CSV" | "JSON")}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FFFFFF",
              fontSize: "12px",
              color: "#24213A",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>
        </div>

        {/* Export Logs Button */}
        <button
          type="button"
          onClick={onExportLogs}
          disabled={isExporting}
          style={{
            padding: "5px 14px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FAF9FD",
            color: "#24213A",
            fontSize: "12px",
            fontWeight: 600,
            cursor: isExporting ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.15s ease",
          }}
        >
          <Download size={12} color="#777184" />
          <span>{isExporting ? "Exporting..." : "Export Logs"}</span>
        </button>
      </div>
    </div>
  );
};
