"use client";

import React from "react";
import { FileQuestion, Plus } from "lucide-react";

interface EmptyStateCardProps {
  onCreateTemplate: () => void;
  title?: string;
  subtitle?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  onCreateTemplate,
  title = "No templates found",
  subtitle = "Try adjusting your search or filter criteria, or create a new template.",
}) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "36px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        marginTop: "24px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Icon in subtle purple container */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "#F5F0FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary, #7956C9)",
          marginBottom: "14px",
        }}
      >
        <FileQuestion size={24} strokeWidth={1.75} />
      </div>

      {/* Heading */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          margin: "0 0 6px 0",
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-muted, #777184)",
          margin: "0 0 16px 0",
          maxWidth: "460px",
        }}
      >
        {subtitle}
      </p>

      {/* Create Template CTA button */}
      <button
        type="button"
        onClick={onCreateTemplate}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--primary, #7956C9)",
          color: "#ffffff",
          padding: "8px 18px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(121, 86, 201, 0.2)",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary-hover, #6846B5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--primary, #7956C9)";
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        <span>Create Template</span>
      </button>
    </div>
  );
};
