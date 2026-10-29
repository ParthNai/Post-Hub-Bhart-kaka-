"use client";

import React from "react";
import { Eye, RotateCcw } from "lucide-react";
import type { VersionRecord } from "@/lib/version-history";

interface ChangeActionsCardProps {
  selectedVersion: VersionRecord | null;
  onViewFullVersion: () => void;
  onRestoreDraft: () => void;
  isRestoring: boolean;
}

export const ChangeActionsCard: React.FC<ChangeActionsCardProps> = ({
  selectedVersion,
  onViewFullVersion,
  onRestoreDraft,
  isRestoring,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "20px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          margin: 0,
        }}
      >
        Change actions
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* View Full Version Button */}
        <button
          type="button"
          onClick={onViewFullVersion}
          disabled={!selectedVersion}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "9px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: !selectedVersion ? "not-allowed" : "pointer",
            opacity: !selectedVersion ? 0.5 : 1,
            transition: "all 0.15s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <Eye size={15} style={{ color: "var(--text-muted, #777184)" }} />
          <span>View full version</span>
        </button>

        {/* Restore as Draft Button */}
        <button
          type="button"
          onClick={onRestoreDraft}
          disabled={!selectedVersion || isRestoring}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "9px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: !selectedVersion || isRestoring ? "not-allowed" : "pointer",
            opacity: !selectedVersion || isRestoring ? 0.5 : 1,
            transition: "all 0.15s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <RotateCcw size={14} style={{ color: "var(--text-muted, #777184)" }} />
          <span>{isRestoring ? "Restoring..." : "Restore as draft"}</span>
        </button>
      </div>
    </div>
  );
};

