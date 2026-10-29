"use client";

import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { AppScreen } from "@/lib/screens";

interface JsonConfigModalProps {
  screen: AppScreen | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JsonConfigModal: React.FC<JsonConfigModalProps> = ({ screen, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !screen) return null;

  const jsonString = JSON.stringify(screen, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Close modal backdrop"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(36, 33, 58, 0.45)",
          backdropFilter: "blur(2px)",
          zIndex: 70,
        }}
      />

      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "560px",
          maxWidth: "94vw",
          maxHeight: "85vh",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(36, 33, 58, 0.18)",
          zIndex: 75,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: 0 }}>
              {screen.name} — Schema Record
            </h3>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Direct JSON representation of the screen entity
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                fontSize: "12px",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close JSON config modal"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "var(--text-muted)",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", backgroundColor: "#FAF9FC" }}>
          <pre
            style={{
              margin: 0,
              fontSize: "12px",
              fontFamily: "monospace",
              color: "var(--text)",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {jsonString}
          </pre>
        </div>
      </div>
    </>
  );
};
