"use client";

import React from "react";
import { Lock, X, LayoutGrid } from "lucide-react";
import { TemplateCategoryRecord } from "@/lib/template-categories";

interface CannotDeleteModalProps {
  category: TemplateCategoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onViewTemplates: (category: TemplateCategoryRecord) => void;
}

export const CannotDeleteModal: React.FC<CannotDeleteModalProps> = ({
  category,
  isOpen,
  onClose,
  onViewTemplates,
}) => {
  if (!isOpen || !category) return null;

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
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-8px", marginRight: "-8px" }}>
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

        {/* Lock Icon */}
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
          <Lock size={26} strokeWidth={2.2} />
        </div>

        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 8px 0",
          }}
        >
          Category cannot be deleted
        </h3>

        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted, #777184)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
          }}
        >
          This category is being used by {category.templateCount} poster template{category.templateCount === 1 ? "" : "s"} and cannot be deleted.
        </p>

        {/* Action Button: View Templates */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewTemplates(category);
            }}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            <LayoutGrid size={16} />
            <span>View Templates</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "var(--text-muted, #777184)",
              fontSize: "13px",
              fontWeight: 500,
              border: "1px solid var(--border, #EAE4EE)",
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
