"use client";

import React from "react";
import { LayoutGrid, X } from "lucide-react";
import type { EventCategoryItem } from "@/lib/festivals";

interface EventCategoriesModalProps {
  isOpen: boolean;
  categories: EventCategoryItem[];
  onClose: () => void;
}

export const EventCategoriesModal: React.FC<EventCategoriesModalProps> = ({
  isOpen,
  categories,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 12px 36px rgba(36, 33, 58, 0.18)",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LayoutGrid size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Festival Event Categories
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Active categories used for organizing celebration campaigns and templates.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#24213A" }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: "11px", color: "#777184", marginTop: "2px" }}>
                  {cat.description}
                </div>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  backgroundColor: "#F4EFFC",
                  color: "#7956C9",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {cat.count} Events
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
