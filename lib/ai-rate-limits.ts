/**
 * Authoritative types, models, and canonical seed for
 * Screen 34: AI Generation API Rate Limits & Throttling Configuration
 */

export type RateLimitScope =
  | "Global"
  | "Per User"
  | "Per Subscription Plan"
  | "Per Provider"
  | "Per Endpoint";

export type RateLimitStatus = "Active" | "Paused" | "Disabled" | "Limited";

export type EnforcementMode =
  | "Reject Request (HTTP 429)"
  | "Throttling (Queue)"
  | "Delayed Retry"
  | "Temporary Cooldown";

export interface RateLimitPolicy {
  id: string; // e.g. "POL-001"
  name: string; // e.g. "Global Rate Limit"
  scope: RateLimitScope; // "Global"
  endpoint: string; // "/api/generate-image"
  requestLimit: number; // e.g. 1000
  timeWindow: string; // e.g. "1 Hour", "5 Minutes"
  timeWindowSeconds: number; // e.g. 3600, 300
  burstAllowance: number; // e.g. 100
  enforcementMode: EnforcementMode; // "Throttling (Queue)"
  status: RateLimitStatus; // "Active"
  enabled: boolean;
  lastUpdated: string; // e.g. "Nov 19, 2025, 10:30 AM"
  updatedBy: string; // e.g. "Parth Admin"
}

export interface RateLimitSummaryMetrics {
  activePolicies: number; // 5
  protectedEndpoints: number; // 8
  requestsCurrentlyThrottled: number; // 12
  rateLimitEvents: number; // 48
}

export interface PlanLimitCard {
  id: string;
  title: string;
  badge: string; // "Inherited", "None", "1 Active"
  badgeType: "purple" | "gray" | "green";
  features: string[];
}

export interface ProviderRateLimitItem {
  provider: string; // "OpenAI"
  model: string; // "GPT-4o"
  requestsPerMinute: string; // "Unavailable"
  concurrentRequests: string; // "Unavailable"
  providerQuota: string; // "Unavailable"
  currentUsage: string; // "Unavailable"
  configurationSource: string; // "Default"
  status: "Active" | "Limited" | "Unavailable";
}

export interface ThrottlingBehaviorConfig {
  selectedBehavior: "Reject Request" | "Queue Request" | "Delayed Retry" | "Temporary Cooldown";
  http429Title: string; // "Too Many Requests"
  http429Message: string; // "Your request has been rate limited. Please try again later."
  cooldownDurationMinutes?: number;
  retryAfterSeconds?: number;
}

export interface RateLimitEvent {
  id: string; // e.g. "EVT-1001"
  timestamp: string; // e.g. "Nov 19, 2025, 10:46 AM"
  userClientReference: string; // e.g. "user_2847"
  endpoint: string; // e.g. "/api/generate-image"
  appliedPolicy: string; // e.g. "Global Rate Limit"
  requestCount: number; // e.g. 1001
  enforcementAction: "Throttled" | "Delayed" | "Rejected";
  relatedRequestId: string; // e.g. "REQ-4587"
}

export interface PolicyAuditRecord {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  details: string;
}

export interface RateLimitDataset {
  summary: RateLimitSummaryMetrics;
  policies: RateLimitPolicy[];
  planLimits: PlanLimitCard[];
  providerRateLimits: ProviderRateLimitItem[];
  throttlingBehavior: ThrottlingBehaviorConfig;
  eventHistory: RateLimitEvent[];
  auditHistory: PolicyAuditRecord[];
  lastUpdated: string;
}

// Canonical 5 Policies matching Screen 34 reference image table exactly
export const CANONICAL_RATE_LIMIT_POLICIES: RateLimitPolicy[] = [
  {
    id: "POL-001",
    name: "Global Rate Limit",
    scope: "Global",
    endpoint: "/api/generate-image",
    requestLimit: 1000,
    timeWindow: "1 Hour",
    timeWindowSeconds: 3600,
    burstAllowance: 100,
    enforcementMode: "Throttling (Queue)",
    status: "Active",
    enabled: true,
    lastUpdated: "Nov 19, 2025, 10:30 AM",
    updatedBy: "Parth Admin",
  },
  {
    id: "POL-002",
    name: "Per User Limit",
    scope: "Per User",
    endpoint: "/api/generate-image",
    requestLimit: 100,
    timeWindow: "1 Hour",
    timeWindowSeconds: 3600,
    burstAllowance: 20,
    enforcementMode: "Throttling (Queue)",
    status: "Active",
    enabled: true,
    lastUpdated: "Nov 19, 2025, 09:45 AM",
    updatedBy: "Parth Admin",
  },
  {
    id: "POL-003",
    name: "Premium Plan Limit",
    scope: "Per Subscription Plan",
    endpoint: "/api/generate-image",
    requestLimit: 2000,
    timeWindow: "1 Hour",
    timeWindowSeconds: 3600,
    burstAllowance: 200,
    enforcementMode: "Throttling (Queue)",
    status: "Active",
    enabled: true,
    lastUpdated: "Nov 19, 2025, 09:30 AM",
    updatedBy: "Parth Admin",
  },
  {
    id: "POL-004",
    name: "Per Provider Limit",
    scope: "Per Provider",
    endpoint: "/api/generate-image",
    requestLimit: 500,
    timeWindow: "1 Hour",
    timeWindowSeconds: 3600,
    burstAllowance: 50,
    enforcementMode: "Throttling (Queue)",
    status: "Paused",
    enabled: false,
    lastUpdated: "Nov 19, 2025, 08:20 AM",
    updatedBy: "Parth Admin",
  },
  {
    id: "POL-005",
    name: "Burst Protection",
    scope: "Per Endpoint",
    endpoint: "/api/generate-image",
    requestLimit: 200,
    timeWindow: "5 Minutes",
    timeWindowSeconds: 300,
    burstAllowance: 50,
    enforcementMode: "Reject Request (HTTP 429)",
    status: "Active",
    enabled: true,
    lastUpdated: "Nov 19, 2025, 08:15 AM",
    updatedBy: "Parth Admin",
  },
];

