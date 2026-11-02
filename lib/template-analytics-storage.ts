import type {
  AnalyticsDateRange,
  AnalyticsKpis,
  TemplateAnalyticsData,
} from "./template-analytics.ts";
import {
  CANONICAL_30D_TIMELINE,
  CANONICAL_CATEGORY_DISTRIBUTION,
  CANONICAL_PERFORMANCE_TEMPLATES,
} from "./template-analytics.ts";
import { getTemplates } from "./templates-storage.ts";

export function getTemplateAnalytics(range: AnalyticsDateRange = "30d"): TemplateAnalyticsData {
  let multiplier = 1;
  let trendUses = "+12.4% vs last period";
  let trendDesigns = "+8.6% vs last period";

  if (range === "7d") {
    multiplier = 0.28;
    trendUses = "+5.2% vs last week";
    trendDesigns = "+3.4% vs last week";
  } else if (range === "90d") {
    multiplier = 2.9;
    trendUses = "+28.1% vs last quarter";
    trendDesigns = "+22.5% vs last quarter";
  }

  const kpis: AnalyticsKpis = {
    templateUses: Math.round(1245 * multiplier),
    templateUsesTrend: trendUses,
    designsCreated: Math.round(862 * multiplier),
    designsCreatedTrend: trendDesigns,
    mostUsedCategory: "Social Media",
    mostUsedCategoryDetail: `${Math.round(412 * multiplier)} uses (33.1%)`,
    activeTemplates: 24,
    activeTemplatesDetail: "87.5% utilization rate",
  };

  // Adjust time-series based on range
  const timeSeries = CANONICAL_30D_TIMELINE.map((pt) => ({
    ...pt,
    uses: Math.round(pt.uses * (range === "7d" ? 0.35 : range === "90d" ? 2.8 : 1)),
    designs: Math.round(pt.designs * (range === "7d" ? 0.35 : range === "90d" ? 2.8 : 1)),
  }));

  const categoryDistribution = CANONICAL_CATEGORY_DISTRIBUTION.map((c) => ({
    ...c,
    uses: Math.round(c.uses * multiplier),
  }));

  // Merge with real templates from storage if available
  const templates = getTemplates();
  const topTemplates = CANONICAL_PERFORMANCE_TEMPLATES.map((row) => {
    const matched = templates.find((t) => t.id === row.id);
    return {
      ...row,
      name: matched ? matched.name : row.name,
      category: matched ? matched.category : row.category,
      format: matched ? matched.format : row.format,
      status: matched ? matched.status : row.status,
    };
  });

  return {
    range,
    kpis,
    timeSeries,
    categoryDistribution,
    topTemplates,
  };
}
