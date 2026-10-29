"use client";

import React, { useState } from "react";
import { Plus, LayoutGrid, Edit2, Star, X, Clock, Maximize2 } from "lucide-react";
import Image from "next/image";

interface LiveComponentPreviewCardProps {
  primaryColor: string;
  lavenderColor: string;
  ivoryColor: string;
  mainTextColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

export const LiveComponentPreviewCard: React.FC<LiveComponentPreviewCardProps> = ({
  primaryColor,
  lavenderColor,
  mainTextColor,
  secondaryTextColor,
  borderColor,
}) => {
  const [chipVisible, setChipVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");
  const [inputValue, setInputValue] = useState("");

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
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
            color: mainTextColor,
            letterSpacing: "-0.01em",
          }}
        >
          Live Component Preview
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Buttons & Navigation Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                backgroundColor: primaryColor,
                color: "#FFFFFF",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.2)",
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Create Poster</span>
            </button>

            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#FFFFFF",
                color: primaryColor,
                borderRadius: "8px",
                border: `1px solid ${borderColor}`,
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <LayoutGrid size={14} />
              <span>Explore Templates</span>
            </button>
          </div>

          {/* Active Navigation Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "13px" }}>
            {["Home", "Templates", "Gallery", "Profile"].map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveNav(item)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? `2px solid ${primaryColor}` : "2px solid transparent",
                    padding: "4px 2px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? primaryColor : secondaryTextColor,
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input & Filter Pill Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Text Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Edit2
              size={14}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: secondaryTextColor,
              }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a poster title"
              style={{
                width: "100%",
                padding: "9px 14px 9px 38px",
                fontSize: "13px",
                color: mainTextColor,
                backgroundColor: "#FFFFFF",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          {/* Category Chip */}
          {chipVisible ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "16px",
                backgroundColor: lavenderColor,
                color: primaryColor,
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(121, 86, 201, 0.15)",
                whiteSpace: "nowrap",
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
                  color: primaryColor,
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setChipVisible(true)}
              style={{
                fontSize: "12px",
                color: primaryColor,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              + Reset filter
            </button>
          )}
        </div>

        {/* Sample Content Card */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "18px",
            padding: "14px",
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
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
              backgroundColor: lavenderColor,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Image
              src="/assets/pagoda_poster.jpg"
              alt="Festival Pagoda Poster"
              fill
              sizes="115px"
              style={{ objectFit: "cover" }}
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
                    backgroundColor: lavenderColor,
                    color: primaryColor,
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
                  color: mainTextColor,
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                }}
              >
                Create Beautiful Posters for Every Occasion
              </h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: secondaryTextColor,
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
                color: secondaryTextColor,
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
