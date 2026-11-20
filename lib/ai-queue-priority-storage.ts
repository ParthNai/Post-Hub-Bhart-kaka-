import fs from "fs";
import path from "path";
import {
  type QueuePriorityDataset,
  type QueuePriorityItem,
  type QueuePriorityLevel,
  type QueueSchedulingSettings,
  type PriorityConfig,
  type QueueActivityEvent,
  CANONICAL_QUEUE_PRIORITY_SEED,
  compareQueueItemsForScheduling,
} from "./ai-queue-priority.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORAGE_FILE = path.join(DATA_DIR, "ai-queue-priority.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Recalculate summary metrics from actual item state
 */
export function recalculateQueueMetrics(
  items: QueuePriorityItem[],
  existingTimestamp?: string
): QueuePriorityDataset["summary"] {
  const processing = items.filter((it) => it.status === "Processing").length;
  const scheduled = items.filter((it) => it.status === "Scheduled").length;
  const failed = items.filter((it) => it.status === "Failed").length;
  // Total active queued requests includes waiting, processing, scheduled, and paused (excludes completed/cancelled)
  const activeQueued = items.filter(
    (it) =>
      it.status === "Processing" ||
      it.status === "Waiting" ||
      it.status === "Scheduled" ||
      it.status === "Paused"
  ).length;

  return {
    totalQueuedRequests: activeQueued,
    currentlyProcessing: processing,
    scheduledRequests: scheduled,
    failedBlockedRequests: failed,
    lastUpdated: existingTimestamp || "Nov 19, 2025 10:48 AM",
  };
}

/**
 * Re-index queue positions based on scheduling order
 */
export function reindexQueuePositions(
  items: QueuePriorityItem[],
  fairScheduling: boolean = true,
  maxWaitingThresholdMinutes: number = 30
): QueuePriorityItem[] {
  // Processing items keep their top positions
  const processing = items.filter((it) => it.status === "Processing");
  // Waiting items get sorted deterministically by priority and wait time
  const waiting = items
    .filter((it) => it.status === "Waiting")
    .sort((a, b) =>
      compareQueueItemsForScheduling(a, b, fairScheduling, maxWaitingThresholdMinutes)
    );
  // Scheduled items
  const scheduled = items.filter((it) => it.status === "Scheduled");
  // Paused, Failed, Cancelled, Completed items
  const others = items.filter(
    (it) =>
      it.status !== "Processing" &&
      it.status !== "Waiting" &&
      it.status !== "Scheduled"
  );

  const reordered = [...processing, ...waiting, ...scheduled, ...others];
  return reordered.map((item, idx) => ({
    ...item,
    queuePosition: idx + 1,
  }));
}

/**
 * Load authoritative Queue Priority dataset
 */
export function getQueuePriorityDataset(): QueuePriorityDataset {
  ensureDataDir();

  if (!fs.existsSync(STORAGE_FILE)) {
    saveQueuePriorityDataset(CANONICAL_QUEUE_PRIORITY_SEED);
    return JSON.parse(JSON.stringify(CANONICAL_QUEUE_PRIORITY_SEED));
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return parsed;
    }
    saveQueuePriorityDataset(CANONICAL_QUEUE_PRIORITY_SEED);
    return JSON.parse(JSON.stringify(CANONICAL_QUEUE_PRIORITY_SEED));
  } catch (err) {
    console.error("Error reading ai-queue-priority.json:", err);
    saveQueuePriorityDataset(CANONICAL_QUEUE_PRIORITY_SEED);
    return JSON.parse(JSON.stringify(CANONICAL_QUEUE_PRIORITY_SEED));
  }
}

/**
 * Save authoritative Queue Priority dataset
 */
export function saveQueuePriorityDataset(dataset: QueuePriorityDataset): void {
  ensureDataDir();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(dataset, null, 2), "utf-8");
}

/**
 * Change priority of a queued request
 */
