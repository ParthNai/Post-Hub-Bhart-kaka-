"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DiscardConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiscardConfirmModal: React.FC<DiscardConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
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
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid var(--border, #EAE4EE)",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.15)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--error-bg, #FDF2F2)",
              color: "var(--error, #D9383A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
              Discard unsaved draft changes?
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted, #777184)", marginTop: "4px" }}>
              All uncommitted adjustments to color tokens, brand guidelines, and typography will be reverted to the last saved draft.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
          >
            Keep Editing
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--error, #D9383A)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

