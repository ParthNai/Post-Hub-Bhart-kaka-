"use client";

import React from "react";
import { LayoutGrid, Search, ChevronDown, ArrowUpDown, List } from "lucide-react";
import { CategoryCardItem } from "./CategoryCardItem";
import type { FestivalCategory, CategoryType } from "@/lib/festival-categories";

interface CategoryGridSectionProps {
  categories: FestivalCategory[];
  selectedCategory: FestivalCategory | null;
  onSelectCategory: (category: FestivalCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortDirection: "asc" | "desc";
  onToggleDirection: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onEdit: (category: FestivalCategory) => void;
  onDuplicate: (category: FestivalCategory) => void;
  onToggleStatus: (category: FestivalCategory) => void;
  onToggleFeatured: (category: FestivalCategory) => void;
  onChangePriority: (category: FestivalCategory) => void;
  onDelete: (category: FestivalCategory) => void;
  onViewEvents: (category: FestivalCategory) => void;
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

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  sortDirection,
  onToggleDirection,
  viewMode,
  onViewModeChange,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onToggleFeatured,
  onChangePriority,
  onDelete,
  onViewEvents,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {/* Top Filter and Controls Bar matching reference image */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Left: Section Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LayoutGrid size={18} color="#7956C9" />
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            All Festival & Event Categories
          </h2>
        </div>

        {/* Right: Search, Filters, Sort, View Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={14}
              color="#777184"
              style={{ position: "absolute", left: "10px", pointerEvents: "none" }}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                padding: "6px 10px 6px 30px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "12px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                width: "170px",
                outline: "none",
              }}
            />
          </div>

          {/* Type Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              style={{
                appearance: "none",
                padding: "6px 24px 6px 10px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "12px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All Types">All Types</option>
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{ position: "absolute", right: "8px", top: "10px", pointerEvents: "none" }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{
                appearance: "none",
                padding: "6px 24px 6px 10px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "12px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{ position: "absolute", right: "8px", top: "10px", pointerEvents: "none" }}
            />
          </div>

          {/* Sort By Filter */}
          <div style={{ position: "relative" }}>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                appearance: "none",
                padding: "6px 24px 6px 10px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                fontSize: "12px",
                color: "#24213A",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="priority">Sort by</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Name</option>
              <option value="events">Event Count</option>
              <option value="updated">Recently Updated</option>
            </select>
            <ChevronDown
              size={12}
              color="#777184"
              style={{ position: "absolute", right: "8px", top: "10px", pointerEvents: "none" }}
            />
          </div>

          {/* Direction button */}
          <button
            type="button"
            onClick={onToggleDirection}
            title={`Sort direction: ${sortDirection}`}
            style={{
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FFFFFF",
              color: "#777184",
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpDown size={13} />
          </button>

          {/* View Mode Toggle: Grid and List */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FAF7F2",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              padding: "2px",
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              style={{
                padding: "5px 7px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: viewMode === "grid" ? "#7956C9" : "transparent",
                color: viewMode === "grid" ? "#FFFFFF" : "#777184",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              style={{
                padding: "5px 7px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: viewMode === "list" ? "#7956C9" : "transparent",
                color: viewMode === "list" ? "#FFFFFF" : "#777184",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards 3x3 Grid */}
      {categories.length === 0 ? (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #EAE4EE",
            padding: "40px",
            textAlign: "center",
            color: "#777184",
            fontSize: "13px",
          }}
        >
          No festival categories found matching your criteria.
        </div>
      ) : viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {categories.map((cat) => (
            <CategoryCardItem
              key={cat.id}
              category={cat}
              isSelected={selectedCategory?.id === cat.id}
              onSelect={onSelectCategory}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleStatus={onToggleStatus}
              onToggleFeatured={onToggleFeatured}
              onChangePriority={onChangePriority}
              onDelete={onDelete}
              onViewEvents={onViewEvents}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {categories.map((cat) => (
            <CategoryCardItem
              key={cat.id}
              category={cat}
              isSelected={selectedCategory?.id === cat.id}
              onSelect={onSelectCategory}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onToggleStatus={onToggleStatus}
              onToggleFeatured={onToggleFeatured}
              onChangePriority={onChangePriority}
              onDelete={onDelete}
              onViewEvents={onViewEvents}
            />
          ))}
        </div>
      )}
    </div>
  );
};
