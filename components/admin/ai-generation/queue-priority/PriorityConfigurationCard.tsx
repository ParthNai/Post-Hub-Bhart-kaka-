"use client";

import React from "react";
import { Star } from "lucide-react";
import type { PriorityConfig } from "@/lib/ai-queue-priority";

interface PriorityConfigurationCardProps {
  config: PriorityConfig;
  onChange: (updated: Partial<PriorityConfig>) => void;
}

export const PriorityConfigurationCard: React.FC<PriorityConfigurationCardProps> = ({
  config,
  onChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Star size={16} color="#7956C9" />
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Priority Configuration
        </h3>
      </div>

      {/* Priority Legend Tiers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Critical */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#DC2626" }} />
            <span style={{ fontWeight: 600, color: "#24213A" }}>Critical</span>
          </div>
          <span style={{ color: "#777184" }}>{config.criticalDescription}</span>
        </div>

        {/* High */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#EA580C" }} />
            <span style={{ fontWeight: 600, color: "#24213A" }}>High</span>
          </div>
          <span style={{ color: "#777184" }}>{config.highDescription}</span>
        </div>

        {/* Normal */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#16A34A" }} />
            <span style={{ fontWeight: 600, color: "#24213A" }}>Normal</span>
          </div>
          <span style={{ color: "#777184" }}>{config.normalDescription}</span>
        </div>

        {/* Low */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#0284C7" }} />
            <span style={{ fontWeight: 600, color: "#24213A" }}>Low</span>
          </div>
          <span style={{ color: "#777184" }}>{config.lowDescription}</span>
        </div>
      </div>

      <div style={{ height: "1px", backgroundColor: "#F1EDF5", margin: "2px 0" }} />

      {/* Priority Ordering */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#777184", fontWeight: 500 }}>Priority Ordering</span>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "6px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #EAE4EE",
            color: "#24213A",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {config.ordering}
        </span>
      </div>

      {/* Fair Scheduling Policy */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Fair Scheduling Policy</span>
        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "38px",
            height: "20px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={config.fairSchedulingPolicy}
            onChange={(e) => onChange({ fairSchedulingPolicy: e.target.checked })}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: config.fairSchedulingPolicy ? "#7956C9" : "#D1D5DB",
              borderRadius: "20px",
              transition: "0.2s",
            }}
          />
          <span
            style={{
              position: "absolute",
              height: "14px",
              width: "14px",
              left: config.fairSchedulingPolicy ? "20px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "0.2s",
            }}
          />
        </label>
      </div>

      {/* Maximum Waiting Threshold */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Maximum Waiting Threshold</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="number"
            min={5}
            max={180}
            value={config.maxWaitingThresholdMinutes}
            onChange={(e) =>
              onChange({ maxWaitingThresholdMinutes: Math.max(1, parseInt(e.target.value, 10) || 30) })
            }
            style={{
              width: "50px",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF7F2",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "#24213A",
              outline: "none",
            }}
          />
          <span style={{ color: "#777184", fontSize: "11px" }}>min</span>
        </div>
      </div>

      {/* Queue Overflow Behavior */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Queue Overflow Behavior</span>
        <select
          value={config.queueOverflowBehavior}
          onChange={(e) =>
            onChange({
              queueOverflowBehavior: e.target.value as PriorityConfig["queueOverflowBehavior"],
            })
          }
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FAF7F2",
            fontSize: "12px",
            fontWeight: 500,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="Auto Scale">Auto Scale</option>
          <option value="Reject">Reject</option>
          <option value="Spillover">Spillover</option>
          <option value="Throttle">Throttle</option>
        </select>
      </div>
    </div>
  );
};
