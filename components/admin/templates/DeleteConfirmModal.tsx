"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { PosterTemplate } from "@/lib/templates";

interface DeleteConfirmModalProps {
  template: PosterTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !template) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await onConfirm(template.id);
      if (!res.success) {
        setError(res.error || "Failed to delete template.");
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
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
          maxWidth: "460px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                margin: "0 0 6px 0",
              }}
            >
              Delete Template
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted, #777184)",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Are you sure you want to permanently delete{" "}
              <strong style={{ color: "var(--text, #24213A)" }}>{template.name}</strong> ({template.id})? This action
              cannot be undone.
            </p>
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
              borderRadius: "4px",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div
            style={{
              margin: "0 20px 14px 20px",
              padding: "8px 12px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #F87171",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        {/* Footer */}
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
            disabled={isDeleting}
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
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isDeleting ? "not-allowed" : "pointer",
              boxShadow: "0 1px 3px rgba(220, 38, 38, 0.25)",
            }}
          >
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            <span>Delete Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
