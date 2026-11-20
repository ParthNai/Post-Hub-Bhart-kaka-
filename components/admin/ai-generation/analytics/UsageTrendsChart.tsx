"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import type { UsageTrendPoint } from "@/lib/ai-analytics";

interface UsageTrendsChartProps {
  data?: UsageTrendPoint[];
  trends?: UsageTrendPoint[];
}

export function UsageTrendsChart({ data, trends }: UsageTrendsChartProps) {
  const chartData = data || trends || [];
  const [hoveredPoint, setHoveredPoint] = useState<UsageTrendPoint | null>(null);

  // Chart coordinates
  const height = 220;
  const width = 560;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };

  const maxY = 8000;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => {
    return padding.left + (index / (Math.max(1, chartData.length - 1))) * chartWidth;
  };

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / maxY) * chartHeight;
  };

  // Build SVG path strings with smooth curves
  const makePath = (key: "requests" | "successful" | "failed") => {
    return chartData.reduce((acc, pt, i) => {
      const x = getX(i);
      const y = getY(pt[key]);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(chartData[i - 1][key]);
      const midX = (prevX + x) / 2;
      return `${acc} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
    }, "");
  };

  const requestsPath = makePath("requests");
  const successfulPath = makePath("successful");
  const failedPath = makePath("failed");

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "24px",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <TrendingUp className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24213A]">Usage Trends</h2>
            <p className="text-xs text-[#777184] font-medium">
              Image generation activity over time
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7956C9]" />
            <span>Requests</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Successful</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span>Failed</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Y Axis Grid Lines & Labels */}
          {[8000, 6000, 4000, 2000, 0].map((val) => {
            const y = getY(val);
            const label = val === 0 ? "0" : `${val / 1000}K`;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#EAE4EE"
                  strokeDasharray={val === 0 ? "none" : "3 3"}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-[#777184] font-medium"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Spline Lines */}
          <path
            d={requestsPath}
            fill="none"
            stroke="#7956C9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={successfulPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={failedPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Points & Interactive Nodes */}
          {chartData.map((pt, i) => {
            const x = getX(i);
            const yReq = getY(pt.requests);
            const ySuc = getY(pt.successful);
            const yFail = getY(pt.failed);

            return (
              <g key={pt.date} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
                {/* Requests circle */}
                <circle cx={x} cy={yReq} r="4" fill="#7956C9" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-5 transition-all" />
                {/* Successful circle */}
                <circle cx={x} cy={ySuc} r="4" fill="#10B981" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-5 transition-all" />
                {/* Failed circle */}
                <circle cx={x} cy={yFail} r="4" fill="#EF4444" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-5 transition-all" />

                {/* X Axis Date Label */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-[#777184] font-medium"
                >
                  {pt.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#EAE4EE] shadow-lg text-xs space-y-1 pointer-events-none z-10">
            <span className="font-bold text-[#24213A] block border-b border-[#EAE4EE] pb-1">
              {hoveredPoint.date} Activity
            </span>
            <div className="flex justify-between gap-4 text-[#7956C9]">
              <span>Requests:</span>
              <strong className="font-bold">{hoveredPoint.requests.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[#10B981]">
              <span>Successful:</span>
              <strong className="font-bold">{hoveredPoint.successful.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[#EF4444]">
              <span>Failed:</span>
              <strong className="font-bold">{hoveredPoint.failed.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
