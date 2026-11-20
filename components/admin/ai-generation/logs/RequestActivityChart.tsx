"use client";

import React, { useState } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import type { RequestActivityPoint } from "@/lib/ai-request-logs";

interface RequestActivityChartProps {
  activityData: RequestActivityPoint[];
}

export const RequestActivityChart: React.FC<RequestActivityChartProps> = ({ activityData }) => {
  const [activeRange, setActiveRange] = useState("Last Hour");

  // SVG Chart Geometry
  const width = 850;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxY = 100;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxY) * chartHeight;
  const getX = (idx: number) =>
    paddingLeft + (idx / Math.max(1, activityData.length - 1)) * chartWidth;

  // Build SVG path
  const makePath = (key: keyof Pick<RequestActivityPoint, "incomingRequests" | "successfulResponses" | "failedResponses">) => {
    if (activityData.length === 0) return "";
    return activityData.reduce((acc, point, idx) => {
      const x = getX(idx);
      const y = getY(point[key]);
      if (idx === 0) return `M ${x} ${y}`;
      // Smooth cubic bezier curve
      const prevX = getX(idx - 1);
      const prevY = getY(activityData[idx - 1][key]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }, "");
  };

  const incomingPath = makePath("incomingRequests");
  const successPath = makePath("successfulResponses");
  const failedPath = makePath("failedResponses");

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Chart Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrendingUp size={16} color="#7956C9" />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>
            Request Activity
          </span>
        </div>

        {/* Time Range Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {["Last Hour", "Last 24 Hours", "Last 7 Days", "Custom Range"].map((range) => {
            const isActive = activeRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? "#7956C9" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#544E61",
                  border: isActive ? "none" : "1px solid #EAE4EE",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {range}
              </button>
            );
          })}
          <button
            type="button"
            title="Select date range"
            style={{
              padding: "5px 8px",
              borderRadius: "6px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#544E61",
            }}
          >
            <Calendar size={14} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          fontSize: "12px",
          color: "#544E61",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#7956C9",
              display: "inline-block",
            }}
          />
          <span>Incoming Requests</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              display: "inline-block",
            }}
          />
          <span>Successful Responses</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#EF4444",
              display: "inline-block",
            }}
          />
          <span>Failed Responses</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "190px", display: "block" }}
        >
          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {[100, 75, 50, 25, 0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#A09BA8"
                >
                  {val}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1EDF5"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* X-Axis Labels */}
          {activityData.map((pt, idx) => {
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                textAnchor={idx === 0 ? "start" : idx === activityData.length - 1 ? "end" : "middle"}
                fontSize="11"
                fill="#A09BA8"
              >
                {pt.time}
              </text>
            );
          })}

          {/* Spline Lines */}
          <path
            d={incomingPath}
            fill="none"
            stroke="#7956C9"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={successPath}
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

          {/* Circle Points */}
          {activityData.map((pt, idx) => {
            const x = getX(idx);
            return (
              <g key={idx}>
                {/* Incoming Point */}
                <circle
                  cx={x}
                  cy={getY(pt.incomingRequests)}
                  r="4"
                  fill="#7956C9"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Success Point */}
                <circle
                  cx={x}
                  cy={getY(pt.successfulResponses)}
                  r="4"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Failed Point */}
                <circle
                  cx={x}
                  cy={getY(pt.failedResponses)}
                  r="4"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
