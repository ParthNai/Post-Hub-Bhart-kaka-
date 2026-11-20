"use client";

import React from "react";
import { Settings, ChevronDown } from "lucide-react";
import type { CategoryDisplaySettings } from "@/lib/festival-categories";

interface CategoryDisplaySettingsCardProps {
  settings: CategoryDisplaySettings;
  onUpdateSettings: (settings: Partial<CategoryDisplaySettings>) => void;
}

export const CategoryDisplaySettingsCard: React.FC<CategoryDisplaySettingsCardProps> = ({
  settings,
  onUpdateSettings,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Settings size={16} color="#7956C9" />
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Category Display Settings
        </h2>
      </div>

      {/* 3 Columns Grid matching reference layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {/* Column 1: Category Visibility + Display Order */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category Visibility Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              Category Visibility:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ categoryVisibility: !settings.categoryVisibility })
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: settings.categoryVisibility ? "#7956C9" : "#EAE4EE",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: settings.categoryVisibility ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
              <span style={{ fontSize: "12px", color: "#777184", minWidth: "40px" }}>
                {settings.categoryVisibility ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          {/* Display Order Dropdown */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              Display Order:
            </span>
            <div style={{ position: "relative", minWidth: "130px" }}>
              <select
                value={settings.displayOrder}
                onChange={(e) =>
                  onUpdateSettings({
                    displayOrder: e.target.value as CategoryDisplaySettings["displayOrder"],
                  })
                }
                style={{
                  width: "100%",
                  appearance: "none",
                  padding: "5px 24px 5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #EAE4EE",
                  fontSize: "12px",
                  color: "#24213A",
                  backgroundColor: "#FAF7F2",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="By Priority">By Priority</option>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Event Count">Event Count</option>
                <option value="Recently Updated">Recently Updated</option>
              </select>
              <ChevronDown
                size={12}
                color="#777184"
                style={{ position: "absolute", right: "8px", top: "9px", pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Featured Category + App Display */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Featured Category Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              Featured Category:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ featuredCategory: !settings.featuredCategory })
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: settings.featuredCategory ? "#7956C9" : "#EAE4EE",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: settings.featuredCategory ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
              <span style={{ fontSize: "12px", color: "#777184", minWidth: "26px" }}>
                {settings.featuredCategory ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* App Display Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              App Display:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onUpdateSettings({ appDisplay: !settings.appDisplay })}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: settings.appDisplay ? "#10B981" : "#EAE4EE",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: settings.appDisplay ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
              <span style={{ fontSize: "12px", color: "#777184", minWidth: "26px" }}>
                {settings.appDisplay ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Column 3: Website Display + Language Availability */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Website Display Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              Website Display:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ websiteDisplay: !settings.websiteDisplay })
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: settings.websiteDisplay ? "#7956C9" : "#EAE4EE",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: settings.websiteDisplay ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
              <span style={{ fontSize: "12px", color: "#777184", minWidth: "26px" }}>
                {settings.websiteDisplay ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Language Availability Dropdown */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "#24213A", fontWeight: 500 }}>
              Language Availability:
            </span>
            <div style={{ position: "relative", minWidth: "130px" }}>
              <select
                value={settings.languageAvailability}
                onChange={(e) =>
                  onUpdateSettings({
                    languageAvailability: e.target
                      .value as CategoryDisplaySettings["languageAvailability"],
                  })
                }
                style={{
                  width: "100%",
                  appearance: "none",
                  padding: "5px 24px 5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #EAE4EE",
                  fontSize: "12px",
                  color: "#24213A",
                  backgroundColor: "#FAF7F2",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="All Languages">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
              <ChevronDown
                size={12}
                color="#777184"
                style={{ position: "absolute", right: "8px", top: "9px", pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
