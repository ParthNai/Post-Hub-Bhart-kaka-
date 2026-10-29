"use client";

import React from "react";
import { Database, Cloud } from "lucide-react";

export const ExportImportFooter: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        padding: "16px 20px",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--border, #EAE4EE)",
        fontSize: "12px",
        color: "var(--text-muted, #777184)",
        marginTop: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Database size={14} style={{ color: "var(--primary, #7956C9)" }} />
        <span>
          History source:{" "}
          <strong style={{ color: "var(--text, #24213A)" }}>Not configured</strong>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Cloud size={14} style={{ color: "var(--primary, #7956C9)" }} />
        <span>
          Latest confirmed publication:{" "}
          <strong style={{ color: "var(--text, #24213A)" }}>Not available</strong>
        </span>
      </div>
    </div>
  );
};
