"use client";

import React from "react";
import { Star, Edit3, Eye } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type { FestivalCategory } from "@/lib/festival-categories";

interface CategoryDetailsCardProps {
  category: FestivalCategory | null;
  onEdit: (category: FestivalCategory) => void;
  onViewEvents: (category: FestivalCategory) => void;
}

export const CategoryDetailsCard: React.FC<CategoryDetailsCardProps> = ({
  category,
  onEdit,
  onViewEvents,
}) => {
  if (!category) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "24px",
          textAlign: "center",
          color: "#777184",
          fontSize: "13px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        }}
      >
        Select a category to view details.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Star size={16} color="#7956C9" />
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Category Details
        </h2>
      </div>

      {/* Main Info Row with Large Icon Box */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            backgroundColor: "#F4EFFC",
            border: `1.5px solid ${category.displayColor || "#7956C9"}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: category.displayColor || "#7956C9",
            flexShrink: 0,
          }}
        >
          <CategoryIcon icon={category.icon} size={32} color={category.displayColor || "#7956C9"} />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#24213A",
              margin: "0 0 4px 0",
            }}
          >
            {category.name}
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#777184",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {category.description}
          </p>
        </div>
      </div>

      {/* Metadata Line: • X Associated Events | Priority: Y */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          fontSize: "12px",
          color: "#777184",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#7956C9",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 600, color: "#24213A" }}>
            {category.eventCount} Associated Events
          </span>
        </div>
        <span>|</span>
        <span>Priority: {category.displayPriority}</span>
      </div>

      {/* Audit Timestamps Line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "11px",
          color: "#777184",
        }}
      >
        <span>Created: {category.createdAt}</span>
        <span>Updated: {category.updatedAt}</span>
      </div>

      {/* Action Buttons: Edit Category & View Associated Events */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "4px",
        }}
      >
        <button
          type="button"
          onClick={() => onEdit(category)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 0",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#7956C9",
            border: "1px solid #7956C9",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Edit3 size={13} />
          <span>Edit Category</span>
        </button>

        <button
          type="button"
          onClick={() => onViewEvents(category)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 0",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Eye size={13} color="#7956C9" />
          <span>View Associated Events</span>
        </button>
      </div>
    </div>
  );
};
