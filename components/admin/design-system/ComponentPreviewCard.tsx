"use client";

import React, { useState } from "react";
import type { ColorTokens, ComponentTokens } from "@/lib/design-system";
import { Plus, LayoutGrid, Edit2, Star, X, Clock, Maximize2 } from "lucide-react";
import Image from "next/image";

interface ComponentPreviewCardProps {
  colorTokens: ColorTokens;
  componentTokens: ComponentTokens;
}

export const ComponentPreviewCard: React.FC<ComponentPreviewCardProps> = ({
  colorTokens,
  componentTokens,
}) => {
  const [chipVisible, setChipVisible] = useState(true);
  const [inputValue, setInputValue] = useState("");

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: `1px solid ${colorTokens.border || "var(--border, #EAE4EE)"}`,
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: colorTokens.mainText || "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Component Preview
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Buttons Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              backgroundColor: colorTokens.primaryViolet,
              color: "#FFFFFF",
              borderRadius: componentTokens.borderRadius || "8px",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.1s ease, filter 0.15s ease",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.2)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Poster</span>
          </button>

          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              backgroundColor: "#FFFFFF",
              color: colorTokens.primaryViolet,
              borderRadius: componentTokens.borderRadius || "8px",
              border: `1px solid ${colorTokens.border || "#EAE4EE"}`,
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 0.15s ease",
            }}
          >
            <LayoutGrid size={15} strokeWidth={2.2} />
            <span>Explore Templates</span>
          </button>
        </div>

        {/* Input Row */}
        <div style={{ position: "relative" }}>
          <Edit2
            size={14}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: colorTokens.secondaryText || "#777184",
            }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a poster title"
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              fontSize: "13.5px",
              color: colorTokens.mainText || "#24213A",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${colorTokens.border || "#EAE4EE"}`,
              borderRadius: componentTokens.borderRadius || "8px",
              outline: "none",
              transition: "border-color 0.15s ease",
            }}
          />
        </div>

        {/* Filter Chip Row */}
        {chipVisible ? (
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "16px",
                backgroundColor: colorTokens.softLavender,
                color: colorTokens.primaryViolet,
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(121, 86, 201, 0.15)",
              }}
            >
              <Star size={11} fill="currentColor" />
              <span>Festival</span>
              <button
                type="button"
                onClick={() => setChipVisible(false)}
                aria-label="Remove filter"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: colorTokens.primaryViolet,
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setChipVisible(true)}
              style={{
                fontSize: "12px",
                color: colorTokens.primaryViolet,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 0",
              }}
            >
              + Reset filter chip
            </button>
          </div>
        )}

        {/* Sample Content Card */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "18px",
            padding: "14px",
            borderRadius: "12px",
            border: `1px solid ${colorTokens.border || "#EAE4EE"}`,
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Card Left Thumbnail */}
          <div
            style={{
              width: "115px",
              height: "148px",
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              position: "relative",
              backgroundColor: colorTokens.softLavender,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Image
              src="/assets/pagoda_poster.jpg"
              alt="Festival Pagoda Poster"
              fill
              sizes="115px"
              style={{
                objectFit: "cover",
              }}
            />
          </div>

          {/* Card Right Details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    backgroundColor: colorTokens.softLavender,
                    color: colorTokens.primaryViolet,
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  <Star size={10} fill="currentColor" />
                  <span>Festival</span>
                </span>
              </div>

              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: colorTokens.mainText || "#24213A",
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                }}
              >
                Create Beautiful Posters for Every Occasion
              </h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: colorTokens.secondaryText || "#777184",
                  lineHeight: 1.45,
                }}
              >
                Bring your ideas to life with Post Hub. Create stunning posters, social media designs and festival greetings in just a few clicks.
              </p>
            </div>

            {/* Metadata Bottom Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "11.5px",
                color: colorTokens.secondaryText || "#777184",
                marginTop: "8px",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Maximize2 size={12} />
                <span>1080 × 1350</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} />
                <span>2 min ago</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
