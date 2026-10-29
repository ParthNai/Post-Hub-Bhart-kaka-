import React from "react";

export interface BrandLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  withIcon?: boolean;
  variant?: "light" | "dark";
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  withIcon = true,
  variant = "light",
  iconOnly = false,
}) => {
  const isDark = variant === "dark";

  // Sizing definitions
  const dimensions = {
    xs: { icon: 22, radius: "6px", fontSize: "12px", text: "15px", gap: "6px" },
    sm: { icon: 28, radius: "8px", fontSize: "16px", text: "19px", gap: "8px" },
    md: { icon: 34, radius: "10px", fontSize: "19px", text: "23px", gap: "10px" },
    lg: { icon: 44, radius: "12px", fontSize: "24px", text: "28px", gap: "12px" },
    xl: { icon: 68, radius: "18px", fontSize: "38px", text: "36px", gap: "16px" },
  }[size];

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: dimensions.gap,
        fontWeight: 700,
        letterSpacing: "-0.025em",
        userSelect: "none",
      }}
    >
      {/* Brand Icon Badge */}
      {withIcon && (
        <div
          style={{
            width: `${dimensions.icon}px`,
            height: `${dimensions.icon}px`,
            borderRadius: dimensions.radius,
            backgroundColor: isDark && iconOnly ? "#7956C9" : "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: "var(--font-family-sans)",
            fontWeight: 800,
            fontSize: dimensions.fontSize,
            lineHeight: 1,
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
          }}
        >
          P
        </div>
      )}

      {/* Brand Text */}
      {!iconOnly && (
        <div style={{ display: "inline-flex", alignItems: "baseline" }}>
          <span
            style={{
              color: isDark ? "#FFFFFF" : "var(--text, #24213A)",
              fontSize: dimensions.text,
              letterSpacing: "-0.03em",
              marginRight: "3px",
              fontWeight: 700,
            }}
          >
            Post
          </span>
          <span
            style={{
              color: isDark ? "#FFFFFF" : "var(--primary, #7956C9)",
              fontSize: dimensions.text,
              letterSpacing: "-0.03em",
              fontWeight: 700,
            }}
          >
            Hub
          </span>
        </div>
      )}
    </div>
  );
};

