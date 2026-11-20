"use client";

import React from "react";
import { Calendar } from "lucide-react";
import type { QueueSchedulingSettings } from "@/lib/ai-queue-priority";

interface SchedulingSettingsCardProps {
  settings: QueueSchedulingSettings;
  onChange: (updated: Partial<QueueSchedulingSettings>) => void;
}

export const SchedulingSettingsCard: React.FC<SchedulingSettingsCardProps> = ({
  settings,
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
        gap: "12px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Calendar size={16} color="#7956C9" />
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Scheduling Settings
        </h3>
      </div>

      {/* Scheduling Mode */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Scheduling Mode</span>
        <select
          value={settings.schedulingMode}
          onChange={(e) =>
            onChange({
              schedulingMode: e.target.value as QueueSchedulingSettings["schedulingMode"],
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
          <option value="Balanced">Balanced</option>
          <option value="Throughput-Optimized">Throughput-Optimized</option>
          <option value="Cost-Optimized">Cost-Optimized</option>
          <option value="Strict-Priority">Strict-Priority</option>
        </select>
      </div>

      {/* Maximum Concurrent Jobs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Maximum Concurrent Jobs</span>
        <input
          type="number"
          min={1}
          max={100}
          value={settings.maxConcurrentJobs}
          onChange={(e) =>
            onChange({ maxConcurrentJobs: Math.max(1, parseInt(e.target.value, 10) || 20) })
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
      </div>

      {/* Provider-Specific Limits */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Provider-Specific Limits</span>
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
            checked={settings.providerSpecificLimits}
            onChange={(e) => onChange({ providerSpecificLimits: e.target.checked })}
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
              backgroundColor: settings.providerSpecificLimits ? "#7956C9" : "#D1D5DB",
              borderRadius: "20px",
              transition: "0.2s",
            }}
          />
          <span
            style={{
              position: "absolute",
              height: "14px",
              width: "14px",
              left: settings.providerSpecificLimits ? "20px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "0.2s",
            }}
          />
        </label>
      </div>

      {/* Queue Processing */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Queue Processing</span>
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
            checked={settings.queueProcessing}
            onChange={(e) => onChange({ queueProcessing: e.target.checked })}
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
              backgroundColor: settings.queueProcessing ? "#7956C9" : "#D1D5DB",
              borderRadius: "20px",
              transition: "0.2s",
            }}
          />
          <span
            style={{
              position: "absolute",
              height: "14px",
              width: "14px",
              left: settings.queueProcessing ? "20px" : "3px",
              bottom: "3px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "0.2s",
            }}
          />
        </label>
      </div>

      {/* Scheduled Request Handling */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Scheduled Request Handling</span>
        <select
          value={settings.scheduledRequestHandling}
          onChange={(e) =>
            onChange({
              scheduledRequestHandling: e.target
                .value as QueueSchedulingSettings["scheduledRequestHandling"],
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
          <option value="Process on Time">Process on Time</option>
          <option value="Immediate If Capacity">Immediate If Capacity</option>
          <option value="Batch Scheduled">Batch Scheduled</option>
        </select>
      </div>

      {/* Retry Scheduling Policy */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Retry Scheduling Policy</span>
        <select
          value={settings.retrySchedulingPolicy}
          onChange={(e) =>
            onChange({
              retrySchedulingPolicy: e.target
                .value as QueueSchedulingSettings["retrySchedulingPolicy"],
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
          <option value="Exponential Backoff">Exponential Backoff</option>
          <option value="Linear Retry">Linear Retry</option>
          <option value="Fixed Interval">Fixed Interval</option>
        </select>
      </div>

      {/* Rate-Limit Handling */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
        <span style={{ color: "#24213A", fontWeight: 500 }}>Rate-Limit Handling</span>
        <select
          value={settings.rateLimitHandling}
          onChange={(e) =>
            onChange({
              rateLimitHandling: e.target
                .value as QueueSchedulingSettings["rateLimitHandling"],
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
          <option value="Queue & Retry">Queue & Retry</option>
          <option value="Instant Failover">Instant Failover</option>
          <option value="Drop Request">Drop Request</option>
        </select>
      </div>
    </div>
  );
};