export function changeRequestPriority(
  requestId: string,
  newPriority: QueuePriorityLevel,
  reason: string,
  adminName: string = "parth"
): { success: boolean; item?: QueuePriorityItem; error?: string } {
  const data = getQueuePriorityDataset();
  const index = data.items.findIndex((it) => it.id === requestId);

  if (index === -1) {
    return { success: false, error: `Request "${requestId}" not found in queue.` };
  }

  const existingItem = data.items[index];
  const oldPriority = existingItem.priority;

  if (oldPriority === newPriority) {
    return { success: true, item: existingItem };
  }

  // Update priority
  existingItem.priority = newPriority;

  // Add audit activity event
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const newEvent: QueueActivityEvent = {
    eventId: `EVT-${1000 + data.activityHistory.length + 1}`,
    requestId: existingItem.id,
    eventType: "Priority Change",
    previousPriority: oldPriority,
    newPriority: newPriority,
    actionBy: adminName,
    timestamp: timeStr,
    fullDateTime: `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${timeStr}`,
    reason: reason || `Priority manually updated from ${oldPriority} to ${newPriority}`,
  };

  data.activityHistory.unshift(newEvent);

  // Re-index positions
  data.items = reindexQueuePositions(
    data.items,
    data.priorityConfig.fairSchedulingPolicy,
    data.priorityConfig.maxWaitingThresholdMinutes
  );

  data.summary = recalculateQueueMetrics(data.items);
  data.lastUpdated = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${timeStr}`;
  data.monitor.lastUpdated = data.lastUpdated;

  saveQueuePriorityDataset(data);

  const updatedItem = data.items.find((it) => it.id === requestId);
  return { success: true, item: updatedItem };
}

/**
 * Cancel a request safely with audit trail and credit safety check
 */
export function cancelQueuedRequest(
  requestId: string,
  reason: string,
  adminName: string = "parth"
): { success: boolean; item?: QueuePriorityItem; error?: string } {
  const data = getQueuePriorityDataset();
  const index = data.items.findIndex((it) => it.id === requestId);

  if (index === -1) {
    return { success: false, error: `Request "${requestId}" not found.` };
  }

  const existingItem = data.items[index];

  if (existingItem.status === "Completed") {
    return { success: false, error: "Cannot cancel an already completed request." };
  }

  existingItem.status = "Cancelled";
  existingItem.failureReason = `Cancelled: ${reason}`;
  if (existingItem.creditsDeducted && existingItem.creditsDeducted > 0) {
    existingItem.refunded = true;
  }

  // Record activity
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const cancelEvent: QueueActivityEvent = {
    eventId: `EVT-${1000 + data.activityHistory.length + 1}`,
    requestId: existingItem.id,
    eventType: "Cancelled",
    previousPriority: existingItem.priority,
    newPriority: "—",
    actionBy: adminName,
    timestamp: timeStr,
    fullDateTime: `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${timeStr}`,
    reason: reason || "Administrative cancellation",
  };

  data.activityHistory.unshift(cancelEvent);

  data.items = reindexQueuePositions(
    data.items,
    data.priorityConfig.fairSchedulingPolicy,
    data.priorityConfig.maxWaitingThresholdMinutes
  );

  data.summary = recalculateQueueMetrics(data.items);
  data.monitor.requestCount = data.summary.totalQueuedRequests;
  data.lastUpdated = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${timeStr}`;

  saveQueuePriorityDataset(data);
  return { success: true, item: existingItem };
}

/**
 * Pause or resume request
 */
export function toggleRequestPause(
  requestId: string,
  adminName: string = "parth"
): { success: boolean; item?: QueuePriorityItem; error?: string } {
  const data = getQueuePriorityDataset();
  const index = data.items.findIndex((it) => it.id === requestId);

  if (index === -1) {
    return { success: false, error: `Request "${requestId}" not found.` };
  }

  const item = data.items[index];
  const newStatus = item.status === "Paused" ? "Waiting" : "Paused";
  item.status = newStatus;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  data.activityHistory.unshift({
    eventId: `EVT-${1000 + data.activityHistory.length + 1}`,
    requestId: item.id,
    eventType: newStatus === "Paused" ? "Paused" : "Resumed",
    previousPriority: item.priority,
    newPriority: item.priority,
    actionBy: adminName,
    timestamp: timeStr,
    fullDateTime: `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${timeStr}`,
    reason: `Request status toggled to ${newStatus}`,
  });

  data.items = reindexQueuePositions(
    data.items,
    data.priorityConfig.fairSchedulingPolicy,
    data.priorityConfig.maxWaitingThresholdMinutes
  );

  data.summary = recalculateQueueMetrics(data.items);
  saveQueuePriorityDataset(data);
  return { success: true, item };
}

