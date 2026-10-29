"use client";

import React from "react";
import { ColorCategory } from "@/lib/color-tokens";

interface ColorCategoryTabsProps {
  activeCategory: ColorCategory;
  onSelectCategory: (cat: ColorCategory) => void;
}

const CATEGORIES: ColorCategory[] = [
  "All Colors",
  "Brand",
  "Backgrounds",
  "Text",
  "Borders",
  "Components",
];

export const ColorCategoryTabs: React.FC<ColorCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        borderBottom: "1px solid var(--border, #EAE4EE)",
        padding: "0 32px",
        backgroundColor: "var(--bg, #FAF7F2)",
        overflowX: "auto",
      }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "12px 18px",
              fontSize: "13.5px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: isActive ? "2.5px solid var(--primary, #7956C9)" : "2.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
