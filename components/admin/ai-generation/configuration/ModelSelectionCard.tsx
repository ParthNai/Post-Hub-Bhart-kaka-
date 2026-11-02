"use client";

import React from "react";
import { Box, Image as ImageIcon } from "lucide-react";
import type { AiProviderFullConfig, AiModelSpec } from "@/lib/ai-generation";
import { SUPPORTED_AI_MODELS } from "@/lib/ai-generation";

interface ModelSelectionCardProps {
  config: AiProviderFullConfig;
  onChange: (fields: Partial<AiProviderFullConfig>) => void;
  availableModels?: AiModelSpec[];
}

export const ModelSelectionCard: React.FC<ModelSelectionCardProps> = ({
  config,
  onChange,
  availableModels = SUPPORTED_AI_MODELS,
}) => {
  // Filter models for active provider
  const filteredModels = availableModels.filter(
    (m) => m.providerId === config.providerId
  );

  const activeModelSpec =
    filteredModels.find((m) => m.id === config.selectedModel) ||
    filteredModels[0] ||
    availableModels[0];

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box size={20} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Model Selection
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Choose the best model for your needs.
          </p>
        </div>
      </div>

      {/* Available Models Dropdown */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: "6px",
          }}
        >
          Available Models <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <select
          value={config.selectedModel}
          onChange={(e) => onChange({ selectedModel: e.target.value })}
          style={{
            width: "100%",
            padding: "9px 12px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {filteredModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Nested Capability Box */}
      <div
        style={{
          backgroundColor: "#FAF7FC",
          border: "1px solid #ECE4F7",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Model info row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ImageIcon size={18} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>
              Model: {activeModelSpec?.label || "DALL·E 3"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              Capability: {activeModelSpec?.capability || "High-quality image generation"}
            </div>
          </div>
        </div>

        {/* 3 Stats Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1.2fr",
            gap: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #ECE4F7",
          }}
        >
          {/* Supported Ratios */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Supported Ratios
            </div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--primary)",
                marginTop: "4px",
              }}
            >
              {activeModelSpec?.supportedRatios || "1:1, 3:4, 4:3, 16:9"}
            </div>
          </div>

          {/* Max Dimensions */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Max Dimensions
            </div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--foreground)",
                marginTop: "4px",
              }}
            >
              {activeModelSpec?.maxDimensions || "1024 x 1024"}
            </div>
          </div>

          {/* Output Formats */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Output Formats
            </div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--foreground)",
                marginTop: "4px",
              }}
            >
              {activeModelSpec?.outputFormats || "PNG, JPEG, WEBP"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

