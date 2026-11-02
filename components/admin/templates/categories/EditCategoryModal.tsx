"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { CategoryIconType, TemplateCategoryRecord, TemplateCategoryStatus } from "@/lib/template-categories";
import { CategoryIcon } from "./CategoryIcon";

interface EditCategoryModalProps {
  category: TemplateCategoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TemplateCategoryRecord>) => Promise<{ success: boolean; error?: string }>;
}

interface EditCategoryFormContentProps {
  category: TemplateCategoryRecord;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TemplateCategoryRecord>) => Promise<{ success: boolean; error?: string }>;
}

const EditCategoryFormContent: React.FC<EditCategoryFormContentProps> = ({
  category,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconType>(category.icon);
  const [status, setStatus] = useState<TemplateCategoryStatus>(category.status);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons: CategoryIconType[] = [
    "briefcase",
    "party-popper",
    "graduation-cap",
    "tag",
    "layout-grid",
    "snowflake",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (name.trim().length > 60) {
      setError("Category name cannot exceed 60 characters.");
      return;
    }

    if (description.length > 300) {
      setError("Description cannot exceed 300 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onUpdate(category.id, {
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        status,
      });

      if (!res.success) {
        setError(res.error || "Failed to update category.");
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          padding: "16px 20px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Edit Category
          </h2>
          <span
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "var(--text-muted, #777184)",
              padding: "2px 6px",
              backgroundColor: "#F3F4F6",
              borderRadius: "4px",
            }}
          >
            {category.id}
          </span>
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
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
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
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Category Name */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Category Name <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            required
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13.5px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
            }}
          />
        </div>

        {/* 2. Description */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            rows={3}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border, #EAE4EE)",
              fontSize: "13.5px",
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* 3. Status Selection */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "6px",
            }}
          >
            Lifecycle Status
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setStatus("Active")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: status === "Active" ? "2px solid #059669" : "1px solid var(--border, #EAE4EE)",
                backgroundColor: status === "Active" ? "#ECFDF5" : "#ffffff",
                color: status === "Active" ? "#059669" : "var(--text-muted, #777184)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatus("Archived")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: status === "Archived" ? "2px solid #6B7280" : "1px solid var(--border, #EAE4EE)",
                backgroundColor: status === "Archived" ? "#F3F4F6" : "#ffffff",
                color: status === "Archived" ? "#374151" : "var(--text-muted, #777184)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Archived
            </button>
          </div>
        </div>

        {/* 4. Select Icon */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text, #24213A)",
              marginBottom: "8px",
            }}
          >
            Select Icon
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "8px",
            }}
          >
            {icons.map((ic) => {
              const isSelected = selectedIcon === ic;
              return (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setSelectedIcon(ic)}
                  style={{
                    height: "44px",
                    borderRadius: "8px",
                    border: isSelected
                      ? "2px solid var(--primary, #7956C9)"
                      : "1px solid var(--border, #EAE4EE)",
                    backgroundColor: isSelected ? "var(--secondary, #E8DFF5)" : "#ffffff",
                    color: isSelected ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <CategoryIcon icon={ic} size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border, #EAE4EE)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 500,
              color: "var(--text, #24213A)",
              backgroundColor: "#ffffff",
              border: "1px solid var(--border, #EAE4EE)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "var(--primary, #7956C9)",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onUpdate,
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
      <EditCategoryFormContent
        key={category.id}
        category={category}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </div>
  );
};
