"use client";

import React from "react";
import { FileText, Sliders, ShieldCheck, Sparkles, Clock, AlertTriangle } from "lucide-react";

interface ConfigurationSummaryCardProps {
  modifiedCount: number;
  isValid: boolean;
  lastSavedAt?: string;
  hasUnsavedChanges: boolean;
}

export const ConfigurationSummaryCard: React.FC<ConfigurationSummaryCardProps> = ({
  modifiedCount,
  isValid,
  lastSavedAt = "Not saved yet",
  hasUnsavedChanges,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "20px 22px 18px 22px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          <FileText size={16} />
        </div>
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 2px 0",
              letterSpacing: "-0.015em",
            }}
          >
            Configuration Summary
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            Quick overview of this screen&apos;s configuration status.
          </p>
        </div>
      </div>

      {/* 4 Summary Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 1. Modified fields */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
            borderBottom: "1px solid #FAF7FD",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sliders size={15} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "12.5px", color: "var(--text)", fontWeight: 500 }}>
              Modified fields
            </span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
            {modifiedCount}
          </span>
        </div>

        {/* 2. Validation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
            borderBottom: "1px solid #FAF7FD",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={15} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "12.5px", color: "var(--text)", fontWeight: 500 }}>
              Validation
            </span>
          </div>
          {isValid ? (
            <span
              style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: "12px",
                backgroundColor: "#EDF7F2",
                color: "var(--success)",
                fontSize: "11.5px",
                fontWeight: 600,
              }}
            >
              Ready to review
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 10px",
                borderRadius: "12px",
                backgroundColor: "var(--error-bg)",
                color: "var(--error)",
                fontSize: "11.5px",
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={11} />
              Needs attention
            </span>
          )}
        </div>

        {/* 3. Current state */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
            borderBottom: "1px solid #FAF7FD",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Sparkles size={15} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "12.5px", color: "var(--text)", fontWeight: 500 }}>
              Current state
            </span>
          </div>
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              fontSize: "11.5px",
              fontWeight: 600,
            }}
          >
            {hasUnsavedChanges ? "Unsaved Changes" : "Draft"}
          </span>
        </div>

        {/* 4. Last saved */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={15} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: "12.5px", color: "var(--text)", fontWeight: 500 }}>
              Last saved
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
            {lastSavedAt}
          </span>
        </div>
      </div>
    </div>
  );
};
