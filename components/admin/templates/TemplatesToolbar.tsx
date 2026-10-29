"use client";

import React from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { TemplateFilterParams } from "@/lib/templates";

interface TemplatesToolbarProps {
  filters: TemplateFilterParams;
  onFilterChange: (key: keyof TemplateFilterParams, value: string) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const TemplatesToolbar: React.FC<TemplatesToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isFiltered,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "10px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          position: "relative",
          flex: "1 1 260px",
          minWidth: "220px",
        }}
      >
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted, #777184)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={filters.query || ""}
          onChange={(e) => onFilterChange("query", e.target.value)}
          placeholder="Search templates by name or ID..."
          style={{
            width: "100%",
            height: "36px",
            paddingLeft: "36px",
            paddingRight: "12px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            fontSize: "13px",
            color: "var(--text, #24213A)",
            backgroundColor: "#ffffff",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--primary, #7956C9)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border, #EAE4EE)")}
        />
      </div>

      {/* Filter Dropdowns */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* Category Dropdown */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.category || "All Categories"}
            onChange={(e) => onFilterChange("category", e.target.value)}
            style={{
              height: "36px",
              paddingLeft: "12px",
              paddingRight: "28px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="All Categories">All Categories</option>
            <option value="Business">Business</option>
            <option value="Festival">Festival</option>
            <option value="Education">Education</option>
            <option value="Promotion">Promotion</option>
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

        {/* Status Dropdown */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.status || "All Statuses"}
            onChange={(e) => onFilterChange("status", e.target.value)}
            style={{
              height: "36px",
              paddingLeft: "12px",
              paddingRight: "28px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
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

        {/* Format Dropdown */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.format || "All Formats"}
            onChange={(e) => onFilterChange("format", e.target.value)}
            style={{
              height: "36px",
              paddingLeft: "12px",
              paddingRight: "28px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="All Formats">All Formats</option>
            <option value="3:4">3:4</option>
            <option value="4:5">4:5</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
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

        {/* Sort Dropdown */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.sort || "Recently Updated"}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            style={{
              height: "36px",
              paddingLeft: "12px",
              paddingRight: "28px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="Recently Updated">Recently Updated</option>
            <option value="Name (A-Z)">Name (A-Z)</option>
            <option value="Name (Z-A)">Name (Z-A)</option>
            <option value="Oldest First">Oldest First</option>
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

        {/* Clear Filters */}
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: isFiltered ? "var(--secondary, #F5F2F9)" : "transparent",
            color: isFiltered ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary, #7956C9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isFiltered
              ? "var(--primary, #7956C9)"
              : "var(--text-muted, #777184)";
          }}
        >
          <RotateCcw size={13} />
          <span>Clear filters</span>
        </button>
      </div>
    </div>
  );
};
