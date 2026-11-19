"use client";

import React from "react";
import { Smartphone, Search, Menu, Image as ImageIcon, ArrowRight, Mail, Sparkles, WandSparkles } from "lucide-react";
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
  const loginExperience = {
    brandName: "Post Hub",
    brandTagline: "Design  ·  Create  ·  Inspire",
    welcomeTitle: "Welcome Back!",
    welcomeSubtitle: "Sign in to continue creating amazing designs with Post Hub 💜",
    footerTagline: "Turn Your Ideas Into Stunning Designs ✨",
    heroImageUrl: "",
    googleEnabled: true,
    emailEnabled: true,
    mobileEnabled: true,
    signupEnabled: true,
    ...configData.loginExperience,
  };

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
          padding: isLoginScreen ? "14px 14px 16px" : "16px 14px 18px 14px",
          boxShadow: "0 4px 16px rgba(36, 33, 58, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: isLoginScreen ? "9px" : "12px",
          overflow: "hidden",
          minHeight: isLoginScreen ? "500px" : "auto",
          justifyContent: isLoginScreen ? "flex-start" : "flex-start",
        }}
        className="live-preview-canvas"
      >
        {isLoginScreen ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
          >
            {isSectionEnabled("brand_header", true) && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "8px",
                    backgroundColor: primaryAccent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "14px",
                  }}
                >
                  {loginExperience.brandName.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: previewTextColor, fontSize: "13px", fontWeight: 800 }}>
                    {loginExperience.brandName}
                  </div>
                  <div style={{ color: previewMutedColor, fontSize: "7px" }}>
                    {loginExperience.brandTagline}
                  </div>
                </div>
              </div>
            )}

            {isSectionEnabled("welcome_text", true) && (
              <>
                <div
                  style={{
                    width: "100%",
                    height: "135px",
                    position: "relative",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: `linear-gradient(145deg, ${primaryAccent}1A, #FFF1F8 52%, #E9E1FF)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loginExperience.heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={loginExperience.heroImageUrl}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          width: "72px",
                          height: "100px",
                          borderRadius: "17px",
                          padding: "6px",
                          background: "#211D43",
                          transform: "rotate(-9deg)",
                          boxShadow: "0 10px 24px rgba(47, 28, 102, .24)",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "12px",
                            background: `linear-gradient(155deg, #F9B8C5, ${primaryAccent} 48%, #F8C774)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                          }}
                        >
                          <Sparkles size={28} />
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          left: "18%",
                          top: "38%",
                          width: "28px",
                          height: "28px",
                          borderRadius: "9px",
                          background: "#FFFFFF",
                          color: primaryAccent,
                          display: "grid",
                          placeItems: "center",
                          boxShadow: "0 5px 12px rgba(47, 28, 102, .12)",
                        }}
                      >
                        <span style={{ fontWeight: 800 }}>T</span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: "17%",
                          top: "23%",
                          color: "#F2A72F",
                        }}
                      >
                        <WandSparkles size={22} />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: "17%",
                          bottom: "18%",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          color: primaryAccent,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Sparkles size={16} />
                      </div>
                    </>
                  )}
                </div>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h4
                    style={{
                      fontSize: "19px",
                      fontWeight: 800,
                      color: previewTextColor,
                      margin: "0 0 4px",
                    }}
                  >
                    {loginExperience.welcomeTitle}
                  </h4>
                  <p
                    style={{
                      fontSize: "10px",
                      color: previewMutedColor,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {loginExperience.welcomeSubtitle}
                  </p>
                </div>
              </>
            )}

            {isSectionEnabled("social_login", true) && loginExperience.googleEnabled && (
              <div
                style={{
                  width: "100%",
                  height: "36px",
                  borderRadius: "20px",
                  background: `linear-gradient(100deg, ${primaryAccent}, #5520C6)`,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "10px",
                  fontWeight: 700,
                  boxShadow: `0 5px 12px ${primaryAccent}35`,
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: 800 }}>G</span>
                <span>Continue with Google</span>
              </div>
            )}

            {isSectionEnabled("credentials_form", true) && loginExperience.emailEnabled && (
              <div
                style={{
                  width: "100%",
                  height: "36px",
                  borderRadius: "20px",
                  backgroundColor: previewInputBg,
                  border: `1px solid ${previewInputBorder}`,
                  color: previewTextColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                <Mail size={14} />
                <span>Continue with Email</span>
              </div>
            )}

            {isSectionEnabled("mobile_login", true) && loginExperience.mobileEnabled && (
              <div
                style={{
                  width: "100%",
                  height: "36px",
                  borderRadius: "20px",
                  backgroundColor: previewInputBg,
                  border: `1px solid ${previewInputBorder}`,
                  color: previewTextColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                <Smartphone size={14} />
                <span>Continue with Mobile</span>
              </div>
            )}

            {isSectionEnabled("signup_link", true) && loginExperience.signupEnabled && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginTop: "3px",
                  color: previewMutedColor,
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
                <span style={{ color: primaryAccent, fontWeight: 700, fontSize: "10px" }}>or</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
              </div>
            )}

            {isSectionEnabled("signup_link", true) && loginExperience.signupEnabled && (
              <div style={{ textAlign: "center", fontSize: "10px", color: previewMutedColor }}>
                <span>New here? </span>
                <span style={{ color: primaryAccent, fontWeight: 700 }}>Create an Account →</span>
              </div>
            )}

            {loginExperience.footerTagline && (
              <div
                style={{
                  width: "calc(100% + 28px)",
                  margin: "6px -14px -16px",
                  padding: "12px 18px",
                  textAlign: "center",
                  color: primaryAccent,
                  background: `linear-gradient(165deg, ${primaryAccent}1C, #F4E8FF)`,
                  fontSize: "10px",
                  fontWeight: 700,
                  fontStyle: "italic",
                }}
              >
                {loginExperience.footerTagline}
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
