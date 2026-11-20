"use client";

import React from "react";
import { Tag, ArrowRight, Landmark, Flag, MapPin, Sparkles, Briefcase, Globe, Star } from "lucide-react";
import type { EventCategoryItem } from "@/lib/festivals";

interface EventCategoriesSectionProps {
  categories: EventCategoryItem[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onViewAll?: () => void;
}

export const EventCategoriesSection: React.FC<EventCategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onViewAll,
}) => {
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case "Religious":
        return <Landmark size={18} />;
      case "National":
        return <Flag size={18} />;
      case "Regional":
        return <MapPin size={18} />;
      case "Cultural":
        return <Sparkles size={18} />;
      case "Business":
        return <Briefcase size={18} />;
      case "International":
        return <Globe size={18} />;
      default:
        return <Star size={18} />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#F4EFFC",
              color: "#7956C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tag size={16} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Event Categories
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#7956C9",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: 0,
          }}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 7 Category Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory?.(isSelected ? "all" : cat.name)}
              style={{
                backgroundColor: isSelected ? "#F4EFFC" : "#FAF7F2",
                borderRadius: "10px",
                border: isSelected ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                padding: "14px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  color: isSelected ? "#7956C9" : "#777184",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getCategoryIcon(cat.name)}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: isSelected ? "#7956C9" : "#24213A",
                  textAlign: "center",
                }}
              >
                {cat.name}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: isSelected ? "#7956C9" : "#24213A",
                }}
              >
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
