"use client";

import React from "react";
import { AppScreen } from "@/lib/screens";

interface MiniaturePreviewProps {
  screen: AppScreen;
}

export const MiniaturePreview: React.FC<MiniaturePreviewProps> = ({ screen }) => {
  const { key } = screen;

  return (
    <div
      style={{
        width: "100%",
        height: "148px",
        backgroundColor: "#FAF9FC",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        userSelect: "none",
      }}
      className="miniature-preview-box"
    >
      {/* Mock Left Sidebar */}
      <div
        style={{
          width: "28px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EFEAF2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px 0",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {/* Mini logo dot */}
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            marginBottom: "4px",
          }}
        />
        {/* Navigation line dots */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "2.5px",
              borderRadius: "2px",
              backgroundColor: i === (key === "home" ? 1 : key === "templates" ? 2 : key === "ai-generator" ? 3 : key === "festivals" ? 4 : key === "my-creations" ? 5 : 6)
                ? "var(--primary)"
                : "#EAE4EE",
            }}
          />
        ))}
      </div>

      {/* Mock Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "8px 10px",
          overflow: "hidden",
        }}
      >
        {/* Mock Top Navbar */}
        <div
          style={{
            height: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "4px",
              backgroundColor: "#E4DEEC",
              borderRadius: "2px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                width: "24px",
                height: "5px",
                backgroundColor: "#EFEAF2",
                borderRadius: "3px",
              }}
            />
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#D8D0E3",
              }}
            />
          </div>
        </div>

        {/* Dynamic Wireframe Mockup Based on Screen Type */}
        {key === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            {/* Hero Landscape Banner */}
            <div
              style={{
                height: "60px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #E6DCF5 0%, #CBBCE4 100%)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <svg
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              >
                <polygon
                  points="20,60 70,25 110,60"
                  fill="#B9A4D8"
                  opacity="0.6"
                />
                <polygon
                  points="80,60 140,15 190,60"
                  fill="#9D85C4"
                  opacity="0.8"
                />
                <polygon
                  points="0,60 40,35 90,60"
                  fill="#A894CE"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* 3 Template Card Thumbnails */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    height: "36px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECE7F0",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "10px",
                      borderRadius: "2px",
                      border: "1px solid #C4B5DA",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {key === "templates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            {/* Top row with + banner tile */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "5px" }}>
              <div
                style={{
                  height: "44px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  borderRadius: "5px",
                }}
              />
              <div
                style={{
                  height: "44px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  borderRadius: "5px",
                }}
              />
              {/* Highlight purple + tile */}
              <div
                style={{
                  height: "44px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                +
              </div>
            </div>

            {/* Bottom template grid row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    height: "42px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECE7F0",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {key === "ai-generator" && (
          <div style={{ display: "flex", gap: "8px", flex: 1 }}>
            {/* Center Canvas area */}
            <div
              style={{
                flex: 1.6,
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECE7F0",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "6px",
              }}
            >
              {/* Picture placeholder icon */}
              <div
                style={{
                  width: "22px",
                  height: "18px",
                  border: "1.5px solid #A895C9",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#A895C9",
                  }}
                />
              </div>

              {/* Purple Generate pill */}
              <div
                style={{
                  width: "55px",
                  height: "10px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "5px",
                }}
              />
            </div>

            {/* Right parameter panel wireframe */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                justifyContent: "center",
              }}
            >
              <div style={{ height: "4px", width: "80%", backgroundColor: "#E4DEEC", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "100%", backgroundColor: "#ECE7F0", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "60%", backgroundColor: "#E4DEEC", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "90%", backgroundColor: "#ECE7F0", borderRadius: "2px" }} />
            </div>
          </div>
        )}

        {key === "festivals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            {/* Festival banner with fireworks */}
            <div
              style={{
                height: "56px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #E6DCF5 0%, #CBBCE4 100%)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                paddingLeft: "14px",
              }}
            >
              {/* Fireworks burst SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
                <line x1="12" y1="2" x2="12" y2="7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12" y2="22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="12" x2="7" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="12" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="5" x2="8.5" y2="8.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="15.5" y1="15.5" x2="19" y2="19" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="5" y1="19" x2="8.5" y2="15.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="15.5" y1="8.5" x2="19" y2="5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Festival poster thumbnails */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    height: "38px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECE7F0",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "10px",
                      borderRadius: "2px",
                      border: "1px solid #C4B5DA",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {key === "my-creations" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "5px",
              flex: 1,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #ECE7F0",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "10px",
                    border: "1px solid #C4B5DA",
                    borderRadius: "2px",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {key === "profile-settings" && (
          <div style={{ display: "flex", gap: "10px", flex: 1, alignItems: "center" }}>
            {/* Center profile avatar mockup */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#E6DCF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Settings rows mockup */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <div style={{ height: "5px", width: "70%", backgroundColor: "#E4DEEC", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "100%", backgroundColor: "#ECE7F0", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "85%", backgroundColor: "#ECE7F0", borderRadius: "2px" }} />
              <div style={{ height: "4px", width: "60%", backgroundColor: "#ECE7F0", borderRadius: "2px" }} />
            </div>
          </div>
        )}

        {/* Fallback layout for any custom screen */}
        {!["home", "templates", "ai-generator", "festivals", "my-creations", "profile-settings"].includes(key) && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: "36px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECE7F0",
                borderRadius: "6px",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
              <div style={{ height: "30px", backgroundColor: "#FFFFFF", borderRadius: "4px", border: "1px solid #ECE7F0" }} />
              <div style={{ height: "30px", backgroundColor: "#FFFFFF", borderRadius: "4px", border: "1px solid #ECE7F0" }} />
              <div style={{ height: "30px", backgroundColor: "#FFFFFF", borderRadius: "4px", border: "1px solid #ECE7F0" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
