"use client";

import React, { useState } from "react";
import { RefreshCw, Search, Maximize2, Check, ChevronDown, BookOpen, Users } from "lucide-react";
import { PosterTemplate, FORMAT_DIMENSIONS_MAP } from "@/lib/templates";
import { PosterArtwork } from "../PosterArtwork";

interface PosterPreviewCanvasProps {
  draft: PosterTemplate;
  onRefresh: () => void;
}

export const PosterPreviewCanvas: React.FC<PosterPreviewCanvasProps> = ({ draft, onRefresh }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isFit, setIsFit] = useState<boolean>(true);

  const currentFormat = draft.format || "3:4";
  const dimensionsText = FORMAT_DIMENSIONS_MAP[currentFormat] || "1024 × 1365 px";

  // Check if this is the Education template (TPL-003 or Category Education)
  const isEducationTemplate =
    draft.id === "TPL-003" ||
    draft.category === "Education" ||
    (draft.headline && draft.headline.includes("ADMISSION"));

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        position: "sticky",
        top: "24px",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Poster Preview
        </h3>

        <button
          type="button"
          onClick={onRefresh}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "var(--primary, #7956C9)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Format Pill & Dimensions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "var(--secondary, #EDE9FE)",
              color: "var(--primary, #7956C9)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "6px",
            }}
          >
            {currentFormat}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              fontWeight: 500,
            }}
          >
            {dimensionsText}
          </span>
        </div>

        {/* Right: Zoom Dropdown & Fit Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Zoom Selector */}
          <div style={{ position: "relative" }}>
            <select
              value={zoom}
              onChange={(e) => {
                setZoom(Number(e.target.value));
                setIsFit(false);
              }}
              style={{
                height: "28px",
                paddingLeft: "24px",
                paddingRight: "22px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "var(--text, #24213A)",
                backgroundColor: "#ffffff",
                appearance: "none",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
            </select>
            <Search
              size={11}
              style={{
                position: "absolute",
                left: "7px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
            <ChevronDown
              size={11}
              style={{
                position: "absolute",
                right: "6px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Fit Button */}
          <button
            type="button"
            onClick={() => {
              setIsFit(!isFit);
              setZoom(100);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              height: "28px",
              padding: "0 8px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: isFit ? "var(--secondary, #F5F2F9)" : "#ffffff",
              color: isFit ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
              fontSize: "11.5px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Maximize2 size={12} />
            <span>Fit</span>
          </button>
        </div>
      </div>

      {/* Poster Stage Viewport */}
      <div
        style={{
          flex: 1,
          minHeight: "440px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
          borderRadius: "8px",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "16px",
          overflow: "auto",
        }}
      >
        {/* Poster Canvas Frame */}
        <div
          style={{
            width: "100%",
            maxWidth: isFit ? "360px" : `${(360 * zoom) / 100}px`,
            aspectRatio: currentFormat === "3:4" ? "3/4" : currentFormat === "4:5" ? "4/5" : "9/16",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.05)",
            border: "1px solid #E2E8F0",
            backgroundColor: "#ffffff",
            transition: "all 0.2s ease",
            transformOrigin: "center center",
          }}
        >
          {isEducationTemplate ? (
            /* High-fidelity reproduction of the Education Admission Poster matching the reference screenshot */
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                fontFamily: draft.fontSelection || "Poppins, sans-serif",
                boxSizing: "border-box",
              }}
            >
              {/* Background Geometric Light Yellow/Blue Ribbons */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                {/* Yellow diagonal glow */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="60,30 100,50 100,80 50,70" fill="#FEF3C7" opacity="0.8" />
                  <polygon points="50,45 100,75 100,85 45,78" fill="#FDE68A" opacity="0.6" />
                </svg>
              </div>

              {/* Top Header Bar */}
              <div
                style={{
                  padding: "14px 16px 0 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 3,
                }}
              >
                {/* Logo & Brand */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "4px",
                      backgroundColor: "#0284C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    <BookOpen size={13} />
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "#1E3A8A",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {draft.logoText || "YOUR LOGO"}
                  </span>
                </div>

                {/* Right Tagline */}
                <div
                  style={{
                    fontSize: "8px",
                    fontWeight: 600,
                    color: "#0369A1",
                    textAlign: "right",
                    lineHeight: "1.2",
                  }}
                >
                  Better Education
                  <br />
                  Brighter Future
                </div>
              </div>

              {/* Main Content Area */}
              <div
                style={{
                  padding: "10px 16px",
                  position: "relative",
                  zIndex: 3,
                }}
              >
                {/* Headline: ADMISSION OPEN */}
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    lineHeight: "1.05",
                    color: "#0F3A7A",
                    letterSpacing: "-0.01em",
                    margin: "0 0 4px 0",
                    textAlign: draft.alignment === "Left" ? "left" : draft.alignment === "Right" ? "right" : "left",
                  }}
                >
                  {draft.headline || "ADMISSION OPEN"}
                </h2>

                {/* Subheadline: Build Your Future */}
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0284C7",
                    marginBottom: "12px",
                    textAlign: draft.alignment === "Left" ? "left" : draft.alignment === "Right" ? "right" : "left",
                  }}
                >
                  {draft.subheadline || "Build Your Future"}
                </div>

                {/* Bullets List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    maxWidth: "60%",
                  }}
                >
                  {(draft.bulletPoints || ["Quality Education", "Expert Faculty", "Modern Campus"]).map((bp, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "9px",
                        fontWeight: 600,
                        color: "#1E293B",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: "#0284C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={9} strokeWidth={3} />
                      </div>
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Female Student Vector Graphic Illustration */}
              <div
                style={{
                  position: "absolute",
                  right: "-5px",
                  bottom: "45px",
                  width: "56%",
                  height: "62%",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 200 240" width="100%" height="100%" fill="none">
                  {/* Student Body silhouette */}
                  {/* Head */}
                  <circle cx="110" cy="50" r="26" fill="#FBBF24" opacity="0.2" />
                  {/* Hair */}
                  <path
                    d="M80 50 C80 20 140 20 140 50 C140 75 142 90 145 110 C140 115 130 95 130 80 C110 80 90 85 85 110 C80 95 80 70 80 50 Z"
                    fill="#332211"
                  />
                  {/* Face */}
                  <ellipse cx="112" cy="54" rx="18" ry="22" fill="#FDDCB5" />
                  {/* Eyes & Smile */}
                  <circle cx="106" cy="50" r="2.5" fill="#1e293b" />
                  <circle cx="118" cy="50" r="2.5" fill="#1e293b" />
                  <path d="M107 62 Q112 67 117 62" stroke="#dc2626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  {/* Neck */}
                  <rect x="108" y="74" width="8" height="12" fill="#FDDCB5" />
                  {/* T-Shirt Torso */}
                  <path d="M85 84 L139 84 L148 180 L76 180 Z" fill="#E2E8F0" />
                  <path d="M96 84 C96 92 128 92 128 84" fill="#FDDCB5" />
                  {/* Backpack straps */}
                  <path d="M92 84 L88 150" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
                  <path d="M132 84 L136 150" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
                  {/* Arms holding blue binders */}
                  <path d="M80 100 L95 155 L135 155 L145 110" fill="#FDDCB5" />
                  {/* Blue Folders / Notebooks */}
                  <rect x="95" y="115" width="40" height="52" rx="4" fill="#0284C7" transform="rotate(-6 95 115)" />
                  <rect x="92" y="118" width="40" height="50" rx="3" fill="#2563EB" transform="rotate(4 92 118)" />
                  <line x1="94" y1="125" x2="132" y2="128" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
                  <line x1="94" y1="135" x2="132" y2="138" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
                </svg>
              </div>

              {/* Bottom Curved Banner & Ribbon */}
              <div
                style={{
                  position: "relative",
                  zIndex: 4,
                  backgroundColor: "#0B2545",
                  borderTopLeftRadius: "28px",
                  padding: "12px 14px 10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* Left: Yellow CTA Pill + Subtext */}
                <div>
                  <div
                    style={{
                      backgroundColor: "#F59E0B",
                      color: "#0F172A",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: "999px",
                      display: "inline-block",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      marginBottom: "3px",
                    }}
                  >
                    {draft.ctaText || "Enroll Now"}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      fontWeight: 500,
                    }}
                  >
                    {draft.slogan || "For a Brighter Tomorrow"} &gt;
                  </div>
                </div>

                {/* Right: Kids logo + Shaping Future Leaders */}
                <div style={{ textAlign: "right", color: "#ffffff" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "4px",
                      marginBottom: "1px",
                    }}
                  >
                    <Users size={12} style={{ color: "#38BDF8" }} />
                  </div>
                  <div style={{ fontSize: "7px", color: "#CBD5E1", lineHeight: "1.1" }}>
                    Shaping
                    <br />
                    Future Leaders
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Other Templates Poster Artwork dynamically rendered */
            <div style={{ width: "100%", height: "100%" }}>
              <PosterArtwork template={draft} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
