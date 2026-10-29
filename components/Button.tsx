"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        width: "100%",
        height: "48px",
        borderRadius: "var(--radius-btn)",
        border: "none",
        backgroundColor: isDisabled
          ? "rgba(121, 86, 201, 0.65)"
          : isActive
          ? "var(--primary-active)"
          : isHovered
          ? "var(--primary-hover)"
          : "var(--primary)",
        color: "#FFFFFF",
        fontSize: "15px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color 0.18s ease, transform 0.1s ease, box-shadow 0.18s ease",
        transform: isActive && !isDisabled ? "scale(0.995)" : "none",
        boxShadow:
          isHovered && !isDisabled
            ? "0 4px 12px rgba(121, 86, 201, 0.28)"
            : "0 2px 6px rgba(121, 86, 201, 0.18)",
        outline: "none",
      }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Signing In...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
