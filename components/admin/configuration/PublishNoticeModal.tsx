"use client";

import React from "react";
import { Lock, X, Info } from "lucide-react";

interface PublishNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenName: string;
}

export const PublishNoticeModal: React.FC<PublishNoticeModalProps> = ({
  isOpen,
  onClose,
  screenName,
}) => {
  if (!isOpen) return null;

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
          zIndex: 80,
        }}
      />

      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "460px",
          maxWidth: "92vw",
          backgroundColor: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(36, 33, 58, 0.18)",
          zIndex: 85,
          padding: "24px",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", margin: "0 0 4px 0" }}>
              Publishing Service Integration
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
              Live publication of &quot;{screenName}&quot; requires active mobile client integration.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close publish notice modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#FAF7FD",
            border: "1px solid #E8DFF5",
            borderRadius: "10px",
            padding: "14px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Info size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text)" }}>
              Publishing Pipeline Policy
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            To prevent breaking changes on live client devices, drafts are safely saved and versioned
            in the database without altering existing production app builds until the publishing release
            cycle is initiated.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Understood
          </button>
        </div>
      </div>
    </>
  );
};
