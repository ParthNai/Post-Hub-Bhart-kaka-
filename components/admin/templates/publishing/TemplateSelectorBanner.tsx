"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Layers } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface TemplateSelectorBannerProps {
  currentTemplate: PosterTemplate;
  allTemplates: PosterTemplate[];
  onSelectTemplate: (template: PosterTemplate) => void;
}

export const TemplateSelectorBanner: React.FC<TemplateSelectorBannerProps> = ({
  currentTemplate,
  allTemplates,
  onSelectTemplate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPublished = currentTemplate.status === "Published";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
      }}
    >
      {/* Left: Template Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
        {/* Template Thumbnail Icon */}
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "8px",
            backgroundColor: "var(--secondary, #E8DFF5)",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Layers size={22} />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: 0,
              }}
            >
              {currentTemplate.name}
            </h2>

            {/* Template ID Badge */}
            <span
              style={{
                fontSize: "11.5px",
                fontFamily: "monospace",
                color: "var(--text-muted, #777184)",
                backgroundColor: "#F3F4F6",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {currentTemplate.id}
            </span>

            {/* Category Badge */}
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: 500,
                color: "#6D28D9",
                backgroundColor: "#EDE9FE",
                padding: "2px 8px",
                borderRadius: "10px",
              }}
            >
              {currentTemplate.category}
            </span>

            {/* Status Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11.5px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "10px",
                backgroundColor: isPublished ? "#ECFDF5" : "#FEF3C7",
                color: isPublished ? "#059669" : "#D97706",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: isPublished ? "#10B981" : "#F59E0B",
                }}
              />
              {currentTemplate.status}
            </span>
          </div>

          <div
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted, #777184)",
              marginTop: "2px",
            }}
          >
            Format: {currentTemplate.format || "3:4"} • Last updated {currentTemplate.updatedAt}
          </div>
        </div>
      </div>

      {/* Right: Switch Template Selector */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FAF7F2",
            border: "1px solid var(--border, #EAE4EE)",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text, #24213A)",
            cursor: "pointer",
          }}
        >
          <span>Select Template: <strong>{currentTemplate.id}</strong></span>
          <ChevronDown size={14} style={{ color: "var(--text-muted, #777184)" }} />
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: "280px",
              maxHeight: "320px",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(36, 33, 58, 0.12)",
              zIndex: 50,
              padding: "4px",
            }}
          >
            {allTemplates.map((tpl) => {
              const isSelected = tpl.id === currentTemplate.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isSelected ? "var(--secondary, #E8DFF5)" : "transparent",
                    color: isSelected ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                  }}
                  className="hover:bg-slate-50"
                >
                  <div style={{ minWidth: 0, paddingRight: "8px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tpl.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted, #777184)" }}>
                      {tpl.id} • {tpl.category}
                    </div>
                  </div>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
