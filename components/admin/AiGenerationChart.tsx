"use client";

import React, { useState } from "react";
import { AiCategoryStat } from "@/app/api/admin/dashboard/route";

interface AiGenerationChartProps {
  totalFormatted?: string;
  categories?: AiCategoryStat[];
}

const DEFAULT_CATEGORIES: AiCategoryStat[] = [
  { name: "Completed", count: 6214, percentage: 73.7, color: "#7956C9" },
  { name: "Processing", count: 1246, percentage: 14.8, color: "#9B72CF" },
  { name: "Failed", count: 672, percentage: 8.0, color: "#E15252" },
  { name: "Cancelled", count: 300, percentage: 3.6, color: "#8EA2D3" },
];

export const AiGenerationChart: React.FC<AiGenerationChartProps> = ({
  totalFormatted = "8,432",
  categories = DEFAULT_CATEGORIES,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // SVG Donut calculation
  const size = 170;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each category purely
  const slices = categories.map((cat, idx) => {
    const previousPercent = categories.slice(0, idx).reduce((acc, c) => acc + c.percentage, 0);
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((previousPercent / 100) * circumference);
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "22px 24px 20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Card Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 4px 0",
          }}
        >
          AI Generation Overview
        </h2>
        <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
          Illustrative demo data
        </span>
      </div>

      {/* Main Body: Donut on Left, Breakdown list on Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Donut Chart SVG */}
        <div
          style={{
            position: "relative",
            width: `${size}px`,
            height: `${size}px`,
            margin: "0 auto",
            flexShrink: 0,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: "rotate(-90deg)", overflow: "visible" }}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F4F0FB"
              strokeWidth={strokeWidth}
            />

            {/* Segment rings */}
            {slices.map((slice) => {
              const isHovered = hoveredCategory === slice.name;
              return (
                <circle
                  key={slice.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredCategory(slice.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center text in donut hole */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {totalFormatted}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-light)",
                marginTop: "2px",
              }}
            >
              Total Generations
            </span>
          </div>
        </div>

        {/* Legend / Breakdown Table */}
        <div
          style={{
            flex: 1,
            minWidth: "170px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {categories.map((item) => {
            const isHovered = hoveredCategory === item.name;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: isHovered ? "var(--primary-light)" : "transparent",
                  transition: "background-color 0.15s ease",
                  cursor: "default",
                }}
              >
                {/* Dot and Label */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isHovered ? 600 : 500,
                      color: "var(--text)",
                    }}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Count and Percentage */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text)",
                      minWidth: "40px",
                      textAlign: "right",
                    }}
                  >
                    {item.count.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-light)",
                      minWidth: "38px",
                      textAlign: "right",
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
