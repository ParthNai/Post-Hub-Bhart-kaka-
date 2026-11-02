"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

interface PublishingHeaderProps {
  templateId: string;
  adminName?: string;
  adminRole?: string;
}

export const PublishingHeader: React.FC<PublishingHeaderProps> = ({
  templateId,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
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
        {/* Breadcrumbs */}
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
          <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Publishing Workflow</span>
        </div>

        {/* User profile & notification */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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

      {/* Screen Title & Top Navigation */}
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
            Template Preview & Publishing
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              margin: "4px 0 0 0",
            }}
          >
            Review pre-flight validation checklist and publishing readiness.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href={`/admin/templates/${templateId}/edit`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              border: "1px solid var(--border, #EAE4EE)",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            className="hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            <span>Back to Template Editor</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
