/**
 * Authoritative types, models, and canonical datasets for
 * Screen 30: AI Generation Queue Priority & Scheduling Management
 */

export type QueuePriorityLevel = "Critical" | "High" | "Normal" | "Low";

export type QueueItemStatus =
  | "Processing"
  | "Waiting"
  | "Scheduled"
  | "Paused"
  | "Failed"
  | "Cancelled"
  | "Completed";

export type QueueRequestType = "Image" | "Text" | "Multimodal";

export interface QueuePriorityItem {
  id: string; // e.g. "REQ-4587"
  queuePosition: number; // 1, 2, 3...
  userId: string; // e.g. "user_2847"
  userName?: string;
  userRole?: string;
  generationType: QueueRequestType;
  provider: string; // "OpenAI", "Gemini", "Stability AI"
  model: string; // "GPT-4o", "1.5 Pro", "Stable Diffusion XL"
  providerModelFormatted: string; // e.g. "OpenAI / GPT-4o"
  priority: QueuePriorityLevel;
  submittedAt: string; // e.g. "Nov 19, 10:40 AM"
  submittedTimestamp: number;
  scheduledAt: string | null; // e.g. "Nov 19, 11:00 AM" or null
  scheduledTimestamp: number | null;
  status: QueueItemStatus;
  attemptCount: number;
  relatedJobId: string; // e.g. "JOB-7845"
  prompt?: string;
  aspectRatio?: string;
  creditsDeducted?: number;
  refunded?: boolean;
  workerId?: string;
  failureReason?: string | null;
  waitingDurationMinutes?: number;
}

export interface QueueSummaryMetrics {
  totalQueuedRequests: number; // 128
  currentlyProcessing: number; // 12
  scheduledRequests: number; // 34
  failedBlockedRequests: number; // 5
  lastUpdated: string; // "Nov 19, 2025 10:48 AM"
}

export interface QueueMonitorInfo {
  queueName: string; // "Main Generation Queue"
  currentPosition: string; // "#1 – 50"
  requestCount: number; // 128
  status: "Active" | "Paused" | "Degraded";
  priorityLevel: QueuePriorityLevel;
  lastUpdated: string; // "Nov 19, 2025 10:48 AM"
}

export interface PriorityConfig {
  criticalDescription: string;
  highDescription: string;
  normalDescription: string;
  lowDescription: string;
  ordering: string; // "Critical → High → Normal → Low"
  fairSchedulingPolicy: boolean;
  maxWaitingThresholdMinutes: number; // 30
  queueOverflowBehavior: "Auto Scale" | "Reject" | "Spillover" | "Throttle";
}

export interface QueueSchedulingSettings {
  schedulingMode: "Balanced" | "Throughput-Optimized" | "Cost-Optimized" | "Strict-Priority";
  maxConcurrentJobs: number; // 20
  providerSpecificLimits: boolean;
  queueProcessing: boolean;
  scheduledRequestHandling: "Process on Time" | "Immediate If Capacity" | "Batch Scheduled";
  retrySchedulingPolicy: "Exponential Backoff" | "Linear Retry" | "Fixed Interval";
  rateLimitHandling: "Queue & Retry" | "Instant Failover" | "Drop Request";
  providerConcurrencyLimits?: Record<string, number>;
}

export interface QueueActivityEvent {
  eventId: string; // e.g. "EVT-1001"
  requestId: string; // e.g. "REQ-4587"
  eventType:
    | "Priority Change"
    | "Scheduled"
    | "Added"
    | "Paused"
    | "Resumed"
    | "Cancelled"
    | "Failed"
    | "Processing Started"
    | "Completed";
  previousPriority: string; // "Normal", "—", "High"
  newPriority: string; // "Critical", "High", "Normal", "Low"
  actionBy: string; // "parth", "system"
  timestamp: string; // "10:46 AM"
  fullDateTime: string; // "Nov 19, 2025 • 10:46:12 AM"
  reason?: string;
}

export interface QueuePriorityDataset {
  summary: QueueSummaryMetrics;
  monitor: QueueMonitorInfo;
  priorityConfig: PriorityConfig;
  schedulingSettings: QueueSchedulingSettings;
  items: QueuePriorityItem[];
  activityHistory: QueueActivityEvent[];
  lastUpdated: string;
}

// Deterministic priority rank map for ordering (lower number = higher priority)
export const PRIORITY_RANK: Record<QueuePriorityLevel, number> = {
  Critical: 1,
  High: 2,
  Normal: 3,
  Low: 4,
};

