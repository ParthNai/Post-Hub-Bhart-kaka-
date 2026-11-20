"use client";

import React from "react";
import { Zap, Save, History, Play } from "lucide-react";

interface RateLimitsHeaderProps {
  onSaveConfiguration: () => void;
  onOpenHistory: () => void;
  onOpenTest: () => void;
  isSaving?: boolean;
}

export const RateLimitsHeader: React.FC<RateLimitsHeaderProps> = ({
  onSaveConfiguration,
  onOpenHistory,
  onOpenTest,
  isSaving = false,
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
            API Rate Limits & Throttling Configuration
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
          Configure request limits, traffic throttling and usage protection across AI generation APIs.
        </p>
      </div>

      {/* Header Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Save Configuration Button (Purple Solid) */}
        <button
          type="button"
          onClick={onSaveConfiguration}
          disabled={isSaving}
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
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 1px 2px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          <Save size={14} />
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
        </button>

        {/* View Change History Button (White Outline) */}
        <button
          type="button"
          onClick={onOpenHistory}
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
          <History size={14} color="#777184" />
          <span>View Change History</span>
        </button>

        {/* Test Configuration Button (White Outline) */}
        <button
          type="button"
          onClick={onOpenTest}
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
          <Play size={14} color="#777184" />
          <span>Test Configuration</span>
        </button>
      </div>
    </div>
  );
};
