"use client";

import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import type { VersionRecord } from "@/lib/version-history";

interface ViewFullVersionModalProps {
  version: VersionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewFullVersionModal: React.FC<ViewFullVersionModalProps> = ({ version, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !version) return null;

  const jsonString = JSON.stringify(
    {
      id: version.id,
      summary: version.summary,
      status: version.status,
      author: version.author,
      timestamp: version.timestamp,
      baseVersion: version.baseVersion,
      publicationRecord: version.publicationRecord,
      snapshot: version.snapshot,
      diffs: version.diffs,
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px -10px rgba(36, 33, 58, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
              Full Version Snapshot — {version.id}
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted, #777184)" }}>
              {version.summary}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted, #777184)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* JSON Viewer Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", backgroundColor: "#FAF9FC" }}>
          <pre
            style={{
              fontFamily: "var(--font-mono, monospace, sans-serif)",
              fontSize: "12px",
              color: "var(--text, #24213A)",
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--border, #EAE4EE)",
              borderRadius: "8px",
              padding: "16px",
              overflowX: "auto",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {jsonString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
          }}
        >
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={14} style={{ color: "#12805C" }} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy JSON"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              border: "none",
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
