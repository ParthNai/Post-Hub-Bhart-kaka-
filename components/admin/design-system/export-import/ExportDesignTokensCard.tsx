"use client";

import React from "react";
import {
  Droplet,
  Maximize2,
  Square,
  LayoutGrid,
  Layers,
  Info,
  Sliders,
  FileCode2,
  PlayCircle,
  Download,
  Eye,
  Check,
} from "lucide-react";
import type { ExportCategory } from "@/lib/export-import";

interface ExportDesignTokensCardProps {
  selectedCategories: Set<ExportCategory>;
  onToggleCategory: (category: ExportCategory) => void;
  onExport: () => void;
  onPreview: () => void;
  isExporting?: boolean;
}

export const ExportDesignTokensCard: React.FC<ExportDesignTokensCardProps> = ({
  selectedCategories,
  onToggleCategory,
  onExport,
  onPreview,
  isExporting = false,
}) => {
  const categoriesList: {
    key: ExportCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "colors",
      label: "Colors",
      icon: <Droplet size={15} style={{ color: "#7956C9" }} />,
    },
    {
      key: "typography",
      label: "Typography",
      icon: <span style={{ fontWeight: 700, fontSize: "14px", color: "#7956C9", lineHeight: 1 }}>Aa</span>,
    },
    {
      key: "spacing",
      label: "Spacing",
      icon: <Maximize2 size={15} style={{ color: "#7956C9" }} />,
    },
    {
      key: "radius",
      label: "Radius",
      icon: <Square size={15} style={{ color: "#7956C9", borderRadius: "4px" }} />,
    },
    {
      key: "layout",
      label: "Layout",
      icon: <LayoutGrid size={15} style={{ color: "#7956C9" }} />,
    },
    {
      key: "complete",
      label: "Complete design system",
      icon: <Layers size={15} style={{ color: "#7956C9" }} />,
    },
  ];

  // Selected categories readable text
  const selectedLabels = React.useMemo(() => {
    if (selectedCategories.has("complete")) {
      return "Complete design system";
    }
    const labels: string[] = [];
    if (selectedCategories.has("colors")) labels.push("Colors");
    if (selectedCategories.has("typography")) labels.push("Typography");
    if (selectedCategories.has("spacing")) labels.push("Spacing");
    if (selectedCategories.has("radius")) labels.push("Radius");
    if (selectedCategories.has("layout")) labels.push("Layout");
    return labels.length > 0 ? labels.join(", ") : "None selected";
  }, [selectedCategories]);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
      }}
    >
      {/* Title & Description */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 4px 0",
          }}
        >
          Export design tokens
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted, #777184)",
            margin: 0,
          }}
        >
          Select the design token categories you want to export. This will generate a JSON file with the supported Post Hub design-token configuration.
        </p>
      </div>

      {/* 6 Category Selector Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {categoriesList.map((cat) => {
          const isChecked = selectedCategories.has(cat.key);
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onToggleCategory(cat.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "10px",
                border: isChecked
                  ? "1px solid var(--primary, #7956C9)"
                  : "1px solid var(--border, #EAE4EE)",
                backgroundColor: isChecked ? "#FAF8FE" : "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  {cat.icon}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text, #24213A)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Custom checkbox box */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  border: isChecked ? "none" : "1.5px solid #D5CEE0",
                  backgroundColor: isChecked ? "var(--primary, #7956C9)" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
              >
                {isChecked && <Check size={13} style={{ color: "#FFFFFF" }} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Configuration summary bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "18px",
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "#FAF9F7",
          border: "1px solid var(--border, #EAE4EE)",
        }}
      >
        {/* Info Items */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            flexWrap: "wrap",
          }}
        >
          {/* Item 1 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Info size={16} style={{ color: "#777184", marginTop: "1px" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500 }}>
                Configuration source
              </div>
              <div style={{ fontSize: "13px", color: "var(--text, #24213A)", fontWeight: 600 }}>
                Current design system
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <Sliders size={16} style={{ color: "#777184", marginTop: "1px" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500 }}>
                Selected categories
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text, #24213A)",
                  fontWeight: 600,
                  maxWidth: "320px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={selectedLabels}
              >
                {selectedLabels}
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <FileCode2 size={16} style={{ color: "#777184", marginTop: "1px" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500 }}>
                Export format
              </div>
              <div style={{ fontSize: "13px", color: "var(--text, #24213A)", fontWeight: 600 }}>
                JSON
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <PlayCircle size={16} style={{ color: "#777184", marginTop: "1px" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#777184", fontWeight: 500 }}>
                Version metadata availability
              </div>
              <div style={{ fontSize: "13px", color: "var(--text, #24213A)", fontWeight: 600 }}>
                Not available
              </div>
            </div>
          </div>
        </div>

        {/* Buttons on the right */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting || selectedCategories.size === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              border: "none",
              cursor: selectedCategories.size === 0 ? "not-allowed" : "pointer",
              opacity: selectedCategories.size === 0 ? 0.6 : 1,
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onPreview}
            disabled={selectedCategories.size === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              border: "1px solid var(--border, #EAE4EE)",
              cursor: selectedCategories.size === 0 ? "not-allowed" : "pointer",
              opacity: selectedCategories.size === 0 ? 0.6 : 1,
              transition: "all 0.15s ease",
            }}
          >
            <Eye size={14} style={{ color: "#777184" }} />
            <span>Preview configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
