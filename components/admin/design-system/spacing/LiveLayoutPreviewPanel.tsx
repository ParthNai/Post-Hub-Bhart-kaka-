"use client";

import React, { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Search, Bell, User, LayoutGrid, Clock, Maximize2, Star, ChevronDown } from "lucide-react";
import Image from "next/image";
import { BorderRadiusTokens, ComponentSpacingTokens } from "@/lib/spacing-tokens";

interface LiveLayoutPreviewPanelProps {
  componentSpacing: ComponentSpacingTokens;
  radii: BorderRadiusTokens;
}

export const LiveLayoutPreviewPanel: React.FC<LiveLayoutPreviewPanelProps> = ({
  componentSpacing,
  radii,
}) => {
  const [activeNav, setActiveNav] = useState("Home");

  // Determine current active corner radius in px
  const activeRadiusVal = radii[radii.activeKey];
  const radiusPx = `${activeRadiusVal}px`;

  // Spacing variables
  const btnPadX = `${componentSpacing.buttonPaddingX}px`;
  const btnPadY = `${componentSpacing.buttonPaddingY}px`;
  const inputPadX = `${componentSpacing.inputPaddingX}px`;
  const inputPadY = `${componentSpacing.inputPaddingY}px`;
  const cardPad = `${componentSpacing.cardPadding}px`;
  const cardGap = `${componentSpacing.cardGap}px`;
  const formGap = `${componentSpacing.formFieldGap}px`;
  const sectionGap = `${componentSpacing.sectionGap}px`;

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "20px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
      }}
    >
      {/* Panel Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Live layout preview
        </h3>

        {/* 24px Spacing indicator top right */}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "monospace",
            color: "var(--primary, #7956C9)",
            backgroundColor: "var(--secondary, #E8DFF5)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {sectionGap}
        </span>
      </div>

      {/* Mock Application Container */}
      <div
        style={{
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mock Topbar Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <BrandLogo size="xs" />

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "12.5px" }}>
            {["Home", "Templates", "Gallery"].map((link) => {
              const isActive = activeNav === link;
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => setActiveNav(link)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2px solid var(--primary, #7956C9)" : "2px solid transparent",
                    padding: "4px 2px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {link}
                </button>
              );
            })}
          </div>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted, #777184)" }}>
            <Search size={14} />
            <Bell size={14} />
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary, #E8DFF5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary, #7956C9)",
              }}
            >
              <User size={12} />
            </div>
          </div>
        </div>

        {/* Mock Canvas Body */}
        <div
          style={{
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: formGap,
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Hero Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--primary, #7956C9)",
              }}
            >
              Create stunning posters
            </span>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--text, #24213A)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              Design beautiful posters for every occasion
            </h4>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted, #777184)",
                lineHeight: 1.45,
              }}
            >
              Choose from thousands of templates and create professional designs in just a few clicks.
            </p>
          </div>

          {/* Search & Select Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
            {/* Search Input */}
            <div style={{ position: "relative", flex: 1.2 }}>
              <Search
                size={13}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search templates..."
                readOnly
                style={{
                  width: "100%",
                  paddingTop: inputPadY,
                  paddingBottom: inputPadY,
                  paddingLeft: "32px",
                  paddingRight: inputPadX,
                  fontSize: "12px",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: radiusPx,
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                  color: "var(--text, #24213A)",
                  transition: "all 0.15s ease",
                }}
              />
            </div>

            {/* Select Dropdown */}
            <div style={{ position: "relative", flex: 0.8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: inputPadY,
                  paddingBottom: inputPadY,
                  paddingLeft: inputPadX,
                  paddingRight: inputPadX,
                  fontSize: "12px",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: radiusPx,
                  backgroundColor: "#FFFFFF",
                  color: "var(--text, #24213A)",
                  transition: "all 0.15s ease",
                }}
              >
                <span>Select category</span>
                <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
              </div>
            </div>

            {/* 16px indicator badge */}
            <span
              style={{
                position: "absolute",
                right: "-28px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "var(--primary, #7956C9)",
              }}
            >
              {formGap}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
            <button
              type="button"
              style={{
                paddingTop: btnPadY,
                paddingBottom: btnPadY,
                paddingLeft: btnPadX,
                paddingRight: btnPadX,
                fontSize: "12.5px",
                fontWeight: 600,
                backgroundColor: "var(--primary, #7956C9)",
                color: "#FFFFFF",
                borderRadius: radiusPx,
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Create poster
            </button>

            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                paddingTop: btnPadY,
                paddingBottom: btnPadY,
                paddingLeft: btnPadX,
                paddingRight: btnPadX,
                fontSize: "12.5px",
                fontWeight: 600,
                backgroundColor: "#FFFFFF",
                color: "var(--primary, #7956C9)",
                borderRadius: radiusPx,
                border: "1px solid var(--border, #EAE4EE)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <LayoutGrid size={13} />
              <span>Explore templates</span>
            </button>

            <span
              style={{
                position: "absolute",
                right: "-28px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "var(--primary, #7956C9)",
              }}
            >
              {sectionGap}
            </span>
          </div>

          {/* Diwali Poster Content Card */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: cardGap,
              padding: cardPad,
              borderRadius: radiusPx,
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              transition: "all 0.15s ease",
              position: "relative",
            }}
          >
            {/* Thumbnail Image */}
            <div
              style={{
                width: "96px",
                height: "124px",
                borderRadius: radiusPx,
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                backgroundColor: "var(--secondary, #E8DFF5)",
              }}
            >
              <Image
                src="/assets/mountain_poster.jpg"
                alt="Diwali Celebration Poster"
                fill
                sizes="96px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      backgroundColor: "var(--secondary, #E8DFF5)",
                      color: "var(--primary, #7956C9)",
                      fontSize: "10.5px",
                      fontWeight: 600,
                    }}
                  >
                    <Star size={9} fill="currentColor" />
                    <span>Festival</span>
                  </span>
                </div>

                <h5
                  style={{
                    fontSize: "14.5px",
                    fontWeight: 700,
                    color: "var(--text, #24213A)",
                    lineHeight: 1.25,
                  }}
                >
                  Diwali Celebration Poster
                </h5>

                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted, #777184)",
                    lineHeight: 1.4,
                  }}
                >
                  Bright and festive design for your Diwali celebrations with elegant visuals and warm tones.
                </p>
              </div>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "10.5px",
                  color: "var(--text-muted, #777184)",
                  marginTop: "6px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <Maximize2 size={11} />
                  <span>1080 × 1350</span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <Clock size={11} />
                  <span>2 min ago</span>
                </span>
              </div>
            </div>

            <span
              style={{
                position: "absolute",
                right: "-28px",
                bottom: "10px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "var(--primary, #7956C9)",
              }}
            >
              {cardPad}
            </span>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          color: "var(--text-muted, #777184)",
        }}
      >
        <span>ⓘ Preview reflects current draft settings.</span>
      </div>
    </div>
  );
};

