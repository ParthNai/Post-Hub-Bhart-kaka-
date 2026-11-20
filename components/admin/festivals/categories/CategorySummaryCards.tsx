"use client";

import React from "react";
import { LayoutGrid, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import type { CategorySummaryMetrics } from "@/lib/festival-categories";

interface CategorySummaryCardsProps {
  metrics: CategorySummaryMetrics;
  activeFilter?: string | null;
  onSelectFilter?: (filterKey: string | null) => void;
}

export const CategorySummaryCards: React.FC<CategorySummaryCardsProps> = ({
  metrics,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      key: "all",
      label: "Total Categories",
      value: metrics.totalCategories,
      trend: metrics.totalCategoriesTrend,
      icon: LayoutGrid,
      iconBg: "#F4EFFC",
      iconColor: "#7956C9",
      trendColor: "#059669",
    },
    {
      key: "active",
      label: "Active Categories",
      value: metrics.activeCategories,
      trend: metrics.activeCategoriesTrend,
      icon: CheckCircle2,
      iconBg: "#DEF7EC",
      iconColor: "#0E9F6E",
      trendColor: "#059669",
    },
    {
      key: "events",
      label: "Total Associated Events",
      value: metrics.totalAssociatedEvents,
      trend: metrics.totalAssociatedEventsTrend,
      icon: Calendar,
      iconBg: "#EDE9FE",
      iconColor: "#7956C9",
      trendColor: "#059669",
    },
    {
      key: "without-events",
      label: "Categories Without Events",
      value: metrics.categoriesWithoutEvents,
      trend: null,
      icon: AlertCircle,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      trendColor: "#D97706",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.key;

        return (
          <div
            key={card.key}
            onClick={() => onSelectFilter?.(isSelected ? null : card.key)}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              border: isSelected ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
              padding: "18px 20px",
              boxShadow: isSelected
                ? "0 4px 12px rgba(121, 86, 201, 0.12)"
                : "0 1px 3px rgba(36, 33, 58, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#777184",
                    marginBottom: "4px",
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#24213A",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </span>
                  {card.trend && (
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: card.trendColor,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      ↑ {card.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
