"use client";

import React from "react";
import { Cpu, Settings, CheckCircle2 } from "lucide-react";
import type { AiProviderConfig } from "@/lib/ai-generation";

interface AiProviderBannerProps {
  config: AiProviderConfig;
  onConfigure: () => void;
}

export const AiProviderBanner: React.FC<AiProviderBannerProps> = ({
  config,
  onConfigure,
}) => {
  const isConnected = config.status === "connected" && config.hasApiKey;

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Section Sub-heading */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--foreground)",
          marginBottom: "12px",
          letterSpacing: "-0.01em",
        }}
      >
        AI Provider Integration
      </div>

      {/* Main Banner Card */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        }}
      >
        {/* Left: Icon and Status Text */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: isConnected ? "#E6F4EA" : "#F1ECF9",
              color: isConnected ? "#137333" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Cpu size={24} strokeWidth={2} />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              <span>{isConnected ? `${config.name} Connected` : "No Provider Connected"}</span>
              {isConnected ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#E6F4EA",
                    color: "#137333",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  <CheckCircle2 size={12} /> Active
                </span>
              ) : null}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "3px",
              }}
            >
              {isConnected
                ? `Model: ${config.model} • Key: ${config.apiKeyMasked} • Resolution: ${config.defaultResolution}`
                : "Configure an AI provider to enable image generation features."}
            </div>
          </div>
        </div>

        {/* Right: Configure Provider Button */}
        <div>
          <button
            type="button"
            onClick={onConfigure}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <Settings size={15} />
            <span>Configure Provider</span>
          </button>
        </div>
      </div>
    </div>
  );
};

