"use client";

import React, { useState } from "react";
import { Sliders, X, Plus, ChevronDown, Check } from "lucide-react";
import { PosterTemplate, TextAlignment } from "@/lib/templates";

interface SupportedCustomizationCardProps {
  draft: PosterTemplate;
  onChange: (field: keyof PosterTemplate, value: unknown) => void;
}

export const SupportedCustomizationCard: React.FC<SupportedCustomizationCardProps> = ({
  draft,
  onChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextFieldPicker, setShowTextFieldPicker] = useState(false);

  const availableTextFields = ["Title", "Subtitle", "Feature List", "Call to Action", "Discount Badge", "Contact Info"];
  const currentTextFields = draft.editableTextFields || ["Title", "Subtitle", "Feature List"];

  const currentColors = draft.textColours || ["#1E3A8A", "#0284C7", "#F59E0B", "#F1F5F9"];
  const availableFonts = ["Poppins", "Inter", "Roboto", "Montserrat", "Playfair Display"];

  const handleRemoveField = (field: string) => {
    onChange(
      "editableTextFields",
      currentTextFields.filter((f) => f !== field)
    );
  };

  const handleAddField = (field: string) => {
    if (!currentTextFields.includes(field)) {
      onChange("editableTextFields", [...currentTextFields, field]);
    }
    setShowTextFieldPicker(false);
  };

  const handleColorToggle = (color: string) => {
    if (currentColors.includes(color)) {
      if (currentColors.length > 1) {
        onChange(
          "textColours",
          currentColors.filter((c) => c !== color)
        );
      }
    } else {
      onChange("textColours", [...currentColors, color]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--border, #EAE4EE)",
        borderRadius: "12px",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
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
          <Sliders size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          4. Supported Customization
        </h2>
      </div>

      {/* Row 1: Editable Text Fields, Text Colours, Font Selection */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1.2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
          alignItems: "start",
        }}
      >
        {/* Editable Text Fields */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Editable Text Fields
          </label>
          <div
            style={{
              minHeight: "38px",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "6px",
              position: "relative",
            }}
          >
            {currentTextFields.map((field) => (
              <span
                key={field}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "var(--secondary, #F5F2F9)",
                  color: "var(--text, #24213A)",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid #EAE4EE",
                }}
              >
                <span>{field}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveField(field)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-muted, #777184)",
                  }}
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={() => setShowTextFieldPicker(!showTextFieldPicker)}
              title="Add field"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                marginLeft: "auto",
                color: "var(--text-muted, #777184)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronDown size={14} />
            </button>

            {showTextFieldPicker && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "42px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "4px",
                  zIndex: 20,
                  width: "180px",
                }}
              >
                {availableTextFields.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAddField(opt)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      textAlign: "left",
                      fontSize: "12px",
                      color: currentTextFields.includes(opt) ? "var(--text-muted, #777184)" : "var(--text, #24213A)",
                      background: "none",
                      border: "none",
                      cursor: currentTextFields.includes(opt) ? "default" : "pointer",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => {
                      if (!currentTextFields.includes(opt)) {
                        e.currentTarget.style.backgroundColor = "var(--secondary, #F5F2F9)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {opt} {currentTextFields.includes(opt) && "✓"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Colours */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Text Colours
          </label>
          <div
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              height: "38px",
              padding: "0 10px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {currentColors.map((color, idx) => (
                <span
                  key={idx}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: color === "#FFFFFF" || color === "#F1F5F9" ? "1px solid #CBD5E1" : "none",
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
            <ChevronDown size={14} style={{ color: "var(--text-muted, #777184)" }} />

            {showColorPicker && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "42px",
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border, #EAE4EE)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  zIndex: 20,
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  width: "160px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {["#1E3A8A", "#0284C7", "#F59E0B", "#F1F5F9", "#10B981", "#7956C9", "#DC2626"].map((hex) => {
                  const isChecked = currentColors.includes(hex);
                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handleColorToggle(hex)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: hex,
                        border: isChecked ? "2px solid #24213A" : "1px solid #E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: hex === "#FFFFFF" || hex === "#F1F5F9" || hex === "#F59E0B" ? "#000" : "#fff",
                      }}
                    >
                      {isChecked && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Font Selection
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={draft.fontSelection || "Poppins"}
              onChange={(e) => onChange("fontSelection", e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                paddingLeft: "12px",
                paddingRight: "28px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                backgroundColor: "#ffffff",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              {availableFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Image Slots & Alignment */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "16px",
        }}
      >
        {/* Image Slots */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Image Slots
          </label>
          <div
            style={{
              minHeight: "38px",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "var(--secondary, #F5F2F9)",
                color: "var(--text, #24213A)",
                fontSize: "11.5px",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid #EAE4EE",
              }}
            >
              <span>Main Image</span>
              <X size={11} style={{ cursor: "pointer", color: "var(--text-muted, #777184)" }} />
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "#ffffff",
                color: "var(--primary, #7956C9)",
                fontSize: "11.5px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px dashed var(--primary-light, #D2C4ED)",
                cursor: "pointer",
              }}
            >
              <span>Logo</span>
              <Plus size={11} />
            </span>
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Alignment
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={draft.alignment || "Center"}
              onChange={(e) => onChange("alignment", e.target.value as TextAlignment)}
              style={{
                width: "100%",
                height: "38px",
                paddingLeft: "12px",
                paddingRight: "28px",
                borderRadius: "6px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "13px",
                color: "var(--text, #24213A)",
                backgroundColor: "#ffffff",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <option value="Left">Left</option>
              <option value="Center">Center</option>
              <option value="Right">Right</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #777184)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
