"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { TemplateCategoryRecord } from "@/lib/template-categories";

interface DeleteConfirmModalProps {
  category: TemplateCategoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  category,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await onConfirm(category.id);
      if (!res.success) {
        setError(res.error || "Failed to delete category.");
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
          maxWidth: "420px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid var(--border, #EAE4EE)",
          padding: "24px 20px",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#FEF2F2",
            color: "#EF4444",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <Trash2 size={26} strokeWidth={2.2} />
        </div>

        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 8px 0",
          }}
        >
          Delete Category
        </h3>

        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: "0 0 16px 0",
            lineHeight: 1.5,
          }}
        >
          Are you sure you want to delete category <strong>{category.name}</strong> ({category.id})? This action cannot be undone.
        </p>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FEE2E2",
              color: "#B91C1C",
              fontSize: "13px",
              marginBottom: "16px",
              textAlign: "left",
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "var(--text, #24213A)",
              fontSize: "13.5px",
              fontWeight: 500,
              border: "1px solid var(--border, #EAE4EE)",
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
              flex: 1,
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#EF4444",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 600,
              border: "none",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
