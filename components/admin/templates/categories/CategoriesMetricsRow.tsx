"use client";

import React from "react";
import { LayoutGrid, CheckCircle2, FileText } from "lucide-react";
import { CategoryMetrics } from "@/lib/template-categories";

interface CategoriesMetricsRowProps {
  metrics: CategoryMetrics;
  onFilterActive?: () => void;
  onFilterAll?: () => void;
}

export const CategoriesMetricsRow: React.FC<CategoriesMetricsRowProps> = ({
  metrics,
  onFilterActive,
  onFilterAll,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}
      className="categories-metrics-grid"
    >
      {/* 1. Total Categories */}
      <div
        onClick={onFilterAll}
        role="button"
        tabIndex={0}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(121, 86, 201, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(36, 33, 58, 0.04)";
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LayoutGrid size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
              marginBottom: "2px",
            }}
          >
            Total Categories
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              lineHeight: 1.1,
            }}
          >
            {metrics.total}
          </div>
        </div>
      </div>

      {/* 2. Active Categories */}
      <div
        onClick={onFilterActive}
        role="button"
        tabIndex={0}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(121, 86, 201, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(36, 33, 58, 0.04)";
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
              marginBottom: "2px",
            }}
          >
            Active Categories
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              lineHeight: 1.1,
            }}
          >
            {metrics.active}
          </div>
        </div>
      </div>

      {/* 3. Unassigned Templates */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={22} strokeWidth={2.2} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--text-muted, #777184)",
              marginBottom: "2px",
            }}
          >
            Unassigned Templates
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              lineHeight: 1.1,
            }}
          >
            {metrics.unassigned}
          </div>
        </div>
      </div>
    </div>
  );
};
