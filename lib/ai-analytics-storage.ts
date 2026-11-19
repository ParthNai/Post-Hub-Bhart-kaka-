import fs from "fs";
import path from "path";
import type {
  AiAnalyticsOverviewMetrics,
  UsageTrendPoint,
  CreditConsumptionPoint,
  ProviderCostRecord,
  UserUsageRecord,
  ImageBreakdownData,
  BudgetConfig,
  AiAnalyticsDataset,
} from "./ai-analytics.ts";
import {
  CANONICAL_ANALYTICS_OVERVIEW,
  CANONICAL_USAGE_TRENDS,
  CANONICAL_CREDIT_CONSUMPTION,
  CANONICAL_PROVIDER_COSTS,
  CANONICAL_USER_USAGE,
  CANONICAL_BREAKDOWN,
  CANONICAL_BUDGET,
} from "./ai-analytics.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const ANALYTICS_FILE = path.join(DATA_DIR, "ai-analytics.json");
const BUDGET_FILE = path.join(DATA_DIR, "ai-budget-settings.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getCanonicalDataset(): {
  overview: AiAnalyticsOverviewMetrics;
  usageTrends: UsageTrendPoint[];
  creditConsumption: CreditConsumptionPoint[];
  providerCosts: ProviderCostRecord[];
  userUsage: UserUsageRecord[];
  breakdown: ImageBreakdownData;
} {
  return {
    overview: { ...CANONICAL_ANALYTICS_OVERVIEW },
    usageTrends: CANONICAL_USAGE_TRENDS.map((u) => ({ ...u })),
    creditConsumption: CANONICAL_CREDIT_CONSUMPTION.map((c) => ({ ...c })),
    providerCosts: CANONICAL_PROVIDER_COSTS.map((p) => ({ ...p })),
    userUsage: CANONICAL_USER_USAGE.map((usr) => ({ ...usr })),
    breakdown: {
      aspectRatio: { ...CANONICAL_BREAKDOWN.aspectRatio },
      imageFormat: { ...CANONICAL_BREAKDOWN.imageFormat },
      categories: { ...CANONICAL_BREAKDOWN.categories },
      presetUsage: { ...CANONICAL_BREAKDOWN.presetUsage },
    },
  };
}

/**
 * Load raw analytics data from storage
 */
function getStoredAnalytics(): {
  overview: AiAnalyticsOverviewMetrics;
  usageTrends: UsageTrendPoint[];
  creditConsumption: CreditConsumptionPoint[];
  providerCosts: ProviderCostRecord[];
  userUsage: UserUsageRecord[];
  breakdown: ImageBreakdownData;
} {
  ensureDataDir();
  if (!fs.existsSync(ANALYTICS_FILE)) {
    const initial = getCanonicalDataset();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(ANALYTICS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.overview && parsed.usageTrends && parsed.providerCosts) {
      return parsed;
    }
    const initial = getCanonicalDataset();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.error("Error reading ai-analytics file:", err);
    const initial = getCanonicalDataset();
    return initial;
  }
}

/**
 * Save raw analytics data to storage
 */
function saveStoredAnalytics(data: {
  overview: AiAnalyticsOverviewMetrics;
  usageTrends: UsageTrendPoint[];
  creditConsumption: CreditConsumptionPoint[];
  providerCosts: ProviderCostRecord[];
  userUsage: UserUsageRecord[];
  breakdown: ImageBreakdownData;
}): void {
  ensureDataDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Load budget configuration from storage
 */
export function getBudgetConfig(): BudgetConfig {
  ensureDataDir();
  if (!fs.existsSync(BUDGET_FILE)) {
    fs.writeFileSync(BUDGET_FILE, JSON.stringify(CANONICAL_BUDGET, null, 2), "utf-8");
    return { ...CANONICAL_BUDGET };
  }
  try {
    const raw = fs.readFileSync(BUDGET_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.configuredBudget !== undefined && parsed.consumed !== undefined) {
      return parsed;
    }
    return { ...CANONICAL_BUDGET };
  } catch {
    return { ...CANONICAL_BUDGET };
  }
}

/**
 * Update budget configuration
 */
export function updateBudgetConfig(updates: Partial<BudgetConfig>): BudgetConfig {
  ensureDataDir();
  const current = getBudgetConfig();
  const newBudget = updates.configuredBudget !== undefined ? updates.configuredBudget : current.configuredBudget;
  const newConsumed = updates.consumed !== undefined ? updates.consumed : current.consumed;
  const remaining = Math.max(0, newBudget - newConsumed);
  const consumedPercentage = newBudget > 0 ? Math.round((newConsumed / newBudget) * 100) : 0;

  const status: BudgetConfig["status"] =
    consumedPercentage >= 100
      ? "Exceeded"
      : consumedPercentage >= (current.alertThreshold || 80)
      ? "Approaching Limit"
      : "Within Limit";

  const updated: BudgetConfig = {
    ...current,
    ...updates,
    configuredBudget: newBudget,
    consumed: newConsumed,
    remaining,
    consumedPercentage,
    status,
  };

  fs.writeFileSync(BUDGET_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/**
 * Get complete AI analytics dataset for specified time range
 */
export function getAiAnalytics(timeRange: string = "30d"): AiAnalyticsDataset {
  const stored = getStoredAnalytics();
  const budget = getBudgetConfig();

  // Multiplier or slice according to time range if requested
  let trends = stored.usageTrends;
  let credit = stored.creditConsumption;

  if (timeRange === "7d") {
    trends = stored.usageTrends.slice(-7);
    credit = stored.creditConsumption.slice(-7);
  }

  // Calculate actual total provider cost
  const totalCost = stored.providerCosts.reduce((acc, p) => acc + p.totalCost, 0);
  const totalImages = stored.providerCosts.reduce((acc, p) => acc + p.imagesGenerated, 0);
  const avgCost = totalImages > 0 ? Number((totalCost / totalImages).toFixed(4)) : 0.0029;

  const overview: AiAnalyticsOverviewMetrics = {
    ...stored.overview,
    actualProviderCost: Number(totalCost.toFixed(2)),
    totalImagesGenerated: totalImages,
    totalCreditsConsumed: totalImages,
    averageCostPerImage: avgCost,
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return {
    overview,
    usageTrends: trends,
    creditConsumption: credit,
    providerCosts: stored.providerCosts,
    userUsage: stored.userUsage,
    breakdown: stored.breakdown,
    budget,
    selectedTimeRange: timeRange,
    lastUpdated: `${dateStr} • ${timeStr}`,
  };
}

/**
 * Filter user usage records
 */
export function queryUserUsage(query?: string): UserUsageRecord[] {
  const stored = getStoredAnalytics();
  if (!query || !query.trim()) return stored.userUsage;

  const q = query.toLowerCase().trim();
  return stored.userUsage.filter(
    (u) =>
      u.user.toLowerCase().includes(q) ||
      u.userId.toLowerCase().includes(q)
  );
}

/**
 * Reset analytics data to canonical Screen 24 reference values
 */
export function resetAnalyticsData(): AiAnalyticsDataset {
  const canonical = getCanonicalDataset();
  saveStoredAnalytics(canonical);
  ensureDataDir();
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(CANONICAL_BUDGET, null, 2), "utf-8");
  return getAiAnalytics("30d");
}
