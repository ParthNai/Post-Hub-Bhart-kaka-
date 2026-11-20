"use client";

import React from "react";
import { Calendar, Clock, Check, FileText } from "lucide-react";
import type { FestivalSummaryMetrics } from "@/lib/festivals";

interface FestivalsSummaryCardsProps {
  metrics: FestivalSummaryMetrics;
  selectedFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export const FestivalsSummaryCards: React.FC<FestivalsSummaryCardsProps> = ({
  metrics,
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* 1. Total Festivals & Events */}
      <div
        onClick={() => onSelectFilter?.("all")}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: selectedFilter === "all" ? "2px solid #7956C9" : "1px solid #EAE4EE",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#F4EFFC",
              color: "#7956C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#777184", marginBottom: "4px" }}>
              Total Festivals & Events
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#24213A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {metrics.totalEvents}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#10B981" }}>
                ↑ {metrics.totalEventsTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Subtle decorative purple wave at card corner */}
        <div
          style={{
            position: "absolute",
            right: "-15px",
            bottom: "-15px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(121,86,201,0.08) 0%, rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 2. Upcoming Events */}
      <div
        onClick={() => onSelectFilter?.("upcoming")}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: selectedFilter === "upcoming" ? "2px solid #7956C9" : "1px solid #EAE4EE",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Clock size={22} />
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#777184", marginBottom: "4px" }}>
            Upcoming Events
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {metrics.upcomingEvents}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#10B981" }}>
              ↑ {metrics.upcomingEventsTrend}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Active Events */}
      <div
        onClick={() => onSelectFilter?.("active")}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: selectedFilter === "active" ? "2px solid #7956C9" : "1px solid #EAE4EE",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#ECFDF5",
            color: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={15} strokeWidth={3} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#777184", marginBottom: "4px" }}>
            Active Events
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {metrics.activeEvents}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#10B981" }}>
              ↑ {metrics.activeEventsTrend}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Draft Events */}
      <div
        onClick={() => onSelectFilter?.("draft")}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: selectedFilter === "draft" ? "2px solid #7956C9" : "1px solid #EAE4EE",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#FFFBEB",
            color: "#F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={22} />
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#777184", marginBottom: "4px" }}>
            Draft Events
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {metrics.draftEvents}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#777184" }}>
              → {metrics.draftEventsTrend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
