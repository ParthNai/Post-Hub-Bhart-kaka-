"use client";

import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { TimeSeriesPoint } from "@/lib/template-analytics";

interface UsageOverTimeChartProps {
  data: TimeSeriesPoint[];
}

export const UsageOverTimeChart: React.FC<UsageOverTimeChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(7); // Default to Oct 18 (index 7) as in reference!

  // Canvas bounds
  const width = 500;
  const height = 200;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxY = 80;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.uses / maxY) * chartHeight;
    return { x, y, ...d };
  });

  // Construct SVG cubic bezier curve
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cpX1 = current.x + (next.x - current.x) / 2;
    const cpY1 = current.y;
    const cpX2 = current.x + (next.x - current.x) / 2;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  // Gradient area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

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
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "14.5px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Template Usage Over Time
        </h3>
        <button
          type="button"
          aria-label="Options"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted, #777184)",
            cursor: "pointer",
            padding: "2px",
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* SVG Chart */}
      <div style={{ position: "relative", width: "100%", height: "220px" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7956C9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7956C9" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-Axis labels */}
          {[0, 20, 40, 60, 80].map((val) => {
            const y = paddingTop + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#EAE4EE"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#777184"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Main Curve Line */}
          <path d={pathD} fill="none" stroke="#7956C9" strokeWidth="2.5" />

          {/* Vertical dashed guide line on hovered point */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={paddingTop + chartHeight}
              stroke="#7956C9"
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
          )}

          {/* Interactive Data Point Dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#7956C9"
                  strokeWidth={isHovered ? 2.5 : 2}
                  style={{ transition: "r 0.15s ease" }}
                />
                {/* Transparent larger hit target */}
                <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />
              </g>
            );
          })}

          {/* X-Axis Date Labels */}
          {points.filter((_, i) => i % 2 === 0 || i === points.length - 1).map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={paddingTop + chartHeight + 18}
              textAnchor="middle"
              fontSize="10.5"
              fill="#777184"
              fontFamily="sans-serif"
            >
              {pt.dayLabel}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Box matching reference! */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 32}%`,
              transform: "translate(-50%, -100%)",
              backgroundColor: "#24213A",
              color: "#ffffff",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {hoveredPoint.dayLabel}: {hoveredPoint.uses} uses
          </div>
        )}
      </div>
    </div>
  );
};

