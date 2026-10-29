"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 55,
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
          maxWidth: "460px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(36, 33, 58, 0.16)",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "#FCE8E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D93025",
              }}
            >
              <AlertCircle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Discard Unsaved Changes?
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted, #777184)" }}>
                Unsaved edits will be lost
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted, #777184)",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted, #777184)", lineHeight: 1.6, margin: "0 0 20px 0" }}>
          You have unsaved changes in your governance settings. Are you sure you want to discard them and return to the last saved configuration?
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: "pointer",
            }}
          >
            Continue Editing
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "#D93025",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(217, 48, 37, 0.25)",
            }}
          >
            <span>Discard Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

