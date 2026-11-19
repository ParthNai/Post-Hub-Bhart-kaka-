/**
 * Post Hub Admin Panel — Screen 25: AI Generation Credit Plans & User Allocation
 * Core Types, Canonical Models, and Ledger Reconciliation Helpers
 */

export type CreditPlanType = "One-time" | "Recurring";
export type CreditPlanStatus = "Active" | "Draft" | "Archived";
export type CreditPlanVisibility = "Public" | "Private";

export interface CreditPlan {
  id: string;
  name: string;
  description: string;
  creditQuantity: number;
  validityDays: number;
  planType: CreditPlanType;
  status: CreditPlanStatus;
  visibility: CreditPlanVisibility;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreditAccount {
  userId: string;
  name: string;
  email: string;
  avatarInitials: string;
  purchasedCredits: number;
  promotionalCredits: number;
  adminGrantedCredits: number;
  creditsUsed: number;
  availableBalance: number;
  status: "Active" | "Suspended" | "Pending";
  planId?: string;
  planName?: string;
  lastTransactionAt: string;
}

export type TransactionType =
  | "Credit Purchase"
  | "Usage"
  | "Promotional Grant"
  | "Refund"
  | "Admin Adjustment"
  | "Credit Expiry";

export type TransactionSource =
  | "Razorpay"
  | "Stripe"
  | "AI Generation"
  | "Campaign"
  | "Support"
  | "Admin"
  | "System";

export type TransactionStatus =
  | "Completed"
  | "Success"
  | "Pending"
  | "Failed"
  | "Reversed";

export interface CreditTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transactionType: TransactionType;
  creditChange: number;
  source: TransactionSource;
  date: string;
  timestamp: number;
  status: TransactionStatus;
  reason: string;
  adminId?: string;
  adminName?: string;
  expiryDate?: string;
  idempotencyKey?: string;
}

export interface CreditSettings {
  defaultCostPerImage: number;
  promotionalExpiryDays: number;
  maxPromotionalPerUser: number;
  maxAdminAllocationPerDay: number;
  refundOnFailure: boolean;
  rolloverAllowed: boolean;
  twoFactorRequiredForAdminGrant: boolean;
  updatedAt: string;
}

export interface CreditSummaryMetrics {
  activeCreditPlans: number;
  activePlansChange: string;
  totalCreditsIssued: number;
  totalCreditsChange: string;
  creditsConsumed: number;
  creditsConsumedChange: string;
  creditsRemaining: number;
  creditsRemainingChange: string;
}

export interface CreditDataset {
  summary: CreditSummaryMetrics;
  plans: CreditPlan[];
  users: UserCreditAccount[];
  transactions: CreditTransaction[];
  settings: CreditSettings;
  lastUpdated: string;
}

/**
 * Canonical Screen 25 Credit Plans
 */
export const CANONICAL_CREDIT_PLANS: CreditPlan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    description: "Ideal for casual creators and small projects.",
    creditQuantity: 500,
    validityDays: 30,
    planType: "One-time",
    status: "Active",
    visibility: "Public",
    price: 9.99,
    currency: "USD",
    createdAt: "2025-09-01T00:00:00.000Z",
    updatedAt: "Oct 28, 2025",
  },
  {
    id: "plan-creator",
    name: "Creator",
    description: "Best for growing businesses and marketing teams.",
    creditQuantity: 1500,
    validityDays: 90,
    planType: "One-time",
    status: "Active",
    visibility: "Public",
    price: 24.99,
    currency: "USD",
    createdAt: "2025-09-01T00:00:00.000Z",
    updatedAt: "Oct 25, 2025",
  },
  {
    id: "plan-pro",
    name: "Professional",
    description: "Comprehensive package for agencies and high-volume designers.",
    creditQuantity: 5000,
    validityDays: 180,
    planType: "One-time",
    status: "Draft",
    visibility: "Private",
    price: 69.99,
    currency: "USD",
    createdAt: "2025-09-15T00:00:00.000Z",
    updatedAt: "Oct 20, 2025",
  },
  {
    id: "plan-business",
    name: "Business",
    description: "Unlimited potential with priority queuing and dedicated credits.",
    creditQuantity: 12000,
    validityDays: 365,
    planType: "Recurring",
    status: "Archived",
    visibility: "Public",
    price: 149.99,
    currency: "USD",
    createdAt: "2025-08-01T00:00:00.000Z",
    updatedAt: "Sep 15, 2025",
  },
];

/**
 * Canonical Screen 25 User Credit Allocations
 */
export const CANONICAL_USER_ACCOUNTS: UserCreditAccount[] = [
  {
    userId: "usr-priya",
    name: "Priya Shah",
    email: "priya.shah@email.com",
    avatarInitials: "PK",
    purchasedCredits: 10000,
    promotionalCredits: 1000,
    adminGrantedCredits: 500,
    creditsUsed: 7250,
    availableBalance: 3250,
    status: "Active",
    planId: "plan-pro",
    planName: "Professional",
    lastTransactionAt: "Oct 31, 2025, 2:45 PM",
  },
  {
    userId: "usr-rohit",
    name: "Rohit Sharma",
    email: "rohit@mail.com",
    avatarInitials: "RS",
    purchasedCredits: 5000,
    promotionalCredits: 0,
    adminGrantedCredits: 500,
    creditsUsed: 3200,
    availableBalance: 2300,
    status: "Active",
    planId: "plan-creator",
    planName: "Creator",
    lastTransactionAt: "Oct 30, 2025, 6:20 PM",
  },
  {
    userId: "usr-dhruv",
    name: "Dhruv Mehta",
    email: "dhruv@gmail.com",
    avatarInitials: "DM",
    purchasedCredits: 2000,
    promotionalCredits: 500,
    adminGrantedCredits: 0,
    creditsUsed: 1100,
    availableBalance: 1400,
    status: "Active",
    planId: "plan-starter",
    planName: "Starter",
    lastTransactionAt: "Oct 28, 2025, 11:15 AM",
  },
  {
    userId: "usr-anita",
    name: "Anita Singh",
    email: "anita@domain.com",
    avatarInitials: "AS",
    purchasedCredits: 1000,
    promotionalCredits: 0,
    adminGrantedCredits: 0,
    creditsUsed: 800,
    availableBalance: 200,
    status: "Active",
    planId: "plan-starter",
    planName: "Starter",
    lastTransactionAt: "Oct 27, 2025, 4:30 PM",
  },
];

