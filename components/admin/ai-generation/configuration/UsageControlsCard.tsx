"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { AiProviderFullConfig } from "@/lib/ai-generation";

interface UsageControlsCardProps {
  config: AiProviderFullConfig;
  onChange: (fields: Partial<AiProviderFullConfig>) => void;
}

export const UsageControlsCard: React.FC<UsageControlsCardProps> = ({
  config,
  onChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Generation Limits & Usage Controls
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Manage limits to ensure fair usage and control costs.
          </p>
        </div>
      </div>

      {/* Row 1: Per-User Request Limit & Global Request Limit */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "6px",
            }}
          >
            Per-User Request Limit
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              min={1}
              value={config.perUserRequestLimit}
              onChange={(e) =>
                onChange({ perUserRequestLimit: Math.max(1, Number(e.target.value) || 1) })
              }
              style={{
                width: "100%",
                padding: "9px 65px 9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              per day
            </span>
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "6px",
            }}
          >
            Global Request Limit
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={config.globalRequestLimit.toLocaleString()}
              onChange={(e) => {
                const numeric = Number(e.target.value.replace(/,/g, "")) || 0;
                onChange({ globalRequestLimit: numeric });
              }}
              style={{
                width: "100%",
                padding: "9px 75px 9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              per month
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Concurrent Generation Limit, Rate Limit, Max Retry Attempts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "6px",
            }}
          >
            Concurrent Generation Limit
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={config.concurrentGenerationLimit}
            onChange={(e) =>
              onChange({ concurrentGenerationLimit: Math.max(1, Number(e.target.value) || 1) })
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "6px",
            }}
          >
            Rate Limit
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="number"
              min={1}
              value={config.rateLimit}
              onChange={(e) =>
                onChange({ rateLimit: Math.max(1, Number(e.target.value) || 1) })
              }
              style={{
                width: "60px",
                padding: "9px 10px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                textAlign: "center",
              }}
            />
            <select
              value={config.rateLimitUnit}
              onChange={(e) => onChange({ rateLimitUnit: e.target.value })}
              style={{
                flex: 1,
                padding: "9px 8px",
                fontSize: "12.5px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="requests/min">requests/min</option>
              <option value="requests/sec">requests/sec</option>
              <option value="requests/hour">requests/hour</option>
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "6px",
            }}
          >
            Max Retry Attempts
          </label>
          <input
            type="number"
            min={0}
            max={5}
            value={config.maxRetryAttempts}
            onChange={(e) =>
              onChange({ maxRetryAttempts: Math.max(0, Number(e.target.value) || 0) })
            }
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </div>
  );
};

