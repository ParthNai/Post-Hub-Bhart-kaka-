"use client";

import React, { useState } from "react";
import { X, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type { FestivalCategory } from "@/lib/festival-categories";

interface ReorderCategoriesModalProps {
  isOpen: boolean;
  categories: FestivalCategory[];
  onClose: () => void;
  onSaveReorder: (orderedIds: string[]) => Promise<void>;
}

export const ReorderCategoriesModal: React.FC<ReorderCategoriesModalProps> = ({
  isOpen,
  categories,
  onClose,
  onSaveReorder,
}) => {
  const [list, setList] = useState<FestivalCategory[]>(() =>
    [...categories].sort((a, b) => a.displayPriority - b.displayPriority)
  );
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList([...categories].sort((a, b) => a.displayPriority - b.displayPriority));
  }, [categories, isOpen]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...list];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    setList(copy);
  };

  const moveDown = (index: number) => {
    if (index === list.length - 1) return;
    const copy = [...list];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setList(copy);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSaveReorder(list.map((c) => c.id));
      onClose();
    } catch {
      // handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "540px",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
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
            <ArrowUpDown size={18} color="#7956C9" />
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#24213A", margin: 0 }}>
              Reorder Category Priorities
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

        {/* List */}
        <div
          style={{
            padding: "16px 22px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: 1,
          }}
        >
          <p style={{ fontSize: "12px", color: "#777184", margin: "0 0 4px 0" }}>
            Adjust the display priority order of categories as shown across the platform and mobile applications.
          </p>

          {list.map((cat, idx) => (
            <div
              key={cat.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    backgroundColor: "#FAF7F2",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#7956C9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {idx + 1}
                </span>

                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#F5F3FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cat.displayColor || "#7956C9",
                  }}
                >
                  <CategoryIcon icon={cat.icon} size={16} color={cat.displayColor || "#7956C9"} />
                </div>

                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#777184" }}>
                    {cat.eventCount} Events • {cat.status}
                  </div>
                </div>
              </div>

              {/* Up/Down buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveUp(idx)}
                  style={{
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: idx === 0 ? "#FAF7F2" : "#FFFFFF",
                    color: idx === 0 ? "#CBD5E1" : "#24213A",
                    cursor: idx === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === list.length - 1}
                  onClick={() => moveDown(idx)}
                  style={{
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: idx === list.length - 1 ? "#FAF7F2" : "#FFFFFF",
                    color: idx === list.length - 1 ? "#CBD5E1" : "#24213A",
                    cursor: idx === list.length - 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          ))}
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
            disabled={isSaving}
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
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Priorities"}
          </button>
        </div>
      </div>
    </div>
  );
};
