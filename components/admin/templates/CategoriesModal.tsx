"use client";

import React from "react";
import { X, LayoutGrid, ArrowRight } from "lucide-react";
import { TEMPLATE_CATEGORIES, PosterTemplate } from "@/lib/templates";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PosterTemplate[];
  onSelectCategoryFilter: (categoryName: string) => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectCategoryFilter,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "580px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--secondary, #F5F2F9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary, #7956C9)",
              }}
            >
              <LayoutGrid size={18} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--text, #24213A)",
                  margin: "0 0 2px 0",
                }}
              >
                Template Categories
              </h2>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-muted, #777184)",
                  margin: 0,
                }}
              >
                Browse template catalog distribution by category classification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text-muted, #777184)",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories List */}
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {TEMPLATE_CATEGORIES.map((cat) => {
            const count = templates.filter(
              (t) => t.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.name}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        backgroundColor: cat.badgeBg,
                        color: cat.badgeColor,
                        fontSize: "11.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--text-muted, #777184)",
                      }}
                    >
                      {count} {count === 1 ? "template" : "templates"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-muted, #777184)",
                      margin: 0,
                    }}
                  >
                    {cat.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCategoryFilter(cat.name);
                    onClose();
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border, #EAE4EE)",
                    backgroundColor: "#ffffff",
                    color: "var(--text, #24213A)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
                    e.currentTarget.style.borderColor = "var(--primary-light, #D2C4ED)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
                  }}
                >
                  <span>Filter by</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "var(--bg, #FAF7F2)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
