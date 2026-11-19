"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { CategoryFilterOptions } from "@/lib/template-categories";

interface CategoriesToolbarProps {
  filters: CategoryFilterOptions;
  onFilterChange: <K extends keyof CategoryFilterOptions>(
    key: K,
    value: CategoryFilterOptions[K]
  ) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const CategoriesToolbar: React.FC<CategoriesToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statuses = ["All Statuses", "Active", "Archived"] as const;
  const sortOptions = [
    "Name A–Z",
    "Name Z–A",
    "Most Templates",
    "Recently Updated",
  ] as const;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: "relative",
          flex: "1 1 320px",
          maxWidth: "460px",
        }}
      >
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted, #777184)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search categories by name or ID..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
          style={{
            width: "100%",
            padding: "9px 36px 9px 38px",
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            fontSize: "13.5px",
            backgroundColor: "#FAF7F2",
            color: "var(--text, #24213A)",
            outline: "none",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--primary, #7956C9)";
            e.currentTarget.style.backgroundColor = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
            e.currentTarget.style.backgroundColor = "#FAF7F2";
          }}
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange("search", "")}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted, #777184)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right Controls: Status, Sort, Clear */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Status Dropdown */}
        <div style={{ position: "relative" }} ref={statusRef}>
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              cursor: "pointer",
              minWidth: "130px",
              justifyContent: "space-between",
            }}
          >
            <span>{filters.status || "All Statuses"}</span>
            <ChevronDown size={14} style={{ color: "var(--text-muted, #777184)" }} />
          </button>

          {isStatusOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                width: "150px",
                backgroundColor: "#ffffff",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                boxShadow: "0 8px 16px rgba(36, 33, 58, 0.08)",
                zIndex: 50,
                padding: "4px",
              }}
            >
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onFilterChange("status", s);
                    setIsStatusOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: filters.status === s ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                    backgroundColor: filters.status === s ? "var(--secondary, #E8DFF5)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: filters.status === s ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (filters.status !== s) e.currentTarget.style.backgroundColor = "#FAF7F2";
                  }}
                  onMouseLeave={(e) => {
                    if (filters.status !== s) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ position: "relative" }} ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              cursor: "pointer",
              minWidth: "140px",
              justifyContent: "space-between",
            }}
          >
            <span>{filters.sort || "Name A–Z"}</span>
            <ChevronDown size={14} style={{ color: "var(--text-muted, #777184)" }} />
          </button>

          {isSortOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                width: "165px",
                backgroundColor: "#ffffff",
                border: "1px solid var(--border, #EAE4EE)",
                borderRadius: "8px",
                boxShadow: "0 8px 16px rgba(36, 33, 58, 0.08)",
                zIndex: 50,
                padding: "4px",
              }}
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onFilterChange("sort", opt);
                    setIsSortOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: filters.sort === opt ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                    backgroundColor: filters.sort === opt ? "var(--secondary, #E8DFF5)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: filters.sort === opt ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (filters.sort !== opt) e.currentTarget.style.backgroundColor = "#FAF7F2";
                  }}
                  onMouseLeave={(e) => {
                    if (filters.sort !== opt) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary, #7956C9)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              padding: "6px 8px",
              textDecoration: "underline",
            }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

