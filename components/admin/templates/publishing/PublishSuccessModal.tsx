"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface PublishSuccessModalProps {
  template: PosterTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
  template,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
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
          maxWidth: "460px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "26px 22px",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px", marginRight: "-10px" }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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

        {/* Celebration Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#ECFDF5",
            color: "#10B981",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <CheckCircle2 size={32} strokeWidth={2.3} />
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 8px 0",
          }}
        >
          Template Published Successfully!
        </h3>

        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
          }}
        >
          <strong>{template.name}</strong> ({template.id}) has been published and deployed to mobile app production channels.
        </p>

        {/* Deployment details box */}
        <div
          style={{
            backgroundColor: "#FAF7F2",
            border: "1px solid var(--border, #EAE4EE)",
            borderRadius: "8px",
            padding: "12px 16px",
            textAlign: "left",
            fontSize: "12.5px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted, #777184)" }}>Target Channel:</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>Mobile App v2.4+ OTA</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted, #777184)" }}>Access:</span>
            <span style={{ fontWeight: 600, color: "#059669" }}>Public • Live</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted, #777184)" }}>Active Format:</span>
            <span style={{ fontWeight: 600, color: "var(--text, #24213A)" }}>{template.format || "3:4"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/admin/templates"
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <span>Back to Templates</span>
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "13.5px",
              fontWeight: 500,
              border: "1px solid var(--border, #EAE4EE)",
              cursor: "pointer",
            }}
          >
            Keep Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
