"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, RotateCcw, Bookmark, UploadCloud, Loader2 } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface TemplateEditorHeaderProps {
  template: PosterTemplate;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const TemplateEditorHeader: React.FC<TemplateEditorHeaderProps> = ({
  template,
  isDirty,
  isSaving,
  isPublishing,
  onDiscard,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12.5px",
          color: "var(--text-muted, #777184)",
          marginBottom: "12px",
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
        <Link
          href="/admin/templates"
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <span>Templates</span>
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>Template Details</span>
      </div>

      {/* Main Header Row */}
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
          {/* Title and Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Template Editor
            </h1>

            {/* Template ID Badge */}
            <span
              style={{
                backgroundColor: "#EDE9FE",
                color: "var(--primary, #7956C9)",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              {template.id}
            </span>

            {/* Lifecycle Status Badge */}
            <span
              style={{
                backgroundColor: template.status === "Published" ? "#E6F7ED" : "#FFF3E0",
                color: template.status === "Published" ? "#1E8E3E" : "#D97706",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "999px",
              }}
            >
              {template.status}
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted, #777184)",
              margin: "6px 0 0 0",
            }}
          >
            Review and edit template properties and poster assets.
          </p>

          {/* Back to Templates Link */}
          <div style={{ marginTop: "10px" }}>
            <Link
              href="/admin/templates"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--primary, #7956C9)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Templates</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Discard Changes */}
          <button
            type="button"
            onClick={onDiscard}
            disabled={!isDirty || isSaving || isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: !isDirty ? "#A09BAA" : "var(--text, #24213A)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: !isDirty ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              opacity: !isDirty ? 0.65 : 1,
            }}
            onMouseEnter={(e) => {
              if (isDirty) {
                e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            <RotateCcw size={14} />
            <span>Discard Changes</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={!isDirty || isSaving || isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: !isDirty ? "#A09BAA" : "var(--text, #24213A)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              opacity: !isDirty ? 0.65 : 1,
            }}
            onMouseEnter={(e) => {
              if (isDirty) {
                e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
                e.currentTarget.style.borderColor = "var(--primary-light, #D2C4ED)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
            }}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
            <span>Save Draft</span>
          </button>

          {/* Publish Changes */}
          <button
            type="button"
            onClick={onPublish}
            disabled={isSaving || isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isPublishing ? "not-allowed" : "pointer",
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
            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={15} />}
            <span>Publish Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
