import fs from "fs";
import path from "path";
import type {
  GlobalModerationSettings,
  ModerationCategory,
  AutomaticModerationRule,
  RejectionReason,
  ManualReviewConfiguration,
  UnknownErrorHandling,
  ModerationKpiMetrics,
  ModerationPolicyRevision,
  ModerationPolicyConfiguration,
} from "./ai-moderation.ts";
import {
  CANONICAL_CATEGORIES,
  CANONICAL_RULES,
  CANONICAL_REJECTION_REASONS,
  CANONICAL_GLOBAL_SETTINGS,
  CANONICAL_MANUAL_REVIEW,
  CANONICAL_ERROR_HANDLING,
} from "./ai-moderation.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const POLICY_FILE = path.join(DATA_DIR, "ai-moderation-policy.json");
const HISTORY_FILE = path.join(DATA_DIR, "ai-policy-history.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Generate initial canonical policy dataset matching Screen 23
 */
function getCanonicalDataset(): {
  globals: GlobalModerationSettings;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
  reasons: RejectionReason[];
  manualReview: ManualReviewConfiguration;
  errorHandling: UnknownErrorHandling;
} {
  return {
    globals: { ...CANONICAL_GLOBAL_SETTINGS },
    categories: CANONICAL_CATEGORIES.map((c) => ({ ...c })),
    rules: CANONICAL_RULES.map((r) => ({ ...r })),
    reasons: CANONICAL_REJECTION_REASONS.map((reason) => ({ ...reason })),
    manualReview: { ...CANONICAL_MANUAL_REVIEW },
    errorHandling: { ...CANONICAL_ERROR_HANDLING },
  };
}

/**
 * Generate canonical version history
 */
function getCanonicalHistory(): ModerationPolicyRevision[] {
  const current = getCanonicalDataset();
  return [
    {
      id: "REV-20251102-001",
      version: "v2.1.0",
      timestamp: "Nov 2, 2025 • 4:30 PM",
      updatedBy: "Parth Patel (Administrator)",
      summary: "Updated explicit content trigger and added copyright detection rule.",
      globals: current.globals,
      categories: current.categories,
      rules: current.rules,
      reasons: current.reasons,
      manualReview: current.manualReview,
      errorHandling: current.errorHandling,
    },
    {
      id: "REV-20251015-001",
      version: "v2.0.0",
      timestamp: "Oct 15, 2025 • 10:15 AM",
      updatedBy: "Super Administrator",
      summary: "Major policy overhaul introducing Vision AI + NLP hybrid detection.",
      globals: {
        ...current.globals,
        policyVersion: "v2.0.0",
        lastUpdated: "Oct 15, 2025 • 10:15 AM",
      },
      categories: current.categories,
      rules: current.rules.slice(0, 3),
      reasons: current.reasons.slice(0, 5),
      manualReview: current.manualReview,
      errorHandling: current.errorHandling,
    },
    {
      id: "REV-20250901-001",
      version: "v1.2.0",
      timestamp: "Sep 1, 2025 • 02:00 PM",
      updatedBy: "Security Lead",
      summary: "Initial production moderation policy with manual review queues.",
      globals: {
        ...current.globals,
        policyVersion: "v1.2.0",
        lastUpdated: "Sep 1, 2025 • 02:00 PM",
      },
      categories: current.categories,
      rules: current.rules.slice(0, 2),
      reasons: current.reasons.slice(0, 4),
      manualReview: current.manualReview,
      errorHandling: current.errorHandling,
    },
  ];
}

/**
 * Calculate KPI Metrics matching Screen 23 reference photo:
 * Active Policies: 8 (↑ +1)
 * Enabled Checks: 6 (↑ +0)
 * Pending Review Rules: 2 (↑ +0)
 * Last Policy Update: Nov 2, 2025 • 4:30 PM (Live)
 */
export function getPolicyKpiMetrics(
  categories?: ModerationCategory[],
  rules?: AutomaticModerationRule[],
  globals?: GlobalModerationSettings
): ModerationKpiMetrics {
  const policy = getStoredPolicy();
  const cats = categories || policy.categories;
  const rls = rules || policy.rules;
  const globs = globals || policy.globals;

  const activePolicies = cats.filter((c) => c.enabled).length;
  // 4 active rules + 2 core automated pipeline checks = 6
  const enabledChecks = rls.filter((r) => r.enabled).length + (globs.automaticModerationAvailability ? 2 : 0);
  // Rules that result in "Flag for Review" = 2 (Violence Detection, Copyright Content)
  const pendingReviewRules = rls.filter((r) => r.resultingAction === "Flag for Review" && r.enabled).length;

  return {
    activePolicies,
    activePoliciesChange: "↑ +1",
    enabledChecks,
    enabledChecksChange: "↑ +0",
    pendingReviewRules,
    pendingReviewRulesChange: "↑ +0",
    lastPolicyUpdate: globs.lastUpdated || "Nov 2, 2025 • 4:30 PM",
    policyStatusBadge: "Live",
  };
}

/**
 * Load raw policy object from storage
 */
function getStoredPolicy(): {
  globals: GlobalModerationSettings;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
  reasons: RejectionReason[];
  manualReview: ManualReviewConfiguration;
  errorHandling: UnknownErrorHandling;
} {
  ensureDataDir();
  if (!fs.existsSync(POLICY_FILE)) {
    const initial = getCanonicalDataset();
    fs.writeFileSync(POLICY_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(POLICY_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.globals && parsed.categories && parsed.rules) {
      return parsed;
    }
    const initial = getCanonicalDataset();
    fs.writeFileSync(POLICY_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.error("Error loading moderation policy:", err);
    const initial = getCanonicalDataset();
    return initial;
  }
}

/**
 * Save raw policy object to storage
 */
function saveStoredPolicy(data: {
  globals: GlobalModerationSettings;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
  reasons: RejectionReason[];
  manualReview: ManualReviewConfiguration;
  errorHandling: UnknownErrorHandling;
}): void {
  ensureDataDir();
  fs.writeFileSync(POLICY_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Get complete Moderation Policy with metrics and version history
 */
export function getModerationPolicy(): ModerationPolicyConfiguration {
  const stored = getStoredPolicy();
  const metrics = getPolicyKpiMetrics(stored.categories, stored.rules, stored.globals);
  const versionHistory = getPolicyVersionHistory();

  return {
    globals: stored.globals,
    categories: stored.categories,
    rules: stored.rules,
    reasons: stored.reasons,
    manualReview: stored.manualReview,
    errorHandling: stored.errorHandling,
    metrics,
    versionHistory,
  };
}

/**
 * Save moderation policy with automatic audit history recording
 */
export function saveModerationPolicy(
  updates: Partial<{
    globals: Partial<GlobalModerationSettings>;
    categories: ModerationCategory[];
    rules: AutomaticModerationRule[];
    reasons: RejectionReason[];
    manualReview: Partial<ManualReviewConfiguration>;
    errorHandling: Partial<UnknownErrorHandling>;
  }>,
  author: string = "Parth Patel (Administrator)",
  summary?: string
): ModerationPolicyConfiguration {
  const current = getStoredPolicy();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const timestamp = `${dateStr} • ${timeStr}`;

  // Bump patch version if version is not explicitly passed
  let nextVersion = current.globals.policyVersion;
  if (!updates.globals?.policyVersion) {
    const parts = nextVersion.replace("v", "").split(".").map(Number);
    if (parts.length === 3) {
      parts[2] += 1;
      nextVersion = `v${parts.join(".")}`;
    }
  } else {
    nextVersion = updates.globals.policyVersion;
  }

  const updatedGlobals: GlobalModerationSettings = {
    ...current.globals,
    ...updates.globals,
    policyVersion: nextVersion,
    lastUpdated: timestamp,
    status: "live",
  };

  const updatedCategories = updates.categories || current.categories;
  const updatedRules = updates.rules || current.rules;
  const updatedReasons = updates.reasons || current.reasons;
  const updatedManualReview: ManualReviewConfiguration = {
    ...current.manualReview,
    ...updates.manualReview,
  };
  const updatedErrorHandling: UnknownErrorHandling = {
    ...current.errorHandling,
    ...updates.errorHandling,
  };

  const newPolicy = {
    globals: updatedGlobals,
    categories: updatedCategories,
    rules: updatedRules,
    reasons: updatedReasons,
    manualReview: updatedManualReview,
    errorHandling: updatedErrorHandling,
  };

  saveStoredPolicy(newPolicy);

  // Record Revision in History
  const history = getPolicyVersionHistory();
  const newRevision: ModerationPolicyRevision = {
    id: `REV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    version: nextVersion,
    timestamp,
    updatedBy: author,
    summary: summary || "Configuration updated via Admin Panel.",
    globals: updatedGlobals,
    categories: updatedCategories,
    rules: updatedRules,
    reasons: updatedReasons,
    manualReview: updatedManualReview,
    errorHandling: updatedErrorHandling,
  };
  history.unshift(newRevision);
  savePolicyVersionHistory(history.slice(0, 50));

  return getModerationPolicy();
}

/**
 * Toggle an automatic rule's enabled state
 */
export function toggleRule(ruleId: string, enabled?: boolean): AutomaticModerationRule | null {
  const current = getStoredPolicy();
  const idx = current.rules.findIndex((r) => r.id === ruleId);
  if (idx === -1) return null;

  const newEnabled = enabled !== undefined ? enabled : !current.rules[idx].enabled;
  current.rules[idx] = {
    ...current.rules[idx],
    enabled: newEnabled,
  };

  saveStoredPolicy(current);
  return current.rules[idx];
}

/**
 * Add a new automatic rule
 */
export function addRule(
  rule: Omit<AutomaticModerationRule, "id">
): AutomaticModerationRule {
  const current = getStoredPolicy();
  const newRule: AutomaticModerationRule = {
    ...rule,
    id: `rule-${Date.now()}`,
    order: current.rules.length + 1,
  };

  current.rules.push(newRule);
  saveStoredPolicy(current);
  return newRule;
}

/**
 * Update an existing automatic rule
 */
export function updateRule(
  ruleId: string,
  updates: Partial<AutomaticModerationRule>
): AutomaticModerationRule | null {
  const current = getStoredPolicy();
  const idx = current.rules.findIndex((r) => r.id === ruleId);
  if (idx === -1) return null;

  current.rules[idx] = {
    ...current.rules[idx],
    ...updates,
  };

  saveStoredPolicy(current);
  return current.rules[idx];
}

/**
 * Delete an automatic rule
 */
export function deleteRule(ruleId: string): boolean {
  const current = getStoredPolicy();
  const initialLength = current.rules.length;
  current.rules = current.rules.filter((r) => r.id !== ruleId);
  if (current.rules.length !== initialLength) {
    saveStoredPolicy(current);
    return true;
  }
  return false;
}

/**
 * Toggle category enabled state
 */
export function toggleCategory(
  categoryId: string,
  enabled?: boolean
): ModerationCategory | null {
  const current = getStoredPolicy();
  const idx = current.categories.findIndex((c) => c.id === categoryId);
  if (idx === -1) return null;

  const newEnabled = enabled !== undefined ? enabled : !current.categories[idx].enabled;
  current.categories[idx] = {
    ...current.categories[idx],
    enabled: newEnabled,
  };

  saveStoredPolicy(current);
  return current.categories[idx];
}

/**
 * Update category details
 */
export function updateCategory(
  categoryId: string,
  updates: Partial<ModerationCategory>
): ModerationCategory | null {
  const current = getStoredPolicy();
  const idx = current.categories.findIndex((c) => c.id === categoryId);
  if (idx === -1) return null;

  current.categories[idx] = {
    ...current.categories[idx],
    ...updates,
  };

  saveStoredPolicy(current);
  return current.categories[idx];
}

/**
 * Add a new rejection reason
 */
export function addRejectionReason(
  reason: Omit<RejectionReason, "id">
): RejectionReason {
  const current = getStoredPolicy();
  const newReason: RejectionReason = {
    ...reason,
    id: `rej-${Date.now()}`,
    status: reason.status || "Active",
    usageCount: 0,
  };

  current.reasons.push(newReason);
  saveStoredPolicy(current);
  return newReason;
}

/**
 * Update an existing rejection reason
 */
export function updateRejectionReason(
  reasonId: string,
  updates: Partial<RejectionReason>
): RejectionReason | null {
  const current = getStoredPolicy();
  const idx = current.reasons.findIndex((r) => r.id === reasonId);
  if (idx === -1) return null;

  current.reasons[idx] = {
    ...current.reasons[idx],
    ...updates,
  };

  saveStoredPolicy(current);
  return current.reasons[idx];
}

/**
 * Toggle rejection reason status (Active <-> Disabled)
 */
export function toggleRejectionReason(reasonId: string): RejectionReason | null {
  const current = getStoredPolicy();
  const idx = current.reasons.findIndex((r) => r.id === reasonId);
  if (idx === -1) return null;

  const nextStatus = current.reasons[idx].status === "Active" ? "Disabled" : "Active";
  current.reasons[idx] = {
    ...current.reasons[idx],
    status: nextStatus,
  };

  saveStoredPolicy(current);
  return current.reasons[idx];
}

/**
 * Delete a rejection reason (only allowed if unused or softly marks disabled)
 */
export function deleteRejectionReason(reasonId: string): boolean {
  const current = getStoredPolicy();
  const idx = current.reasons.findIndex((r) => r.id === reasonId);
  if (idx === -1) return false;

  // If already used in audit logs, softly disable to preserve audit references
  if (current.reasons[idx].usageCount && current.reasons[idx].usageCount! > 0) {
    current.reasons[idx].status = "Disabled";
    saveStoredPolicy(current);
    return true;
  }

  current.reasons.splice(idx, 1);
  saveStoredPolicy(current);
  return true;
}

/**
 * Get Version History
 */
export function getPolicyVersionHistory(): ModerationPolicyRevision[] {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) {
    const canonical = getCanonicalHistory();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(canonical, null, 2), "utf-8");
    return canonical;
  }
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    const list = JSON.parse(raw);
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    const canonical = getCanonicalHistory();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(canonical, null, 2), "utf-8");
    return canonical;
  } catch (err) {
    console.error("Error reading policy history:", err);
    const canonical = getCanonicalHistory();
    return canonical;
  }
}

function savePolicyVersionHistory(history: ModerationPolicyRevision[]): void {
  ensureDataDir();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

/**
 * Rollback / Restore previous policy revision
 */
export function restorePolicyRevision(
  revisionId: string,
  author: string = "Parth Patel (Administrator)"
): ModerationPolicyConfiguration | null {
  const history = getPolicyVersionHistory();
  const revision = history.find((h) => h.id === revisionId);
  if (!revision) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const timestamp = `${dateStr} • ${timeStr}`;

  const restoredGlobals: GlobalModerationSettings = {
    ...revision.globals,
    lastUpdated: timestamp,
    status: "live",
  };

  const newPolicy = {
    globals: restoredGlobals,
    categories: revision.categories.map((c) => ({ ...c })),
    rules: revision.rules.map((r) => ({ ...r })),
    reasons: revision.reasons.map((reason) => ({ ...reason })),
    manualReview: { ...revision.manualReview },
    errorHandling: { ...revision.errorHandling },
  };

  saveStoredPolicy(newPolicy);

  // Add rollback audit record
  const rollbackRecord: ModerationPolicyRevision = {
    id: `REV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    version: revision.version,
    timestamp,
    updatedBy: author,
    summary: `Restored policy configuration from version ${revision.version} (${revision.timestamp}).`,
    globals: restoredGlobals,
    categories: revision.categories,
    rules: revision.rules,
    reasons: revision.reasons,
    manualReview: revision.manualReview,
    errorHandling: revision.errorHandling,
  };
  history.unshift(rollbackRecord);
  savePolicyVersionHistory(history.slice(0, 50));

  return getModerationPolicy();
}

/**
 * Reset policy to canonical reference state
 */
export function resetModerationPolicy(): ModerationPolicyConfiguration {
  const canonical = getCanonicalDataset();
  saveStoredPolicy(canonical);
  const canonicalHistory = getCanonicalHistory();
  savePolicyVersionHistory(canonicalHistory);
  return getModerationPolicy();
}
