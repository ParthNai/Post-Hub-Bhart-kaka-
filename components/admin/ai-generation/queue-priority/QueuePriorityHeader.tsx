"use client";

import React from "react";
import Link from "next/link";
import { Zap, RefreshCw, Settings, Save, Bell } from "lucide-react";

interface QueuePriorityHeaderProps {
  onRefresh: () => void;
  onOpenSettings: () => void;
  onSaveConfig: () => void;
  isRefreshing?: boolean;
  isSaving?: boolean;
  adminName?: string;
}

export const QueuePriorityHeader: React.FC<QueuePriorityHeaderProps> = ({
  onRefresh,
  onOpenSettings,
  onSaveConfig,
  isRefreshing = false,
  isSaving = false,
  adminName = "Parth Admin",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginBottom: "16px",
      }}
    >
      {/* Top Meta Bar: Breadcrumbs & Admin Profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "#777184",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "#777184", textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <Link
            href="/admin/ai-generation"
            style={{ color: "#777184", textDecoration: "none" }}
          >
            AI Image Generation
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#7956C9", fontWeight: 600 }}>
            Queue Priority &amp; Scheduling
          </span>
        </div>

        {/* Right profile chip & notification bell */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            title="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "7px",
                height: "7px",
                backgroundColor: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              padding: "4px 10px 4px 6px",
              borderRadius: "20px",
              border: "1px solid #EAE4EE",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {adminName.charAt(0)}
            </div>
            <span
              style={{ fontSize: "12.5px", fontWeight: 600, color: "#24213A" }}
            >
              {adminName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Title Row & Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
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
              Queue Priority &amp; Scheduling
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
