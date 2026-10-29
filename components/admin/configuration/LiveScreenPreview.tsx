"use client";

import React from "react";
import { Smartphone, Search, Menu, Image as ImageIcon, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AppScreen } from "@/lib/screens";
import { GeneralFormData } from "./GeneralSection";

interface LiveScreenPreviewProps {
  generalData: GeneralFormData;
  configData: AppScreen["configData"];
}

export const LiveScreenPreview: React.FC<LiveScreenPreviewProps> = ({
  generalData,
  configData,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "20px 22px 18px 22px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          <Smartphone size={16} />
        </div>
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 2px 0",
              letterSpacing: "-0.015em",
            }}
          >
            Screen Preview
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            Live preview of how this screen appears in the app.
          </p>
        </div>
      </div>

      {/* Mock Mobile Screen Frame */}
      <div
        style={{
          border: "1px solid #ECE7F0",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          padding: "16px 14px 18px 14px",
          boxShadow: "0 4px 16px rgba(36, 33, 58, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          overflow: "hidden",
        }}
        className="live-preview-canvas"
      >
        {/* App Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "8px",
            borderBottom: "1px solid #FAF7FD",
          }}
        >
          <BrandLogo size="sm" />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text)" }}>
            <Search size={16} />
            <Menu size={16} />
          </div>
        </div>

        {/* App Search Bar */}
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-light)",
            }}
          />
          <div
            style={{
              width: "100%",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "#FAF9FC",
              border: "1px solid #EAE4EE",
              paddingLeft: "30px",
              fontSize: "11.5px",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            Search templates, festivals, designs...
          </div>
        </div>

        {/* Category Pills Row */}
        {configData.tagsFilterEnabled !== false && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflowX: "auto",
              paddingBottom: "2px",
            }}
          >
            {["All", "Business", "Festival", "Social Media", "Event"].map((cat, i) => (
              <span
                key={cat}
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  backgroundColor: i === 0 ? "var(--primary)" : "#FAF9FC",
                  color: i === 0 ? "#FFFFFF" : "var(--text-muted)",
                  border: i === 0 ? "none" : "1px solid #EAE4EE",
                  fontSize: "11px",
                  fontWeight: i === 0 ? 600 : 500,
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Featured Section */}
        <div>
          {/* Section Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text)" }}>
              {generalData.name === "Home" ? "Featured Templates" : generalData.name}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--primary)",
                cursor: "pointer",
              }}
            >
              View all
            </span>
          </div>

          {/* 3 Template Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${configData.gridColumns || 3}, minmax(0, 1fr))`,
              gap: "8px",
            }}
          >
            {[
              { title: "Business Poster", tag: "Popular", color: "#E8DFF5" },
              { title: "Festival Design", tag: "Trending", color: "#DCD0F0" },
              { title: "Social Media", tag: "New", color: "#E8DFF5" },
            ]
              .slice(0, configData.gridColumns || 3)
              .map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECE7F0",
                    borderRadius: configData.cardRadius || "8px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Card Thumbnail */}
                  <div
                    style={{
                      height: "56px",
                      backgroundColor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      opacity: 0.85,
                    }}
                  >
                    <ImageIcon size={18} strokeWidth={1.8} />
                  </div>

                  {/* Card Meta */}
                  <div style={{ padding: "6px 8px" }}>
                    <div
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: "9.5px", color: "var(--text-light)", marginTop: "1px" }}>
                      {item.tag}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            type="button"
            style={{
              width: "100%",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.2)",
            }}
          >
            <span>Explore All Templates</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
