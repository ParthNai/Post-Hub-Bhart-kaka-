import fs from "fs";
import path from "path";
import type {
  DetailedCreditTransaction,
  AuditEvent,
  AuditSummaryMetrics,
  AuditDataset,
} from "./ai-audit.ts";
import {
  CANONICAL_AUDIT_SUMMARY,
  CANONICAL_AUDIT_TRANSACTIONS,
  CANONICAL_AUDIT_EVENTS,
} from "./ai-audit.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const AUDIT_FILE = path.join(DATA_DIR, "ai-audit.json");

interface StoredAuditData {
  summary: AuditSummaryMetrics;
  transactions: DetailedCreditTransaction[];
  auditEvents: AuditEvent[];
  lastUpdated: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getCanonicalStoredData(): StoredAuditData {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return {
    summary: { ...CANONICAL_AUDIT_SUMMARY },
    transactions: CANONICAL_AUDIT_TRANSACTIONS.map((t) => ({
      ...t,
      timeline: t.timeline.map((tl) => ({ ...tl })),
    })),
    auditEvents: CANONICAL_AUDIT_EVENTS.map((e) => ({ ...e })),
    lastUpdated: `${dateStr} • ${timeStr}`,
  };
}

function readStoredData(): StoredAuditData {
  ensureDataDir();
  if (!fs.existsSync(AUDIT_FILE)) {
    const canonical = getCanonicalStoredData();
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(canonical, null, 2), "utf-8");
    return canonical;
  }

  try {
    const raw = fs.readFileSync(AUDIT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary || CANONICAL_AUDIT_SUMMARY,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : CANONICAL_AUDIT_TRANSACTIONS,
      auditEvents: Array.isArray(parsed.auditEvents) ? parsed.auditEvents : CANONICAL_AUDIT_EVENTS,
      lastUpdated: parsed.lastUpdated || "Just now",
    };
  } catch {
    const fallback = getCanonicalStoredData();
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function writeStoredData(data: StoredAuditData): void {
  ensureDataDir();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  data.lastUpdated = `${dateStr} • ${timeStr}`;
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Get complete audit dataset
 */
export function getAuditDataset(): AuditDataset {
  const data = readStoredData();
  return {
    summary: data.summary,
    transactions: data.transactions,
    auditEvents: data.auditEvents,
    lastUpdated: data.lastUpdated,
  };
}

/**
 * Get single transaction by ID with complete timeline
 */
export function getTransactionById(id: string): DetailedCreditTransaction | null {
  const data = readStoredData();
  const tx = data.transactions.find((t) => t.id.toLowerCase() === id.toLowerCase().trim());
  return tx || null;
}

/**
 * Query and filter transactions
 */
export function queryAuditTransactions(params: {
  searchId?: string;
  searchUser?: string;
  type?: string;
  status?: string;
  source?: string;
  dateRange?: string;
}): DetailedCreditTransaction[] {
  const data = readStoredData();
  let result = data.transactions;

  if (params.searchId && params.searchId.trim()) {
    const qId = params.searchId.toLowerCase().trim();
    result = result.filter((t) => t.id.toLowerCase().includes(qId));
  }

  if (params.searchUser && params.searchUser.trim()) {
    const qUser = params.searchUser.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.userName.toLowerCase().includes(qUser) ||
        t.userId.toLowerCase().includes(qUser) ||
        t.userEmail.toLowerCase().includes(qUser)
    );
  }

  if (params.type && params.type !== "All Types") {
    result = result.filter((t) => t.transactionType === params.type);
  }

  if (params.status && params.status !== "All Statuses" && params.status !== "All Status") {
    result = result.filter((t) => t.status === params.status);
  }

  if (params.source && params.source !== "All Sources") {
    result = result.filter((t) => t.source === params.source);
  }

  return result;
}

/**
 * Query administrative audit events
 */
export function queryAuditEvents(params?: {
  admin?: string;
  action?: string;
  target?: string;
}): AuditEvent[] {
  const data = readStoredData();
  let result = data.auditEvents;

  if (!params) return result;

  if (params.admin && params.admin !== "All") {
    result = result.filter((e) => e.administrator.toLowerCase().includes(params.admin!.toLowerCase()));
  }

  if (params.action && params.action !== "All") {
    result = result.filter((e) => e.actionPerformed.toLowerCase().includes(params.action!.toLowerCase()));
  }

  if (params.target && params.target.trim()) {
    result = result.filter((e) => e.targetEntity.toLowerCase().includes(params.target!.toLowerCase().trim()));
  }

  return result;
}

/**
 * Record an immutable administrative audit event
 */
export function recordAuditEvent(event: {
  administrator: string;
  actionPerformed: string;
  targetEntity: string;
  previousValue: string | number;
  newValue: string | number;
  reason: string;
  relatedTransactionId?: string;
}): AuditEvent {
  const data = readStoredData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const randomId = Math.floor(100 + Math.random() * 900);
  const id = `AUD-00${randomId}`;

  const newEvent: AuditEvent = {
    id,
    administrator: event.administrator,
    actionPerformed: event.actionPerformed,
    targetEntity: event.targetEntity,
    previousValue: event.previousValue,
    newValue: event.newValue,
    reason: event.reason,
    timestamp: `${dateStr} ${timeStr}`,
    rawTimestamp: now.getTime(),
    relatedTransactionId: event.relatedTransactionId,
  };

  data.auditEvents.unshift(newEvent);
  writeStoredData(data);
  return newEvent;
}

/**
 * Reset audit data to canonical Screen 26 state
 */
export function resetAuditData(): AuditDataset {
  const canonical = getCanonicalStoredData();
  ensureDataDir();
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(canonical, null, 2), "utf-8");
  return getAuditDataset();
}
