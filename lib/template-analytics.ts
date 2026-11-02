export type AnalyticsDateRange = "7d" | "30d" | "90d";

export interface AnalyticsKpis {
  templateUses: number;
  templateUsesTrend: string;
  designsCreated: number;
  designsCreatedTrend: string;
  mostUsedCategory: string;
  mostUsedCategoryDetail: string;
  activeTemplates: number;
  activeTemplatesDetail: string;
}

export interface TimeSeriesPoint {
  date: string;
  dayLabel: string;
  uses: number;
  designs: number;
}

export interface CategoryDistributionItem {
  category: string;
  uses: number;
  percentage: number;
}

export interface TemplatePerformanceRow {
  id: string;
  name: string;
  category: string;
  format: string;
  usageCount: number;
  designsCreated: number;
  lastUsed: string;
  status: "Published" | "Draft" | "Archived";
  theme: string;
}

export interface TemplateAnalyticsData {
  range: AnalyticsDateRange;
  kpis: AnalyticsKpis;
  timeSeries: TimeSeriesPoint[];
  categoryDistribution: CategoryDistributionItem[];
  topTemplates: TemplatePerformanceRow[];
}

/**
 * 30-day authentic timeline data matching Screen 17 reference curve
 */
export const CANONICAL_30D_TIMELINE: TimeSeriesPoint[] = [
  { date: "Oct 01", dayLabel: "Oct 01", uses: 22, designs: 15 },
  { date: "Oct 03", dayLabel: "Oct 03", uses: 26, designs: 18 },
  { date: "Oct 05", dayLabel: "Oct 05", uses: 28, designs: 20 },
  { date: "Oct 07", dayLabel: "Oct 07", uses: 32, designs: 24 },
  { date: "Oct 10", dayLabel: "Oct 10", uses: 38, designs: 29 },
  { date: "Oct 12", dayLabel: "Oct 12", uses: 45, designs: 33 },
  { date: "Oct 15", dayLabel: "Oct 15", uses: 54, designs: 40 },
  { date: "Oct 18", dayLabel: "Oct 18", uses: 68, designs: 52 }, // Peak as shown in reference tooltip!
  { date: "Oct 20", dayLabel: "Oct 20", uses: 58, designs: 44 },
  { date: "Oct 22", dayLabel: "Oct 22", uses: 48, designs: 36 },
  { date: "Oct 25", dayLabel: "Oct 25", uses: 40, designs: 28 },
  { date: "Oct 28", dayLabel: "Oct 28", uses: 48, designs: 35 },
  { date: "Oct 30", dayLabel: "Oct 30", uses: 52, designs: 38 },
];

export const CANONICAL_CATEGORY_DISTRIBUTION: CategoryDistributionItem[] = [
  { category: "Social Media", uses: 412, percentage: 85 },
  { category: "Business", uses: 320, percentage: 65 },
  { category: "Festivals & Events", uses: 245, percentage: 50 },
  { category: "Education", uses: 148, percentage: 30 },
  { category: "Product Promotion", uses: 82, percentage: 17 },
  { category: "Seasonal Greetings", uses: 38, percentage: 8 },
];

export const CANONICAL_PERFORMANCE_TEMPLATES: TemplatePerformanceRow[] = [
  {
    id: "TPL-001",
    name: "Business Promotion Poster",
    category: "Business",
    format: "3:4",
    usageCount: 428,
    designsCreated: 312,
    lastUsed: "Oct 28, 2026 10:45 AM",
    status: "Published",
    theme: "corporate-blue",
  },
  {
    id: "TPL-002",
    name: "Diwali Festival Greeting",
    category: "Festivals & Events",
    format: "4:5",
    usageCount: 315,
    designsCreated: 240,
    lastUsed: "Oct 28, 2026 09:15 AM",
    status: "Published",
    theme: "festive-gold",
  },
  {
    id: "TPL-003",
    name: "Education Admission Poster",
    category: "Education",
    format: "3:4",
    usageCount: 210,
    designsCreated: 154,
    lastUsed: "Oct 27, 2026 04:30 PM",
    status: "Published",
    theme: "education-blue",
  },
  {
    id: "TPL-004",
    name: "Product Promotion Poster",
    category: "Product Promotion",
    format: "3:4",
    usageCount: 164,
    designsCreated: 98,
    lastUsed: "Oct 26, 2026 02:10 PM",
    status: "Published",
    theme: "corporate-blue",
  },
  {
    id: "TPL-006",
    name: "Real Estate Poster",
    category: "Business",
    format: "3:4",
    usageCount: 128,
    designsCreated: 58,
    lastUsed: "Oct 25, 2026 11:20 AM",
    status: "Published",
    theme: "corporate-blue",
  },
];

/**
 * Filter performance table rows
 */
export function filterAndSortPerformanceTemplates(
  items: TemplatePerformanceRow[],
  query: string = "",
  category: string = "All Categories",
  status: string = "All Statuses",
  sort: string = "Most Uses"
): TemplatePerformanceRow[] {
  let result = [...items];

  // Search
  if (query.trim() !== "") {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // Category
  if (category !== "All Categories") {
    result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  // Status
  if (status !== "All Statuses") {
    result = result.filter((t) => t.status === status);
  }

  // Sorting
  result.sort((a, b) => {
    switch (sort) {
      case "Most Uses":
        return b.usageCount - a.usageCount;
      case "Highest Designs":
        return b.designsCreated - a.designsCreated;
      case "Name A–Z":
        return a.name.localeCompare(b.name);
      case "Recently Used":
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      default:
        return b.usageCount - a.usageCount;
    }
  });

  return result;
}

/**
 * Generate CSV Report string
 */
export function generateAnalyticsCsvReport(
  kpis: AnalyticsKpis,
  templates: TemplatePerformanceRow[],
  range: string
): string {
  const lines: string[] = [];
  lines.push(`Post Hub Template Analytics Report - ${range.toUpperCase()}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Summary KPIs:");
  lines.push(`Template Uses,${kpis.templateUses},Trend,${kpis.templateUsesTrend}`);
  lines.push(`Designs Created,${kpis.designsCreated},Trend,${kpis.designsCreatedTrend}`);
  lines.push(`Most Used Category,${kpis.mostUsedCategory},Detail,${kpis.mostUsedCategoryDetail}`);
  lines.push(`Active Templates,${kpis.activeTemplates},Detail,${kpis.activeTemplatesDetail}`);
  lines.push("");
  lines.push("Template Performance:");
  lines.push("ID,Name,Category,Format,Usage Count,Designs Created,Last Used,Status");

  templates.forEach((t) => {
    lines.push(
      `"${t.id}","${t.name}","${t.category}","${t.format}",${t.usageCount},${t.designsCreated},"${t.lastUsed}","${t.status}"`
    );
  });

  return lines.join("\n");
}

