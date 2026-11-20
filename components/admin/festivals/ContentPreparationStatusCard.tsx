"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import type { ContentPreparationMetrics } from "@/lib/festivals";

interface ContentPreparationStatusCardProps {
  metrics: ContentPreparationMetrics;
}

export const ContentPreparationStatusCard: React.FC<ContentPreparationStatusCardProps> = ({
  metrics,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart3 size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Content Preparation Status
        </h2>
      </div>

      {/* Progress Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 1. Events with ready templates */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: "#24213A", fontWeight: 500 }}>Events with ready templates</span>
            <span style={{ color: "#7956C9", fontWeight: 700 }}>{metrics.readyTemplatesPercent}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "7px",
              backgroundColor: "#EAE4EE",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${metrics.readyTemplatesPercent}%`,
                height: "100%",
                backgroundColor: "#7956C9",
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* 2. Events requiring templates */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: "#24213A", fontWeight: 500 }}>Events requiring templates</span>
            <span style={{ color: "#F59E0B", fontWeight: 700 }}>{metrics.requiringTemplatesPercent}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "7px",
              backgroundColor: "#EAE4EE",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${metrics.requiringTemplatesPercent}%`,
                height: "100%",
                backgroundColor: "#F59E0B",
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* 3. Events awaiting review */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            <span style={{ color: "#24213A", fontWeight: 500 }}>Events awaiting review</span>
            <span style={{ color: "#3B82F6", fontWeight: 700 }}>{metrics.awaitingReviewPercent}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "7px",
              backgroundColor: "#EAE4EE",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${metrics.awaitingReviewPercent}%`,
                height: "100%",
                backgroundColor: "#3B82F6",
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
