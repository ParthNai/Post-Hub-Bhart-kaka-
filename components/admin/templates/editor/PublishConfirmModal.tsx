"use client";

import React, { useState } from "react";
import { X, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface PublishConfirmModalProps {
  template: PosterTemplate;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "20px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#EDE9FE",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <UploadCloud size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: "0 0 4px 0",
              }}
            >
              Publish Template Live
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted, #777184)",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              You are about to publish <strong style={{ color: "var(--text, #24213A)" }}>{template.name}</strong> (
              {template.id}) to the live catalog. It will become instantly available to client mobile and web apps.
            </p>

            {/* Checklist details */}
            <div
              style={{
                marginTop: "12px",
                padding: "10px 12px",
                backgroundColor: "var(--bg, #FAF7F2)",
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534" }}>
                <CheckCircle2 size={13} />
                <span>Format verified: {template.format}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534" }}>
                <CheckCircle2 size={13} />
                <span>Category verified: {template.category}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#166534" }}>
                <CheckCircle2 size={13} />
                <span>Asset linked: {template.assetFileName || "Standard poster asset"}</span>
              </div>
            </div>
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
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border, #EAE4EE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "var(--bg, #FAF7F2)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 1px 3px rgba(121, 86, 201, 0.25)",
            }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            <span>Confirm & Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
