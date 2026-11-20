import fs from "fs";
import path from "path";
import {
  type RateLimitDataset,
  type RateLimitPolicy,
  type ThrottlingBehaviorConfig,
  CANONICAL_RATE_LIMIT_SEED,
  recalculateRateLimitMetrics,
} from "./ai-rate-limits.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORAGE_FILE = path.join(DATA_DIR, "ai-rate-limits.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load authoritative Rate Limits dataset
 */
export function getRateLimitsDataset(): RateLimitDataset {
  ensureDataDir();

  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(
      STORAGE_FILE,
      JSON.stringify(CANONICAL_RATE_LIMIT_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_RATE_LIMIT_SEED));
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.policies)) {
      return parsed as RateLimitDataset;
    }
    fs.writeFileSync(
      STORAGE_FILE,
      JSON.stringify(CANONICAL_RATE_LIMIT_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_RATE_LIMIT_SEED));
  } catch (err) {
    console.error("Error reading ai-rate-limits.json:", err);
    return JSON.parse(JSON.stringify(CANONICAL_RATE_LIMIT_SEED));
  }
}

/**
 * Save Rate Limits dataset
 */
export function saveRateLimitsDataset(dataset: RateLimitDataset): void {
  ensureDataDir();
  dataset.summary = recalculateRateLimitMetrics(dataset.policies, dataset.eventHistory);
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(dataset, null, 2), "utf-8");
}

/**
 * Update a rate limit policy by ID
 */
export function updateRateLimitPolicy(
  policyId: string,
  partial: Partial<RateLimitPolicy>,
  adminName: string = "Parth Admin"
): { success: boolean; policy?: RateLimitPolicy; error?: string } {
  const dataset = getRateLimitsDataset();
  const index = dataset.policies.findIndex((p) => p.id === policyId);
  if (index === -1) {
    return { success: false, error: `Policy ${policyId} not found.` };
  }

  const now = new Date();
  const timeFormatted = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const current = dataset.policies[index];
  const updated: RateLimitPolicy = {
    ...current,
    ...partial,
    lastUpdated: timeFormatted,
    updatedBy: adminName,
  };

  dataset.policies[index] = updated;

  // Append audit trail record
  dataset.auditHistory.unshift({
    id: `AUD-POL-${Date.now().toString().slice(-4)}`,
    timestamp: timeFormatted,
    adminName,
    action: `Updated policy '${updated.name}'`,
    details: `Limit: ${updated.requestLimit} / ${updated.timeWindow}, Burst: ${updated.burstAllowance}, Status: ${updated.status}`,
  });

  dataset.lastUpdated = timeFormatted;
  saveRateLimitsDataset(dataset);
  return { success: true, policy: updated };
}

/**
 * Toggle policy active / paused status
 */
export function togglePolicyStatus(
  policyId: string,
  adminName: string = "Parth Admin"
): { success: boolean; policy?: RateLimitPolicy; error?: string } {
  const dataset = getRateLimitsDataset();
  const policy = dataset.policies.find((p) => p.id === policyId);
  if (!policy) {
    return { success: false, error: `Policy ${policyId} not found.` };
  }

  const nextStatus = policy.status === "Active" ? "Paused" : "Active";
  const nextEnabled = nextStatus === "Active";

  return updateRateLimitPolicy(
    policyId,
    { status: nextStatus, enabled: nextEnabled },
    adminName
  );
}

/**
 * Create a new rate limit policy
 */
