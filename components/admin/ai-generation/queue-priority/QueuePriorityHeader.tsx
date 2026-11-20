"use client";

import React from "react";
import { Zap, RefreshCw, Settings, Save } from "lucide-react";

interface QueuePriorityHeaderProps {
  onRefresh: () => void;
  onOpenSettings: () => void;
  onSaveConfig: () => void;
  isRefreshing?: boolean;
  isSaving?: boolean;
}

export const QueuePriorityHeader: React.FC<QueuePriorityHeaderProps> = ({
  onRefresh,
  onOpenSettings,
  onSaveConfig,
  isRefreshing = false,
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
            Queue Priority & Scheduling
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
          Manage AI generation request priorities, processing capacity and scheduling policies.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <span>{isRefreshing ? "Refreshing..." : "Refresh Queue"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
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
          <Settings size={14} style={{ color: "#777184" }} />
          <span>Scheduling Settings</span>
        </button>

        <button
          type="button"
          onClick={onSaveConfig}
          disabled={isSaving}
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
            cursor: isSaving ? "wait" : "pointer",
            boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
          }}
        >
          <Save size={14} />
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
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
