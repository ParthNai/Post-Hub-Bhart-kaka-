"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Send,
} from "lucide-react";
import { TemplatePerformanceRow } from "@/lib/template-analytics";
import { PosterArtwork } from "../PosterArtwork";

interface TopTemplatesTableProps {
  templates: TemplatePerformanceRow[];
  totalTemplates: number;
}

export const TopTemplatesTable: React.FC<TopTemplatesTableProps> = ({
  templates,
  totalTemplates,
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [sort, setSort] = useState("Most Uses");

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    "All Categories",
    "Business",
    "Festivals & Events",
    "Education",
    "Product Promotion",
    "Seasonal Greetings",
  ];

  const statuses = ["All Statuses", "Published", "Draft", "Archived"];
  const sortOptions = ["Most Uses", "Highest Designs", "Recently Used", "Name A–Z"];

  // Filter & sort
  let filtered = [...templates];
  if (query.trim() !== "") {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }
  if (category !== "All Categories") {
    filtered = filtered.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }
  if (status !== "All Statuses") {
    filtered = filtered.filter((t) => t.status === status);
  }
  filtered.sort((a, b) => {
    switch (sort) {
      case "Most Uses":
        return b.usageCount - a.usageCount;
      case "Highest Designs":
        return b.designsCreated - a.designsCreated;
      case "Name A–Z":
        return a.name.localeCompare(b.name);
      case "Recently Used":
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      default:
        return b.usageCount - a.usageCount;
    }
  });

  const hasFilters = query !== "" || category !== "All Categories" || status !== "All Statuses" || sort !== "Most Uses";

  const clearFilters = () => {
    setQuery("");
    setCategory("All Categories");
    setStatus("All Statuses");
    setSort("Most Uses");
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        marginTop: "20px",
        marginBottom: "24px",
      }}
    >
      {/* Header & Filters Toolbar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border, #EAE4EE)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Top Performing Templates
          </h3>
        </div>

        {/* Filters Controls Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: "380px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
              }}
            />
            <input
              type="text"
              placeholder="Search template by name or ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 32px 8px 34px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                backgroundColor: "#FAF7F2",
                color: "var(--text, #24213A)",
                outline: "none",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted, #777184)",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdowns */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "12.5px",
                backgroundColor: "#ffffff",
                color: "var(--text, #24213A)",
                cursor: "pointer",
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "12.5px",
                backgroundColor: "#ffffff",
                color: "var(--text, #24213A)",
                cursor: "pointer",
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "12.5px",
                backgroundColor: "#ffffff",
                color: "var(--text, #24213A)",
                cursor: "pointer",
              }}
            >
              {sortOptions.map((so) => (
                <option key={so} value={so}>{so}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary, #7956C9)",
                  fontSize: "12.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FAF7F2",
                color: "var(--text-muted, #777184)",
                fontWeight: 600,
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px 20px", width: "300px" }}>Template</th>
              <th style={{ padding: "12px 16px" }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Usage Count</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Designs Created</th>
              <th style={{ padding: "12px 16px" }}>Last Used</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const isMenuOpen = activeMenuId === t.id;

              return (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: "1px solid var(--border, #EAE4EE)",
                    transition: "background-color 0.15s ease",
                  }}
                  className="hover:bg-slate-50/60"
                >
                  {/* Template Info (Thumbnail + Name + ID) */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Mini Artwork Thumbnail */}
                      <div
                        style={{
                          width: "36px",
                          height: "46px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                      >
                        <PosterArtwork
                          template={{
                            id: t.id,
                            name: t.name,
                            category: t.category as "Business" | "Festival" | "Education" | "Promotion" | "Custom",
                            format: t.format as "3:4" | "4:5" | "9:16" | "1:1",
                            status: t.status,
                            updatedAt: t.lastUsed,
                            fileSize: "245 KB",
                            description: t.name,
                            theme: t.theme,
                            aspectRatio: t.format,
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: "11.5px", fontFamily: "monospace", color: "var(--text-muted, #777184)" }}>
                          {t.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#6D28D9",
                        backgroundColor: "#EDE9FE",
                        padding: "3px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      {t.category}
                    </span>
                  </td>

                  {/* Usage Count */}
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "var(--text, #24213A)" }}>
                    {t.usageCount.toLocaleString()}
                  </td>

                  {/* Designs Created */}
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "var(--text, #24213A)" }}>
                    {t.designsCreated.toLocaleString()}
                  </td>

                  {/* Last Used */}
                  <td style={{ padding: "14px 16px", fontSize: "12.5px", color: "var(--text-muted, #777184)" }}>
                    {t.lastUsed}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        backgroundColor: "#ECFDF5",
                        color: "#059669",
                      }}
                    >
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                      {t.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 20px", textAlign: "right", position: "relative" }}>
                    <button
                      type="button"
                      aria-label="Actions"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : t.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted, #777184)",
                        cursor: "pointer",
                        padding: "6px",
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "40px",
                          width: "170px",
                          backgroundColor: "#ffffff",
                          border: "1px solid var(--border, #EAE4EE)",
                          borderRadius: "10px",
                          boxShadow: "0 10px 25px -5px rgba(36, 33, 58, 0.12)",
                          zIndex: 60,
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        <Link
                          href={`/admin/templates/${t.id}/edit`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "7px 10px",
                            fontSize: "12.5px",
                            color: "var(--text, #24213A)",
                            textDecoration: "none",
                            borderRadius: "6px",
                          }}
                          className="hover:bg-slate-50"
                        >
                          <Edit2 size={14} style={{ color: "var(--text-muted, #777184)" }} />
                          <span>Edit Template</span>
                        </Link>

                        <Link
                          href={`/admin/templates/${t.id}/publish`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "7px 10px",
                            fontSize: "12.5px",
                            color: "var(--text, #24213A)",
                            textDecoration: "none",
                            borderRadius: "6px",
                          }}
                          className="hover:bg-slate-50"
                        >
                          <Send size={14} style={{ color: "var(--primary, #7956C9)" }} />
                          <span>Publish Workflow</span>
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border, #EAE4EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          Showing 1 – {filtered.length} of {totalTemplates} templates
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Rows per page:</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>10 ⌵</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              disabled
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "not-allowed",
                color: "#CBD5E1",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "6px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              1
            </span>
            <button
              type="button"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text, #24213A)",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
