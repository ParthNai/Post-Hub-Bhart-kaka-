"use client";

import React, { useState } from "react";
import {
  X,
  Cpu,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { AiProviderConfig, AiProviderId } from "@/lib/ai-generation";

interface ConfigureProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiProviderConfig;
  onSave: (
    updated: Partial<AiProviderConfig>,
    rawApiKey?: string
  ) => Promise<{ success: boolean; error?: string }>;
  onTestConnection: (
    providerId: string,
    apiKey?: string
  ) => Promise<{ success: boolean; latencyMs: number; message: string }>;
}

export const ConfigureProviderModal: React.FC<ConfigureProviderModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onTestConnection,
}) => {
  const [providerId, setProviderId] = useState<AiProviderId>(config.providerId || "openai");
  const [model, setModel] = useState(config.model || "dall-e-3");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [defaultResolution, setDefaultResolution] = useState(config.defaultResolution || "1080 × 1350 px");
  const [quality, setQuality] = useState<"standard" | "hd">(config.quality || "standard");

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: AiProviderId) => {
    setProviderId(newProvider);
    if (newProvider === "openai") {
      setModel("dall-e-3");
    } else if (newProvider === "google") {
      setModel("imagen-3.0");
    } else {
      setModel("sd3-medium");
    }
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection(providerId, apiKey || undefined);
      setTestResult(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection verification failed.";
      setTestResult({
        success: false,
        message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const providerName =
        providerId === "openai"
          ? "OpenAI (DALL-E 3)"
          : providerId === "google"
          ? "Google Imagen"
          : "Stability AI";

      const outcome = await onSave(
        {
          providerId,
          name: providerName,
          model,
          defaultResolution,
          quality,
        },
        apiKey || undefined
      );

      if (outcome.success) {
        onClose();
      } else {
        setSaveError(outcome.error || "Failed to save configuration.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                Configure AI Provider
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Connect and authenticate generative poster AI models.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Provider Selection */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Select AI Engine
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { id: "openai", name: "OpenAI DALL-E" },
                  { id: "google", name: "Google Imagen" },
                  { id: "stability", name: "Stability AI" },
                ].map((p) => {
                  const isSelected = providerId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProviderChange(p.id as AiProviderId)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: isSelected ? "var(--primary-light)" : "var(--surface)",
                        color: isSelected ? "var(--primary)" : "var(--foreground)",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "12px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Target Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                {providerId === "openai" ? (
                  <>
                    <option value="dall-e-3">DALL-E 3 (High fidelity, detailed prompt comprehension)</option>
                    <option value="dall-e-2">DALL-E 2 (Legacy fast generator)</option>
                  </>
                ) : providerId === "google" ? (
                  <>
                    <option value="imagen-3.0">Imagen 3.0 (Photorealistic & graphic design)</option>
                    <option value="imagen-2.0">Imagen 2.0 (Stable enterprise)</option>
                  </>
                ) : (
                  <>
                    <option value="sd3-medium">Stable Diffusion 3 Medium</option>
                    <option value="sd-xl-1.0">SDXL 1.0</option>
                  </>
                )}
              </select>
            </div>

            {/* API Key Input */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600 }}>
                  API Key
                </label>
                {config.hasApiKey && (
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Current: {config.apiKeyMasked}
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <Key
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={config.hasApiKey ? "Leave blank to keep current key, or enter new key..." : "Enter provider API key (sk-...)"}
                  style={{
                    width: "100%",
                    padding: "9px 40px 9px 36px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
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
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                API keys are encrypted and verified server-side. Never exposed in client code.
              </div>
            </div>

            {/* Default Dimensions & Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  Default Resolution
                </label>
                <select
                  value={defaultResolution}
                  onChange={(e) => setDefaultResolution(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                >
                  <option value="1080 × 1350 px">1080 × 1350 px (4:5)</option>
                  <option value="1024 × 1024 px">1024 × 1024 px (1:1)</option>
                  <option value="1080 × 1920 px">1080 × 1920 px (9:16)</option>
                  <option value="1200 × 630 px">1200 × 630 px (Banner)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  Generation Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as "standard" | "hd")}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                >
                  <option value="standard">Standard Quality</option>
                  <option value="hd">HD (Enhanced Texturing)</option>
                </select>
              </div>
            </div>

            {/* Test Connection Result Callout */}
            {testResult && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: testResult.success ? "#E6F4EA" : "#FEF2F2",
                  border: testResult.success ? "1px solid #CEEAD6" : "1px solid #FEE2E2",
                  color: testResult.success ? "#137333" : "#991B1B",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <div style={{ flex: 1 }}>
                  <span>{testResult.message}</span>
                  {testResult.latencyMs !== undefined && testResult.latencyMs > 0 && (
                    <span style={{ marginLeft: "6px", fontWeight: 600 }}>({testResult.latencyMs}ms)</span>
                  )}
                </div>
              </div>
            )}

            {saveError && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FEE2E2",
                  color: "#991B1B",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertCircle size={16} />
                <span>{saveError}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Test connection button */}
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                cursor: isTesting ? "not-allowed" : "pointer",
              }}
            >
              {isTesting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
              <span>Test Connection</span>
            </button>

            {/* Cancel & Save */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  color: "var(--text-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
                }}
              >
                {isSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

