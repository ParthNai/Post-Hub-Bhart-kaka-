"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import type { ImportValidationResult } from "@/lib/export-import";

interface ConfirmImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  result: ImportValidationResult | null;
  isImporting: boolean;
}

export const ConfirmImportModal: React.FC<ConfirmImportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  result,
  isImporting,
}) => {
  if (!isOpen || !result) return null;

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
          maxWidth: "480px",
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
                backgroundColor: "#F2EEF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary, #7956C9)",
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text, #24213A)" }}>
                Confirm Draft Import
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted, #777184)" }}>
                File: {result.fileName}
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

        {/* Info Box */}
        <div
          style={{
            backgroundColor: "#FAF9FC",
            border: "1px solid #ECE7F2",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "18px",
            fontSize: "12.5px",
            color: "var(--text, #24213A)",
            lineHeight: "1.6",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
            <AlertCircle size={15} style={{ color: "var(--primary, #7956C9)", marginTop: "2px", flexShrink: 0 }} />
            <span>
              This will update your current <strong>working draft</strong> with the imported tokens.
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#777184" }}>
            • <strong>{result.addedTokens}</strong> added, <strong>{result.modifiedTokens}</strong> modified, <strong>{result.unchangedTokens}</strong> unchanged.
            <br />
            • Published configuration is <strong>never modified</strong> automatically.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "var(--text, #24213A)",
              cursor: isImporting ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isImporting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              border: "none",
              cursor: isImporting ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
            }}
          >
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : null}
            <span>{isImporting ? "Importing Draft..." : "Confirm Import as Draft"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
