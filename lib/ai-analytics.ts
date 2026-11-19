export interface AiAnalyticsOverviewMetrics {
  totalImagesGenerated: number;
  totalImagesChange: string;
  totalCreditsConsumed: number;
  totalCreditsChange: string;
  actualProviderCost: number;
  actualProviderCostChange: string;
  averageCostPerImage: number;
  averageCostChange: string;
}

export interface UsageTrendPoint {
  date: string;
  timestamp: number;
  requests: number;
  successful: number;
  failed: number;
}

export interface CreditConsumptionPoint {
  date: string;
  timestamp: number;
  issued: number;
  consumed: number;
  refunded: number;
  remaining: number;
}

export interface ProviderCostRecord {
  id: string;
  provider: string;
  model: string;
  imagesGenerated: number;
  usageUnits: number;
  totalCost: number;
  billingPeriod: string;
  currency: string;
}

export interface UserUsageRecord {
  userId: string;
  user: string;
  totalGenerations: number;
  creditsConsumed: number;
  successful: number;
  failed: number;
  lastGeneration: string;
}

export interface AspectRatioDistribution {
  ratio1_1: number;
  ratio9_16: number;
  ratio16_9: number;
}

export interface ImageFormatDistribution {
  jpg: number;
  png: number;
}

export interface CategoryDistribution {
  festival: number;
  business: number;
  other: number;
}

export interface PresetUsageDistribution {
  templates: number;
  aiPrompt: number;
}

export interface ImageBreakdownData {
  aspectRatio: AspectRatioDistribution;
  imageFormat: ImageFormatDistribution;
  categories: CategoryDistribution;
  presetUsage: PresetUsageDistribution;
}

export interface BudgetConfig {
  configuredBudget: number;
  consumed: number;
  remaining: number;
  consumedPercentage: number;
  status: "Within Limit" | "Approaching Limit" | "Exceeded";
  currency: string;
  billingPeriod: string;
  alertThreshold: number;
}

export interface AiAnalyticsDataset {
  overview: AiAnalyticsOverviewMetrics;
  usageTrends: UsageTrendPoint[];
  creditConsumption: CreditConsumptionPoint[];
  providerCosts: ProviderCostRecord[];
  userUsage: UserUsageRecord[];
  breakdown: ImageBreakdownData;
  budget: BudgetConfig;
  selectedTimeRange: string;
  lastUpdated: string;
}

/**
 * Canonical Screen 24 KPI Overview Metrics
 */
export const CANONICAL_ANALYTICS_OVERVIEW: AiAnalyticsOverviewMetrics = {
  totalImagesGenerated: 48750,
  totalImagesChange: "+12.5%",
  totalCreditsConsumed: 48750,
  totalCreditsChange: "+12.3%",
  actualProviderCost: 142.5,
  actualProviderCostChange: "+10.8%",
  averageCostPerImage: 0.0029,
  averageCostChange: "-1.1%",
};

/**
 * Canonical Screen 24 Usage Trends (Oct 25 – Oct 31)
 */
export const CANONICAL_USAGE_TRENDS: UsageTrendPoint[] = [
  { date: "Oct 25", timestamp: 1761350400000, requests: 4900, successful: 3400, failed: 700 },
  { date: "Oct 26", timestamp: 1761436800000, requests: 5200, successful: 3700, failed: 800 },
  { date: "Oct 27", timestamp: 1761523200000, requests: 6700, successful: 5100, failed: 900 },
  { date: "Oct 28", timestamp: 1761609600000, requests: 6900, successful: 5200, failed: 800 },
  { date: "Oct 29", timestamp: 1761696000000, requests: 6000, successful: 4400, failed: 700 },
  { date: "Oct 30", timestamp: 1761782400000, requests: 6500, successful: 4900, failed: 900 },
  { date: "Oct 31", timestamp: 1761868800000, requests: 7100, successful: 5600, failed: 1100 },
];

/**
 * Canonical Screen 24 Credit Consumption (Oct 25 – Oct 31)
 */
export const CANONICAL_CREDIT_CONSUMPTION: CreditConsumptionPoint[] = [
  { date: "Oct 25", timestamp: 1761350400000, issued: 33000, consumed: 22500, refunded: 3800, remaining: 12200 },
  { date: "Oct 26", timestamp: 1761436800000, issued: 33500, consumed: 23200, refunded: 4100, remaining: 12500 },
  { date: "Oct 27", timestamp: 1761523200000, issued: 34000, consumed: 24100, refunded: 4300, remaining: 13100 },
  { date: "Oct 28", timestamp: 1761609600000, issued: 34500, consumed: 24800, refunded: 4200, remaining: 13600 },
  { date: "Oct 29", timestamp: 1761696000000, issued: 34800, consumed: 24200, refunded: 4500, remaining: 13800 },
  { date: "Oct 30", timestamp: 1761782400000, issued: 35200, consumed: 25400, refunded: 4600, remaining: 14100 },
  { date: "Oct 31", timestamp: 1761868800000, issued: 35500, consumed: 25800, refunded: 4700, remaining: 14500 },
];

/**
 * Canonical Screen 24 Provider Cost Breakdown
 * OpenAI: 28,500 imgs ($85.50)
 * Google: 12,800 imgs ($45.20)
 * Replicate: 7,450 imgs ($11.80)
 * Total: 48,750 images, $142.50
 */