/**
 * Compare two queue items for scheduling order:
 * 1. Priority rank (Critical > High > Normal > Low)
 * 2. If Fair Scheduling is active and waiting time exceeds threshold, starve-boost
 * 3. Submission timestamp (earlier first)
 */
export function compareQueueItemsForScheduling(
  a: QueuePriorityItem,
  b: QueuePriorityItem,
  fairScheduling: boolean = true,
  maxWaitingThresholdMinutes: number = 30
): number {
  let rankA = PRIORITY_RANK[a.priority];
  let rankB = PRIORITY_RANK[b.priority];

  if (fairScheduling) {
    if ((a.waitingDurationMinutes || 0) >= maxWaitingThresholdMinutes && rankA > 1) {
      rankA -= 1; // Temporary starvation boost
    }
    if ((b.waitingDurationMinutes || 0) >= maxWaitingThresholdMinutes && rankB > 1) {
      rankB -= 1;
    }
  }

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  return a.submittedTimestamp - b.submittedTimestamp;
}

// Canonical Top 5 items matching Screen 30 reference image exactly
export const CANONICAL_TOP_ITEMS: QueuePriorityItem[] = [
  {
    id: "REQ-4587",
    queuePosition: 1,
    userId: "user_2847",
    userName: "Parth Admin",
    userRole: "Administrator",
    generationType: "Image",
    provider: "OpenAI",
    model: "GPT-4o",
    providerModelFormatted: "OpenAI / GPT-4o",
    priority: "Critical",
    submittedAt: "Nov 19, 10:40 AM",
    submittedTimestamp: 1795084800000,
    scheduledAt: null,
    scheduledTimestamp: null,
    status: "Processing",
    attemptCount: 1,
    relatedJobId: "JOB-7845",
    prompt: "High-resolution corporate anniversary poster with golden typography and luxury purple backdrop",
    aspectRatio: "1:1",
    creditsDeducted: 25,
    workerId: "worker-ai-01",
    waitingDurationMinutes: 8,
  },
  {
    id: "REQ-4586",
    queuePosition: 2,
    userId: "user_1293",
    userName: "Priya Shah",
    userRole: "Creator Pro",
    generationType: "Image",
    provider: "Gemini",
    model: "1.5 Pro",
    providerModelFormatted: "Gemini / 1.5 Pro",
    priority: "High",
    submittedAt: "Nov 19, 10:42 AM",
    submittedTimestamp: 1795084920000,
    scheduledAt: null,
    scheduledTimestamp: null,
    status: "Waiting",
    attemptCount: 1,
    relatedJobId: "JOB-7844",
    prompt: "Diwali festival greeting card with diya lanterns, floral rangoli patterns and sacred warm ambience",
    aspectRatio: "9:16",
    creditsDeducted: 25,
    waitingDurationMinutes: 6,
  },
  {
    id: "REQ-4585",
    queuePosition: 3,
    userId: "user_7721",
    userName: "Amit Desai",
    userRole: "Business Team",
    generationType: "Image",
    provider: "Stability AI",
    model: "Stable Diffusion XL",
    providerModelFormatted: "Stability AI",
    priority: "Normal",
    submittedAt: "Nov 19, 10:43 AM",
    submittedTimestamp: 1795084980000,
    scheduledAt: null,
    scheduledTimestamp: null,
    status: "Waiting",
    attemptCount: 1,
    relatedJobId: "JOB-7843",
    prompt: "Product packaging preview banner with modern minimal aesthetic on pedestal",
    aspectRatio: "1:1",
    creditsDeducted: 25,
    waitingDurationMinutes: 5,
  },
  {
    id: "REQ-4584",
    queuePosition: 4,
    userId: "user_6602",
    userName: "Neha Patel",
    userRole: "Creator Pro",
    generationType: "Text",
    provider: "OpenAI",
    model: "GPT-4o",
    providerModelFormatted: "OpenAI / GPT-4o",
    priority: "Low",
    submittedAt: "Nov 19, 10:44 AM",
    submittedTimestamp: 1795085040000,
    scheduledAt: "Nov 19, 11:00 AM",
    scheduledTimestamp: 1795086000000,
    status: "Scheduled",
    attemptCount: 0,
    relatedJobId: "JOB-7842",
    prompt: "Catchy seasonal marketing headline variations for Black Friday e-commerce campaign",
    creditsDeducted: 5,
    waitingDurationMinutes: 4,
  },
  {
    id: "REQ-4583",
    queuePosition: 5,
    userId: "user_3412",
    userName: "Rohan Mehta",
    userRole: "Member",
    generationType: "Image",
    provider: "Gemini",
    model: "1.5 Pro",
    providerModelFormatted: "Gemini / 1.5 Pro",
    priority: "High",
    submittedAt: "Nov 19, 10:45 AM",
    submittedTimestamp: 1795085100000,
    scheduledAt: null,
    scheduledTimestamp: null,
    status: "Paused",
    attemptCount: 1,
    relatedJobId: "JOB-7841",
    prompt: "Real estate luxury apartment promotional banner with terrace sunset view",
    aspectRatio: "16:9",
    creditsDeducted: 25,
    waitingDurationMinutes: 3,
  },
];

