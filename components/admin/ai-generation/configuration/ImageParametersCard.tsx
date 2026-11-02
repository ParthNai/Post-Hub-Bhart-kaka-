"use client";

import React from "react";
import { Sliders } from "lucide-react";
import type { AiProviderFullConfig } from "@/lib/ai-generation";

interface ImageParametersCardProps {
  config: AiProviderFullConfig;
  onChange: (fields: Partial<AiProviderFullConfig>) => void;
}

export const ImageParametersCard: React.FC<ImageParametersCardProps> = ({
  config,
  onChange,
}) => {
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
          <Sliders size={20} />
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
            Image Generation Parameters
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Set default parameters for image generation.
          </p>
        </div>
      </div>

      {/* Row 1: Aspect Ratio, Output Format, Dimensions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
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
            Default Aspect Ratio
          </label>
          <select
            value={config.defaultAspectRatio}
            onChange={(e) => onChange({ defaultAspectRatio: e.target.value })}
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
            <option value="1:1 (Square)">1:1 (Square)</option>
            <option value="3:4 (Portrait)">3:4 (Portrait)</option>
            <option value="4:5 (Mobile Feed)">4:5 (Mobile Feed)</option>
            <option value="16:9 (Landscape)">16:9 (Landscape)</option>
          </select>
        </div>

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
            Default Output Format
          </label>
          <select
            value={config.defaultOutputFormat}
            onChange={(e) => onChange({ defaultOutputFormat: e.target.value })}
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
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="WEBP">WEBP</option>
          </select>
        </div>

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
            Default Dimensions
          </label>
          <select
            value={config.defaultDimensions}
            onChange={(e) => onChange({ defaultDimensions: e.target.value })}
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
            <option value="1024 x 1024">1024 x 1024</option>
            <option value="1080 x 1350">1080 x 1350</option>
            <option value="1080 x 1920">1080 x 1920</option>
            <option value="1200 x 630">1200 x 630</option>
          </select>
        </div>
      </div>

      {/* Row 2: Quality, Count Limit, Prompt Input Limit */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
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
            Image Quality
          </label>
          <select
            value={config.imageQuality}
            onChange={(e) => onChange({ imageQuality: e.target.value })}
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
            <option value="High Quality">High Quality</option>
            <option value="Standard">Standard</option>
            <option value="HD">HD</option>
          </select>
        </div>

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
            Generation Count Limit
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              min={1}
              max={4}
              value={config.generationCountLimit}
              onChange={(e) =>
                onChange({ generationCountLimit: Math.max(1, Math.min(4, Number(e.target.value) || 1)) })
              }
              style={{
                width: "100%",
                padding: "9px 50px 9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              (1–4)
            </span>
          </div>
        </div>

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
            Prompt Input Limit
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              min={100}
              max={4000}
              value={config.promptInputLimit}
              onChange={(e) =>
                onChange({ promptInputLimit: Math.max(50, Number(e.target.value) || 500) })
              }
              style={{
                width: "100%",
                padding: "9px 54px 9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            >
              (chars)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

