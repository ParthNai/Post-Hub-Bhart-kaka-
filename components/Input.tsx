"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, icon, error, isPassword = false, type = "text", disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "18px" }}>
        <label
          htmlFor={id}
          style={{
            fontSize: "13.5px",
            fontWeight: 500,
            color: "var(--text)",
            marginBottom: "8px",
            userSelect: "none",
          }}
        >
          {label}
        </label>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "48px",
            borderRadius: "var(--radius-input)",
            backgroundColor: "var(--surface)",
            border: error
              ? "1.5px solid var(--error)"
              : isFocused
              ? "1.5px solid var(--border-focus)"
              : "1px solid var(--border)",
            boxShadow: isFocused
              ? error
                ? "0 0 0 3px rgba(217, 56, 58, 0.15)"
                : "0 0 0 3px rgba(121, 86, 201, 0.15)"
              : "none",
            transition: "all 0.18s ease-in-out",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {icon && (
            <div
              style={{
                position: "absolute",
                left: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isFocused ? "var(--primary)" : "#8E879B",
                pointerEvents: "none",
                transition: "color 0.18s ease",
              }}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={effectiveType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            style={{
              width: "100%",
              height: "100%",
              paddingLeft: icon ? "42px" : "14px",
              paddingRight: isPassword ? "42px" : "14px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "var(--text)",
              fontSize: "14px",
              letterSpacing: effectiveType === "password" && !showPassword ? "0.15em" : "normal",
            }}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                color: "#8E879B",
                padding: "6px",
                borderRadius: "4px",
                transition: "color 0.18s ease",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <span
            id={`${id}-error`}
            role="alert"
            style={{
              fontSize: "12.5px",
              color: "var(--error)",
              marginTop: "5px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