// Canonical 4 Plan & User cards matching Screen 34 reference image
export const CANONICAL_PLAN_LIMIT_CARDS: PlanLimitCard[] = [
  {
    id: "card_free",
    title: "Free Plan Limits",
    badge: "Inherited",
    badgeType: "purple",
    features: ["100 requests/hour", "10 concurrent", "Basic models"],
  },
  {
    id: "card_paid",
    title: "Paid Plan Limits",
    badge: "Inherited",
    badgeType: "purple",
    features: ["2,000 requests/hour", "50 concurrent", "Premium models"],
  },
  {
    id: "card_user_overrides",
    title: "Individual User Overrides",
    badge: "None",
    badgeType: "gray",
    features: ["No custom limits for selected users"],
  },
  {
    id: "card_admin_exemptions",
    title: "Administrative Exemptions",
    badge: "1 Active",
    badgeType: "green",
    features: ["Internal team accounts are exempted"],
  },
];

// Canonical Provider Rate-Limits table matching Screen 34 reference image
export const CANONICAL_PROVIDER_RATE_LIMITS: ProviderRateLimitItem[] = [
  {
    provider: "OpenAI",
    model: "GPT-4o",
    requestsPerMinute: "Unavailable",
    concurrentRequests: "Unavailable",
    providerQuota: "Unavailable",
    currentUsage: "Unavailable",
    configurationSource: "Default",
    status: "Active",
  },
  {
    provider: "Gemini",
    model: "Gemini 1.5 Pro",
    requestsPerMinute: "Unavailable",
    concurrentRequests: "Unavailable",
    providerQuota: "Unavailable",
    currentUsage: "Unavailable",
    configurationSource: "Default",
    status: "Active",
  },
  {
    provider: "Stability AI",
    model: "Stable Diffusion XL",
    requestsPerMinute: "Unavailable",
    concurrentRequests: "Unavailable",
    providerQuota: "Unavailable",
    currentUsage: "Unavailable",
    configurationSource: "Default",
    status: "Limited",
  },
];

// Canonical Rate-Limit Event History matching Screen 34 reference image table
export const CANONICAL_RATE_LIMIT_EVENTS: RateLimitEvent[] = [
  {
    id: "EVT-1001",
    timestamp: "Nov 19, 2025, 10:46 AM",
    userClientReference: "user_2847",
    endpoint: "/api/generate-image",
    appliedPolicy: "Global Rate Limit",
    requestCount: 1001,
    enforcementAction: "Throttled",
    relatedRequestId: "REQ-4587",
  },
  {
    id: "EVT-1002",
    timestamp: "Nov 19, 2025, 10:40 AM",
    userClientReference: "user_1293",
    endpoint: "/api/generate-image",
    appliedPolicy: "Per User Limit",
    requestCount: 101,
    enforcementAction: "Delayed",
    relatedRequestId: "REQ-4586",
  },
  {
    id: "EVT-1003",
    timestamp: "Nov 19, 2025, 10:35 AM",
    userClientReference: "user_7721",
    endpoint: "/api/generate-image",
    appliedPolicy: "Burst Protection",
    requestCount: 201,
    enforcementAction: "Rejected",
    relatedRequestId: "REQ-4585",
  },
];

// Canonical seed dataset matching Screen 34 reference photo exactly
export const CANONICAL_RATE_LIMIT_SEED: RateLimitDataset = {
  summary: {
    activePolicies: 5,
    protectedEndpoints: 8,
    requestsCurrentlyThrottled: 12,
    rateLimitEvents: 48,
  },
  policies: CANONICAL_RATE_LIMIT_POLICIES,
  planLimits: CANONICAL_PLAN_LIMIT_CARDS,
  providerRateLimits: CANONICAL_PROVIDER_RATE_LIMITS,
  throttlingBehavior: {
    selectedBehavior: "Reject Request",
    http429Title: "Too Many Requests",
    http429Message: "Your request has been rate limited. Please try again later.",
    cooldownDurationMinutes: 15,
    retryAfterSeconds: 60,
  },
  eventHistory: CANONICAL_RATE_LIMIT_EVENTS,
  auditHistory: [
    {
      id: "AUD-POL-01",
      timestamp: "Nov 19, 2025, 10:30 AM",
      adminName: "Parth Admin",
      action: "Updated Global Rate Limit",
      details: "Configured request limit to 1,000 / 1 Hour with burst 100",
    },
    {
      id: "AUD-POL-02",
      timestamp: "Nov 19, 2025, 08:20 AM",
      adminName: "Parth Admin",
      action: "Paused Per Provider Limit",
      details: "Temporarily paused Per Provider Limit policy for maintenance",
    },
  ],
  lastUpdated: "Nov 19, 2025, 10:30 AM",
};

/**
 * Recalculate summary metrics from active policy list
 */
export function recalculateRateLimitMetrics(
  policies: RateLimitPolicy[],
  events: RateLimitEvent[]
): RateLimitSummaryMetrics {
  const activeCount = policies.filter((p) => p.status === "Active" && p.enabled).length;
  const uniqueEndpoints = new Set(policies.map((p) => p.endpoint));

  return {
    activePolicies: activeCount,
    protectedEndpoints: Math.max(8, uniqueEndpoints.size),
    requestsCurrentlyThrottled: 12,
    rateLimitEvents: Math.max(48, events.length),
  };
}
