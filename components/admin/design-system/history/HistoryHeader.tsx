"use client";

import React from "react";
import Link from "next/link";
import { Search, Home, ChevronDown } from "lucide-react";
import type { ChangeType, VersionStatus } from "@/lib/version-history";

interface HistoryHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedChangeType: ChangeType;
  onChangeTypeChange: (type: ChangeType) => void;
  selectedStatus: VersionStatus | "All";
  onStatusChange: (status: VersionStatus | "All") => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedChangeType,
  onChangeTypeChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <header
      style={{
        padding: "20px 32px 16px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "var(--bg, #FAF7F2)",
        borderBottom: "1px solid var(--border, #EAE4EE)",
      }}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
        }}
      >
        <Link href="/admin/dashboard" style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          <Home size={14} style={{ marginRight: "4px" }} />
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/design-system" style={{ color: "inherit", textDecoration: "none" }}>
          Design System
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>
          Change History
        </span>
      </nav>

      {/* Main Title Row & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Change History & Version Comparison
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted, #777184)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Review design-system changes, compare configurations and inspect publication history.
          </p>
        </div>

        {/* Right Search and Filter Dropdowns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search changes or versions"
              style={{
                width: "240px",
                padding: "8px 12px 8px 34px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                outline: "none",
              }}
            />
          </div>

          {/* Change Types Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedChangeType}
              onChange={(e) => onChangeTypeChange(e.target.value as ChangeType)}
              aria-label="Filter by change type"
              style={{
                appearance: "none",
                padding: "8px 32px 8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All change types</option>
              <option value="Colors">Colors</option>
              <option value="Typography">Typography</option>
              <option value="Spacing">Spacing</option>
              <option value="Layout">Layout</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Statuses Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as VersionStatus | "All")}
              aria-label="Filter by version status"
              style={{
                appearance: "none",
                padding: "8px 32px 8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
