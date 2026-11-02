"use client";

import React from "react";
import { CategoryDistributionItem } from "@/lib/template-analytics";

interface CategoryDistributionChartProps {
  distribution: CategoryDistributionItem[];
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  distribution,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "14.5px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Category Usage Distribution
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {distribution.map((cat, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12.5px",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{cat.category}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--text-muted, #777184)" }}>{cat.uses} uses</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--primary, #7956C9)",
                    width: "32px",
                    textAlign: "right",
                  }}
                >
                  {cat.percentage}%
                </span>
              </div>
            </div>

            {/* Horizontal Bar Track */}
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#F3F4F6",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${cat.percentage}%`,
                  height: "100%",
                  backgroundColor: "var(--primary, #7956C9)",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
