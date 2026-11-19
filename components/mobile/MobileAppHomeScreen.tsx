"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Sparkles,
  FileText,
  Plus,
  Home,
  User as UserIcon,
  ExternalLink,
} from "lucide-react";
import { AppUser } from "@/lib/app-auth";
import { PosterTemplate } from "@/lib/templates";
import { PosterArtwork } from "@/components/admin/templates/PosterArtwork";

interface MobileAppHomeScreenProps {
  user: AppUser;
  templates: PosterTemplate[];
  config?: Record<string, any>;
  onSignOut: () => void;
}

export const MobileAppHomeScreen: React.FC<MobileAppHomeScreenProps> = ({
  user,
  templates,
  config,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<"home" | "templates" | "ai" | "profile">("home");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const bannerVisible = config?.bannerVisible ?? true;
  const bannerHeadline = config?.bannerHeadline || "What will you design today?";
  const bannerSubtitle = config?.bannerSubtitle || "Choose a format below or start from 50,000+ templates.";
  const bannerBadge = config?.bannerBadge || "POST HUB CANVAS STUDIO";
  const primaryAccent = config?.primaryAccent || "#7956C9";
  const gridColumns = config?.gridColumns || 2;

  const categories = ["All", "Festival", "Business", "Promotion"];

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory !== "All" && tpl.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
      }}
    >
      <div
        className="mobile-home-container"
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#FAF7F2",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 24px rgba(36, 33, 58, 0.05)",
          position: "relative",
        }}
      >
        {/* Top Mobile Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #ECE7F0",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#24213A", lineHeight: 1.2 }}>
                {user.name}
              </div>
              <div style={{ fontSize: "11px", color: "#7956C9", fontWeight: 600 }}>
                {user.plan} Member · Studio
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/admin/dashboard"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#543399",
                backgroundColor: "#F4F0FB",
                border: "1px solid #E3D9F8",
                padding: "4px 8px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              <span>Admin</span>
              <ExternalLink size={11} />
            </Link>

            <button
              type="button"
              title="Sign Out to Login Page"
              onClick={onSignOut}
              style={{
                height: "32px",
                padding: "0 10px",
                borderRadius: "6px",
                backgroundColor: "#FDF2F2",
                border: "1px solid #F8D7DA",
                color: "#D9383A",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Scrollable Mobile Body */}
        <div style={{ flex: 1, padding: "16px 18px 80px 18px", overflowY: "auto" }}>
          {/* Banner: What will you design? */}
          {bannerVisible && (
            <div
              style={{
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${primaryAccent} 0%, #9B51E0 50%, #00C4CC 100%)`,
                color: "#FFFFFF",
                padding: "18px 20px",
                marginBottom: "18px",
                boxShadow: `0 8px 20px ${primaryAccent}33`,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginBottom: "6px",
                }}
              >
                {bannerBadge}
              </span>
              <div style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.2, marginBottom: "4px" }}>
                {bannerHeadline}
              </div>
              <p style={{ fontSize: "12px", opacity: 0.9, margin: 0 }}>
                {bannerSubtitle}
              </p>

              {/* Quick Format Pills */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginTop: "14px", paddingBottom: "2px" }}>
                {[
                  { label: "📸 Square", sub: "1:1" },
                  { label: "📜 Poster", sub: "3:4" },
                  { label: "🎆 Festival", sub: "Promo" },
                  { label: "✨ AI Studio", sub: "Magic" },
                ].map((f) => (
                  <div
                    key={f.label}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.18)",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    {f.label} <span style={{ opacity: 0.75, fontSize: "10px" }}>({f.sub})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Rail */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border: selectedCategory === cat ? "1.5px solid #7956C9" : "1px solid #ECE7F0",
                  backgroundColor: selectedCategory === cat ? "#F4F0FB" : "#FFFFFF",
                  color: selectedCategory === cat ? "#7956C9" : "#6E687A",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#24213A" }}>Trending Posters</span>
              <span style={{ fontSize: "12px", color: "#7956C9", fontWeight: 600 }}>See All ({filteredTemplates.length})</span>
            </div>

            {filteredTemplates.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #ECE7F0",
                  boxShadow: "0 2px 8px rgba(36, 33, 58, 0.04)",
                }}
              >
                <div style={{ height: "260px", width: "100%", position: "relative" }}>
                  <PosterArtwork template={tpl} />
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#24213A" }}>{tpl.name}</div>
                    <div style={{ fontSize: "11px", color: "#8E8899" }}>
                      {tpl.category} · {tpl.format}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      backgroundColor: "#F4F0FB",
                      color: "#7956C9",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Native Mobile Bottom Navigation Bar */}
        <div
          style={{
            height: "58px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #ECE7F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            position: "sticky",
            bottom: 0,
            zIndex: 25,
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: activeTab === "home" ? "#7956C9" : "#8E8899",
              cursor: "pointer",
              fontSize: "10.5px",
              fontWeight: 600,
            }}
          >
            <Home size={19} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: activeTab === "templates" ? "#7956C9" : "#8E8899",
              cursor: "pointer",
              fontSize: "10.5px",
              fontWeight: 600,
            }}
          >
            <FileText size={19} />
            <span>Templates</span>
          </button>

          {/* Center Floating Create CTA Button */}
          <button
            type="button"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)",
              color: "#FFFFFF",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(121, 86, 201, 0.4)",
            }}
          >
            <Plus size={22} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: activeTab === "ai" ? "#7956C9" : "#8E8899",
              cursor: "pointer",
              fontSize: "10.5px",
              fontWeight: 600,
            }}
          >
            <Sparkles size={19} />
            <span>AI Studio</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              color: "#8E8899",
              cursor: "pointer",
              fontSize: "10.5px",
              fontWeight: 600,
            }}
          >
            <UserIcon size={19} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
