"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        fontSize: "13.5px",
        color: "var(--text-muted)",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "4px",
          border: checked ? "1.5px solid var(--primary)" : "1.5px solid #D5CEE0",
          backgroundColor: checked ? "var(--primary)" : "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.16s ease",
          boxShadow: checked ? "0 2px 4px rgba(121, 86, 201, 0.2)" : "none",
        }}
      >
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span>{label}</span>
    </label>
  );
};
