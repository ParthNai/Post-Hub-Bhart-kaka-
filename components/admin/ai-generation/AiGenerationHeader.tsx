"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Settings, BookOpen, Bell, Sparkles, ListFilter, Image as ImageIcon } from "lucide-react";

interface AiGenerationHeaderProps {
  onRefresh: () => void;
  onOpenSettings: () => void;
  onOpenDocs: () => void;
  isRefreshing?: boolean;
  adminName?: string;
  adminRole?: string;
}

export const AiGenerationHeader: React.FC<AiGenerationHeaderProps> = ({
  onRefresh,
  onOpenSettings,
  onOpenDocs,
  isRefreshing = false,
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
      {/* Top Meta Bar: Breadcrumbs on Left, Admin User Info on Right */}
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
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            AI Image Generation
          </span>
        </div>

        {/* Right profile chip & notification bell */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Notification bell */}
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

          {/* User profile */}
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

      {/* Main Title Row & Actions */}
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
            AI Image Generation
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Monitor generation requests, manage AI services and review image-generation activity.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Generated Images button */}
          <Link
            href="/admin/ai-generation/images"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--primary)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
          >
            <ImageIcon size={14} />
            <span>Image Library</span>
          </Link>

          {/* Queue Monitor button */}
          <Link
            href="/admin/ai-generation/queue"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--primary)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
          >
            <ListFilter size={14} />
            <span>Queue Monitor</span>
          </Link>

          {/* Prompt Rules & Presets button */}
          <Link
            href="/admin/ai-generation/presets"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--surface)",
              color: "var(--primary)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
          >
            <Sparkles size={14} />
            <span>Prompt Rules & Presets</span>
          </Link>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
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
              cursor: isRefreshing ? "not-allowed" : "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
              }}
            />
            <span>Refresh</span>
          </button>

          {/* Generation Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
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
            <Settings size={14} />
            <span>Generation Settings</span>
          </button>

          {/* View Documentation button */}
          <button
            type="button"
            onClick={onOpenDocs}
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
            <BookOpen size={14} />
            <span>View Documentation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

