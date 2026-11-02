"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Bell } from "lucide-react";

interface CategoriesHeaderProps {
  onCreateCategory: () => void;
  adminName?: string;
  adminRole?: string;
}

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  onCreateCategory,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Top Bar with Parth Patel Administrator Profile & Notifications */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "var(--text-muted, #777184)",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "inherit", textDecoration: "none" }}
            className="hover:underline"
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/templates"
            style={{ color: "inherit", textDecoration: "none" }}
            className="hover:underline"
          >
            Templates
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Categories</span>
        </div>

        {/* User profile & notification */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Notification bell with red badge */}
          <button
            type="button"
            aria-label="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text, #24213A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "8px",
                height: "8px",
                backgroundColor: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #FAF7F2",
              }}
            />
          </button>

          {/* User profile pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary, #E8DFF5)",
                color: "var(--primary, #7956C9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {adminName.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                  lineHeight: 1.2,
                }}
              >
                {adminName}
              </span>
              <span
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-muted, #777184)",
                  lineHeight: 1.2,
                }}
              >
                {adminRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Screen Title Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Template Categories
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              margin: "4px 0 0 0",
            }}
          >
            Organize poster templates with consistent categories and clear ownership.
          </p>
        </div>

        {/* Header Right Actions: Back to Templates + Create Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/admin/templates"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "transparent",
              color: "var(--text, #24213A)",
              padding: "9px 14px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            className="hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span>Back to Templates</span>
          </Link>

          <button
            type="button"
            onClick={onCreateCategory}
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
            <span>Create Category</span>
          </button>
        </div>
      </div>
    </div>
  );
};