/**
 * Canonical Screen 25 Recent Credit Transactions
 */
export const CANONICAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "TXN-20251031-001",
    userId: "usr-priya",
    userName: "Priya Shah",
    userEmail: "priya.shah@email.com",
    transactionType: "Credit Purchase",
    creditChange: 5000,
    source: "Razorpay",
    date: "Oct 31, 2025, 2:45 PM",
    timestamp: 1761909900000,
    status: "Completed",
    reason: "Purchased Professional add-on bundle",
  },
  {
    id: "TXN-20251030-002",
    userId: "usr-rohit",
    userName: "Rohit Sharma",
    userEmail: "rohit@mail.com",
    transactionType: "Usage",
    creditChange: -1200,
    source: "AI Generation",
    date: "Oct 30, 2025, 6:20 PM",
    timestamp: 1761836400000,
    status: "Success",
    reason: "Batch generation: 12 High-Resolution festival posters",
  },
  {
    id: "TXN-20251028-003",
    userId: "usr-dhruv",
    userName: "Dhruv Mehta",
    userEmail: "dhruv@gmail.com",
    transactionType: "Promotional Grant",
    creditChange: 500,
    source: "Campaign",
    date: "Oct 28, 2025, 11:15 AM",
    timestamp: 1761637500000,
    status: "Completed",
    reason: "Special campaign for active users.",
  },
  {
    id: "TXN-20251027-004",
    userId: "usr-anita",
    userName: "Anita Singh",
    userEmail: "anita@domain.com",
    transactionType: "Refund",
    creditChange: 1000,
    source: "Support",
    date: "Oct 27, 2025, 4:30 PM",
    timestamp: 1761561000000,
    status: "Completed",
    reason: "Credit refund for failed queue timeout request REQ-001245",
  },
];

/**
 * Canonical Screen 25 Credit Settings
 */
export const CANONICAL_CREDIT_SETTINGS: CreditSettings = {
  defaultCostPerImage: 1,
  promotionalExpiryDays: 90,
  maxPromotionalPerUser: 2000,
  maxAdminAllocationPerDay: 50000,
  refundOnFailure: true,
  rolloverAllowed: true,
  twoFactorRequiredForAdminGrant: false,
  updatedAt: "Oct 28, 2025, 10:00 AM",
};

/**
 * Canonical Screen 25 Credit Summary Metrics
 */
export const CANONICAL_CREDIT_SUMMARY: CreditSummaryMetrics = {
  activeCreditPlans: 4,
  activePlansChange: "+1",
  totalCreditsIssued: 125000,
  totalCreditsChange: "+12.5%",
  creditsConsumed: 98750,
  creditsConsumedChange: "+11.2%",
  creditsRemaining: 26250,
  creditsRemainingChange: "+8.7%",
};

/**
 * Reconcile user balance based on credits and transactions
 */
export function calculateAvailableBalance(user: UserCreditAccount): number {
  return user.availableBalance;
}

/**
 * Format credit quantities with comma separated notation (e.g. 1,25,000 or 98,750)
 */
export function formatCredits(num: number, useIndianFormat = false): string {
  if (useIndianFormat && num >= 100000) {
    // 1,25,000 format
    const str = num.toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    return formatted;
  }
  return num.toLocaleString("en-US");
}

/**
 * Generate CSV export of transaction ledger
 */
export function generateTransactionsCsv(transactions: CreditTransaction[]): string {
  const headers = [
    "Transaction ID",
    "User",
    "Account / Email",
    "Transaction Type",
    "Credit Change",
    "Source",
    "Date",
    "Status",
    "Reason",
  ];

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.userName}"`,
    `"${t.userEmail}"`,
    `"${t.transactionType}"`,
    t.creditChange > 0 ? `+${t.creditChange}` : `${t.creditChange}`,
    `"${t.source}"`,
    `"${t.date}"`,
    `"${t.status}"`,
    `"${(t.reason || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Generate CSV export of user credit allocation
 */
export function generateUserCreditsCsv(users: UserCreditAccount[]): string {
  const headers = [
    "User ID",
    "User",
    "Account / Email",
    "Purchased Credits",
    "Promotional Credits",
    "Admin Granted",
    "Credits Used",
    "Available Balance",
    "Status",
    "Last Transaction",
  ];

  const rows = users.map((u) => [
    `"${u.userId}"`,
    `"${u.name}"`,
    `"${u.email}"`,
    u.purchasedCredits,
    u.promotionalCredits,
    u.adminGrantedCredits,
    u.creditsUsed,
    u.availableBalance,
    `"${u.status}"`,
    `"${u.lastTransactionAt}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
