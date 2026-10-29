"use client";

import React from "react";
import { Database, Cloud } from "lucide-react";
import type { VersionHistorySummary } from "@/lib/version-history";

interface HistoryFooterProps {
  summary: VersionHistorySummary;
}

export const HistoryFooter: React.FC<HistoryFooterProps> = ({ summary }) => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px 10px 4px",
        marginTop: "16px",
        fontSize: "12px",
        color: "var(--text-muted, #777184)",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {/* Left History Source */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Database size={13} style={{ color: "var(--text-muted, #777184)" }} />
        <span>History source: {summary.historySource}</span>
      </div>

      {/* Right Publication Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Cloud size={13} style={{ color: "var(--text-muted, #777184)" }} />
        <span>Latest confirmed publication: {summary.latestConfirmedPublication}</span>
      </div>
    </footer>
  );
};

