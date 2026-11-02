"use client";

import React from "react";
import Link from "next/link";
import { Download, Bell, Filter } from "lucide-react";
import { AnalyticsDateRange } from "@/lib/template-analytics";

interface AnalyticsHeaderProps {
  range: AnalyticsDateRange;
  onRangeChange: (range: AnalyticsDateRange) => void;
  onExport: () => void;
  isExporting?: boolean;
  adminName?: string;
  adminRole?: string;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  range,
  onRangeChange,
  onExport,
  isExporting = false,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  return (
    <div style={{ marginBottom: "22px" }}>
      {/* Top Bar with Parth Patel Administrator Profile & Notifications */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "var(--text-muted, #777184)",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "inherit", textDecoration: "none" }}
            className="hover:underline"
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/templates"
            style={{ color: "inherit", textDecoration: "none" }}
            className="hover:underline"
          >
            Templates
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Analytics</span>
        </div>

        {/* User profile & notification */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            aria-label="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text, #24213A)",
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
                width: "8px",
                height: "8px",
                backgroundColor: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #FAF7F2",
              }}
            />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary, #E8DFF5)",
                color: "var(--primary, #7956C9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {adminName.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  lineHeight: 1.2,
                }}
              >
                {adminName}
              </span>
              <span
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-muted, #777184)",
                  lineHeight: 1.2,
                }}
              >
                {adminRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Title & Top Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Template Analytics
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              margin: "4px 0 0 0",
            }}
          >
            Analyze template usage, user engagement, and design creation trends.
          </p>
        </div>

        {/* Action Controls: Date Range pills, Filter, Export Report */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Date Range Segmented Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              borderRadius: "8px",
              padding: "3px",
            }}
          >
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
            ].map((p) => {
              const isActive = range === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onRangeChange(p.id as AnalyticsDateRange)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isActive ? "var(--primary, #7956C9)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-muted, #777184)",
                    fontSize: "12.5px",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Filter Button */}
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
            className="hover:bg-slate-50"
          >
            <Filter size={14} style={{ color: "var(--text-muted, #777184)" }} />
            <span>Filter</span>
          </button>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              cursor: isExporting ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            className="hover:bg-slate-50"
          >
            <Download size={14} style={{ color: "var(--primary, #7956C9)" }} />
            <span>{isExporting ? "Exporting..." : "Export Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

