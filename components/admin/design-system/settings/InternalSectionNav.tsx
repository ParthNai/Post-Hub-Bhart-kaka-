"use client";

import React from "react";
import { Settings, Tag, ShieldCheck, Link2, Lock } from "lucide-react";

export type SettingsSectionKey = "general" | "naming" | "validation" | "schema" | "protection";

interface InternalSectionNavProps {
  activeSection: SettingsSectionKey;
  onSelectSection: (section: SettingsSectionKey) => void;
}

export const InternalSectionNav: React.FC<InternalSectionNavProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const sections: { key: SettingsSectionKey; label: string; icon: React.ReactNode }[] = [
    { key: "general", label: "General", icon: <Settings size={15} /> },
    { key: "naming", label: "Token Naming", icon: <Tag size={15} /> },
    { key: "validation", label: "Validation Rules", icon: <ShieldCheck size={15} /> },
    { key: "schema", label: "Schema & Compatibility", icon: <Link2 size={15} /> },
    { key: "protection", label: "Change Protection", icon: <Lock size={15} /> },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        position: "sticky",
        top: "24px",
      }}
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.key;
        return (
          <button
            key={sec.key}
            type="button"
            onClick={() => onSelectSection(sec.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isActive ? "#EFEAF7" : "transparent",
              color: isActive ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
              fontWeight: isActive ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
              width: "100%",
            }}
          >
            <span style={{ color: isActive ? "var(--primary, #7956C9)" : "#777184" }}>
              {sec.icon}
            </span>
            <span>{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
};