export function createRateLimitPolicy(
  policy: Omit<RateLimitPolicy, "id" | "lastUpdated" | "updatedBy">,
  adminName: string = "Parth Admin"
): { success: boolean; policy?: RateLimitPolicy; error?: string } {
  const dataset = getRateLimitsDataset();

  if (!policy.name || !policy.endpoint || policy.requestLimit <= 0) {
    return { success: false, error: "Invalid policy parameters. Name, endpoint, and positive limit are required." };
  }

  const now = new Date();
  const timeFormatted = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newPolicy: RateLimitPolicy = {
    ...policy,
    id: `POL-00${dataset.policies.length + 1}`,
    lastUpdated: timeFormatted,
    updatedBy: adminName,
  };

  dataset.policies.push(newPolicy);
  dataset.auditHistory.unshift({
    id: `AUD-POL-${Date.now().toString().slice(-4)}`,
    timestamp: timeFormatted,
    adminName,
    action: `Created policy '${newPolicy.name}'`,
    details: `Scope: ${newPolicy.scope}, Limit: ${newPolicy.requestLimit} / ${newPolicy.timeWindow}`,
  });

  dataset.lastUpdated = timeFormatted;
  saveRateLimitsDataset(dataset);
  return { success: true, policy: newPolicy };
}

/**
 * Delete a rate limit policy
 */
export function deleteRateLimitPolicy(
  policyId: string,
  adminName: string = "Parth Admin"
): { success: boolean; error?: string } {
  const dataset = getRateLimitsDataset();
  const index = dataset.policies.findIndex((p) => p.id === policyId);
  if (index === -1) {
    return { success: false, error: `Policy ${policyId} not found.` };
  }

  const removed = dataset.policies.splice(index, 1)[0];
  const now = new Date();
  const timeFormatted = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  dataset.auditHistory.unshift({
    id: `AUD-POL-${Date.now().toString().slice(-4)}`,
    timestamp: timeFormatted,
    adminName,
    action: `Deleted policy '${removed.name}'`,
    details: `Removed policy ID ${policyId}`,
  });

  saveRateLimitsDataset(dataset);
  return { success: true };
}

/**
 * Update throttling behavior configuration
 */
export function updateThrottlingBehavior(
  behavior: ThrottlingBehaviorConfig["selectedBehavior"]
): { success: boolean; config: ThrottlingBehaviorConfig } {
  const dataset = getRateLimitsDataset();
  dataset.throttlingBehavior.selectedBehavior = behavior;
  saveRateLimitsDataset(dataset);
  return { success: true, config: dataset.throttlingBehavior };
}

/**
 * Local simulation test of a request payload against effective rate limits
 */
export function testPolicyEvaluation(params: {
  endpoint: string;
  requestCount: number;
  userId?: string;
  plan?: string;
}): {
  allowed: boolean;
  enforcementAction: "Allowed" | "Throttled (Queue)" | "Rejected (HTTP 429)" | "Delayed";
  limitingPolicy: string;
  retryAfterSeconds?: number;
} {
  const dataset = getRateLimitsDataset();
  const activePolicies = dataset.policies.filter((p) => p.enabled && p.status === "Active");

  // Check burst protection first (Per Endpoint)
  const burst = activePolicies.find(
    (p) => p.scope === "Per Endpoint" && p.endpoint === params.endpoint
  );
  if (burst && params.requestCount > burst.requestLimit + burst.burstAllowance) {
    return {
      allowed: false,
      enforcementAction: "Rejected (HTTP 429)",
      limitingPolicy: burst.name,
      retryAfterSeconds: 60,
    };
  }

  // Check global limit
  const global = activePolicies.find((p) => p.scope === "Global");
  if (global && params.requestCount > global.requestLimit) {
    return {
      allowed: false,
      enforcementAction: "Throttled (Queue)",
      limitingPolicy: global.name,
      retryAfterSeconds: 120,
    };
  }

  // Check user limit
  const userPolicy = activePolicies.find((p) => p.scope === "Per User");
  if (userPolicy && params.requestCount > userPolicy.requestLimit) {
    return {
      allowed: false,
      enforcementAction: "Throttled (Queue)",
      limitingPolicy: userPolicy.name,
      retryAfterSeconds: 300,
    };
  }

  return {
    allowed: true,
    enforcementAction: "Allowed",
    limitingPolicy: "None (Within Limits)",
  };
}

/**
 * Reset dataset back to canonical pristine state
 */
export function resetRateLimitsData(): void {
  ensureDataDir();
  fs.writeFileSync(
    STORAGE_FILE,
    JSON.stringify(CANONICAL_RATE_LIMIT_SEED, null, 2),
    "utf-8"
  );
}
