"use client";

import React from "react";
import { SPACING_TOKEN_USAGE_REGISTRY } from "@/lib/spacing-tokens";
import { X, Layers } from "lucide-react";

interface TokenUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenUsageModal: React.FC<TokenUsageModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

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
          maxWidth: "600px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} style={{ color: "var(--primary, #7956C9)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
              Spacing & Layout Token References
            </h3>
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

        {/* Content list */}
        <div
          style={{
            maxHeight: "420px",
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {SPACING_TOKEN_USAGE_REGISTRY.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                  {item.token}
                </span>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontFamily: "monospace",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "var(--secondary, #E8DFF5)",
                    color: "var(--primary, #7956C9)",
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </span>
              </div>

              <p style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
                {item.usageDescription}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted, #777184)", fontWeight: 500 }}>
                  Used in:
                </span>
                {item.consumers.map((c, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#F4F3F7",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      color: "var(--text, #24213A)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "14px 24px",
            backgroundColor: "#FAF9FC",
            borderTop: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 16px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

