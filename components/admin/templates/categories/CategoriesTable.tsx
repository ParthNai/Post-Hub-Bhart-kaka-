"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  LayoutGrid,
  Edit2,
  Archive,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { TemplateCategoryRecord } from "@/lib/template-categories";
import { CategoryIcon } from "./CategoryIcon";

interface CategoriesTableProps {
  categories: TemplateCategoryRecord[];
  allTotal: number;
  onViewTemplates: (category: TemplateCategoryRecord) => void;
  onEditCategory: (category: TemplateCategoryRecord) => void;
  onToggleArchive: (category: TemplateCategoryRecord) => void;
  onDeleteCategory: (category: TemplateCategoryRecord) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  allTotal,
  onViewTemplates,
  onEditCategory,
  onToggleArchive,
  onDeleteCategory,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = categories.slice(startIndex, startIndex + pageSize);

  const startRecord = categories.length === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(startIndex + pageSize, categories.length);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        overflow: "visible",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        marginBottom: "24px",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13.5px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FAF7F2",
                color: "var(--text-muted, #777184)",
                fontWeight: 600,
                fontSize: "12.5px",
              }}
            >
              <th style={{ padding: "14px 20px", width: "220px" }}>Category</th>
              <th style={{ padding: "14px 16px", width: "130px" }}>Category ID</th>
              <th style={{ padding: "14px 16px" }}>Description</th>
              <th style={{ padding: "14px 16px", width: "110px", textAlign: "center" }}>
                Templates
              </th>
              <th style={{ padding: "14px 16px", width: "110px" }}>Status</th>
              <th style={{ padding: "14px 16px", width: "170px" }}>Last Updated</th>
              <th style={{ padding: "14px 20px", width: "80px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat) => {
              const isActive = cat.status === "Active";
              const isMenuOpen = activeMenuId === cat.id;

              return (
                <tr
                  key={cat.id}
                  style={{
                    borderBottom: "1px solid var(--border, #EAE4EE)",
                    transition: "background-color 0.15s ease",
                  }}
                  className="hover:bg-slate-50/60"
                >
                  {/* Category Name & Icon */}
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          backgroundColor: "var(--secondary, #E8DFF5)",
                          color: "var(--primary, #7956C9)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CategoryIcon icon={cat.icon} size={18} />
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--text, #24213A)",
                          fontSize: "13.5px",
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </td>

                  {/* Category ID */}
                  <td
                    style={{
                      padding: "16px 16px",
                      color: "var(--text-muted, #777184)",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  >
                    {cat.id}
                  </td>

                  {/* Description */}
                  <td
                    style={{
                      padding: "16px 16px",
                      color: "var(--text-muted, #777184)",
                      fontSize: "13px",
                      maxWidth: "360px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={cat.description}
                  >
                    {cat.description || "—"}
                  </td>

                  {/* Templates Count */}
                  <td style={{ padding: "16px 16px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        backgroundColor: "#F3F4F6",
                        color: "var(--text, #24213A)",
                        fontWeight: 600,
                        fontSize: "12.5px",
                      }}
                    >
                      {cat.templateCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "16px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: isActive ? "#ECFDF5" : "#F3F4F6",
                        color: isActive ? "#059669" : "#6B7280",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: isActive ? "#10B981" : "#9CA3AF",
                        }}
                      />
                      {cat.status}
                    </span>
                  </td>

                  {/* Last Updated */}
                  <td
                    style={{
                      padding: "16px 16px",
                      color: "var(--text-muted, #777184)",
                      fontSize: "12.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.updatedAt}
                  </td>

                  {/* Actions (··· Popover) */}
                  <td
                    style={{
                      padding: "16px 20px",
                      textAlign: "right",
                      position: "relative",
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Actions for ${cat.name}`}
                      onClick={() => setActiveMenuId(isMenuOpen ? null : cat.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted, #777184)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className="hover:bg-slate-100"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {/* Popover Menu */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "45px",
                          width: "175px",
                          backgroundColor: "#ffffff",
                          border: "1px solid var(--border, #EAE4EE)",
                          borderRadius: "10px",
                          boxShadow: "0 10px 25px -5px rgba(36, 33, 58, 0.12)",
                          zIndex: 60,
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        {/* 1. View Templates */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewTemplates(cat);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            fontSize: "13px",
                            color: "var(--text, #24213A)",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          className="hover:bg-slate-50"
                        >
                          <LayoutGrid size={15} style={{ color: "var(--text-muted, #777184)" }} />
                          <span>View Templates</span>
                        </button>

                        {/* 2. Edit Category */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onEditCategory(cat);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            fontSize: "13px",
                            color: "var(--text, #24213A)",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          className="hover:bg-slate-50"
                        >
                          <Edit2 size={15} style={{ color: "var(--text-muted, #777184)" }} />
                          <span>Edit Category</span>
                        </button>

                        {/* 3. Archive / Restore Category */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onToggleArchive(cat);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            fontSize: "13px",
                            color: "var(--text, #24213A)",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          className="hover:bg-slate-50"
                        >
                          {cat.status === "Active" ? (
                            <>
                              <Archive size={15} style={{ color: "var(--text-muted, #777184)" }} />
                              <span>Archive Category</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw size={15} style={{ color: "var(--text-muted, #777184)" }} />
                              <span>Restore Category</span>
                            </>
                          )}
                        </button>

                        <div
                          style={{
                            height: "1px",
                            backgroundColor: "var(--border, #EAE4EE)",
                            margin: "4px 0",
                          }}
                        />

                        {/* 4. Delete Category */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDeleteCategory(cat);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            fontSize: "13px",
                            color: "#EF4444",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          className="hover:bg-red-50"
                        >
                          <Trash2 size={15} style={{ color: "#EF4444" }} />
                          <span>Delete Category</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching reference */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderTop: "1px solid var(--border, #EAE4EE)",
          fontSize: "13px",
          color: "var(--text-muted, #777184)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          Showing {startRecord} – {endRecord} of {categories.length} categories
          {allTotal > categories.length && ` (filtered from ${allTotal} total)`}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Rows per page */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} ref={pageSizeRef}>
            <span>Rows per page:</span>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  color: "var(--text, #24213A)",
                  cursor: "pointer",
                }}
              >
                <span>{pageSize}</span>
                <ChevronDown size={13} />
              </button>

              {isPageSizeOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 4px)",
                    right: 0,
                    width: "70px",
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--border, #EAE4EE)",
                    borderRadius: "6px",
                    boxShadow: "0 6px 16px rgba(36, 33, 58, 0.08)",
                    zIndex: 50,
                    padding: "2px",
                  }}
                >
                  {[10, 20, 50].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        onPageSizeChange(sz);
                        setIsPageSizeOpen(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "5px 8px",
                        fontSize: "12px",
                        textAlign: "center",
                        border: "none",
                        background: pageSize === sz ? "var(--secondary, #E8DFF5)" : "transparent",
                        color: pageSize === sz ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Page Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous page"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                color: currentPage <= 1 ? "var(--border, #EAE4EE)" : "var(--text, #24213A)",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isCurr = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: isCurr ? "none" : "1px solid var(--border, #EAE4EE)",
                    backgroundColor: isCurr ? "var(--primary, #7956C9)" : "#ffffff",
                    color: isCurr ? "#ffffff" : "var(--text, #24213A)",
                    fontSize: "12.5px",
                    fontWeight: isCurr ? 600 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next page"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                color: currentPage >= totalPages ? "var(--border, #EAE4EE)" : "var(--text, #24213A)",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

