/**
 * Post Hub Admin Panel — Screen 26: AI Generation Credit Transaction Details & Audit Trail
 * Authoritative Types, Canonical Ledger Seeds, Timeline Definitions & CSV Exporters
 */

export type DetailedTransactionType =
  | "Credit Purchase"
  | "AI Generation Usage"
  | "Promotional Credit"
  | "Admin Credit Grant"
  | "Credit Reversal"
  | "Credit Expiry";

export type DetailedTransactionSource =
  | "Razorpay"
  | "Generation"
  | "Promo"
  | "Admin"
  | "System";

export type DetailedTransactionStatus =
  | "Successful"
  | "Reversed"
  | "Pending"
  | "Failed";

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  status: "completed" | "failed" | "pending";
}

export interface DetailedCreditTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionType: DetailedTransactionType;
  creditChange: number;
  previousBalance: number;
  resultingBalance: number;
  source: DetailedTransactionSource;
  date: string;
  timestamp: number;
  fullDateTime: string;
  status: DetailedTransactionStatus;
  relatedRequest?: string;
  administrator?: string;
  note: string;
  timeline: TimelineEvent[];
}

export interface AuditEvent {
  id: string;
  administrator: string;
  actionPerformed: string;
  targetEntity: string;
  previousValue: string | number;
  newValue: string | number;
  reason: string;
  timestamp: string;
  rawTimestamp: number;
  relatedTransactionId?: string;
}

export interface AuditSummaryMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  reversedTransactions: number;
  pendingTransactions: number;
  reportingPeriod: string;
  lastUpdated: string;
}

export interface AuditDataset {
  summary: AuditSummaryMetrics;
  transactions: DetailedCreditTransaction[];
  auditEvents: AuditEvent[];
  lastUpdated: string;
}

/**
 * Canonical Screen 26 KPI Summary Metrics
 */
export const CANONICAL_AUDIT_SUMMARY: AuditSummaryMetrics = {
  totalTransactions: 12480,
  successfulTransactions: 11962,
  reversedTransactions: 148,
  pendingTransactions: 27,
  reportingPeriod: "Last 30 Days",
  lastUpdated: "19 Nov 2026 • 10:45 AM",
};

/**
 * Canonical Screen 26 Transaction Ledger Records
 */
