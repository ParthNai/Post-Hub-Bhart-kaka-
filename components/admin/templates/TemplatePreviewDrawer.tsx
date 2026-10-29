"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";
import { PosterArtwork } from "./PosterArtwork";

interface TemplatePreviewDrawerProps {
  template: PosterTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullPreview: (template: PosterTemplate) => void;
}

export const TemplatePreviewDrawer: React.FC<TemplatePreviewDrawerProps> = ({
  template,
  isOpen,
  onClose,
  onOpenFullPreview,
}) => {
  if (!isOpen || !template) return null;

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return { bg: "#E6F7ED", color: "#1E8E3E" };
      case "Draft":
        return { bg: "#FFF3E0", color: "#D97706" };
      case "Archived":
        return { bg: "#F1F0F5", color: "#777184" };
      default:
        return { bg: "#F5F2F9", color: "#524C60" };
    }
  };

  const statusBadge = getStatusBadge(template.status);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "0 2px 12px rgba(36, 33, 58, 0.04)",
        height: "fit-content",
        position: "sticky",
        top: "20px",
      }}
      className="template-preview-drawer"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Template Preview
        </h3>
        <button
          type="button"
          onClick={onClose}
          title="Close preview"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "var(--text-muted, #777184)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
            e.currentTarget.style.color = "var(--text, #24213A)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted, #777184)";
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Large Poster Thumbnail */}
      <div
        style={{
          width: "100%",
          height: "220px",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <PosterArtwork template={template} />
      </div>

      {/* Template Metadata */}
      <div>
        <h4
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 2px 0",
          }}
        >
          {template.name}
        </h4>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted, #777184)",
            marginBottom: "8px",
          }}
        >
          {template.id}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              backgroundColor: "#EDE9FE",
              color: "#6D28D9",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            {template.category}
          </span>
          <span
            style={{
              backgroundColor: statusBadge.bg,
              color: statusBadge.color,
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            {template.status}
          </span>
        </div>
      </div>

      {/* Details List */}
      <div
        style={{
          paddingTop: "10px",
          borderTop: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <div
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            marginBottom: "10px",
          }}
        >
          Details
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Format</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.format}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>Last updated</span>
            <span style={{ fontWeight: 500, color: "var(--text, #24213A)" }}>{template.updatedAt}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
            }}
          >
            <span style={{ color: "var(--text-muted, #777184)" }}>File size</span>
            <span style={{ fontWeight: 500, color: "var(--text, #24213A)" }}>{template.fileSize}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onOpenFullPreview(template)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "var(--primary, #7956C9)",
          color: "#ffffff",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "13.5px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          marginTop: "4px",
          boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-hover, #6846B5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary, #7956C9)";
        }}
      >
        <Eye size={16} />
        <span>Preview</span>
      </button>
    </div>
  );
};
