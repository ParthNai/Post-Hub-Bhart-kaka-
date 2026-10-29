"use client";

import React from "react";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

interface AlertProps {
  type?: "error" | "warning" | "success";
  message: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = "error", message }) => {
  const isError = type === "error";
  const isWarning = type === "warning";

  const bgColor = isError ? "var(--error-bg)" : isWarning ? "#FFFBEB" : "var(--success-bg)";
  const borderColor = isError ? "var(--error-border)" : isWarning ? "#FDE68A" : "var(--success-border)";
  const textColor = isError ? "var(--error)" : isWarning ? "#92400E" : "var(--success)";

  return (
    <div
      role="alert"
      className="animate-fade-in"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "8px",
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontSize: "13px",
        lineHeight: 1.45,
        marginBottom: "18px",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "1px" }}>
        {isError && <AlertCircle size={16} />}
        {isWarning && <ShieldAlert size={16} />}
        {type === "success" && <CheckCircle2 size={16} />}
      </div>
      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
};
