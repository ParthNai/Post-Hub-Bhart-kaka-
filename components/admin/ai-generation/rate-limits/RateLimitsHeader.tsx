"use client";

import React from "react";
import Link from "next/link";
import { Zap, Save, History, Play, Bell } from "lucide-react";

interface RateLimitsHeaderProps {
  onSaveConfiguration: () => void;
  onOpenHistory: () => void;
  onOpenTest: () => void;
  isSaving?: boolean;
  adminName?: string;
}

export const RateLimitsHeader: React.FC<RateLimitsHeaderProps> = ({
  onSaveConfiguration,
  onOpenHistory,
  onOpenTest,
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
            API Rate Limits &amp; Throttling
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
              API Rate Limits &amp; Throttling Configuration
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
    </div>
  );
};
