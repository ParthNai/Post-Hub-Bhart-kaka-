"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type {
  FestivalCategory,
  CategoryType,
  CategoryIconIdentifier,
  CategoryStatus,
} from "@/lib/festival-categories";

interface AddEditCategoryDrawerProps {
  isOpen: boolean;
  category: FestivalCategory | null; // null if adding new
  onClose: () => void;
  onSave: (data: Partial<FestivalCategory>) => Promise<void>;
}

const CATEGORY_TYPES: CategoryType[] = [
  "Religious",
  "National",
  "Regional",
  "Cultural",
  "Business",
  "International",
  "Special",
  "Seasonal",
  "Community",
];

const ICONS_ROW_1: { id: CategoryIconIdentifier; label: string }[] = [
  { id: "hands-praying", label: "Namaste" },
  { id: "flag", label: "Flag" },
  { id: "map-pin", label: "Location" },
  { id: "theater", label: "Masks" },
  { id: "briefcase", label: "Business" },
];

const ICONS_ROW_2: { id: CategoryIconIdentifier; label: string }[] = [
  { id: "globe", label: "Globe" },
  { id: "star", label: "Star" },
  { id: "sun", label: "Sun" },
  { id: "users", label: "Community" },
  { id: "gift", label: "Gift" },
];

const COLOR_SWATCHES = [
  { hex: "#7956C9", name: "Purple" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#10B981", name: "Green" },
  { hex: "#F97316", name: "Orange" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#14B8A6", name: "Teal" },
];

export const AddEditCategoryDrawer: React.FC<AddEditCategoryDrawerProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CategoryType>("Religious");
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconIdentifier>("hands-praying");
  const [displayColor, setDisplayColor] = useState("#7956C9");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState<CategoryStatus>("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize form when category changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setIsSlugManuallyEdited(true);
      setDescription(category.description);
      setType(category.type);
      setSelectedIcon(category.icon);
      setDisplayColor(category.displayColor || "#7956C9");
      setPriority(category.displayPriority || 1);
      setStatus(category.status || "Active");
    } else {
      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setDescription("");
      setType("Religious");
      setSelectedIcon("hands-praying");
      setDisplayColor("#7956C9");
      setPriority(1);
      setStatus("Active");
    }
    setErrorMsg(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [category, isOpen]);

  // Auto-generate slug when typing name (if not manually edited)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(autoSlug);
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Category slug is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...(category ? { id: category.id } : {}),
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        type,
        icon: selectedIcon,
        displayColor,
        displayPriority: Number(priority),
        status,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(36, 33, 58, 0.4)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={18} color="#7956C9" />
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#24213A",
                margin: 0,
              }}
            >
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>
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
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            flex: 1,
          }}
        >
          {errorMsg && (
            <div
              style={{
                backgroundColor: "#FDE8E8",
                color: "#9B1C1C",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #F8B4B4",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Category Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Category Name <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
                backgroundColor: "#FAF7F2",
              }}
            />
          </div>

          {/* Slug */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Slug <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. religious-festivals"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
                backgroundColor: "#FAF7F2",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter category description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
                backgroundColor: "#FAF7F2",
                resize: "vertical",
              }}
            />
          </div>

          {/* Category Type */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Category Type <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CategoryType)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
                backgroundColor: "#FAF7F2",
                cursor: "pointer",
              }}
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Select Icon */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Select Icon
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {ICONS_ROW_1.map((ic) => {
                  const isSelected = selectedIcon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setSelectedIcon(ic.id)}
                      title={ic.label}
                      style={{
                        height: "44px",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #7956C9" : "1px solid #EAE4EE",
                        backgroundColor: isSelected ? "#F4EFFC" : "#FFFFFF",
                        color: isSelected ? "#7956C9" : "#777184",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <CategoryIcon icon={ic.id} size={20} color={isSelected ? "#7956C9" : "#777184"} />
                    </button>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {ICONS_ROW_2.map((ic) => {
                  const isSelected = selectedIcon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setSelectedIcon(ic.id)}
                      title={ic.label}
                      style={{
                        height: "44px",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #7956C9" : "1px solid #EAE4EE",
                        backgroundColor: isSelected ? "#F4EFFC" : "#FFFFFF",
                        color: isSelected ? "#7956C9" : "#777184",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <CategoryIcon icon={ic.id} size={20} color={isSelected ? "#7956C9" : "#777184"} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Display Color */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Display Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {COLOR_SWATCHES.map((swatch) => {
                const isSelected = displayColor.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setDisplayColor(swatch.hex)}
                    title={swatch.name}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: swatch.hex,
                      border: isSelected ? "2px solid #FFFFFF" : "none",
                      boxShadow: isSelected ? `0 0 0 2px ${swatch.hex}` : "none",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                      padding: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Display Priority */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Display Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "13px",
                color: "#24213A",
                outline: "none",
                backgroundColor: "#FAF7F2",
                cursor: "pointer",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Category Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Category Status
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#24213A",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                  style={{ accentColor: "#7956C9", cursor: "pointer" }}
                />
                <span>Active</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#24213A",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === "Inactive"}
                  onChange={() => setStatus("Inactive")}
                  style={{ accentColor: "#7956C9", cursor: "pointer" }}
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          {/* Category Preview Card matching reference image */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#24213A",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ color: "#7956C9" }}>✦</span> Category Preview
            </label>
            <div
              style={{
                backgroundColor: "#FAF7F2",
                borderRadius: "12px",
                border: "1px solid #EAE4EE",
                padding: "14px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "#F5F3FF",
                  border: `1px solid ${displayColor}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: displayColor,
                  flexShrink: 0,
                }}
              >
                <CategoryIcon icon={selectedIcon} size={22} color={displayColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#24213A",
                    marginBottom: "3px",
                  }}
                >
                  {name.trim() || "Religious Festivals"}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#777184",
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}
                >
                  {description.trim() || "Religious and spiritual festivals across India."}
                </div>
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "#777184",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>• {category?.eventCount ?? 12} Events</span>
                  <span>|</span>
                  <span>Priority: {priority}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "10px",
              borderTop: "1px solid #FAF7F2",
              marginTop: "auto",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
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
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
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
