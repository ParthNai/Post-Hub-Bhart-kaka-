"use client";

import React from "react";
import { PieChart, AlertCircle, BarChart3, Clock } from "lucide-react";
import type {
  HttpStatusDistribution,
  ErrorCategoryItem,
  EndpointActivityItem,
  LatencyDistributionItem,
} from "@/lib/ai-request-logs";

interface BottomAnalyticsCardsProps {
  httpStatusData: HttpStatusDistribution[];
  errorCategories: ErrorCategoryItem[];
  endpointActivity: EndpointActivityItem[];
  latencyDistribution: LatencyDistributionItem[];
}

export const BottomAnalyticsCards: React.FC<BottomAnalyticsCardsProps> = ({
  httpStatusData,
  errorCategories,
  endpointActivity,
  latencyDistribution,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {/* 1. HTTP Status Categories Donut Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAE4EE",
          borderRadius: "12px",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#24213A",
            marginBottom: "14px",
          }}
        >
          <PieChart size={15} color="#7956C9" />
          <span>HTTP Status Categories</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flex: 1 }}>
          {/* SVG Donut */}
          <svg width="100" height="100" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="#FFFFFF" />
            {/* 2xx: 75% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="5"
              strokeDasharray="75 25"
              strokeDashoffset="25"
            />
            {/* 4xx: 14% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeDasharray="14 86"
              strokeDashoffset="-50"
            />
            {/* 5xx: 8% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="5"
              strokeDasharray="8 92"
              strokeDashoffset="-64"
            />
            {/* Others: 3% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#7956C9"
              strokeWidth="5"
              strokeDasharray="3 97"
              strokeDashoffset="-72"
            />
          </svg>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
            {httpStatusData.map((item) => (
              <div key={item.category} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ color: "#544E61" }}>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Common Error Categories Horizontal Bars */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAE4EE",
          borderRadius: "12px",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#24213A",
            marginBottom: "14px",
          }}
        >
          <AlertCircle size={15} color="#7956C9" />
          <span>Common Error Categories</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, justifyContent: "center" }}>
          {errorCategories.map((item) => (
            <div key={item.category} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px" }}>
              <span style={{ width: "70px", color: "#544E61", whiteSpace: "nowrap" }}>
                {item.category}
              </span>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#F3EFFC",
                  borderRadius: "4px",
                  height: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: "#7956C9",
                    height: "100%",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Endpoint Activity Vertical Bars */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAE4EE",
          borderRadius: "12px",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#24213A",
            marginBottom: "14px",
          }}
        >
          <BarChart3 size={15} color="#7956C9" />
          <span>Endpoint Activity</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", flex: 1, height: "100px", paddingBottom: "4px" }}>
          {endpointActivity.map((item) => (
            <div
              key={item.endpoint}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: `${Math.max(12, (item.percentage / 70) * 80)}px`,
                  backgroundColor: "#7956C9",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <span style={{ fontSize: "10.5px", color: "#544E61" }}>{item.endpoint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Latency Distribution Donut Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EAE4EE",
          borderRadius: "12px",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#24213A",
            marginBottom: "14px",
          }}
        >
          <Clock size={15} color="#7956C9" />
          <span>Latency Distribution</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flex: 1 }}>
          {/* SVG Donut */}
          <svg width="100" height="100" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="#FFFFFF" />
            {/* < 500ms: 38% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#7956C9"
              strokeWidth="5"
              strokeDasharray="38 62"
              strokeDashoffset="25"
            />
            {/* 500ms - 1s: 42% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#9F7AEA"
              strokeWidth="5"
              strokeDasharray="42 58"
              strokeDashoffset="-13"
            />
            {/* 1s - 2s: 16% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#B794F4"
              strokeWidth="5"
              strokeDasharray="16 84"
              strokeDashoffset="-55"
            />
            {/* > 2s: 4% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#D6BCFA"
              strokeWidth="5"
              strokeDasharray="4 96"
              strokeDashoffset="-71"
            />
          </svg>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }}>
            {latencyDistribution.map((item) => (
              <div key={item.range} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ color: "#544E61" }}>{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