// Helper to synthesize additional records to reach canonical 128 total
export function generateSupplementalQueueItems(): QueuePriorityItem[] {
  const supplemental: QueuePriorityItem[] = [];
  const providers = ["OpenAI", "Gemini", "Stability AI"];
  const models: Record<string, string[]> = {
    OpenAI: ["GPT-4o", "DALL·E 3"],
    Gemini: ["1.5 Pro", "Imagen 3.0"],
    "Stability AI": ["Stable Diffusion XL", "SD Turbo"],
  };
  const priorities: QueuePriorityLevel[] = ["High", "Normal", "Low", "Critical"];

  // 12 currently processing total (1 already in top 5, need 11 more)
  for (let i = 6; i <= 16; i++) {
    const prov = providers[i % providers.length];
    const mdl = models[prov][i % models[prov].length];
    supplemental.push({
      id: `REQ-${4588 - i}`,
      queuePosition: i,
      userId: `user_${3000 + i}`,
      userName: `User ${3000 + i}`,
      generationType: i % 4 === 0 ? "Text" : "Image",
      provider: prov,
      model: mdl,
      providerModelFormatted: `${prov} / ${mdl}`,
      priority: priorities[i % priorities.length],
      submittedAt: `Nov 19, 10:${String(30 + (i % 20)).padStart(2, "0")} AM`,
      submittedTimestamp: 1795084200000 + i * 40000,
      scheduledAt: null,
      scheduledTimestamp: null,
      status: "Processing",
      attemptCount: 1,
      relatedJobId: `JOB-${7840 - i}`,
      prompt: `Active image generation stream payload ${i}`,
      creditsDeducted: 25,
      workerId: `worker-ai-0${(i % 3) + 1}`,
      waitingDurationMinutes: 10 + (i % 5),
    });
  }

  // 34 scheduled requests total (1 already in top 5, need 33 more)
  for (let i = 17; i <= 49; i++) {
    const prov = providers[i % providers.length];
    const mdl = models[prov][i % models[prov].length];
    supplemental.push({
      id: `REQ-${4588 - i}`,
      queuePosition: i,
      userId: `user_${4000 + i}`,
      userName: `User ${4000 + i}`,
      generationType: i % 3 === 0 ? "Text" : "Image",
      provider: prov,
      model: mdl,
      providerModelFormatted: `${prov} / ${mdl}`,
      priority: priorities[i % priorities.length],
      submittedAt: `Nov 19, 10:${String(20 + (i % 25)).padStart(2, "0")} AM`,
      submittedTimestamp: 1795083600000 + i * 35000,
      scheduledAt: `Nov 19, ${11 + (i % 4)}:00 ${i % 2 === 0 ? "AM" : "PM"}`,
      scheduledTimestamp: 1795086000000 + i * 180000,
      status: "Scheduled",
      attemptCount: 0,
      relatedJobId: `JOB-${7840 - i}`,
      prompt: `Scheduled social post campaign generation item #${i}`,
      creditsDeducted: 25,
      waitingDurationMinutes: 15 + (i % 8),
    });
  }

  // 5 failed / blocked requests total
  for (let i = 50; i <= 54; i++) {
    const prov = providers[i % providers.length];
    const mdl = models[prov][i % models[prov].length];
    supplemental.push({
      id: `REQ-${4588 - i}`,
      queuePosition: i,
      userId: `user_${5000 + i}`,
      userName: `User ${5000 + i}`,
      generationType: "Image",
      provider: prov,
      model: mdl,
      providerModelFormatted: `${prov} / ${mdl}`,
      priority: "Normal",
      submittedAt: `Nov 19, 09:${String(40 + (i % 15)).padStart(2, "0")} AM`,
      submittedTimestamp: 1795081200000 + i * 30000,
      scheduledAt: null,
      scheduledTimestamp: null,
      status: "Failed",
      attemptCount: 3,
      relatedJobId: `JOB-${7840 - i}`,
      failureReason: i % 2 === 0 ? "Provider Rate Limit (429)" : "Gateway Timeout (> 30s)",
      prompt: `Failed prompt payload batch request ${i}`,
      creditsDeducted: 0,
      refunded: true,
      waitingDurationMinutes: 0,
    });
  }

  // Remaining to make exact 128 total: waiting and paused requests
  for (let i = 55; i <= 128; i++) {
    const prov = providers[i % providers.length];
    const mdl = models[prov][i % models[prov].length];
    const isPaused = i % 20 === 0;
    supplemental.push({
      id: `REQ-${4588 - i}`,
      queuePosition: i,
      userId: `user_${6000 + i}`,
      userName: `User ${6000 + i}`,
      generationType: i % 5 === 0 ? "Text" : "Image",
      provider: prov,
      model: mdl,
      providerModelFormatted: `${prov} / ${mdl}`,
      priority: priorities[i % priorities.length],
      submittedAt: `Nov 19, 09:${String(10 + (i % 40)).padStart(2, "0")} AM`,
      submittedTimestamp: 1795079400000 + i * 25000,
      scheduledAt: null,
      scheduledTimestamp: null,
      status: isPaused ? "Paused" : "Waiting",
      attemptCount: 1,
      relatedJobId: `JOB-${7840 - i}`,
      prompt: `Standard user poster creation request ${i}`,
      creditsDeducted: 25,
      waitingDurationMinutes: 12 + (i % 18),
    });
  }

  return supplemental;
}

