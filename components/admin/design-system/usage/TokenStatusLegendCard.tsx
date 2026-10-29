"use client";

import React from "react";

export const TokenStatusLegendCard: React.FC = () => {
  const legendItems = [
    {
      dotColor: "#12805C",
      title: "Indexed",
      description: "Token is referenced in the project",
    },
    {
      dotColor: "#777184",
      title: "No references found",
      description: "Token exists but has no references",
    },
    {
      dotColor: "#D97706",
      title: "Not scanned",
      description: "Token has not been scanned yet",
    },
    {
      dotColor: "#7956C9",
      title: "Usage data unavailable",
      description: "Source index or runtime data required",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "0 2px 12px -2px rgba(36, 33, 58, 0.02)",
      }}
    >
      <h4
        style={{
          fontSize: "13.5px",
          fontWeight: 700,
          color: "var(--text, #24213A)",
          margin: 0,
        }}
      >
        Token usage status legend
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {legendItems.map((item) => (
          <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: item.dotColor,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text, #24213A)",
                }}
              >
                {item.title}
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-muted, #777184)",
                paddingLeft: "13px",
                lineHeight: "1.35",
              }}
            >
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