export const CANONICAL_PROVIDER_COSTS: ProviderCostRecord[] = [
  {
    id: "prov-openai",
    provider: "OpenAI",
    model: "DALL·E 3",
    imagesGenerated: 28500,
    usageUnits: 28500,
    totalCost: 85.5,
    billingPeriod: "Oct 01 – Oct 31",
    currency: "USD",
  },
  {
    id: "prov-google",
    provider: "Google",
    model: "Imagen 3",
    imagesGenerated: 12800,
    usageUnits: 12800,
    totalCost: 45.2,
    billingPeriod: "Oct 01 – Oct 31",
    currency: "USD",
  },
  {
    id: "prov-replicate",
    provider: "Replicate",
    model: "SDXL Turbo",
    imagesGenerated: 7450,
    usageUnits: 7450,
    totalCost: 11.8,
    billingPeriod: "Oct 01 – Oct 31",
    currency: "USD",
  },
];

/**
 * Canonical Screen 24 User Usage Analytics
 */
export const CANONICAL_USER_USAGE: UserUsageRecord[] = [
  {
    userId: "usr-001",
    user: "jayesh.patel",
    totalGenerations: 8420,
    creditsConsumed: 8420,
    successful: 8210,
    failed: 210,
    lastGeneration: "Oct 31, 11:45 AM",
  },
  {
    userId: "usr-002",
    user: "priya.shah",
    totalGenerations: 6780,
    creditsConsumed: 6780,
    successful: 6621,
    failed: 159,
    lastGeneration: "Oct 31, 10:20 AM",
  },
  {
    userId: "usr-003",
    user: "rohit.desai",
    totalGenerations: 5930,
    creditsConsumed: 5930,
    successful: 5810,
    failed: 120,
    lastGeneration: "Oct 31, 09:15 AM",
  },
  {
    userId: "usr-004",
    user: "parth.patel",
    totalGenerations: 5120,
    creditsConsumed: 5120,
    successful: 5040,
    failed: 80,
    lastGeneration: "Oct 30, 04:32 PM",
  },
  {
    userId: "usr-005",
    user: "neha.patel",
    totalGenerations: 4320,
    creditsConsumed: 4320,
    successful: 4210,
    failed: 110,
    lastGeneration: "Oct 30, 02:15 PM",
  },
];

/**
 * Canonical Screen 24 Image Format & Category Breakdown
 */
export const CANONICAL_BREAKDOWN: ImageBreakdownData = {
  aspectRatio: {
    ratio1_1: 52,
    ratio9_16: 34,
    ratio16_9: 14,
  },
  imageFormat: {
    jpg: 68,
    png: 32,
  },
  categories: {
    festival: 40,
    business: 35,
    other: 25,
  },
  presetUsage: {
    templates: 60,
    aiPrompt: 40,
  },
};

/**
 * Canonical Screen 24 Budget & Usage Limits
 */
export const CANONICAL_BUDGET: BudgetConfig = {
  configuredBudget: 500.0,
  consumed: 142.5,
  remaining: 357.5,
  consumedPercentage: 29,
  status: "Within Limit",
  currency: "USD",
  billingPeriod: "Oct 01 – Oct 31, 2026",
  alertThreshold: 80,
};

/**
 * Generate CSV export text for Usage & Cost Analytics
 */
export function generateAnalyticsUsageCsv(
  usage: UsageTrendPoint[],
  providers: ProviderCostRecord[],
  users: UserUsageRecord[]
): string {
  const lines: string[] = [];

  // Section 1: Usage Trends Summary
  lines.push("Date,Total Requests,Successful,Failed");
  usage.forEach((u) => {
    lines.push(`"${u.date}",${u.requests},${u.successful},${u.failed}`);
  });
  lines.push("");

  // Section 2: Provider Cost Breakdown
  lines.push("Provider,Model,Images Generated,Usage Units,Total Cost (USD),Billing Period");
  providers.forEach((p) => {
    lines.push(
      `"${p.provider}","${p.model}",${p.imagesGenerated},${p.usageUnits},${p.totalCost.toFixed(2)},"${p.billingPeriod}"`
    );
  });
  lines.push("");

  // Section 3: User Generation Activity
  lines.push("User ID,User,Total Generations,Credits Consumed,Successful,Failed,Last Generation");
  users.forEach((usr) => {
    lines.push(
      `"${usr.userId}","${usr.user}",${usr.totalGenerations},${usr.creditsConsumed},${usr.successful},${usr.failed},"${usr.lastGeneration}"`
    );
  });

  return lines.join("\n");
}

/**
 * Generate Billing Period Summary CSV
 */
export function generateBillingSummaryCsv(
  budget: BudgetConfig,
  providers: ProviderCostRecord[]
): string {
  const lines: string[] = [];
  lines.push("Billing Period Summary,Post Hub AI Generation");
  lines.push(`Billing Period,"${budget.billingPeriod}"`);
  lines.push(`Configured Budget,$${budget.configuredBudget.toFixed(2)}`);
  lines.push(`Total Consumed,$${budget.consumed.toFixed(2)} (${budget.consumedPercentage}%)`);
  lines.push(`Remaining Budget,$${budget.remaining.toFixed(2)}`);
  lines.push(`Status,"${budget.status}"`);
  lines.push("");
  lines.push("Provider,Model,Images Generated,Cost (USD),Proportion");

  const totalCost = providers.reduce((sum, p) => sum + p.totalCost, 0);
  providers.forEach((p) => {
    const pct = totalCost > 0 ? ((p.totalCost / totalCost) * 100).toFixed(1) : "0";
    lines.push(`"${p.provider}","${p.model}",${p.imagesGenerated},$${p.totalCost.toFixed(2)},${pct}%`);
  });

  return lines.join("\n");
}
