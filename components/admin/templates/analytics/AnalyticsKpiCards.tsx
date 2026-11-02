"use client";

import React from "react";
import { Sparkles, Palette, Compass, Layers } from "lucide-react";
import { AnalyticsKpis } from "@/lib/template-analytics";

interface AnalyticsKpiCardsProps {
  kpis: AnalyticsKpis;
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: "Template Uses",
      value: kpis.templateUses.toLocaleString(),
      detail: kpis.templateUsesTrend,
      detailPositive: true,
      icon: <Sparkles size={20} strokeWidth={2.2} />,
    },
    {
      title: "Designs Created",
      value: kpis.designsCreated.toLocaleString(),
      detail: kpis.designsCreatedTrend,
      detailPositive: true,
      icon: <Palette size={20} strokeWidth={2.2} />,
    },
    {
      title: "Most Used Category",
      value: kpis.mostUsedCategory,
      detail: kpis.mostUsedCategoryDetail,
      detailPositive: false,
      icon: <Compass size={20} strokeWidth={2.2} />,
    },
    {
      title: "Active Templates",
      value: kpis.activeTemplates.toString(),
      detail: kpis.activeTemplatesDetail,
      detailPositive: false,
      icon: <Layers size={20} strokeWidth={2.2} />,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "20px",
      }}
      className="analytics-kpi-grid"
    >
      {cards.map((c, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid var(--border, #EAE4EE)",
            borderRadius: "12px",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
          }}
        >
          {/* Icon Badge */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: "var(--secondary, #E8DFF5)",
              color: "var(--primary, #7956C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.icon}
          </div>

          <div>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 500,
                color: "var(--text-muted, #777184)",
                marginBottom: "2px",
              }}
            >
              {c.title}
            </div>

            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text, #24213A)",
                lineHeight: 1.15,
              }}
            >
              {c.value}
            </div>

            <div
              style={{
                fontSize: "11.5px",
                color: c.detailPositive ? "#059669" : "var(--text-muted, #777184)",
                fontWeight: c.detailPositive ? 600 : 400,
                marginTop: "2px",
              }}
            >
              {c.detail}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
