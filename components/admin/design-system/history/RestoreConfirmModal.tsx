"use client";

import React from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";
import type { VersionRecord } from "@/lib/version-history";

interface RestoreConfirmModalProps {
  version: VersionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRestoring: boolean;
}

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  version,
  isOpen,
  onClose,
  onConfirm,
  isRestoring,
}) => {
  if (!isOpen || !version) return null;

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
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px -10px rgba(36, 33, 58, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RotateCcw size={18} style={{ color: "var(--primary, #7956C9)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)", margin: 0 }}>
              Restore as Draft
            </h3>
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

        {/* Content */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#FFFBEB",
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <AlertCircle size={18} style={{ color: "#D97706", flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "12.5px", color: "#92400E", lineHeight: "1.45" }}>
              <strong>Safe Draft Restoration:</strong> This action will update your current design system working draft with the tokens from <strong>{version.id}</strong> ({version.summary}). It will not overwrite your production settings or publish to live clients until you explicitly review and publish.
            </div>
          </div>

          <p style={{ fontSize: "13px", color: "var(--text, #24213A)", margin: 0, lineHeight: "1.5" }}>
            Are you sure you want to load the snapshot from <strong>{version.id}</strong> into your working draft?
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "#FAF9FC",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isRestoring}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 600,
              border: "none",
              cursor: isRestoring ? "not-allowed" : "pointer",
              opacity: isRestoring ? 0.7 : 1,
            }}
          >
            {isRestoring ? "Restoring..." : "Confirm & Restore"}
          </button>
        </div>
      </div>
    </div>
  );
};

