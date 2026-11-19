"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";

interface AiRequestsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  providerFilter: string;
  onProviderChange: (provider: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  formatFilter: string;
  onFormatChange: (format: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const AiRequestsToolbar: React.FC<AiRequestsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  providerFilter,
  onProviderChange,
  timeRange,
  onTimeRangeChange,
  formatFilter,
  onFormatChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {/* Left: Search input */}
      <div
        style={{
          position: "relative",
          flex: "1 1 260px",
          maxWidth: "340px",
        }}
      >
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by request ID or user..."
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease",
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted)",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right: Dropdowns & Clear Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Provider Dropdown */}
        <select
          value={providerFilter}
          onChange={(e) => onProviderChange(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Providers">All Providers</option>
          <option value="openai">OpenAI (DALL-E 3)</option>
          <option value="google">Google Imagen</option>
          <option value="stability">Stability AI</option>
        </select>

        {/* Time Range Dropdown */}
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
          <option value="All Time">All Time</option>
        </select>

        {/* Formats Dropdown */}
        <select
          value={formatFilter}
          onChange={(e) => onFormatChange(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Formats">All Formats</option>
          <option value="PNG">PNG</option>
          <option value="JPG">JPG</option>
          <option value="WEBP">WEBP</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "transparent",
              color: "var(--primary)",
              border: "1px solid var(--primary-light)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Filter size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

