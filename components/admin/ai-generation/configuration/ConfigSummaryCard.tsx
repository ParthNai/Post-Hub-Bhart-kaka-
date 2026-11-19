"use client";

import React from "react";
import { FileText, Sparkles } from "lucide-react";
import type { AiProviderFullConfig } from "@/lib/ai-generation";

interface ConfigSummaryCardProps {
  config: AiProviderFullConfig;
}

export const ConfigSummaryCard: React.FC<ConfigSummaryCardProps> = ({ config }) => {
  const isConfigured = config.status === "Configured" && config.enabled;

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={20} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Configuration Summary
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Current configuration overview.
          </p>
        </div>
      </div>

      {/* 5 Columns Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr 1fr 1.3fr 1.3fr",
          gap: "12px",
          alignItems: "center",
          paddingTop: "4px",
        }}
      >
        {/* Active Provider */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Active Provider
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--foreground)",
              marginTop: "4px",
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>{config.providerName}</span>
          </div>
        </div>

        {/* Active Model */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Active Model
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--foreground)",
              marginTop: "4px",
            }}
          >
            {config.selectedModel === "dall-e-3"
              ? "DALL·E 3"
              : config.selectedModel === "dall-e-2"
              ? "DALL·E 2"
              : config.selectedModel === "imagen-3.0"
              ? "Google Imagen 3.0"
              : "SD3 Medium"}
          </div>
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Status
          </div>
          <div style={{ marginTop: "4px" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: isConfigured ? "#E6F4EA" : "#FEF2F2",
                color: isConfigured ? "#137333" : "#DC2626",
                padding: "3px 10px",
                borderRadius: "12px",
              }}
            >
              {isConfigured ? "Configured" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Last Saved */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Last Saved
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--foreground)",
              marginTop: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {config.lastSavedAt || "Oct 28, 2026 04:35 PM"}
          </div>
        </div>

        {/* Last Verified */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Last Verified
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--foreground)",
              marginTop: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {config.lastVerifiedAt || "Oct 28, 2026 04:35 PM"}
          </div>
        </div>
      </div>
    </div>
  );
};

