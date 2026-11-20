"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit3, Copy, ToggleLeft, Star, ArrowUpDown, Trash2 } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type { FestivalCategory } from "@/lib/festival-categories";

interface CategoryCardItemProps {
  category: FestivalCategory;
  isSelected?: boolean;
  onSelect: (category: FestivalCategory) => void;
  onEdit: (category: FestivalCategory) => void;
  onDuplicate: (category: FestivalCategory) => void;
  onToggleStatus: (category: FestivalCategory) => void;
  onToggleFeatured: (category: FestivalCategory) => void;
  onChangePriority: (category: FestivalCategory) => void;
  onDelete: (category: FestivalCategory) => void;
  onViewEvents: (category: FestivalCategory) => void;
}

export const CategoryCardItem: React.FC<CategoryCardItemProps> = ({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onToggleFeatured,
  onChangePriority,
  onDelete,
  onViewEvents,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const isActive = category.status === "Active";

  return (
    <div
      onClick={() => onSelect(category)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: isSelected ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
        padding: "16px 18px",
        boxShadow: isSelected
          ? "0 4px 12px rgba(121, 86, 201, 0.12)"
          : "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "14px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.15s ease",
      }}
    >
      {/* Top row: Icon + Name & Description */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "#F5F3FF",
            border: `1px solid ${category.displayColor}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: category.displayColor || "#7956C9",
            flexShrink: 0,
          }}
        >
          <CategoryIcon icon={category.icon} size={22} color={category.displayColor || "#7956C9"} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#24213A",
              margin: "0 0 3px 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {category.name}
          </h3>
          <p
            style={{
              fontSize: "11.5px",
              color: "#777184",
              margin: 0,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {category.description}
          </p>
        </div>
      </div>

      {/* Bottom status bar matching reference: • X Events | Active pill | Priority: Y | ⋮ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "10px",
          borderTop: "1px solid #FAF7F2",
          fontSize: "11.5px",
          color: "#777184",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                display: "inline-block",
              }}
            />
            <span style={{ fontWeight: 600, color: "#24213A" }}>{category.eventCount} Events</span>
          </div>

          <span
            style={{
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "10.5px",
              fontWeight: 600,
              backgroundColor: isActive ? "#DEF7EC" : "#FDE8E8",
              color: isActive ? "#03543F" : "#9B1C1C",
            }}
          >
            {category.status}
          </span>

          <span style={{ color: "#777184" }}>Priority: {category.displayPriority}</span>
        </div>

        {/* 3 dots menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Options"
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                right: 0,
                bottom: "26px",
                width: "180px",
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                border: "1px solid #EAE4EE",
                padding: "4px 0",
                zIndex: 30,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onViewEvents(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Eye size={13} color="#7956C9" />
                <span>View Events</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Edit3 size={13} color="#7956C9" />
                <span>Edit Category</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Copy size={13} color="#7956C9" />
                <span>Duplicate Category</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleStatus(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <ToggleLeft size={13} color="#7956C9" />
                <span>{isActive ? "Deactivate" : "Activate"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleFeatured(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Star size={13} color={category.isFeatured ? "#EAB308" : "#777184"} />
                <span>{category.isFeatured ? "Unfeature" : "Feature"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onChangePriority(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#24213A",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <ArrowUpDown size={13} color="#7956C9" />
                <span>Change Priority</span>
              </button>

              <div style={{ height: "1px", backgroundColor: "#EAE4EE", margin: "4px 0" }} />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(category);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  color: "#DC2626",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
                <span>Delete Category</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
