import fs from "fs";
import path from "path";
import type {
  CreditPlan,
  UserCreditAccount,
  CreditTransaction,
  CreditSettings,
  CreditSummaryMetrics,
  CreditDataset,
  TransactionType,
  TransactionSource,
} from "./ai-credits.ts";
import {
  CANONICAL_CREDIT_PLANS,
  CANONICAL_USER_ACCOUNTS,
  CANONICAL_TRANSACTIONS,
  CANONICAL_CREDIT_SETTINGS,
  CANONICAL_CREDIT_SUMMARY,
} from "./ai-credits.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const CREDITS_FILE = path.join(DATA_DIR, "ai-credits.json");

interface StoredCreditData {
  plans: CreditPlan[];
  users: UserCreditAccount[];
  transactions: CreditTransaction[];
  settings: CreditSettings;
  summary: CreditSummaryMetrics;
  lastUpdated: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getCanonicalStoredData(): StoredCreditData {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return {
    plans: CANONICAL_CREDIT_PLANS.map((p) => ({ ...p })),
    users: CANONICAL_USER_ACCOUNTS.map((u) => ({ ...u })),
    transactions: CANONICAL_TRANSACTIONS.map((t) => ({ ...t })),
    settings: { ...CANONICAL_CREDIT_SETTINGS },
    summary: { ...CANONICAL_CREDIT_SUMMARY },
    lastUpdated: `${dateStr} • ${timeStr}`,
  };
}

function readStoredData(): StoredCreditData {
  ensureDataDir();
  if (!fs.existsSync(CREDITS_FILE)) {
    const canonical = getCanonicalStoredData();
    fs.writeFileSync(CREDITS_FILE, JSON.stringify(canonical, null, 2), "utf-8");
    return canonical;
  }

  try {
    const raw = fs.readFileSync(CREDITS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      plans: Array.isArray(parsed.plans) ? parsed.plans : CANONICAL_CREDIT_PLANS,
      users: Array.isArray(parsed.users) ? parsed.users : CANONICAL_USER_ACCOUNTS,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : CANONICAL_TRANSACTIONS,
      settings: parsed.settings || CANONICAL_CREDIT_SETTINGS,
      summary: parsed.summary || CANONICAL_CREDIT_SUMMARY,
      lastUpdated: parsed.lastUpdated || "Just now",
    };
  } catch {
    const fallback = getCanonicalStoredData();
    fs.writeFileSync(CREDITS_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function writeStoredData(data: StoredCreditData): void {
  ensureDataDir();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  data.lastUpdated = `${dateStr} • ${timeStr}`;

  // Keep summary synchronized
  data.summary.creditsRemaining = Math.max(
    0,
    data.summary.totalCreditsIssued - data.summary.creditsConsumed
  );

  fs.writeFileSync(CREDITS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Get entire credit dataset
 */
export function getCreditDataset(): CreditDataset {
  const data = readStoredData();
  return {
    summary: data.summary,
    plans: data.plans,
    users: data.users,
    transactions: data.transactions,
    settings: data.settings,
    lastUpdated: data.lastUpdated,
  };
}

/**
 * Atomic Credit Allocation to a User Account
 */
export function allocateUserCredits(params: {
  userId: string;
  source: "Promotional Credits" | "Admin Granted";
  amount: number;
  expiryDate?: string;
  reason: string;
  adminName?: string;
  idempotencyKey?: string;
}): {
  success: boolean;
  transaction: CreditTransaction;
  user: UserCreditAccount;
  summary: CreditSummaryMetrics;
} {
  const { userId, source, amount, expiryDate, reason, adminName, idempotencyKey } = params;

  if (!userId || !userId.trim()) {
    throw new Error("User selection is required.");
  }

  if (typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error("Number of credits must be a positive integer.");
  }

  if (!reason || reason.trim().length < 3) {
    throw new Error("A mandatory internal note or reason is required (min 3 characters).");
  }

  const data = readStoredData();

  // Check idempotency if key provided
  if (idempotencyKey) {
    const existing = data.transactions.find((t) => t.idempotencyKey === idempotencyKey);
    if (existing) {
      const user = data.users.find((u) => u.userId === userId) || data.users[0];
      return {
        success: true,
        transaction: existing,
        user,
        summary: data.summary,
      };
    }
  }

  const userIndex = data.users.findIndex(
    (u) => u.userId === userId || u.email.toLowerCase() === userId.toLowerCase()
  );

  if (userIndex === -1) {
    throw new Error(`User account "${userId}" not found.`);
  }

  const user = data.users[userIndex];
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const formattedDate = `${dateStr}, ${timeStr}`;

  // Credit type and source resolution
  const isPromotional = source === "Promotional Credits";
  const txType: TransactionType = isPromotional ? "Promotional Grant" : "Admin Adjustment";
  const txSource: TransactionSource = isPromotional ? "Campaign" : "Admin";

  // Generate unique Ledger Transaction ID
  const dateId = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randNum = Math.floor(100 + Math.random() * 900);
  const txId = `TXN-${dateId}-${randNum}`;

  const newTransaction: CreditTransaction = {
    id: txId,
    userId: user.userId,
    userName: user.name,
    userEmail: user.email,
    transactionType: txType,
    creditChange: amount,
    source: txSource,
    date: formattedDate,
    timestamp: now.getTime(),
    status: "Completed",
    reason: reason.trim(),
    adminName: adminName || "JD Admin",
    expiryDate: expiryDate || undefined,
    idempotencyKey: idempotencyKey || undefined,
  };

  // Atomic update to user balances
  if (isPromotional) {
    user.promotionalCredits += amount;
  } else {
    user.adminGrantedCredits += amount;
  }
  user.availableBalance += amount;
  user.lastTransactionAt = formattedDate;

  // Append transaction to immutable ledger
  data.transactions.unshift(newTransaction);

  // Update summary metrics
  data.summary.totalCreditsIssued += amount;
  data.summary.creditsRemaining += amount;

  writeStoredData(data);

  return {
    success: true,
    transaction: newTransaction,
    user,
    summary: data.summary,
  };
}

/**
 * Create a new credit plan
 */
export function createCreditPlan(
  planData: Omit<CreditPlan, "id" | "createdAt" | "updatedAt">
): CreditPlan {
  if (!planData.name || !planData.name.trim()) {
    throw new Error("Plan name is required.");
  }
  if (!planData.creditQuantity || planData.creditQuantity <= 0) {
    throw new Error("Credit quantity must be greater than zero.");
  }

  const data = readStoredData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const id = `plan-${planData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

  const newPlan: CreditPlan = {
    ...planData,
    id,
    createdAt: now.toISOString(),
    updatedAt: dateStr,
  };

  data.plans.push(newPlan);
  if (newPlan.status === "Active") {
    data.summary.activeCreditPlans = data.plans.filter((p) => p.status === "Active").length;
  }

  writeStoredData(data);
  return newPlan;
}

/**
 * Update an existing credit plan
 */
export function updateCreditPlan(
  id: string,
  updates: Partial<CreditPlan>
): CreditPlan {
  const data = readStoredData();
  const index = data.plans.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Credit plan "${id}" not found.`);
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const updatedPlan: CreditPlan = {
    ...data.plans[index],
    ...updates,
    updatedAt: dateStr,
  };

  data.plans[index] = updatedPlan;
  data.summary.activeCreditPlans = data.plans.filter((p) => p.status === "Active").length;

  writeStoredData(data);
  return updatedPlan;
}

/**
 * Duplicate a credit plan
 */
export function duplicateCreditPlan(id: string): CreditPlan {
  const data = readStoredData();
  const existing = data.plans.find((p) => p.id === id);
  if (!existing) {
    throw new Error(`Credit plan "${id}" not found.`);
  }

  return createCreditPlan({
    name: `${existing.name} (Copy)`,
    description: existing.description,
    creditQuantity: existing.creditQuantity,
    validityDays: existing.validityDays,
    planType: existing.planType,
    status: "Draft",
    visibility: "Private",
    price: existing.price,
    currency: existing.currency,
  });
}

/**
 * Archive a credit plan
 */
export function archiveCreditPlan(id: string): CreditPlan {
  return updateCreditPlan(id, { status: "Archived" });
}

/**
 * Toggle credit plan active / draft status
 */
export function togglePlanStatus(id: string): CreditPlan {
  const data = readStoredData();
  const plan = data.plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan "${id}" not found.`);

  const nextStatus = plan.status === "Active" ? "Draft" : "Active";
  return updateCreditPlan(id, { status: nextStatus });
}

/**
 * Get credit settings
 */
export function getCreditSettings(): CreditSettings {
  const data = readStoredData();
  return data.settings;
}

/**
 * Update credit settings
 */
export function updateCreditSettings(updates: Partial<CreditSettings>): CreditSettings {
  const data = readStoredData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  data.settings = {
    ...data.settings,
    ...updates,
    updatedAt: `${dateStr}, ${timeStr}`,
  };

  writeStoredData(data);
  return data.settings;
}

/**
 * Search and filter users
 */
export function queryUsers(query?: string, status?: string, plan?: string): UserCreditAccount[] {
  const data = readStoredData();
  let result = data.users;

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
    );
  }

  if (status && status !== "All Status") {
    result = result.filter((u) => u.status === status);
  }

  if (plan && plan !== "All Plans") {
    result = result.filter((u) => u.planName === plan || u.planId === plan);
  }

  return result;
}

/**
 * Search and filter transactions
 */
export function queryTransactions(
  query?: string,
  type?: string,
  status?: string
): CreditTransaction[] {
  const data = readStoredData();
  let result = data.transactions;

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.reason.toLowerCase().includes(q)
    );
  }

  if (type && type !== "All Types") {
    result = result.filter((t) => t.transactionType === type);
  }

  if (status && status !== "All Status") {
    result = result.filter((t) => t.status === status);
  }

  return result;
}

/**
 * Reset credits to canonical state
 */
export function resetCreditData(): CreditDataset {
  const canonical = getCanonicalStoredData();
  ensureDataDir();
  fs.writeFileSync(CREDITS_FILE, JSON.stringify(canonical, null, 2), "utf-8");
  return getCreditDataset();
}
