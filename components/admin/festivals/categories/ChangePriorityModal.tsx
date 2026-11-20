"use client";

import React, { useState } from "react";
import { X, ArrowUpDown } from "lucide-react";
import type { FestivalCategory } from "@/lib/festival-categories";

interface ChangePriorityModalProps {
  isOpen: boolean;
  category: FestivalCategory | null;
  onClose: () => void;
  onSavePriority: (categoryId: string, priority: number) => Promise<void>;
}

export const ChangePriorityModal: React.FC<ChangePriorityModalProps> = ({
  isOpen,
  category,
  onClose,
  onSavePriority,
}) => {
  const [priority, setPriority] = useState<number>(category?.displayPriority || 1);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriority(category.displayPriority || 1);
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSavePriority(category.id, Number(priority));
      onClose();
    } catch {
      // handled in parent
    } finally {
      setIsSaving(false);
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
        zIndex: 52,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "400px",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ArrowUpDown size={16} color="#7956C9" />
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#24213A", margin: 0 }}>
              Change Display Priority
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#777184" }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "12px", color: "#777184", margin: 0 }}>
            Set display priority for <strong>{category.name}</strong>. Lower numbers appear first in lists and user menus.
          </p>

          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              fontSize: "13px",
              color: "#24213A",
              backgroundColor: "#FAF7F2",
              outline: "none",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20].map((p) => (
              <option key={p} value={p}>
                Priority {p} {p === 1 ? "(Highest)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            backgroundColor: "#FAF7F2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
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
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Priority"}
          </button>
        </div>
      </div>
    </div>
  );
};
