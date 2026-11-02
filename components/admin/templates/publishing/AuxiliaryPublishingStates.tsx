"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Smartphone } from "lucide-react";

export const AuxiliaryPublishingStates: React.FC = () => {
  const states = [
    {
      title: "Validation Passed",
      desc: "All pre-flight checks passed without blocking errors.",
      icon: <CheckCircle2 size={20} style={{ color: "#10B981" }} />,
      bg: "#ECFDF5",
      border: "#A7F3D0",
      pill: "Ready",
      pillColor: "#059669",
    },
    {
      title: "Validation Warning",
      desc: "Accessibility contrast warning detected. Non-blocking.",
      icon: <AlertTriangle size={20} style={{ color: "#F59E0B" }} />,
      bg: "#FFFBEB",
      border: "#FDE68A",
      pill: "Review",
      pillColor: "#D97706",
    },
    {
      title: "Validation Failed",
      desc: "Blocking errors found. Resolve required fields in editor.",
      icon: <XCircle size={20} style={{ color: "#EF4444" }} />,
      bg: "#FEF2F2",
      border: "#FECACA",
      pill: "Blocked",
      pillColor: "#DC2626",
    },
    {
      title: "Publishing In Progress",
      desc: "Packaging template bundle for mobile OTA deployment.",
      icon: <RefreshCw size={20} style={{ color: "#3B82F6", animation: "spin 2s linear infinite" }} />,
      bg: "#EFF6FF",
      border: "#BFDBFE",
      pill: "Deploying",
      pillColor: "#2563EB",
    },
    {
      title: "Published Successfully",
      desc: "Live on mobile app. Available to all users on next feed load.",
      icon: <Smartphone size={20} style={{ color: "var(--primary, #7956C9)" }} />,
      bg: "#F5F3FF",
      border: "#DDD6FE",
      pill: "Live",
      pillColor: "#7C3AED",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "14px",
        marginTop: "20px",
        marginBottom: "24px",
      }}
      className="auxiliary-publishing-states-grid"
    >
      {states.map((st, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: "#ffffff",
            border: `1px solid var(--border, #EAE4EE)`,
            borderRadius: "10px",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: st.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {st.icon}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: st.pillColor,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: st.bg,
                }}
              >
                {st.pill}
              </span>
            </div>

            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                marginBottom: "4px",
              }}
            >
              {st.title}
            </div>

            <p
              style={{
                fontSize: "11.5px",
                color: "var(--text-muted, #777184)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {st.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
