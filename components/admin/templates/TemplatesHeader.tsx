"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus, LayoutGrid } from "lucide-react";

interface TemplatesHeaderProps {
  onCreateTemplate: () => void;
  onOpenCategories: () => void;
}

export const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({
  onCreateTemplate,
  onOpenCategories,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "24px",
      }}
    >
      <div>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--text-muted, #777184)",
            marginBottom: "8px",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{
              color: "inherit",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Home size={14} style={{ marginRight: "4px" }} />
            <span>Admin</span>
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Templates</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 6px 0",
            letterSpacing: "-0.01em",
          }}
        >
          Templates
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: 0,
          }}
        >
          Manage poster templates, categories, assets and publishing status.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onCreateTemplate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(121, 86, 201, 0.25)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-hover, #6846B5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary, #7956C9)";
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create Template</span>
        </button>

        <button
          type="button"
          onClick={onOpenCategories}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#ffffff",
            color: "var(--text, #24213A)",
            border: "1px solid var(--border, #EAE4EE)",
            padding: "9px 16px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: 500,
            cursor: "pointer",
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
          <LayoutGrid size={15} style={{ color: "var(--text-muted, #777184)" }} />
          <span>Categories</span>
        </button>
      </div>
    </div>
  );
};