export const CANONICAL_AUDIT_TRANSACTIONS: DetailedCreditTransaction[] = [
  {
    id: "TXN-8F21",
    userId: "usr_20478",
    userName: "Ananya Shah",
    userEmail: "ananya.shah@posthub.io",
    transactionType: "Credit Purchase",
    creditChange: 500,
    previousBalance: 120,
    resultingBalance: 620,
    source: "Razorpay",
    date: "19 Nov 10:42",
    timestamp: 1795066320000,
    fullDateTime: "19 Nov 2026 10:42:15 AM",
    status: "Successful",
    relatedRequest: "ORD-9418",
    administrator: "—",
    note: "Successful online purchase of 500 Starter generation credits.",
    timeline: [
      { id: "tl-21-1", title: "Transaction Initiated", timestamp: "19 Nov 10:42:01 AM", status: "completed" },
      { id: "tl-21-2", title: "Gateway Payment Confirmed", timestamp: "19 Nov 10:42:05 AM", status: "completed" },
      { id: "tl-21-3", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:42:10 AM", status: "completed" },
      { id: "tl-21-4", title: "Balance Updated", timestamp: "19 Nov 10:42:12 AM", status: "completed" },
      { id: "tl-21-5", title: "Final Status: Successful", timestamp: "19 Nov 10:42:15 AM", status: "completed" },
    ],
  },
  {
    id: "TXN-8F20",
    userId: "usr_20481",
    userName: "Rahul Mehta",
    userEmail: "rahul.mehta@example.com",
    transactionType: "AI Generation Usage",
    creditChange: -25,
    previousBalance: 620,
    resultingBalance: 595,
    source: "Generation",
    date: "19 Nov 10:38",
    timestamp: 1795066080000,
    fullDateTime: "19 Nov 2026 10:38:24 AM",
    status: "Successful",
    relatedRequest: "GEN-7C91",
    administrator: "—",
    note: "Credits deducted after successful image generation.",
    timeline: [
      { id: "tl-20-1", title: "Transaction Initiated", timestamp: "19 Nov 10:38:20 AM", status: "completed" },
      { id: "tl-20-2", title: "Validation Completed", timestamp: "19 Nov 10:38:21 AM", status: "completed" },
      { id: "tl-20-3", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:38:22 AM", status: "completed" },
      { id: "tl-20-4", title: "Balance Updated", timestamp: "19 Nov 10:38:23 AM", status: "completed" },
      { id: "tl-20-5", title: "Final Status: Successful", timestamp: "19 Nov 10:38:24 AM", status: "completed" },
    ],
  },
  {
    id: "TXN-8F19",
    userId: "usr_20492",
    userName: "Neha Patel",
    userEmail: "neha.patel@posthub.io",
    transactionType: "Promotional Credit",
    creditChange: 100,
    previousBalance: 520,
    resultingBalance: 620,
    source: "Promo",
    date: "19 Nov 10:35",
    timestamp: 1795065900000,
    fullDateTime: "19 Nov 2026 10:35:48 AM",
    status: "Successful",
    relatedRequest: "CMP-DIWALI",
    administrator: "system.campaign",
    note: "Promotional festival campaign reward credited automatically.",
    timeline: [
      { id: "tl-19-1", title: "Transaction Initiated", timestamp: "19 Nov 10:35:40 AM", status: "completed" },
      { id: "tl-19-2", title: "Eligibility Validated", timestamp: "19 Nov 10:35:42 AM", status: "completed" },
      { id: "tl-19-3", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:35:44 AM", status: "completed" },
      { id: "tl-19-4", title: "Balance Updated", timestamp: "19 Nov 10:35:46 AM", status: "completed" },
      { id: "tl-19-5", title: "Final Status: Successful", timestamp: "19 Nov 10:35:48 AM", status: "completed" },
    ],
  },
  {
    id: "TXN-8F18",
    userId: "usr_20503",
    userName: "Dev Joshi",
    userEmail: "dev.joshi@gmail.com",
    transactionType: "Admin Credit Grant",
    creditChange: 200,
    previousBalance: 320,
    resultingBalance: 520,
    source: "Admin",
    date: "19 Nov 10:30",
    timestamp: 1795065600000,
    fullDateTime: "19 Nov 2026 10:30:12 AM",
    status: "Successful",
    relatedRequest: "AUD-00381",
    administrator: "admin.ops@posthub",
    note: "Customer support compensation granted following resolution of ticket #4192.",
    timeline: [
      { id: "tl-18-1", title: "Transaction Initiated", timestamp: "19 Nov 10:30:02 AM", status: "completed" },
      { id: "tl-18-2", title: "Admin Authorization Verified", timestamp: "19 Nov 10:30:05 AM", status: "completed" },
      { id: "tl-18-3", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:30:08 AM", status: "completed" },
      { id: "tl-18-4", title: "Balance Updated", timestamp: "19 Nov 10:30:10 AM", status: "completed" },
      { id: "tl-18-5", title: "Final Status: Successful", timestamp: "19 Nov 10:30:12 AM", status: "completed" },
    ],
  },
  {
    id: "TXN-8F17",
    userId: "usr_20478",
    userName: "Ananya Shah",
    userEmail: "ananya.shah@posthub.io",
    transactionType: "Credit Reversal",
    creditChange: 25,
    previousBalance: 95,
    resultingBalance: 120,
    source: "System",
    date: "19 Nov 10:28",
    timestamp: 1795065480000,
    fullDateTime: "19 Nov 2026 10:28:44 AM",
    status: "Reversed",
    relatedRequest: "GEN-7C88",
    administrator: "system.recovery",
    note: "Automatic credit reversal for generation request that encountered upstream worker timeout.",
    timeline: [
      { id: "tl-17-1", title: "Generation Failure Detected", timestamp: "19 Nov 10:28:35 AM", status: "completed" },
      { id: "tl-17-2", title: "Auto-Reversal Triggered", timestamp: "19 Nov 10:28:38 AM", status: "completed" },
      { id: "tl-17-3", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:28:40 AM", status: "completed" },
      { id: "tl-17-4", title: "Balance Restored", timestamp: "19 Nov 10:28:42 AM", status: "completed" },
      { id: "tl-17-5", title: "Final Status: Reversed", timestamp: "19 Nov 10:28:44 AM", status: "completed" },
    ],
  },
  {
    id: "TXN-8F16",
    userId: "usr_20481",
    userName: "Rahul Mehta",
    userEmail: "rahul.mehta@example.com",
    transactionType: "Credit Expiry",
    creditChange: -10,
    previousBalance: 210,
    resultingBalance: 200,
    source: "System",
    date: "19 Nov 10:25",
    timestamp: 1795065300000,
    fullDateTime: "19 Nov 2026 10:25:02 AM",
    status: "Successful",
    relatedRequest: "EXP-BATCH-99",
    administrator: "system.cron",
    note: "Expired 90-day promotional grant credits deducted per platform policy.",
    timeline: [
      { id: "tl-16-1", title: "Expiry Evaluation Started", timestamp: "19 Nov 10:25:00 AM", status: "completed" },
      { id: "tl-16-2", title: "Ledger Entry Recorded", timestamp: "19 Nov 10:25:01 AM", status: "completed" },
      { id: "tl-16-3", title: "Balance Updated", timestamp: "19 Nov 10:25:01 AM", status: "completed" },
      { id: "tl-16-4", title: "Final Status: Successful", timestamp: "19 Nov 10:25:02 AM", status: "completed" },
    ],
  },
];

/**
 * Canonical Screen 26 Administrative Audit History Records
 */
export const CANONICAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-00381",
    administrator: "admin.ops@posthub",
    actionPerformed: "Grant Credits",
    targetEntity: "usr_20481",
    previousValue: 100,
    newValue: 200,
    reason: "Customer support adjustment",
    timestamp: "19 Nov 10:32",
    rawTimestamp: 1795065720000,
    relatedTransactionId: "TXN-8F18",
  },
  {
    id: "AUD-00380",
    administrator: "security.lead@posthub",
    actionPerformed: "Update Expiry Rule",
    targetEntity: "rule_promo_expiry",
    previousValue: "60 Days",
    newValue: "90 Days",
    reason: "Policy harmonization for festival season",
    timestamp: "18 Nov 16:45",
    rawTimestamp: 1794998700000,
  },
  {
    id: "AUD-00379",
    administrator: "billing.admin@posthub",
    actionPerformed: "Update Plan Price",
    targetEntity: "plan-creator",
    previousValue: "$29.99",
    newValue: "$24.99",
    reason: "Promotional discount deployment",
    timestamp: "18 Nov 14:10",
    rawTimestamp: 1794989400000,
  },
  {
    id: "AUD-00378",
    administrator: "admin.ops@posthub",
    actionPerformed: "Manual Balance Audit",
    targetEntity: "usr_20478",
    previousValue: "Unverified",
    newValue: "Reconciled",
    reason: "Periodic integrity verification",
    timestamp: "17 Nov 11:20",
    rawTimestamp: 1794892800000,
  },
];

/**
 * Generate CSV export of audit report combining audit events and ledger transactions
 */
export function generateAuditReportCsv(
  events: AuditEvent[],
  transactions: DetailedCreditTransaction[]
): string {
  const lines: string[] = [];

  lines.push("Post Hub — Credit Transactions & Administrative Audit Report");
  lines.push(`Generated At,"${new Date().toISOString()}"`);
  lines.push(`Reporting Period,"${CANONICAL_AUDIT_SUMMARY.reportingPeriod}"`);
  lines.push("");

  // Section 1: Administrative Audit Events
  lines.push("--- Administrative Audit Events ---");
  lines.push("Audit ID,Administrator,Action Performed,Target Entity,Previous Value,New Value,Reason,Timestamp,Related Transaction");
  events.forEach((e) => {
    lines.push(
      `"${e.id}","${e.administrator}","${e.actionPerformed}","${e.targetEntity}","${e.previousValue}","${e.newValue}","${(e.reason || "").replace(/"/g, '""')}","${e.timestamp}","${e.relatedTransactionId || "—"}"`
    );
  });
  lines.push("");

  // Section 2: Credit Transactions Ledger
  lines.push("--- Credit Transactions Ledger ---");
  lines.push("Transaction ID,User,Account ID,Type,Credit Change,Previous Balance,Resulting Balance,Source,Date & Time,Status,Related Request,Note");
  transactions.forEach((t) => {
    const signedChange = t.creditChange > 0 ? `+${t.creditChange}` : `${t.creditChange}`;
    lines.push(
      `"${t.id}","${t.userName}","${t.userId}","${t.transactionType}",${signedChange},${t.previousBalance},${t.resultingBalance},"${t.source}","${t.fullDateTime}","${t.status}","${t.relatedRequest || "—"}","${(t.note || "").replace(/"/g, '""')}"`
    );
  });

  return lines.join("\n");
}
