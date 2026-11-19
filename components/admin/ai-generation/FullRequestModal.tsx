"use client";

import React, { useState } from "react";
import { X, Copy, Check, Code } from "lucide-react";
import type { AiGenerationRequest } from "@/lib/ai-generation";
import { AiArtworkPreview } from "./AiArtworkPreview";

interface FullRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AiGenerationRequest | null;
}

export const FullRequestModal: React.FC<FullRequestModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  if (!isOpen || !request) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(request, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--foreground)",
              }}
            >
              {request.id}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor:
                  request.status === "completed"
                    ? "#E6F4EA"
                    : request.status === "failed"
                    ? "#FEF3C7"
                    : "#EEF2FF",
                color:
                  request.status === "completed"
                    ? "#137333"
                    : request.status === "failed"
                    ? "#D97706"
                    : "#4F46E5",
                padding: "3px 10px",
                borderRadius: "12px",
                textTransform: "capitalize",
              }}
            >
              {request.status}
            </span>
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

        {/* Content Body */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Top Two Columns: Artwork Preview & Key Meta */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "20px",
            }}
          >
            {/* Artwork Preview Canvas */}
            <div
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <AiArtworkPreview request={request} size="full" />
            </div>

            {/* Key Meta Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "12px", marginBottom: "3px" }}>
                  Full Prompt
                </div>
                <div
                  style={{
                    backgroundColor: "var(--background)",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    lineHeight: "1.45",
                  }}
                >
                  {request.prompt}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Submitted By</span>
                  <div style={{ fontWeight: 600, color: "var(--foreground)", marginTop: "2px" }}>
                    {request.userName} ({request.userId})
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>AI Engine / Model</span>
                  <div style={{ fontWeight: 600, color: "var(--foreground)", marginTop: "2px" }}>
                    {request.provider} ({request.model})
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Dimensions / Format</span>
                  <div style={{ fontWeight: 600, color: "var(--foreground)", marginTop: "2px" }}>
                    {request.dimensions} • {request.format}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Design Style</span>
                  <div style={{ fontWeight: 600, color: "var(--foreground)", marginTop: "2px" }}>
                    {request.style}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Submitted At</span>
                  <div style={{ color: "var(--foreground)", marginTop: "2px" }}>
                    {request.submittedAt}
                  </div>
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Generation Seed</span>
                  <div style={{ fontFamily: "monospace", color: "var(--foreground)", marginTop: "2px" }}>
                    #{request.seed || 849204}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible JSON payload */}
          <div>
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--primary)",
                fontSize: "13px",
                fontWeight: 600,
                padding: 0,
              }}
            >
              <Code size={15} />
              <span>{showJson ? "Hide Raw Payload JSON" : "Inspect Raw Payload JSON"}</span>
            </button>

            {showJson && (
              <pre
                style={{
                  marginTop: "10px",
                  padding: "14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  maxHeight: "200px",
                  overflowY: "auto",
                  color: "var(--foreground)",
                }}
              >
                {JSON.stringify(request, null, 2)}
              </pre>
            )}
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
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={handleCopyJson}
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
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={14} style={{ color: "#137333" }} /> : <Copy size={14} />}
            <span>{copied ? "Copied JSON" : "Copy Payload"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

