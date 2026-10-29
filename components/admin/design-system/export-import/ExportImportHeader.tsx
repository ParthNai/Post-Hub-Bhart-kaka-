"use client";

import React from "react";
import Link from "next/link";
import { Home, Info } from "lucide-react";

export const ExportImportHeader: React.FC = () => {
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
            <Home size={13} style={{ marginRight: "4px" }} />
          </Link>
          <span>/</span>
          <Link
            href="/admin/design-system"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Design System
          </Link>
          <span>/</span>
          <span style={{ color: "var(--primary, #7956C9)", fontWeight: 600 }}>
            Export & Import
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 4px 0",
            letterSpacing: "-0.01em",
          }}
        >
          Export & Import
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: 0,
          }}
        >
          Transfer design tokens safely between environments with validation and version awareness.
        </p>
      </div>

      {/* Top Right Format Pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          borderRadius: "20px",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--border, #EAE4EE)",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <Info size={14} style={{ color: "var(--primary, #7956C9)" }} />
        <span>Supported formats: <strong style={{ color: "var(--text, #24213A)" }}>JSON</strong></span>
      </div>
    </div>
  );
};
