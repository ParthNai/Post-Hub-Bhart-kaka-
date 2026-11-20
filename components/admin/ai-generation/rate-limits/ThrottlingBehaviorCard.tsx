"use client";

import React from "react";
import { Shield, Ban, ListFilter, Clock, PauseCircle, Info } from "lucide-react";
import type { ThrottlingBehaviorConfig } from "@/lib/ai-rate-limits";

interface ThrottlingBehaviorCardProps {
  config: ThrottlingBehaviorConfig;
  onSelectBehavior: (behavior: ThrottlingBehaviorConfig["selectedBehavior"]) => void;
}

export const ThrottlingBehaviorCard: React.FC<ThrottlingBehaviorCardProps> = ({
  config,
  onSelectBehavior,
}) => {
  const behaviors: Array<{
    id: ThrottlingBehaviorConfig["selectedBehavior"];
    label: string;
    subtext: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "Reject Request",
      label: "Reject Request",
      subtext: "Return 429 error",
      icon: <Ban size={18} color="#7956C9" />,
    },
    {
      id: "Queue Request",
      label: "Queue Request",
      subtext: "Add to queue",
      icon: <ListFilter size={18} color="#7956C9" />,
    },
    {
      id: "Delayed Retry",
      label: "Delayed Retry",
      subtext: "Retry after delay",
      icon: <Clock size={18} color="#7956C9" />,
    },
    {
      id: "Temporary Cooldown",
      label: "Temporary Cooldown",
      subtext: "Block for time",
      icon: <PauseCircle size={18} color="#7956C9" />,
    },
  ];

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
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <Shield size={16} color="#7956C9" />
        <span>Throttling Behavior</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* Left Side: 4 Selectable Behavior Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {behaviors.map((b) => {
            const isSelected = config.selectedBehavior === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBehavior(b.id)}
                style={{
                  backgroundColor: isSelected ? "#FBF9FE" : "#FFFFFF",
                  border: isSelected ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  borderRadius: "10px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  outline: "none",
                }}
              >
                <div style={{ marginBottom: "8px" }}>{b.icon}</div>
                <div
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: isSelected ? "#7956C9" : "#24213A",
                    marginBottom: "3px",
                  }}
                >
                  {b.label}
                </div>
                <div style={{ fontSize: "11px", color: "#777184" }}>{b.subtext}</div>
              </button>
            );
          })}
        </div>

        {/* Right Side: HTTP 429 Preview */}
        <div
          style={{
            backgroundColor: "#F3EFFC",
            border: "1px solid #EAE4EE",
            borderRadius: "10px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#E2D9F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#7956C9",
            }}
          >
            <Info size={16} />
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#24213A", lineHeight: 1.2 }}>
              {config.http429Title}
            </div>
            <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#7956C9", margin: "2px 0 4px 0" }}>
              Too Many Requests
            </div>
            <div style={{ fontSize: "11.5px", color: "#544E61", lineHeight: 1.4 }}>
              {config.http429Message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
