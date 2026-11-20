"use client";

import React, { useId } from "react";
import { TemplateSlotZone } from "@/lib/templates";

interface CurvedTextRendererProps {
  zone: TemplateSlotZone;
  displayText: string;
  isSelected?: boolean;
}

export const CurvedTextRenderer: React.FC<CurvedTextRendererProps> = ({
  zone,
  displayText,
  isSelected,
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const pathId = `curved-text-path-${zone.id}-${uniqueId}`;

  const isCurved = Boolean(zone.curvedText && zone.curveAngle && Math.abs(zone.curveAngle) > 2);
  const angle = zone.curveAngle || 0;

  // If text is not curved, render standard styled HTML text block
  if (!isCurved) {
    const isGold = zone.textGradient === "gold";
    const isTricolor = zone.textGradient === "tricolor";

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent:
            zone.alignment === "left"
              ? "flex-start"
              : zone.alignment === "right"
              ? "flex-end"
              : "center",
          textAlign: zone.alignment || "center",
          fontFamily: zone.fontFamily || "Poppins, sans-serif",
          fontSize: `${zone.fontSize || 14}px`,
          fontWeight: zone.fontWeight || "700",
          color: isGold || isTricolor ? "transparent" : zone.color || "#FFFFFF",
          backgroundImage: isGold
            ? "linear-gradient(135deg, #FFE259 0%, #FFA751 100%)"
            : isTricolor
            ? "linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)"
            : undefined,
          WebkitBackgroundClip: isGold || isTricolor ? "text" : undefined,
          backgroundClip: isGold || isTricolor ? "text" : undefined,
          textShadow: zone.textShadow
            ? "0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.8)"
            : undefined,
          WebkitTextStroke:
            zone.textStrokeWidth && zone.textStrokeColor
              ? `${zone.textStrokeWidth}px ${zone.textStrokeColor}`
              : undefined,
          letterSpacing: zone.letterSpacing ? `${zone.letterSpacing}px` : undefined,
          lineHeight: 1.25,
          wordBreak: zone.wrapText ? "break-word" : "normal",
          whiteSpace: zone.wrapText ? "normal" : "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: "2px 4px",
          boxSizing: "border-box",
        }}
      >
        {displayText}
      </div>
    );
  }

  // Curved SVG Text Path Rendering
  // Viewport 1000 x 300 virtual coordinate space
  const svgW = 1000;
  const svgH = 300;
  const startY = 150;
  // Calculate curve peak/dip offset based on curveAngle (-180 to +180)
  // Positive curves downwards (convex arc like rainbow); Negative curves upwards (concave)
  const curveDip = (angle / 180) * 120;
  const peakY = startY + curveDip;

  const pathD = `M 40,${startY} Q 500,${peakY} 960,${startY}`;

  const textAnchor =
    zone.alignment === "left"
      ? "start"
      : zone.alignment === "right"
      ? "end"
      : "middle";

  const startOffset =
    zone.alignment === "left"
      ? "5%"
      : zone.alignment === "right"
      ? "95%"
      : "50%";

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <defs>
        <path id={pathId} d={pathD} fill="none" stroke="none" />
        {zone.textGradient === "gold" && (
          <linearGradient id={`gold-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE259" />
            <stop offset="50%" stopColor="#FFF1B0" />
            <stop offset="100%" stopColor="#FFA751" />
          </linearGradient>
        )}
        {zone.textGradient === "tricolor" && (
          <linearGradient id={`tri-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        )}
        {zone.textShadow && (
          <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        )}
      </defs>

      {/* Guide arc line visible only when zone is actively selected */}
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#7956C9"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.4"
        />
      )}

      <text
        fill={
          zone.textGradient === "gold"
            ? `url(#gold-grad-${uniqueId})`
            : zone.textGradient === "tricolor"
            ? `url(#tri-grad-${uniqueId})`
            : zone.color || "#FFFFFF"
        }
        stroke={zone.textStrokeColor || undefined}
        strokeWidth={zone.textStrokeWidth ? zone.textStrokeWidth * 1.5 : undefined}
        fontFamily={zone.fontFamily || "Poppins, sans-serif"}
        fontSize={Math.max(28, (zone.fontSize || 14) * 2.8)}
        fontWeight={zone.fontWeight || "700"}
        letterSpacing={zone.letterSpacing || 1}
        filter={zone.textShadow ? `url(#shadow-${uniqueId})` : undefined}
      >
        <textPath href={`#${pathId}`} startOffset={startOffset} textAnchor={textAnchor}>
          {displayText}
        </textPath>
      </text>
    </svg>
  );
};