// Canonical Activity History matching Screen 30 reference image exactly
export const CANONICAL_ACTIVITY_HISTORY: QueueActivityEvent[] = [
  {
    eventId: "EVT-1001",
    requestId: "REQ-4587",
    eventType: "Priority Change",
    previousPriority: "Normal",
    newPriority: "Critical",
    actionBy: "parth",
    timestamp: "10:46 AM",
    fullDateTime: "Nov 19, 2025 • 10:46:15 AM",
    reason: "Urgent executive campaign graphic required for live press release.",
  },
  {
    eventId: "EVT-1000",
    requestId: "REQ-4586",
    eventType: "Scheduled",
    previousPriority: "High",
    newPriority: "High",
    actionBy: "system",
    timestamp: "10:44 AM",
    fullDateTime: "Nov 19, 2025 • 10:44:20 AM",
    reason: "Auto-scheduled into priority tier based on active Pro membership.",
  },
  {
    eventId: "EVT-0999",
    requestId: "REQ-4585",
    eventType: "Added",
    previousPriority: "—",
    newPriority: "Normal",
    actionBy: "parth",
    timestamp: "10:43 AM",
    fullDateTime: "Nov 19, 2025 • 10:43:08 AM",
    reason: "New request queued via API gateway.",
  },
];

// Initial canonical dataset
export const CANONICAL_QUEUE_PRIORITY_SEED: QueuePriorityDataset = {
  summary: {
    totalQueuedRequests: 128,
    currentlyProcessing: 12,
    scheduledRequests: 34,
    failedBlockedRequests: 5,
    lastUpdated: "Nov 19, 2025 10:48 AM",
  },
  monitor: {
    queueName: "Main Generation Queue",
    currentPosition: "#1 – 50",
    requestCount: 128,
    status: "Active",
    priorityLevel: "Normal",
    lastUpdated: "Nov 19, 2025 10:48 AM",
  },
  priorityConfig: {
    criticalDescription: "Top priority – process first",
    highDescription: "High priority requests",
    normalDescription: "Standard priority",
    lowDescription: "Background processing",
    ordering: "Critical → High → Normal → Low",
    fairSchedulingPolicy: true,
    maxWaitingThresholdMinutes: 30,
    queueOverflowBehavior: "Auto Scale",
  },
  schedulingSettings: {
    schedulingMode: "Balanced",
    maxConcurrentJobs: 20,
    providerSpecificLimits: true,
    queueProcessing: true,
    scheduledRequestHandling: "Process on Time",
    retrySchedulingPolicy: "Exponential Backoff",
    rateLimitHandling: "Queue & Retry",
    providerConcurrencyLimits: {
      OpenAI: 10,
      Gemini: 8,
      "Stability AI": 6,
    },
  },
  items: [...CANONICAL_TOP_ITEMS, ...generateSupplementalQueueItems()],
  activityHistory: CANONICAL_ACTIVITY_HISTORY,
  lastUpdated: "Nov 19, 2025 10:48 AM",
};
