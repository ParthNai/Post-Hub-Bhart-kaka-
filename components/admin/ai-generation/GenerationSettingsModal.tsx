"use client";

import React, { useState } from "react";
import { X, Settings } from "lucide-react";
import type { AiGenerationSettings, AiAspectRatio } from "@/lib/ai-generation";

interface GenerationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiGenerationSettings;
  onSave: (updated: Partial<AiGenerationSettings>) => Promise<{ success: boolean; error?: string }>;
}

export const GenerationSettingsModal: React.FC<GenerationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [maxConcurrent, setMaxConcurrent] = useState(settings.maxConcurrentGenerations || 5);
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<AiAspectRatio>(settings.defaultAspectRatio || "4:5");
  const [safetyFilter, setSafetyFilter] = useState(settings.safetyFilter || "standard");
  const [autoRetry, setAutoRetry] = useState(settings.autoRetryFailed || false);
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        maxConcurrentGenerations: maxConcurrent,
        defaultAspectRatio,
        safetyFilter: safetyFilter as "strict" | "standard" | "permissive",
        autoRetryFailed: autoRetry,
        webhookUrl: webhookUrl || undefined,
      });
      onClose();
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
          maxWidth: "500px",
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
            padding: "18px 24px",
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
              <Settings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
                AI Generation Settings
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Queue concurrency limits, safety filters, and default formats.
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
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Max Concurrent */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Max Concurrent Generations: {maxConcurrent}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={maxConcurrent}
                onChange={(e) => setMaxConcurrent(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
                <span>1 worker</span>
                <span>5 (recommended)</span>
                <span>20 workers</span>
              </div>
            </div>

            {/* Default Aspect Ratio */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Default Poster Aspect Ratio
              </label>
              <select
                value={defaultAspectRatio}
                onChange={(e) => setDefaultAspectRatio(e.target.value as AiAspectRatio)}
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
                <option value="4:5">4:5 (Instagram / Mobile Feed Poster)</option>
                <option value="1:1">1:1 (Square Social Post)</option>
                <option value="9:16">9:16 (Stories / Reels Banner)</option>
                <option value="3:4">3:4 (Portrait Document Print)</option>
              </select>
            </div>

            {/* Safety Filter */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Content Safety Filtering
              </label>
              <select
                value={safetyFilter}
                onChange={(e) => setSafetyFilter(e.target.value as "strict" | "standard" | "permissive")}
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
                <option value="strict">Strict (Blocks sensitive keywords & trademarks)</option>
                <option value="standard">Standard (Recommended production filter)</option>
                <option value="permissive">Permissive (Creative freedom, high tolerance)</option>
              </select>
            </div>

            {/* Auto Retry Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
                  Auto-retry transient failures
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Automatically retries failed requests once after network timeout.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoRetry}
                onChange={(e) => setAutoRetry(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--primary)",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Webhook URL */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Generation Webhook Endpoint (Optional)
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/webhooks/ai-images"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
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
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              }}
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

