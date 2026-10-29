"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChartDataPoint } from "@/app/api/admin/dashboard/route";

interface PlatformActivityChartProps {
  initialRange?: "7d" | "30d" | "90d";
  onRangeChange?: (range: "7d" | "30d" | "90d") => void;
  points?: ChartDataPoint[];
}

const DEFAULT_7D_POINTS: ChartDataPoint[] = [
  { date: "Oct 19", value: 18 },
  { date: "Oct 20", value: 25 },
  { date: "Oct 21", value: 23 },
  { date: "Oct 22", value: 38 },
  { date: "Oct 23", value: 48 },
  { date: "Oct 24", value: 45 },
  { date: "Oct 25", value: 78 },
];

export const PlatformActivityChart: React.FC<PlatformActivityChartProps> = ({
  initialRange = "7d",
  onRangeChange,
  points = DEFAULT_7D_POINTS,
}) => {
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "90d">(initialRange);
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    date: string;
    value: number;
  } | null>(null);

  const handleRangeChange = (range: "7d" | "30d" | "90d") => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  // Dimensions for SVG coordinate space
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const maxY = 100;

  // Convert data points to SVG coordinates
  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / Math.max(points.length - 1, 1)) * chartWidth;
    const y = paddingTop + chartHeight - (p.value / maxY) * chartHeight;
    return { x, y, date: p.date, value: p.value };
  });

  // Generate smooth cubic bezier SVG curve
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      // Tension factor
      const tension = 0.22;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return path;
  };

  const linePath = generateSmoothPath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${
          coords[0].x
        } ${paddingTop + chartHeight} Z`
      : "";

  const yTicks = [100, 75, 50, 25, 0];

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
      {/* Top Header of the Chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 4px 0",
            }}
          >
            Platform Activity
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
            Illustrative demo data
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          {/* Dropdown for date range */}
          <div style={{ position: "relative" }}>
            <select
              aria-label="Filter activity time range"
              value={selectedRange}
              onChange={(e) => handleRangeChange(e.target.value as "7d" | "30d" | "90d")}
              style={{
                appearance: "none",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "6px 28px 6px 12px",
                fontSize: "12.5px",
                fontWeight: 500,
                color: "var(--text)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted)",
              }}
            />
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text)",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
              }}
            />
            <span>Total Activity</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          minHeight: "210px",
        }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="purpleAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7956C9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7956C9" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {yTicks.map((val) => {
            const y = paddingTop + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#EAE4EE"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "none" : "2 2"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9B94A6"
                  fontFamily="inherit"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient Area */}
          <path d={areaPath} fill="url(#purpleAreaGradient)" />

          {/* Curve Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#7956C9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points with interactive hover */}
          {coords.map((pt, idx) => (
            <g key={idx}>
              {/* Outer invisible target for easy hovering */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="12"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setHoveredPoint({
                    index: idx,
                    x: pt.x,
                    y: pt.y,
                    date: pt.date,
                    value: pt.value,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Visible dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.index === idx ? "5.5" : "3.5"}
                fill="#7956C9"
                stroke="#FFFFFF"
                strokeWidth={hoveredPoint?.index === idx ? "2" : "1.5"}
                style={{ transition: "r 0.15s ease" }}
              />
            </g>
          ))}

          {/* X-axis labels */}
          {coords.map((pt, idx) => {
            // If many points (like 30 or 90), space out labels to avoid clutter
            const showLabel =
              coords.length <= 8 || idx % Math.ceil(coords.length / 8) === 0 || idx === coords.length - 1;
            if (!showLabel) return null;

            return (
              <text
                key={idx}
                x={pt.x}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#9B94A6"
                fontFamily="inherit"
              >
                {pt.date}
              </text>
            );
          })}

          {/* Tooltip on hover */}
          {hoveredPoint && (
            <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 12})`}>
              <rect
                x="-36"
                y="-30"
                width="72"
                height="26"
                rx="6"
                fill="#24213A"
                opacity="0.92"
              />
              <text
                x="0"
                y="-13"
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#FFFFFF"
                fontFamily="inherit"
              >
                {hoveredPoint.date}: {hoveredPoint.value}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
