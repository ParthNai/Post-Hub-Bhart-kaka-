import test from "node:test";
import assert from "node:assert/strict";
import {
  filterAndSortPerformanceTemplates,
  generateAnalyticsCsvReport,
  CANONICAL_PERFORMANCE_TEMPLATES,
} from "../lib/template-analytics.ts";
import {
  getTemplateAnalytics,
} from "../lib/template-analytics-storage.ts";

test("Screen 17 — Template Performance & Usage Analytics Test Suite", async (t) => {
  await t.test("1. Returns canonical KPI values matching Screen 17 reference specifications for 30d", () => {
    const data = getTemplateAnalytics("30d");

    assert.equal(data.range, "30d");
    assert.equal(data.kpis.templateUses, 1245, "Template uses must be 1,245");
    assert.equal(data.kpis.templateUsesTrend, "+12.4% vs last period");
    assert.equal(data.kpis.designsCreated, 862, "Designs created must be 862");
    assert.equal(data.kpis.designsCreatedTrend, "+8.6% vs last period");
    assert.equal(data.kpis.mostUsedCategory, "Social Media");
    assert.equal(data.kpis.mostUsedCategoryDetail, "412 uses (33.1%)");
    assert.equal(data.kpis.activeTemplates, 24);
  });

  await t.test("2. Date range scaling adjusts metrics for 7d and 90d query parameters", () => {
    const data7d = getTemplateAnalytics("7d");
    assert.equal(data7d.range, "7d");
    assert.ok(data7d.kpis.templateUses < 1245, "7d uses should be scaled lower than 30d");
    assert.ok(data7d.kpis.designsCreated < 862);

    const data90d = getTemplateAnalytics("90d");
    assert.equal(data90d.range, "90d");
    assert.ok(data90d.kpis.templateUses > 1245, "90d uses should be scaled higher than 30d");
  });

  await t.test("3. Time-series contains peak usage point matching reference curve", () => {
    const data = getTemplateAnalytics("30d");
    assert.ok(data.timeSeries.length >= 10, "Should have time-series points across the month");

    const peak = data.timeSeries.find((pt) => pt.dayLabel === "Oct 18");
    assert.ok(peak, "Must contain peak point at Oct 18");
    assert.equal(peak.uses, 68, "Peak uses must be 68");
  });

  await t.test("4. Category distribution aggregates usage across all 6 categories", () => {
    const data = getTemplateAnalytics("30d");
    assert.equal(data.categoryDistribution.length, 6, "Must contain all 6 categories");

    assert.equal(data.categoryDistribution[0].category, "Social Media");
    assert.equal(data.categoryDistribution[0].uses, 412);
    assert.equal(data.categoryDistribution[1].category, "Business");
    assert.equal(data.categoryDistribution[1].uses, 320);
  });

  await t.test("5. Performance table filter and sort mechanisms", () => {
    // Search by name
    const byName = filterAndSortPerformanceTemplates(CANONICAL_PERFORMANCE_TEMPLATES, "diwali");
    assert.equal(byName.length, 1);
    assert.equal(byName[0].id, "TPL-002");

    // Search by ID
    const byId = filterAndSortPerformanceTemplates(CANONICAL_PERFORMANCE_TEMPLATES, "TPL-003");
    assert.equal(byId.length, 1);
    assert.equal(byId[0].name, "Education Admission Poster");

    // Filter by Category
    const businessOnly = filterAndSortPerformanceTemplates(
      CANONICAL_PERFORMANCE_TEMPLATES,
      "",
      "Business"
    );
    assert.equal(businessOnly.length, 2);

    // Sort by Most Uses
    const sorted = filterAndSortPerformanceTemplates(
      CANONICAL_PERFORMANCE_TEMPLATES,
      "",
      "All Categories",
      "All Statuses",
      "Most Uses"
    );
    assert.equal(sorted[0].id, "TPL-001");
    assert.ok(sorted[0].usageCount >= sorted[1].usageCount);
  });

  await t.test("6. CSV export generator produces complete structured report", () => {
    const data = getTemplateAnalytics("30d");
    const csv = generateAnalyticsCsvReport(data.kpis, data.topTemplates, "30d");

    assert.ok(csv.includes("Post Hub Template Analytics Report - 30D"));
    assert.ok(csv.includes("Template Uses,1245"));
    assert.ok(csv.includes("Designs Created,862"));
    assert.ok(csv.includes("Business Promotion Poster"));
  });
});
