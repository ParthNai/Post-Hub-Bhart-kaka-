import fs from "fs";
import path from "path";
import type {
  RoutingDataset,
  RoutingRule,
  ProviderPriorityItem,
  RoutingEventHistory,
  FailoverConditions,
} from "./ai-failover.ts";
import { CANONICAL_ROUTING_SEED } from "./ai-failover.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const ROUTING_FILE = path.join(DATA_DIR, "ai-routing-failover.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStoredData(): RoutingDataset {
  ensureDataDirectory();
  if (!fs.existsSync(ROUTING_FILE)) {
    fs.writeFileSync(
      ROUTING_FILE,
      JSON.stringify(CANONICAL_ROUTING_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_ROUTING_SEED));
  }

  try {
    const raw = fs.readFileSync(ROUTING_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.rules || !parsed.providerPriorities) {
      throw new Error("Invalid routing payload");
    }
    return parsed;
  } catch {
    fs.writeFileSync(
      ROUTING_FILE,
      JSON.stringify(CANONICAL_ROUTING_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_ROUTING_SEED));
  }
}

function writeStoredData(data: RoutingDataset) {
  ensureDataDirectory();
  data.lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  data.summary.lastConfigUpdate = data.lastUpdated;
  fs.writeFileSync(ROUTING_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function recalculateSummary(data: RoutingDataset) {
  const activeCount = data.rules.filter((r) => r.status === "Active" && r.enabled).length;
  const configuredProviders = data.providerPriorities.length;
  const fallbackRulesCount = data.rules.filter(
    (r) => r.fallbackPolicy && r.fallbackPolicy !== "None"
  ).length;

  data.summary = {
    activeRoutingRules: activeCount,
    configuredProviders,
    fallbackRules: fallbackRulesCount,
    lastConfigUpdate: data.summary.lastConfigUpdate || "Just now",
  };
}

/**
 * Get complete routing and failover dataset
 */
export function getRoutingData(): RoutingDataset {
  return readStoredData();
}

/**
 * Reset dataset to canonical seed
 */
export function resetRoutingData(): RoutingDataset {
  ensureDataDirectory();
  fs.writeFileSync(
    ROUTING_FILE,
    JSON.stringify(CANONICAL_ROUTING_SEED, null, 2),
    "utf-8"
  );
  return JSON.parse(JSON.stringify(CANONICAL_ROUTING_SEED));
}

/**
 * Create or update a routing rule with validation
 */
export function saveRoutingRule(
  ruleInput: Partial<RoutingRule>,
  _adminName: string = "Parth Admin"
): { success: boolean; rule: RoutingRule; message?: string } {
  void _adminName;
  if (!ruleInput.ruleName || !ruleInput.ruleName.trim()) {
    throw new Error("Rule name is required.");
  }

  // Prevent circular fallback
  if (
    ruleInput.preferredProvider &&
    ruleInput.fallbackProvider &&
    ruleInput.preferredProvider.toLowerCase() === ruleInput.fallbackProvider.toLowerCase() &&
    ruleInput.preferredModel === ruleInput.fallbackModel
  ) {
    throw new Error("Circular fallback detected: Fallback provider and model cannot be identical to primary.");
  }

  const data = readStoredData();
  const now = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let savedRule: RoutingRule;

  if (ruleInput.id) {
    const idx = data.rules.findIndex((r) => r.id === ruleInput.id);
    if (idx >= 0) {
      savedRule = {
        ...data.rules[idx],
        ...ruleInput,
        lastUpdated: now,
      } as RoutingRule;
      data.rules[idx] = savedRule;
    } else {
      savedRule = {
        id: ruleInput.id,
        ruleName: ruleInput.ruleName,
        requestType: ruleInput.requestType || "Image",
        modelRequirement: ruleInput.modelRequirement || "DALL·E 3",
        preferredProvider: ruleInput.preferredProvider || "OpenAI",
        preferredProviderId: ruleInput.preferredProviderId || "openai",
        preferredModel: ruleInput.preferredModel || "GPT-4o",
        fallbackPolicy: ruleInput.fallbackPolicy || "All Fallbacks",
        fallbackProvider: ruleInput.fallbackProvider || "Stability AI",
        fallbackModel: ruleInput.fallbackModel || "Stable Diffusion XL",
        healthRequirement: ruleInput.healthRequirement || "Healthy (>= 90%)",
        maxAttempts: ruleInput.maxAttempts || 3,
        priority: ruleInput.priority || data.rules.length + 1,
        status: ruleInput.status || "Active",
        lastUpdated: now,
        enabled: ruleInput.enabled !== false,
      };
      data.rules.push(savedRule);
    }
  } else {
    savedRule = {
      id: `rule-${Date.now()}`,
      ruleName: ruleInput.ruleName,
      requestType: ruleInput.requestType || "Image",
      modelRequirement: ruleInput.modelRequirement || "DALL·E 3",
      preferredProvider: ruleInput.preferredProvider || "OpenAI",
      preferredProviderId: ruleInput.preferredProviderId || "openai",
      preferredModel: ruleInput.preferredModel || "GPT-4o",
      fallbackPolicy: ruleInput.fallbackPolicy || "All Fallbacks",
      fallbackProvider: ruleInput.fallbackProvider || "Stability AI",
      fallbackModel: ruleInput.fallbackModel || "Stable Diffusion XL",
      healthRequirement: ruleInput.healthRequirement || "Healthy (>= 90%)",
      maxAttempts: ruleInput.maxAttempts || 3,
      priority: ruleInput.priority || data.rules.length + 1,
      status: ruleInput.status || "Active",
      lastUpdated: now,
      enabled: ruleInput.enabled !== false,
    };
    data.rules.push(savedRule);
  }

  // Sort rules by priority
  data.rules.sort((a, b) => a.priority - b.priority);

  recalculateSummary(data);
  writeStoredData(data);

  return { success: true, rule: savedRule, message: "Rule saved successfully." };
}

/**
 * Delete a routing rule
 */
export function deleteRoutingRule(
  ruleId: string,
  _adminName: string = "Parth Admin"
): { success: boolean; message?: string } {
  void _adminName;
  const data = readStoredData();
  const initialLen = data.rules.length;
  data.rules = data.rules.filter((r) => r.id !== ruleId);

  if (data.rules.length === initialLen) {
    throw new Error(`Rule "${ruleId}" not found.`);
  }

  // Re-index priorities
  data.rules.forEach((r, idx) => {
    r.priority = idx + 1;
  });

  recalculateSummary(data);
  writeStoredData(data);

  return { success: true, message: "Rule deleted successfully." };
}

/**
 * Update priority order of providers
 */
export function updateProviderPriorities(
  newPriorities: ProviderPriorityItem[],
  _adminName: string = "Parth Admin"
): { success: boolean; items: ProviderPriorityItem[] } {
  void _adminName;
  const data = readStoredData();
  data.providerPriorities = newPriorities;
  writeStoredData(data);
  return { success: true, items: data.providerPriorities };
}

/**
 * Toggle provider routing status
 */
export function toggleProviderRouting(
  providerId: string,
  enabled: boolean,
  _adminName: string = "Parth Admin"
): { success: boolean; provider: ProviderPriorityItem } {
  void _adminName;
  const data = readStoredData();
  const item = data.providerPriorities.find(
    (p) => p.id === providerId || p.providerId === providerId
  );
  if (!item) {
    throw new Error(`Provider priority item "${providerId}" not found.`);
  }

  item.routingEnabled = enabled;
  writeStoredData(data);
  return { success: true, provider: item };
}

/**
 * Update failover conditions
 */
export function updateFailoverConditions(
  conditions: Partial<FailoverConditions>,
  _adminName: string = "Parth Admin"
): { success: boolean; conditions: FailoverConditions } {
  void _adminName;
  const data = readStoredData();
  data.failoverConditions = {
    ...data.failoverConditions,
    ...conditions,
  };
  writeStoredData(data);
  return { success: true, conditions: data.failoverConditions };
}

/**
 * Record a routing event into audit history
 */
export function recordRoutingEvent(
  eventInput: Omit<RoutingEventHistory, "eventId">
): RoutingEventHistory {
  const data = readStoredData();
  const newEvent: RoutingEventHistory = {
    eventId: `RH-${Math.floor(1000 + Math.random() * 9000)}`,
    ...eventInput,
  };

  data.recentHistory.unshift(newEvent);
  if (data.recentHistory.length > 50) {
    data.recentHistory.pop();
  }

  writeStoredData(data);
  return newEvent;
}

/**
 * Evaluate failover routing for incoming generation request
 */
export function evaluateFailoverRouting(
  requestType: string,
  modelRequirement?: string
): {
  primaryProvider: string;
  primaryModel: string;
  fallbackChain: Array<{ provider: string; model: string }>;
  matchedRule: RoutingRule | null;
} {
  const data = readStoredData();
  const activeRules = data.rules.filter((r) => r.status === "Active" && r.enabled);

  // Find highest priority matching rule
  let matchedRule = activeRules.find(
    (r) =>
      r.requestType.toLowerCase() === requestType.toLowerCase() &&
      (!modelRequirement || r.modelRequirement.toLowerCase().includes(modelRequirement.toLowerCase()))
  );

  if (!matchedRule && activeRules.length > 0) {
    matchedRule = activeRules[0];
  }

  if (matchedRule) {
    const chain: Array<{ provider: string; model: string }> = [];
    if (matchedRule.fallbackProvider && matchedRule.fallbackModel) {
      chain.push({
        provider: matchedRule.fallbackProvider,
        model: matchedRule.fallbackModel,
      });
    }

    // Add tertiary fallback from priority list if not already present
    data.providerPriorities
      .filter((p) => p.routingEnabled)
      .forEach((p) => {
        if (
          p.providerName !== matchedRule?.preferredProvider &&
          p.providerName !== matchedRule?.fallbackProvider
        ) {
          chain.push({
            provider: p.providerName,
            model: p.model,
          });
        }
      });

    return {
      primaryProvider: matchedRule.preferredProvider,
      primaryModel: matchedRule.preferredModel,
      fallbackChain: chain,
      matchedRule,
    };
  }

  // Default fallback from provider priority
  const primary = data.providerPriorities[0];
  const secondary = data.providerPriorities[1];

  return {
    primaryProvider: primary ? primary.providerName : "OpenAI",
    primaryModel: primary ? primary.model : "GPT-4o",
    fallbackChain: secondary
      ? [{ provider: secondary.providerName, model: secondary.model }]
      : [],
    matchedRule: null,
  };
}