/**
 * Reschedule a scheduled request
 */
export function rescheduleQueuedRequest(
  requestId: string,
  newScheduledTime: string,
  adminName: string = "parth"
): { success: boolean; item?: QueuePriorityItem; error?: string } {
  const data = getQueuePriorityDataset();
  const index = data.items.findIndex((it) => it.id === requestId);

  if (index === -1) {
    return { success: false, error: `Request "${requestId}" not found.` };
  }

  const item = data.items[index];
  item.scheduledAt = newScheduledTime;
  item.status = "Scheduled";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  data.activityHistory.unshift({
    eventId: `EVT-${1000 + data.activityHistory.length + 1}`,
    requestId: item.id,
    eventType: "Scheduled",
    previousPriority: item.priority,
    newPriority: item.priority,
    actionBy: adminName,
    timestamp: timeStr,
    fullDateTime: `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${timeStr}`,
    reason: `Rescheduled to ${newScheduledTime}`,
  });

  saveQueuePriorityDataset(data);
  return { success: true, item };
}

/**
 * Update Scheduling Settings
 */
export function updateSchedulingSettings(
  partial: Partial<QueueSchedulingSettings>
): { success: boolean; settings: QueueSchedulingSettings; error?: string } {
  const data = getQueuePriorityDataset();

  if (partial.maxConcurrentJobs !== undefined && partial.maxConcurrentJobs < 1) {
    return { success: false, settings: data.schedulingSettings, error: "Maximum concurrent jobs must be at least 1." };
  }

  data.schedulingSettings = {
    ...data.schedulingSettings,
    ...partial,
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  data.lastUpdated = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${timeStr}`;
  data.monitor.status = data.schedulingSettings.queueProcessing ? "Active" : "Paused";

  saveQueuePriorityDataset(data);
  return { success: true, settings: data.schedulingSettings };
}

/**
 * Update Priority Configuration
 */
export function updatePriorityConfiguration(
  partial: Partial<PriorityConfig>
): { success: boolean; config: PriorityConfig; error?: string } {
  const data = getQueuePriorityDataset();

  data.priorityConfig = {
    ...data.priorityConfig,
    ...partial,
  };

  // Re-index with updated fair scheduling or threshold rules
  data.items = reindexQueuePositions(
    data.items,
    data.priorityConfig.fairSchedulingPolicy,
    data.priorityConfig.maxWaitingThresholdMinutes
  );

  saveQueuePriorityDataset(data);
  return { success: true, config: data.priorityConfig };
}

/**
 * Filter and paginate request items
 */
export function queryQueuePriorityItems(options: {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}): {
  items: QueuePriorityItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const data = getQueuePriorityDataset();
  let list = [...data.items];

  // Search filter
  if (options.search && options.search.trim().length > 0) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (it) =>
        it.id.toLowerCase().includes(q) ||
        it.userId.toLowerCase().includes(q) ||
        (it.userName && it.userName.toLowerCase().includes(q)) ||
        (it.prompt && it.prompt.toLowerCase().includes(q)) ||
        it.relatedJobId.toLowerCase().includes(q) ||
        it.providerModelFormatted.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (options.type && options.type !== "All Types" && options.type !== "All") {
    list = list.filter((it) => it.generationType.toLowerCase() === options.type?.toLowerCase());
  }

  // Status filter
  if (options.status && options.status !== "All Status" && options.status !== "All Statuses" && options.status !== "All") {
    list = list.filter((it) => it.status.toLowerCase() === options.status?.toLowerCase());
  }

  // Priority filter
  if (options.priority && options.priority !== "All Priorities" && options.priority !== "All") {
    list = list.filter((it) => it.priority.toLowerCase() === options.priority?.toLowerCase());
  }

  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 5; // Reference shows 5 rows
  const total = list.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginated = list.slice(startIndex, startIndex + pageSize);

  return {
    items: paginated,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Reset Queue Priority data to canonical seed
 */
export function resetQueuePriorityData(): QueuePriorityDataset {
  const seed = JSON.parse(JSON.stringify(CANONICAL_QUEUE_PRIORITY_SEED));
  saveQueuePriorityDataset(seed);
  return seed;
}
