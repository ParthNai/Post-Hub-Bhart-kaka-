"use client";

import React, { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";

interface PerformanceAnalyticsCardsProps {
  trendData: {
    labels: string[];
    periods: {
      "24 Hours": number[];
      "7 Days": number[];
      "30 Days": number[];
    };
  };
  successFailureData: {
    labels: string[];
    periods: {
      "Last 24 Hours": { successful: number[]; failed: number[] };
      "Last 7 Days": { successful: number[]; failed: number[] };
      "Last 30 Days": { successful: number[]; failed: number[] };
    };
  };
}

export const PerformanceAnalyticsCards: React.FC<PerformanceAnalyticsCardsProps> = ({
  trendData,
  successFailureData,
}) => {
  const [trendPeriod, setTrendPeriod] = useState<"24 Hours" | "7 Days" | "30 Days">("24 Hours");
  const [barPeriod, setBarPeriod] = useState<"Last 24 Hours" | "Last 7 Days" | "Last 30 Days">("Last 24 Hours");

  const activeTrendValues = trendData.periods[trendPeriod] || trendData.periods["24 Hours"];
  const activeBarValues = successFailureData.periods[barPeriod] || successFailureData.periods["Last 24 Hours"];

  // SVG dimensions for Trend Chart
  const trendW = 460;
  const trendH = 160;
  const trendPaddingX = 40;
  const trendPaddingTop = 15;
  const trendPaddingBottom = 25;
  const trendPlotH = trendH - trendPaddingTop - trendPaddingBottom;
  const trendPlotW = trendW - trendPaddingX - 20;

  // Max scale is 2.0s
  const maxTrendSec = 2.0;
  const points = activeTrendValues.map((val, idx) => {
    const x = trendPaddingX + (idx / (activeTrendValues.length - 1)) * trendPlotW;
    const y = trendPaddingTop + trendPlotH - (Math.min(val, maxTrendSec) / maxTrendSec) * trendPlotH;
    return { x, y, val };
  });

  // Build SVG path
  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${trendPaddingTop + trendPlotH} L ${points[0].x} ${trendPaddingTop + trendPlotH} Z`;

  // Bar chart parameters
  const barW = 460;
  const barH = 160;
  const barPaddingX = 35;
  const barPaddingTop = 15;
  const barPaddingBottom = 25;
  const barPlotH = barH - barPaddingTop - barPaddingBottom;
  const barPlotW = barW - barPaddingX - 15;
  const maxBarTotal = 15000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 1. Response Time Trend Card */}
      <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7956C9]" />
            <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
              Response Time Trend
            </h3>
          </div>

          {/* Time period filter pills */}
          <div className="flex items-center bg-[#FAF7F2] p-0.5 rounded-lg border border-[#EAE4EE] text-[11px] font-medium">
            {(["24 Hours", "7 Days", "30 Days"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTrendPeriod(period)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  trendPeriod === period
                    ? "bg-[#7956C9] text-white font-semibold shadow-2xs"
                    : "text-[#777184] hover:text-[#24213A]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart SVG */}
        <div className="w-full relative overflow-hidden">
          <svg
            viewBox={`0 0 ${trendW} ${trendH}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7956C9" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#7956C9" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines and Y-axis labels */}
            {[
              { val: 2.0, label: "2s" },
              { val: 1.5, label: "1.5s" },
              { val: 1.0, label: "1s" },
              { val: 0.5, label: "500ms" },
              { val: 0.0, label: "0ms" },
            ].map((grid, idx) => {
              const y = trendPaddingTop + trendPlotH - (grid.val / maxTrendSec) * trendPlotH;
              return (
                <g key={idx}>
                  <text
                    x={trendPaddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-[#777184] font-medium"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1={trendPaddingX}
                    y1={y}
                    x2={trendW - 15}
                    y2={y}
                    stroke="#EAE4EE"
                    strokeDasharray={grid.val === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Area & Spline Line */}
            <path d={areaD} fill="url(#trendGrad)" />
            <path d={pathD} fill="none" stroke="#7956C9" strokeWidth="2.5" />

            {/* Dots */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={3.5}
                  fill="#7956C9"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {trendData.labels.map((lbl, idx) => {
              const x = trendPaddingX + (idx / (trendData.labels.length - 1)) * trendPlotW;
              return (
                <text
                  key={idx}
                  x={x}
                  y={trendH - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-[#777184] font-medium"
                >
                  {lbl}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Request Success & Failure Card */}
      <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#7956C9]" />
            <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
              Request Success &amp; Failure
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#777184]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#7956C9]" />
                Successful
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Failed
              </span>
            </div>

            {/* Period dropdown */}
            <select
              value={barPeriod}
              onChange={(e) => setBarPeriod(e.target.value as any)}
              className="px-2 py-1 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-[11px] text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Stacked Bar Chart SVG */}
        <div className="w-full relative overflow-hidden">
          <svg
            viewBox={`0 0 ${barW} ${barH}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Grid lines and Y-axis labels */}
            {[
              { val: 15000, label: "15K" },
              { val: 10000, label: "10K" },
              { val: 5000, label: "5K" },
              { val: 0, label: "0" },
            ].map((grid, idx) => {
              const y = barPaddingTop + barPlotH - (grid.val / maxBarTotal) * barPlotH;
              return (
                <g key={idx}>
                  <text
                    x={barPaddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-[#777184] font-medium"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1={barPaddingX}
                    y1={y}
                    x2={barW - 15}
                    y2={y}
                    stroke="#EAE4EE"
                    strokeDasharray={grid.val === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Stacked Bars */}
            {activeBarValues.successful.map((succ, idx) => {
              const fail = activeBarValues.failed[idx] || 0;
              const total = succ + fail;
              const barTotalH = (total / maxBarTotal) * barPlotH;
              const barSuccH = (succ / maxBarTotal) * barPlotH;
              const barFailH = (fail / maxBarTotal) * barPlotH;

              const colW = barPlotW / activeBarValues.successful.length;
              const barWidth = Math.min(22, colW * 0.45);
              const x = barPaddingX + idx * colW + (colW - barWidth) / 2;
              const yBase = barPaddingTop + barPlotH;
              const ySucc = yBase - barSuccH;
              const yFail = ySucc - barFailH;

              return (
                <g key={idx}>
                  {/* Successful portion (purple bottom) */}
                  <rect
                    x={x}
                    y={ySucc}
                    width={barWidth}
                    height={barSuccH}
                    fill="#7956C9"
                    rx={2}
                  />
                  {/* Failed portion (amber top cap) */}
                  <rect
                    x={x}
                    y={yFail}
                    width={barWidth}
                    height={barFailH}
                    fill="#F59E0B"
                    rx={2}
                  />
                </g>
              );
            })}

            {/* X-axis labels */}
            {successFailureData.labels.map((lbl, idx) => {
              const colW = barPlotW / successFailureData.labels.length;
              const x = barPaddingX + idx * colW + colW / 2;
              return (
                <text
                  key={idx}
                  x={x}
                  y={barH - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-[#777184] font-medium"
                >
                  {lbl}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
