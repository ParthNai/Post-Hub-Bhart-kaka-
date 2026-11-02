"use client";

import React, { useState } from "react";
import { Cpu, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import type { AiProviderFullConfig, AiProviderId } from "@/lib/ai-generation";

interface ProviderConfigCardProps {
  config: AiProviderFullConfig;
  onChange: (fields: Partial<AiProviderFullConfig>) => void;
  rawApiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ProviderConfigCard: React.FC<ProviderConfigCardProps> = ({
  config,
  onChange,
  rawApiKey,
  onApiKeyChange,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleProviderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value as AiProviderId;
    let endpoint = "https://api.openai.com/v1";
    let name = "OpenAI";
    let model = "dall-e-3";

    if (pId === "google") {
      endpoint = "https://generativelanguage.googleapis.com/v1beta";
      name = "Google Imagen";
      model = "imagen-3.0";
    } else if (pId === "stability") {
      endpoint = "https://api.stability.ai/v2beta";
      name = "Stability AI";
      model = "sd3-medium";
    }

    onChange({
      providerId: pId,
      providerName: name,
      apiEndpoint: endpoint,
      selectedModel: model,
    });
  };

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
          <Cpu size={20} />
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
            Provider Configuration
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              margin: "2px 0 0 0",
            }}
          >
            Configure your AI provider credentials and connection settings.
          </p>
        </div>
      </div>

      {/* Row 1: Provider Selection & Provider Name */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
            Provider Selection <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <select
            value={config.providerId}
            onChange={handleProviderSelect}
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
            <option value="openai">OpenAI</option>
            <option value="google">Google Imagen</option>
            <option value="stability">Stability AI</option>
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
            Provider Name
          </label>
          <input
            type="text"
            value={config.providerName}
            onChange={(e) => onChange({ providerName: e.target.value })}
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Row 2: API Endpoint & API Credential */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
            API Endpoint
          </label>
          <input
            type="text"
            value={config.apiEndpoint}
            onChange={(e) => onChange({ apiEndpoint: e.target.value })}
            style={{
              width: "100%",
              padding: "9px 12px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
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
            API Credential <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showApiKey ? "text" : "password"}
              value={rawApiKey !== "" ? rawApiKey : (config.hasApiKey ? config.apiKeyMasked : "")}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter provider API key"
              style={{
                width: "100%",
                padding: "9px 36px 9px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: !showApiKey && config.hasApiKey && rawApiKey === "" ? "monospace" : "inherit",
              }}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "var(--text-muted)",
              }}
            >
              {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Verified Status Callout */}
      <div
        style={{
          backgroundColor: config.credentialsVerified ? "#E6F4EA" : "#FEF2F2",
          border: config.credentialsVerified ? "1px solid #CEEAD6" : "1px solid #FEE2E2",
          borderRadius: "10px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {config.credentialsVerified ? (
            <CheckCircle2 size={18} color="#137333" style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
          )}
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: config.credentialsVerified ? "#137333" : "#DC2626",
              }}
            >
              {config.credentialsVerified ? "Credentials Verified" : "Credentials Unverified"}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: config.credentialsVerified ? "#1E7E34" : "#B91C1C",
                marginTop: "1px",
              }}
            >
              {config.credentialsVerified
                ? `Your ${config.providerName} credentials are valid and ready to use.`
                : "Please enter a valid API key and verify connection."}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: "11.5px",
            color: config.credentialsVerified ? "#1E7E34" : "#B91C1C",
          }}
        >
          Last Verified: {config.lastVerifiedAt || "Never"}
        </div>
      </div>

      {/* Enable Provider Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          paddingTop: "4px",
        }}
      >
        {/* iOS-style Switch */}
        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "44px",
            height: "24px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: config.enabled ? "var(--primary)" : "var(--border)",
              borderRadius: "24px",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: config.enabled ? "22px" : "3px",
                top: "3px",
                width: "18px",
                height: "18px",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </span>
        </label>

        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
            Enable Provider
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "1px" }}>
            Turn on to use this provider for image generation.
          </div>
        </div>
      </div>
    </div>
  );
};

