"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  RefreshCw,
  Download,
  ChevronDown,
  Bell,
  FileSpreadsheet,
  FileText,
  CreditCard,
} from "lucide-react";

interface AnalyticsHeaderProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onExportCsv: () => void;
  onExportUsageReport: () => void;
  onExportBillingSummary: () => void;
  userName?: string;
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  isRefreshing = false,
  onExportCsv,
  onExportUsageReport,
  onExportBillingSummary,
  userName = "Parth Patel",
}: AnalyticsHeaderProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const timeRangeLabels: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

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
            Usage &amp; Cost Analytics
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
              {userName
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
              {userName}
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
            <BarChart3 size={22} strokeWidth={2.2} />
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
              AI Usage &amp; Cost Analytics
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: "4px 0 0 0",
              }}
            >
              Monitor image-generation consumption, credit usage and actual AI provider costs.
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
          {/* Time Range Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
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
              <Calendar size={14} color="#7956C9" />
              <span>{timeRangeLabels[timeRange] || "Last 30 Days"}</span>
              <ChevronDown size={13} color="#777184" />
            </button>

            {isTimeRangeOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "6px",
                  width: "150px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE4EE",
                  borderRadius: "10px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  padding: "4px 0",
                  zIndex: 30,
                }}
              >
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onTimeRangeChange(key);
                      setIsTimeRangeOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 14px",
                      fontSize: "12px",
                      fontWeight: timeRange === key ? 700 : 500,
                      color: timeRange === key ? "#7956C9" : "#24213A",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{label}</span>
                    {timeRange === key && <span style={{ color: "#7956C9" }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
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
              cursor: isRefreshing ? "not-allowed" : "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <RefreshCw
              size={14}
              color={isRefreshing ? "#7956C9" : "#777184"}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span>Refresh Analytics</span>
          </button>

          {/* Export Report Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
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
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.35)",
              }}
            >
              <Download size={15} />
              <span>Export Report</span>
              <ChevronDown size={13} />
            </button>

            {isExportMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "6px",
                  width: "190px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE4EE",
                  borderRadius: "10px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  padding: "4px 0",
                  zIndex: 30,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setIsExportMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#24213A",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FileSpreadsheet size={15} color="#10B981" />
                  <span>Export Full CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportUsageReport();
                    setIsExportMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#24213A",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FileText size={15} color="#7956C9" />
                  <span>Export Usage Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportBillingSummary();
                    setIsExportMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#24213A",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CreditCard size={15} color="#3B82F6" />
                  <span>Billing Period Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
