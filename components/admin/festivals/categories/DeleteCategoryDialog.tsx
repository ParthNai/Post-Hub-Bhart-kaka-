"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { FestivalCategory } from "@/lib/festival-categories";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  category: FestivalCategory | null;
  categories: FestivalCategory[];
  onClose: () => void;
  onConfirmDelete: (categoryId: string, reassignToId?: string) => Promise<void>;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  category,
  categories,
  onClose,
  onConfirmDelete,
}) => {
  const [reassignTargetId, setReassignTargetId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !category) return null;

  const hasEvents = (category.eventCount || 0) > 0;
  const otherCategories = categories.filter((c) => c.id !== category.id);

  const handleDelete = async () => {
    setErrorMsg(null);
    if (hasEvents && !reassignTargetId) {
      setErrorMsg("Please select a target category to reassign active associated events.");
      return;
    }

    try {
      setIsDeleting(true);
      await onConfirmDelete(category.id, reassignTargetId || undefined);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete category";
      setErrorMsg(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(36, 33, 58, 0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 55,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={18} color="#DC2626" />
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#24213A", margin: 0 }}>
              Delete Category Confirmation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: "#FDE8E8",
                color: "#9B1C1C",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            >
              {errorMsg}
            </div>
          )}

          <p style={{ fontSize: "13px", color: "#24213A", margin: 0 }}>
            Are you sure you want to permanently delete category <strong>&quot;{category.name}&quot;</strong>?
          </p>

          {hasEvents ? (
            <div
              style={{
                backgroundColor: "#FEF3C7",
                border: "1px solid #FCD34D",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#92400E",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div>
                <strong>Dependency Alert:</strong> This category has{" "}
                <strong>{category.eventCount} associated events</strong>. To prevent broken event
                references, reassign them to another category:
              </div>
              <select
                value={reassignTargetId}
                onChange={(e) => setReassignTargetId(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #F59E0B",
                  fontSize: "12px",
                  backgroundColor: "#FFFFFF",
                  color: "#24213A",
                  outline: "none",
                }}
              >
                <option value="">Select Reassignment Category...</option>
                {otherCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
              This category has no associated events and can be safely removed.
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            backgroundColor: "#FAF7F2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
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
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
};
