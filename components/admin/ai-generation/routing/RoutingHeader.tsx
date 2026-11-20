"use client";

import React from "react";
import Link from "next/link";
import {
  GitBranch,
  Settings,
  History,
  Save,
  Bell,
  ChevronDown,
} from "lucide-react";

interface RoutingHeaderProps {
  onOpenSettings: () => void;
  onViewHistory: () => void;
  onSaveChanges: () => void;
  isSaving?: boolean;
  adminName?: string;
}

export const RoutingHeader: React.FC<RoutingHeaderProps> = ({
  onOpenSettings,
  onViewHistory,
  onSaveChanges,
  isSaving = false,
  adminName = "Parth Patel",
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
            Provider Failover &amp; Routing
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
              gap: "10px",
              padding: "4px 10px 4px 6px",
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {adminName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "PP"}
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#24213A",
              }}
            >
              {adminName}
            </span>
            <ChevronDown size={14} color="#777184" />
          </div>
        </div>
      </div>

      {/* Main Page Title and Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
              boxShadow: "0 2px 5px rgba(121, 86, 201, 0.12)",
            }}
          >
            <GitBranch size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              Provider Failover &amp; Routing Configuration
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: "4px 0 0 0",
              }}
            >
              Automated routing rules, failover priorities and load-distribution policies across AI generation providers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onViewHistory}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <History size={14} color="#7956C9" />
            <span>Routing History</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              color: "#24213A",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <Settings size={14} color="#7956C9" />
            <span>Routing Settings</span>
          </button>

          <button
            type="button"
            onClick={onSaveChanges}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "#7956C9",
              border: "1px solid #7956C9",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.35)",
            }}
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
