"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { CategoryIconType, TemplateCategoryRecord } from "@/lib/template-categories";
import { CategoryIcon } from "./CategoryIcon";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<TemplateCategoryRecord>) => Promise<{ success: boolean; error?: string }>;
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconType>("briefcase");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
      const res = await onCreate({
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        status: "Active",
      });

      if (!res.success) {
        setError(res.error || "Failed to create category.");
      } else {
        // Reset and close
        setName("");
        setDescription("");
        setSelectedIcon("briefcase");
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
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: 0,
            }}
          >
            Create Category
          </h2>
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
              placeholder="Enter category name"
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
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary, #7956C9)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
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
              placeholder="Enter category description..."
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
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary, #7956C9)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
              }}
            />
          </div>

          {/* 3. Select Icon (Optional) */}
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
              Select Icon (Optional)
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
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#FAF7F2";
                        e.currentTarget.style.borderColor = "var(--primary-light, #D2C4ED)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "var(--border, #EAE4EE)";
                      }
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
                boxShadow: "0 1px 3px rgba(121, 86, 201, 0.25)",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
