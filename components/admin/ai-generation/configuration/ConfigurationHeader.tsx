"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, History, Save, Bell, Loader2 } from "lucide-react";

interface ConfigurationHeaderProps {
  onOpenHistory: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  adminName?: string;
  adminRole?: string;
}

export const ConfigurationHeader: React.FC<ConfigurationHeaderProps> = ({
  onOpenHistory,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* Top Meta Row: Breadcrumbs on Left, Profile on Right */}
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
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            Admin
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <Link
            href="/admin/ai-generation"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            AI Image Generation
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            Provider Configuration
          </span>
        </div>

        {/* Profile Chip & Notifications */}
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
              color: "var(--text-muted)",
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
                border: "2px solid var(--background)",
              }}
            />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {adminName.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  lineHeight: "1.2",
                }}
              >
                {adminName}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: "1.2",
                }}
              >
                {adminRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Action Buttons Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Provider & Model Configuration
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Configure AI image-generation services, manage model settings and verify provider connectivity.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Back to AI Dashboard */}
          <Link
            href="/admin/ai-generation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to AI Dashboard</span>
          </Link>

          {/* Configuration History */}
          <button
            type="button"
            onClick={onOpenHistory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <History size={14} />
            <span>Configuration History</span>
          </button>

          {/* Save Changes */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              opacity: hasUnsavedChanges || isSaving ? 1 : 0.85,
              transition: "all 0.15s ease",
            }}
          >
            {isSaving ? (
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Save size={14} />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

