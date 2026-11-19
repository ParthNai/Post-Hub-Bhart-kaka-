"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import type { CreditConsumptionPoint } from "@/lib/ai-analytics";

interface CreditConsumptionChartProps {
  data?: CreditConsumptionPoint[];
  consumption?: CreditConsumptionPoint[];
}

export function CreditConsumptionChart({ data, consumption }: CreditConsumptionChartProps) {
  const chartData = data || consumption || [];
  const [hoveredPoint, setHoveredPoint] = useState<CreditConsumptionPoint | null>(null);

  // Chart coordinates
  const height = 220;
  const width = 560;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };

  const maxY = 40000;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barGroupWidth = chartWidth / Math.max(1, chartData.length);
  const barWidth = 6;
  const gap = 3;

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / maxY) * chartHeight;
  };

  const getBarHeight = (val: number) => {
    return (val / maxY) * chartHeight;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE4EE] shadow-2xs space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24213A]">
              Credit Consumption
            </h2>
            <p className="text-xs text-[#777184] font-medium">
              Credits issued, consumed and remaining
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-xs font-semibold self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
            <span>Issued</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />
            <span>Consumed</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Refunded</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#24213A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DDD6FE]" />
            <span>Remaining</span>
          </div>
        </div>
      </div>

      {/* SVG Clustered Column Chart */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Y Axis Grid Lines & Labels */}
          {[40000, 30000, 20000, 10000, 0].map((val) => {
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

          {/* Bar Groups for each day */}
          {chartData.map((pt, i) => {
            const groupCenterX = padding.left + i * barGroupWidth + barGroupWidth / 2;
            const startX = groupCenterX - (4 * barWidth + 3 * gap) / 2;

            const hIssued = getBarHeight(pt.issued);
            const hConsumed = getBarHeight(pt.consumed);
            const hRefunded = getBarHeight(pt.refunded);
            const hRemaining = getBarHeight(pt.remaining);

            const yBaseline = padding.top + chartHeight;

            return (
              <g
                key={pt.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Bar 1: Issued (Lavender) */}
                <rect
                  x={startX}
                  y={yBaseline - hIssued}
                  width={barWidth}
                  height={hIssued}
                  fill="#A78BFA"
                  rx="2"
                  className="hover:opacity-85 transition-opacity"
                />
                {/* Bar 2: Consumed (Deep Purple) */}
                <rect
                  x={startX + barWidth + gap}
                  y={yBaseline - hConsumed}
                  width={barWidth}
                  height={hConsumed}
                  fill="#5B21B6"
                  rx="2"
                  className="hover:opacity-85 transition-opacity"
                />
                {/* Bar 3: Refunded (Green) */}
                <rect
                  x={startX + (barWidth + gap) * 2}
                  y={yBaseline - hRefunded}
                  width={barWidth}
                  height={hRefunded}
                  fill="#10B981"
                  rx="2"
                  className="hover:opacity-85 transition-opacity"
                />
                {/* Bar 4: Remaining (Light Blue/Violet) */}
                <rect
                  x={startX + (barWidth + gap) * 3}
                  y={yBaseline - hRemaining}
                  width={barWidth}
                  height={hRemaining}
                  fill="#DDD6FE"
                  rx="2"
                  className="hover:opacity-85 transition-opacity"
                />

                {/* X Axis Label */}
                <text
                  x={groupCenterX}
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
              {hoveredPoint.date} Credits
            </span>
            <div className="flex justify-between gap-4 text-[#A78BFA]">
              <span>Issued:</span>
              <strong className="font-bold">{hoveredPoint.issued.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[#5B21B6]">
              <span>Consumed:</span>
              <strong className="font-bold">{hoveredPoint.consumed.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[#10B981]">
              <span>Refunded:</span>
              <strong className="font-bold">{hoveredPoint.refunded.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between gap-4 text-[#7956C9]">
              <span>Remaining:</span>
              <strong className="font-bold">{hoveredPoint.remaining.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
