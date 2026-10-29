"use client";

import React from "react";
import Link from "next/link";
import { Search, RotateCw, Loader2, ChevronDown } from "lucide-react";
import type { TokenCategory } from "@/lib/token-usage";

interface TokenUsageHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: TokenCategory;
  onCategoryChange: (cat: TokenCategory) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  scanStatus: "not_checked" | "completed" | "failed";
}

export const TokenUsageHeader: React.FC<TokenUsageHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onRefresh,
  isRefreshing,
  scanStatus,
}) => {
  const statusLabel =
    scanStatus === "completed"
      ? "Scan status: Up to date"
      : scanStatus === "failed"
      ? "Scan status: Failed"
      : "Scan status: Not checked";

  const statusBg =
    scanStatus === "completed"
      ? "#EDF7F2"
      : scanStatus === "failed"
      ? "#FDF2F2"
      : "#F3EFFC";

  const statusColor =
    scanStatus === "completed"
      ? "#12805C"
      : scanStatus === "failed"
      ? "#D9383A"
      : "#7956C9";

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
        <Link href="/admin/design-system" style={{ color: "inherit", textDecoration: "none" }}>
          Design System
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>
          Token Usage
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--text, #24213A)",
                margin: 0,
              }}
            >
              Token Usage & Dependencies
            </h1>

            {/* Scan Status Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: "16px",
                fontSize: "11.5px",
                fontWeight: 600,
                backgroundColor: statusBg,
                color: statusColor,
                border: `1px solid ${statusBg}`,
              }}
            >
              {statusLabel}
            </span>
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted, #777184)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Inspect token references, connected components and potential design impact.
          </p>
        </div>

        {/* Right Search, Filter & Refresh Button */}
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
              placeholder="Search tokens, components or screens"
              style={{
                width: "270px",
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

          {/* Category Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as TokenCategory)}
              aria-label="Filter by token category"
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
              <option value="All">All token categories</option>
              <option value="Colors">Colors</option>
              <option value="Typography">Typography</option>
              <option value="Spacing">Spacing</option>
              <option value="Radius">Radius</option>
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

          {/* Refresh usage data Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            {isRefreshing ? (
              <Loader2 size={15} className="animate-spin" style={{ color: "var(--primary, #7956C9)" }} />
            ) : (
              <RotateCw size={14} style={{ color: "var(--text, #24213A)" }} />
            )}
            <span>{isRefreshing ? "Scanning..." : "Refresh usage data"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

