"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Settings, ArrowUpDown, Plus } from "lucide-react";

interface FestivalCategoriesHeaderProps {
  onOpenSettings: () => void;
  onOpenReorder: () => void;
  onOpenAddCategory: () => void;
}

export const FestivalCategoriesHeader: React.FC<FestivalCategoriesHeaderProps> = ({
  onOpenSettings,
  onOpenReorder,
  onOpenAddCategory,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      {/* Breadcrumb */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          color: "#777184",
        }}
        aria-label="Breadcrumb"
      >
        <Link
          href="/admin/dashboard"
          style={{
            color: "#777184",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <Link
          href="/admin/festivals"
          style={{
            color: "#777184",
            textDecoration: "none",
          }}
        >
          <span>Festivals & Events</span>
        </Link>
        <span>/</span>
        <span style={{ color: "#24213A", fontWeight: 600 }}>Categories</span>
      </nav>

      {/* Main Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Title and subtitle */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
            }}
          >
            <Calendar size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                margin: "0 0 4px 0",
                lineHeight: 1.2,
              }}
            >
              Festival & Event Categories
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: 0,
              }}
            >
              Organize, customize and manage festival categories, event classifications, icons and regional content groups.
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
          <button
            type="button"
            onClick={onOpenSettings}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Settings size={15} color="#7956C9" />
            <span>Category Settings</span>
          </button>

          <button
            type="button"
            onClick={onOpenReorder}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowUpDown size={15} color="#7956C9" />
            <span>Reorder Categories</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddCategory}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>
    </div>
  );
};
