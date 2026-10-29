"use client";

import React, { useState } from "react";
import type { DesignSystemConfig } from "@/lib/design-system";
import { X, Copy, Check, Download } from "lucide-react";

interface TokenExportModalProps {
  isOpen: boolean;
  config: DesignSystemConfig;
  onClose: () => void;
}

export const TokenExportModal: React.FC<TokenExportModalProps> = ({
  isOpen,
  config,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    version: config.version,
    status: config.status,
    theme: config.guidelines,
    colors: config.colorTokens,
    typography: config.typography,
    components: config.components,
    icons: config.icons,
    spacing: config.spacing,
    brandAssets: config.brandAssets.map((a) => ({
      id: a.id,
      title: a.title,
      format: a.format,
      status: a.status,
      url: a.url || null,
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `posthub-design-tokens-v${config.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
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
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
              Export Design Tokens (JSON)
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
              Ready for React Native, Flutter, and Web integration
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted, #777184)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Code display */}
        <div style={{ padding: "20px 24px" }}>
          <pre
            style={{
              backgroundColor: "#1E202C",
              color: "#E2E8F0",
              padding: "16px",
              borderRadius: "10px",
              fontSize: "12px",
              fontFamily: "monospace",
              maxHeight: "320px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {jsonString}
          </pre>
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            backgroundColor: "#FAF9FC",
            borderTop: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <button
            type="button"
            onClick={handleDownload}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              fontSize: "12.5px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Download .json
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                fontSize: "12.5px",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
