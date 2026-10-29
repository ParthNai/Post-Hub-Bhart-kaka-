"use client";

import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode } from "lucide-react";
import type { ExportTokenPayload } from "@/lib/export-import";

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: ExportTokenPayload | null;
  onDownload: () => void;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  payload,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !payload) return null;

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.16)",
          border: "1px solid var(--border, #EAE4EE)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#F2EEF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary, #7956C9)",
              }}
            >
              <FileCode size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Export Configuration Preview
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted, #777184)" }}>
                Categories: {payload.categories.join(", ")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted, #777184)",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#FAF9FC",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: "12px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: "#24213A",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              backgroundColor: "#FFFFFF",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              maxHeight: "440px",
              overflowY: "auto",
            }}
          >
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
            Schema: <strong>{payload.schemaVersion}</strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
              }}
            >
              {copied ? (
                <>
                  <Check size={14} style={{ color: "#1E8E5A" }} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onDownload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "12.5px",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
              }}
            >
              <Download size={14} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
