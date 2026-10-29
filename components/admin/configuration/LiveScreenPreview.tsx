"use client";

import React from "react";
import { Smartphone, Search, Menu, Image as ImageIcon, ArrowRight, Mail, Lock, Eye } from "lucide-react";
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
  const isLoginScreen =
    generalData.route === "/login" ||
    generalData.name.toLowerCase().includes("login") ||
    (generalData as unknown as { key?: string }).key === "login";

  // Section helper
  const isSectionEnabled = (sectionId: string, fallback = true) => {
    if (!configData.sections) return fallback;
    const s = configData.sections.find((item) => item.id === sectionId);
    return s ? s.enabled : fallback;
  };

  const isDarkTheme = configData.activeTheme === "dark_studio";
  const previewBg =
    configData.backgroundColor ||
    (isDarkTheme
      ? "#13111C"
      : configData.activeTheme === "warm_creative"
      ? "#FFFDF9"
      : configData.activeTheme === "lavender_minimal"
      ? "#F8F7FF"
      : isLoginScreen
      ? "#FFFFFF"
      : "#FAF7F2");

  const previewTextColor = isDarkTheme ? "#F5F3FF" : "var(--text)";
  const previewMutedColor = isDarkTheme ? "#9E98B3" : "var(--text-muted)";
  const previewInputBg = isDarkTheme ? "#242135" : "#FAF9FC";
  const previewInputBorder = isDarkTheme ? "#35314C" : "#EAE4EE";
  const primaryAccent = configData.primaryAccent || (isDarkTheme ? "#906CE8" : "var(--primary)");
  const cardRadius = configData.cardRadius || "14px";
  const headerTitle = configData.headerTitle || "Welcome back";

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
            Live preview of how this screen appears in the mobile app.
          </p>
        </div>
      </div>

      {/* Mock Mobile Screen Frame */}
      <div
        style={{
          border: "1px solid #ECE7F0",
          borderRadius: "16px",
          backgroundColor: previewBg,
          padding: isLoginScreen ? "22px 18px" : "16px 14px 18px 14px",
          boxShadow: "0 4px 16px rgba(36, 33, 58, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: isLoginScreen ? "16px" : "12px",
          overflow: "hidden",
          minHeight: isLoginScreen ? "440px" : "auto",
          justifyContent: isLoginScreen ? "center" : "flex-start",
        }}
        className="live-preview-canvas"
      >
        {isLoginScreen ? (
          /* Live Mobile Login Preview */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              width: "100%",
            }}
          >
            {/* Brand Logo & Wordmark */}
            {isSectionEnabled("brand_header", true) && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    backgroundColor: primaryAccent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "16px",
                    boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
                  }}
                >
                  P
                </div>
                <div style={{ display: "inline-flex", alignItems: "baseline" }}>
                  <span style={{ color: previewTextColor, fontSize: "18px", fontWeight: 700, marginRight: "2px" }}>
                    Post
                  </span>
                  <span style={{ color: primaryAccent, fontSize: "18px", fontWeight: 800 }}>Hub</span>
                </div>
              </div>
            )}

            {/* Welcome Headline & Subtitle */}
            {isSectionEnabled("welcome_text", true) && (
              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: previewTextColor,
                    margin: "0 0 4px 0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {headerTitle}
                </h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: previewMutedColor,
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {generalData.description || "Sign in to access poster templates and creative tools."}
                </p>
              </div>
            )}

            {/* Form Fields */}
            {isSectionEnabled("credentials_form", true) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: previewTextColor,
                      marginBottom: "4px",
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: previewInputBg,
                      border: `1px solid ${previewInputBorder}`,
                      borderRadius: cardRadius,
                      height: "38px",
                      padding: "0 10px",
                    }}
                  >
                    <Mail size={14} color="var(--text-light)" />
                    <span style={{ fontSize: "12px", color: previewMutedColor }}>creator@posthub.io</span>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: previewTextColor,
                      marginBottom: "4px",
                    }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: previewInputBg,
                      border: `1px solid ${previewInputBorder}`,
                      borderRadius: cardRadius,
                      height: "38px",
                      padding: "0 10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Lock size={14} color="var(--text-light)" />
                      <span style={{ fontSize: "12px", color: previewMutedColor }}>••••••••••••</span>
                    </div>
                    <Eye size={14} color="var(--text-light)" />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 2px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        backgroundColor: primaryAccent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontSize: "9px",
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontSize: "11px", color: previewMutedColor }}>Remember me</span>
                  </div>

                  <span style={{ fontSize: "11px", fontWeight: 600, color: primaryAccent, cursor: "pointer" }}>
                    Forgot password?
                  </span>
                </div>

                {/* Sign In Button */}
                <button
                  type="button"
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: cardRadius,
                    backgroundColor: primaryAccent,
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 3px 8px rgba(121, 86, 201, 0.25)",
                    marginTop: "2px",
                  }}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Social SSO */}
            {isSectionEnabled("social_login", true) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-light)" }}>OR</span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
                </div>
                <div
                  style={{
                    height: "38px",
                    borderRadius: cardRadius,
                    backgroundColor: previewInputBg,
                    border: `1px solid ${previewInputBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: previewTextColor,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#EA4335" }}>G</span>
                  <span>Continue with Google</span>
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            {isSectionEnabled("signup_link", true) && (
              <div style={{ textAlign: "center", fontSize: "11.5px", color: previewMutedColor, marginTop: "4px" }}>
                <span>Don&apos;t have an account? </span>
                <span style={{ color: primaryAccent, fontWeight: 700, cursor: "pointer" }}>Sign Up</span>
              </div>
            )}
          </div>
        ) : (
          /* Standard App Screen Preview */
          <>
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
            <div style={{ position: "relative", width: "100%" }}>
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
                        borderRadius: cardRadius || "8px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
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
          </>
        )}
      </div>
    </div>
  );
};
