"use client";

import React from "react";
import { Crop, Info } from "lucide-react";
import { PosterTemplate, TemplateFormat, FORMAT_DIMENSIONS_MAP } from "@/lib/templates";

interface PosterFormatCardProps {
  draft: PosterTemplate;
  onChange: (field: keyof PosterTemplate, value: unknown) => void;
}

export const PosterFormatCard: React.FC<PosterFormatCardProps> = ({ draft, onChange }) => {
  const formats: TemplateFormat[] = ["3:4", "4:5", "9:16"];
  const currentFormat = draft.format || "3:4";
  const currentDimensions = FORMAT_DIMENSIONS_MAP[currentFormat] || "1024 × 1365 px";

  const handleSelectFormat = (fmt: TemplateFormat) => {
    onChange("format", fmt);
    onChange("aspectRatio", fmt);
    onChange("assetDimensions", FORMAT_DIMENSIONS_MAP[fmt]);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        marginBottom: "20px",
      }}
    >
      {/* Card Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            backgroundColor: "#F5F0FF",
            color: "var(--primary, #7956C9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Crop size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          2. Poster Format
        </h2>
      </div>

      {/* Format Selector & Canvas Dimensions Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        {/* Aspect Ratio Buttons */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "8px",
            }}
          >
            Aspect Ratio <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "var(--bg, #FAF7F2)",
              padding: "4px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              gap: "4px",
            }}
          >
            {formats.map((fmt) => {
              const isSelected = currentFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleSelectFormat(fmt)}
                  style={{
                    padding: "7px 20px",
                    borderRadius: "6px",
                    border: isSelected ? "1.5px solid var(--primary, #7956C9)" : "1px solid transparent",
                    backgroundColor: isSelected ? "#ffffff" : "transparent",
                    color: isSelected ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
                    fontSize: "13px",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 2px 5px rgba(121, 86, 201, 0.12)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Canvas Dimensions Indicator */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "8px",
            }}
          >
            <span>Canvas Dimensions</span>
            <Info size={13} style={{ color: "var(--text-muted, #777184)" }} />
          </div>
          <div
            style={{
              height: "38px",
              padding: "0 16px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "var(--bg, #FAF7F2)",
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
            }}
          >
            {currentDimensions}
          </div>
        </div>
      </div>

      {/* Helper Warning / Notice */}
      <p
        style={{
          fontSize: "12px",
          color: "var(--text-muted, #777184)",
          margin: 0,
        }}
      >
        Changing the format may affect the layout and positioning of elements.
      </p>
    </div>
  );
};
