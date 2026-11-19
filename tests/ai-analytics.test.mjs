import test from "node:test";
import assert from "node:assert/strict";
import {
  getAiAnalytics,
  getBudgetConfig,
  updateBudgetConfig,
  queryUserUsage,
  resetAnalyticsData,
} from "../lib/ai-analytics-storage.ts";
import {
  generateAnalyticsUsageCsv,
  generateBillingSummaryCsv,
} from "../lib/ai-analytics.ts";

test("Screen 24 — AI Generation Usage, Credits & Cost Analytics Test Suite", async (t) => {
  // Always reset to canonical reference state before tests
  resetAnalyticsData();

  await t.test("1. Initializes canonical KPI metrics matching Screen 24 reference specifications", () => {
    const data = getAiAnalytics("30d");

    // 4 Top KPI Cards
    assert.equal(data.overview.totalImagesGenerated, 48750, "Total images generated must be 48,750");
    assert.equal(data.overview.totalImagesChange, "+12.5%", "Change must be +12.5%");
    assert.equal(data.overview.totalCreditsConsumed, 48750, "Total credits consumed must be 48,750");
    assert.equal(data.overview.totalCreditsChange, "+12.3%", "Change must be +12.3%");
    assert.equal(data.overview.actualProviderCost, 142.5, "Actual provider cost must be $142.50");
    assert.equal(data.overview.actualProviderCostChange, "+10.8%", "Change must be +10.8%");
    assert.equal(data.overview.averageCostPerImage, 0.0029, "Average cost per image must be $0.0029");
    assert.equal(data.overview.averageCostChange, "-1.1%", "Change must be -1.1%");
  });

  await t.test("2. Verifies provider cost breakdown totals and exact math reconciliation", () => {
    const data = getAiAnalytics("30d");
    assert.equal(data.providerCosts.length, 3, "Must have exactly 3 AI providers");

    const openai = data.providerCosts.find((p) => p.provider === "OpenAI");
    assert.ok(openai, "OpenAI must exist");
    assert.equal(openai.model, "DALL·E 3");
    assert.equal(openai.imagesGenerated, 28500);
    assert.equal(openai.usageUnits, 28500);
    assert.equal(openai.totalCost, 85.5);
    assert.equal(openai.billingPeriod, "Oct 01 – Oct 31");

    const google = data.providerCosts.find((p) => p.provider === "Google");
    assert.ok(google, "Google must exist");
    assert.equal(google.model, "Imagen 3");
    assert.equal(google.imagesGenerated, 12800);
    assert.equal(google.usageUnits, 12800);
    assert.equal(google.totalCost, 45.2);

    const replicate = data.providerCosts.find((p) => p.provider === "Replicate");
    assert.ok(replicate, "Replicate must exist");
    assert.equal(replicate.model, "SDXL Turbo");
    assert.equal(replicate.imagesGenerated, 7450);
    assert.equal(replicate.usageUnits, 7450);
    assert.equal(replicate.totalCost, 11.8);

    // Sum verification
    const sumImages = openai.imagesGenerated + google.imagesGenerated + replicate.imagesGenerated;
    assert.equal(sumImages, 48750, "Provider images sum must exactly equal 48,750");

    const sumCost = Number((openai.totalCost + google.totalCost + replicate.totalCost).toFixed(2));
    assert.equal(sumCost, 142.5, "Provider cost sum must exactly equal $142.50");

    const avgCost = Number((sumCost / sumImages).toFixed(4));
    assert.equal(avgCost, 0.0029, "Provider cost average per image must equal $0.0029");
  });

  await t.test("3. Verifies budget & usage limits calculations and status", () => {
    const budget = getBudgetConfig();
    assert.equal(budget.configuredBudget, 500.0, "Configured budget must be $500.00");
    assert.equal(budget.consumed, 142.5, "Consumed budget must be $142.50");
    assert.equal(budget.remaining, 357.5, "Remaining budget must be $357.50");
    assert.equal(budget.consumedPercentage, 29, "Consumed percentage must be 29%");
    assert.equal(budget.status, "Within Limit", "Status must be Within Limit");
  });

  await t.test("4. Verifies usage trends and credit consumption time-series points", () => {
    const data = getAiAnalytics("30d");
    assert.equal(data.usageTrends.length, 7, "Must contain 7 daily trend points");
    assert.equal(data.creditConsumption.length, 7, "Must contain 7 daily credit consumption points");

    // Oct 25 check
    const trendOct25 = data.usageTrends[0];
    assert.equal(trendOct25.date, "Oct 25");
    assert.equal(trendOct25.requests, 4900);
    assert.equal(trendOct25.successful, 3400);
    assert.equal(trendOct25.failed, 700);

    const creditOct25 = data.creditConsumption[0];
    assert.equal(creditOct25.date, "Oct 25");
    assert.equal(creditOct25.issued, 33000);
    assert.equal(creditOct25.consumed, 22500);
    assert.equal(creditOct25.refunded, 3800);
    assert.equal(creditOct25.remaining, 12200);

    // Oct 31 check
    const trendOct31 = data.usageTrends[6];
    assert.equal(trendOct31.date, "Oct 31");
    assert.equal(trendOct31.requests, 7100);
    assert.equal(trendOct31.successful, 5600);
    assert.equal(trendOct31.failed, 1100);
  });

  await t.test("5. Verifies top user usage analytics and filtering", () => {
    const data = getAiAnalytics("30d");
    assert.ok(data.userUsage.length >= 3, "Must contain at least 3 top users");

    const jayesh = data.userUsage[0];
    assert.equal(jayesh.user, "jayesh.patel");
    assert.equal(jayesh.totalGenerations, 8420);
    assert.equal(jayesh.creditsConsumed, 8420);
    assert.equal(jayesh.successful, 8210);
    assert.equal(jayesh.failed, 210);
    assert.equal(jayesh.lastGeneration, "Oct 31, 11:45 AM");

    const priya = data.userUsage[1];
    assert.equal(priya.user, "priya.shah");
    assert.equal(priya.totalGenerations, 6780);

    const rohit = data.userUsage[2];
    assert.equal(rohit.user, "rohit.desai");
    assert.equal(rohit.totalGenerations, 5930);

    // Filter test
    const filtered = queryUserUsage("priya");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].user, "priya.shah");
  });

  await t.test("6. Verifies image format and category breakdown distributions (100% sums)", () => {
    const data = getAiAnalytics("30d");
    const { aspectRatio, imageFormat, categories, presetUsage } = data.breakdown;

    // Aspect Ratio
    assert.equal(aspectRatio.ratio1_1, 52);
    assert.equal(aspectRatio.ratio9_16, 34);
    assert.equal(aspectRatio.ratio16_9, 14);
    assert.equal(aspectRatio.ratio1_1 + aspectRatio.ratio9_16 + aspectRatio.ratio16_9, 100);

    // Image Format
    assert.equal(imageFormat.jpg, 68);
    assert.equal(imageFormat.png, 32);
    assert.equal(imageFormat.jpg + imageFormat.png, 100);

    // Categories
    assert.equal(categories.festival, 40);
    assert.equal(categories.business, 35);
    assert.equal(categories.other, 25);
    assert.equal(categories.festival + categories.business + categories.other, 100);

    // Preset Usage
    assert.equal(presetUsage.templates, 60);
    assert.equal(presetUsage.aiPrompt, 40);
    assert.equal(presetUsage.templates + presetUsage.aiPrompt, 100);
  });

  await t.test("7. Updates budget configuration dynamically and recalculates percentages", () => {
    const updated = updateBudgetConfig({
      configuredBudget: 600.0,
      alertThreshold: 75,
    });

    assert.equal(updated.configuredBudget, 600.0);
    assert.equal(updated.consumed, 142.5);
    assert.equal(updated.remaining, 457.5);
    assert.equal(updated.consumedPercentage, 24); // 142.5 / 600 = 23.75% -> 24%
    assert.equal(updated.status, "Within Limit");
    assert.equal(updated.alertThreshold, 75);

    // Reset back to canonical
    resetAnalyticsData();
    const restored = getBudgetConfig();
    assert.equal(restored.configuredBudget, 500.0);
    assert.equal(restored.remaining, 357.5);
    assert.equal(restored.consumedPercentage, 29);
  });

  await t.test("8. Generates valid CSV exports for analytics and billing statements", () => {
    const data = getAiAnalytics("30d");

    const usageCsv = generateAnalyticsUsageCsv(
      data.usageTrends,
      data.providerCosts,
      data.userUsage
    );
    assert.ok(usageCsv.includes("Total Requests"), "CSV must include requests column");
    assert.ok(usageCsv.includes("OpenAI"), "CSV must contain OpenAI");
    assert.ok(usageCsv.includes("DALL·E 3"), "CSV must contain DALL·E 3");
    assert.ok(usageCsv.includes("jayesh.patel"), "CSV must contain user record");

    const billingCsv = generateBillingSummaryCsv(data.budget, data.providerCosts);
    assert.ok(billingCsv.includes("Billing Period Summary"), "Billing CSV must have header");
    assert.ok(billingCsv.includes("Configured Budget,$500.00"), "Billing CSV must list budget");
    assert.ok(billingCsv.includes("Total Consumed,$142.50 (29%)"), "Billing CSV must list consumed amount");
    assert.ok(billingCsv.includes("Remaining Budget,$357.50"), "Billing CSV must list remaining balance");
  });
});
