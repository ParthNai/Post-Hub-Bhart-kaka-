import fs from "fs";
import path from "path";
import type {
  AiQueueItem,
  AiQueueMetrics,
  AiQueueOverview,
  AiQueueSettings,
  AiQueueFilterOptions,
} from "./ai-queue";

const DATA_DIR = path.join(process.cwd(), ".data");
const QUEUE_FILE = path.join(DATA_DIR, "ai-queue-items.json");
const QUEUE_SETTINGS_FILE = path.join(DATA_DIR, "ai-queue-settings.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Canonical seed queue items matching Screen 21 reference image exactly
export const CANONICAL_QUEUE_ITEMS: AiQueueItem[] = [
  {
    id: "REQ-001247",
    userId: "USR-001",
    userName: "Parth Patel",
    userAvatar: "/avatars/parth.jpg",
    userRole: "Administrator",
    prompt: "Create a Diwali festival poster with diyas and traditional design, warm lighting and golden sparkles",
    promptPreview: "Create a Diwali festival poster...",
    presetName: "Diwali Festival",
    thumbnailType: "diwali",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 04:32 PM",
    submittedTimestamp: 1793284320000,
    processingStartedAt: "Oct 28, 04:33 PM",
    completedAt: null,
    status: "processing",
    durationSec: null,
    dimensions: "1080 × 1350 px",
    format: "PNG",
    retryCount: 0,
    maxRetries: 2,
    workerId: "worker-01",
    priority: 10,
  },
  {
    id: "REQ-001246",
    userId: "USR-004",
    userName: "Priya Shah",
    userAvatar: "/avatars/priya.jpg",
    userRole: "Marketing Specialist",
    prompt: "Education admission poster for 2026 with academic badges and smiling student",
    promptPreview: "Education admission poster for 2026...",
    presetName: "Education Admission",
    thumbnailType: "education",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 04:28 PM",
    submittedTimestamp: 1793284080000,
    processingStartedAt: "Oct 28, 04:29 PM",
    completedAt: null,
    status: "pending",
    durationSec: null,
    dimensions: "1024 × 1365 px",
    format: "PNG",
    retryCount: 0,
    maxRetries: 2,
    priority: 8,
  },
  {
    id: "REQ-001245",
    userId: "USR-005",
    userName: "Amit Desai",
    userAvatar: "/avatars/amit.jpg",
    userRole: "Content Creator",
    prompt: "Business growth poster with upward trend bar charts and professional business executive",
    promptPreview: "Business growth poster with graph...",
    presetName: "Business Growth",
    thumbnailType: "business",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    submittedAt: "Oct 28, 04:25 PM",
    submittedTimestamp: 1793283900000,
    processingStartedAt: null,
    completedAt: null,
    status: "pending",
    durationSec: null,
    dimensions: "1200 × 630 px",
    format: "JPG",
    retryCount: 0,
    maxRetries: 2,
    priority: 5,
  },
  {
    id: "REQ-001244",
    userId: "USR-006",
    userName: "Neha Patel",
    userAvatar: "/avatars/neha.jpg",
    userRole: "Brand Designer",
    prompt: "Product launch offer poster featuring modern wireless headphones on minimalist pedestal",
    promptPreview: "Product launch offer poster...",
    presetName: "Product Launch",
    thumbnailType: "product",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 04:20 PM",
    submittedTimestamp: 1793283600000,
    processingStartedAt: "Oct 28, 04:21 PM",
    completedAt: "Oct 28, 04:21 PM",
    status: "completed",
    durationSec: 18,
    dimensions: "1080 × 1350 px",
    format: "PNG",
    retryCount: 0,
    maxRetries: 2,
    priority: 5,
  },
  {
    id: "REQ-001243",
    userId: "USR-007",
    userName: "Ananya Roy",
    userAvatar: "/avatars/ananya.jpg",
    userRole: "Social Media Manager",
    prompt: "New Year 2026 celebration banner with golden sparkles and luxury night aesthetic",
    promptPreview: "New Year 2026 celebration banner...",
    presetName: "New Year 2026",
    thumbnailType: "newyear",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 04:15 PM",
    submittedTimestamp: 1793283300000,
    processingStartedAt: "Oct 28, 04:31 PM",
    completedAt: null,
    status: "processing",
    durationSec: null,
    dimensions: "1080 × 1080 px",
    format: "PNG",
    retryCount: 0,
    maxRetries: 2,
    workerId: "worker-01",
    priority: 7,
  },
  {
    id: "REQ-001242",
    userId: "USR-008",
    userName: "Vikram Joshi",
    userAvatar: "/avatars/vikram.jpg",
    userRole: "Healthcare Coordinator",
    prompt: "Medical clinic wellness checkup announcement poster with doctor and stethoscope",
    promptPreview: "Medical clinic wellness checkup...",
    presetName: "Healthcare Clinic",
    thumbnailType: "health",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    submittedAt: "Oct 28, 04:10 PM",
    submittedTimestamp: 1793283000000,
    processingStartedAt: null,
    completedAt: null,
    status: "pending",
    durationSec: null,
    dimensions: "1080 × 1350 px",
    format: "JPG",
    retryCount: 0,
    maxRetries: 2,
    priority: 6,
  },
  // Canonical Failed Requests (7 total, led by REQ-001240)
  {
    id: "REQ-001240",
    userId: "USR-009",
    userName: "Rohan Mehta",
    userAvatar: "/avatars/rohan-m.jpg",
    userRole: "Marketing Executive",
    prompt: "Diwali festival celebration special offer poster with diyas and gift boxes",
    promptPreview: "Diwali festival celebration special...",
    presetName: "Diwali Festival",
    thumbnailType: "diwali",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 03:48 PM",
    submittedTimestamp: 1793281680000,
    processingStartedAt: "Oct 28, 03:49 PM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1080 × 1350 px",
    format: "PNG",
    errorCode: 429,
    errorMessage: "Rate limit exceeded",
    retryCount: 0,
    maxRetries: 2,
    priority: 5,
  },
  {
    id: "REQ-001235",
    userId: "USR-010",
    userName: "Suresh Kumar",
    userAvatar: "/avatars/suresh.jpg",
    userRole: "Content Specialist",
    prompt: "Summer sale mega discount banner with beach sunset and shopping bags",
    promptPreview: "Summer sale mega discount banner...",
    presetName: "Summer Sale",
    thumbnailType: "sale",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 03:15 PM",
    submittedTimestamp: 1793279700000,
    processingStartedAt: "Oct 28, 03:16 PM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1080 × 1350 px",
    format: "JPG",
    errorCode: 400,
    errorMessage: "Context length exceeded",
    retryCount: 1,
    maxRetries: 2,
  },
  {
    id: "REQ-001228",
    userId: "USR-011",
    userName: "Kavita Rao",
    userAvatar: "/avatars/kavita.jpg",
    userRole: "Designer",
    prompt: "Corporate announcement flyer with skyscraper glass facade",
    promptPreview: "Corporate announcement flyer...",
    presetName: "Corporate Design",
    thumbnailType: "corporate",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    submittedAt: "Oct 28, 02:40 PM",
    submittedTimestamp: 1793277600000,
    processingStartedAt: "Oct 28, 02:41 PM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1080 × 1350 px",
    format: "PNG",
    errorCode: 504,
    errorMessage: "Provider gateway timeout",
    retryCount: 2,
    maxRetries: 2,
  },
  {
    id: "REQ-001215",
    userId: "USR-012",
    userName: "Deepak Sharma",
    userAvatar: "/avatars/deepak.jpg",
    userRole: "Art Director",
    prompt: "Creative social media post with 3D floating emojis",
    promptPreview: "Creative social media post...",
    presetName: "Social Media Post",
    thumbnailType: "social",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 01:50 PM",
    submittedTimestamp: 1793274600000,
    processingStartedAt: "Oct 28, 01:51 PM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1080 × 1080 px",
    format: "PNG",
    errorCode: 403,
    errorMessage: "Safety filter triggered",
    retryCount: 0,
    maxRetries: 2,
  },
  {
    id: "REQ-001202",
    userId: "USR-013",
    userName: "Manish Patel",
    userAvatar: "/avatars/manish.jpg",
    userRole: "Campaign Manager",
    prompt: "Real estate luxury architecture poster with infinity pool",
    promptPreview: "Real estate luxury architecture...",
    presetName: "Real Estate Modern",
    thumbnailType: "realestate",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    submittedAt: "Oct 28, 12:20 PM",
    submittedTimestamp: 1793269200000,
    processingStartedAt: "Oct 28, 12:21 PM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1024 × 1365 px",
    format: "JPG",
    errorCode: 422,
    errorMessage: "Invalid dimension format",
    retryCount: 0,
    maxRetries: 2,
  },
  {
    id: "REQ-001188",
    userId: "USR-014",
    userName: "Pooja Verma",
    userAvatar: "/avatars/pooja.jpg",
    userRole: "Content Strategist",
    prompt: "Restaurant gourmet dining promotion poster with plated dish",
    promptPreview: "Restaurant gourmet dining promotion...",
    presetName: "Restaurant Menu",
    thumbnailType: "food",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 11:05 AM",
    submittedTimestamp: 1793264700000,
    processingStartedAt: "Oct 28, 11:06 AM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1024 × 1365 px",
    format: "PNG",
    errorCode: 502,
    errorMessage: "Bad gateway response",
    retryCount: 0,
    maxRetries: 2,
  },
  {
    id: "REQ-001170",
    userId: "USR-015",
    userName: "Rajesh Nair",
    userAvatar: "/avatars/rajesh.jpg",
    userRole: "Marketing Associate",
    prompt: "Technology AI summit keynote poster with digital neural nodes",
    promptPreview: "Technology AI summit keynote...",
    presetName: "Tech Conference 2026",
    thumbnailType: "tech",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    submittedAt: "Oct 28, 09:30 AM",
    submittedTimestamp: 1793259000000,
    processingStartedAt: "Oct 28, 09:31 AM",
    completedAt: null,
    status: "failed",
    durationSec: null,
    dimensions: "1080 × 1920 px",
    format: "PNG",
    errorCode: 429,
    errorMessage: "Token quota depleted",
    retryCount: 1,
    maxRetries: 2,
  },
];

// Seed 120 additional completed requests from past 24h to fulfill 124 completed requests exactly
function generateCompletedSeedItems(): AiQueueItem[] {
  const extraItems: AiQueueItem[] = [];
  const baseTime = 1793280000000; // Oct 28, 2026

  for (let i = 1; i <= 123; i++) {
    const num = String(1160 - i).padStart(6, "0");
    const submittedTime = baseTime - i * 480000; // spread over 24 hours
    const date = new Date(submittedTime);
    const dateStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    extraItems.push({
      id: `REQ-${num}`,
      userId: `USR-${(i % 10) + 1}`,
      userName: i % 2 === 0 ? "Parth Patel" : "Marketing Team",
      prompt: `Completed promotional poster template ${i} for seasonal campaigns`,
      promptPreview: `Completed promotional poster template ${i}...`,
      presetName: i % 3 === 0 ? "Diwali Festival" : i % 2 === 0 ? "Business Growth" : "Summer Sale",
      thumbnailType: i % 3 === 0 ? "diwali" : i % 2 === 0 ? "business" : "sale",
      provider: i % 2 === 0 ? "OpenAI / DALL-E 3" : "Google / Imagen",
      providerId: i % 2 === 0 ? "openai" : "google",
      model: i % 2 === 0 ? "DALL·E 3" : "Imagen 3.0",
      submittedAt: `Oct 27, ${dateStr}`,
      submittedTimestamp: submittedTime,
      processingStartedAt: `Oct 27, ${dateStr}`,
      completedAt: `Oct 27, ${dateStr}`,
      status: "completed",
      durationSec: 16 + (i % 6),
      dimensions: "1080 × 1350 px",
      format: "PNG",
      retryCount: 0,
      maxRetries: 2,
      priority: 5,
    });
  }

  return extraItems;
}

export const CANONICAL_SETTINGS: AiQueueSettings = {
  maxConcurrentJobs: 5,
  workerTimeoutSec: 60,
  autoRetryFailed: false,
  maxRetryAttempts: 2,
  pollingIntervalSec: 10,
  maintenanceMode: false,
};

/**
 * Load all queue items from JSON storage
 */
export function getAllQueueItems(): AiQueueItem[] {
  ensureDataDir();
  if (!fs.existsSync(QUEUE_FILE)) {
    const initial = [...CANONICAL_QUEUE_ITEMS, ...generateCompletedSeedItems()];
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(QUEUE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = [...CANONICAL_QUEUE_ITEMS, ...generateCompletedSeedItems()];
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.error("Error reading queue file, resetting to canonical:", err);
    const initial = [...CANONICAL_QUEUE_ITEMS, ...generateCompletedSeedItems()];
    return initial;
  }
}

/**
 * Save all queue items to JSON storage
 */
export function saveAllQueueItems(items: AiQueueItem[]): void {
  ensureDataDir();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(items, null, 2), "utf-8");
}

/**
 * Get queue settings
 */
export function getQueueSettings(): AiQueueSettings {
  ensureDataDir();
  if (!fs.existsSync(QUEUE_SETTINGS_FILE)) {
    fs.writeFileSync(QUEUE_SETTINGS_FILE, JSON.stringify(CANONICAL_SETTINGS, null, 2), "utf-8");
    return { ...CANONICAL_SETTINGS };
  }
  try {
    const raw = fs.readFileSync(QUEUE_SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { ...CANONICAL_SETTINGS };
  }
}

/**
 * Save queue settings
 */
export function saveQueueSettings(settings: Partial<AiQueueSettings>): AiQueueSettings {
  ensureDataDir();
  const current = getQueueSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(QUEUE_SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/**
 * Calculate Queue KPI Metrics matching Screen 21
 */
export function getQueueMetrics(items?: AiQueueItem[]): AiQueueMetrics {
  const list = items || getAllQueueItems();
  const pending = list.filter((r) => r.status === "pending").length;
  const processing = list.filter((r) => r.status === "processing").length;
  const completed24h = list.filter((r) => r.status === "completed").length;
  const failed = list.filter((r) => r.status === "failed").length;

  return {
    pendingRequests: pending,
    processingRequests: processing,
    completedRequests24h: completed24h,
    failedRequests: failed,
  };
}

/**
 * Calculate Processing Overview Strip matching Screen 21
 */
export function getQueueOverview(items?: AiQueueItem[]): AiQueueOverview {
  const list = items || getAllQueueItems();
  const processing = list.filter((r) => r.status === "processing").length;

  return {
    queueStatus: "Healthy",
    activeJobs: processing,
    workersOnline: 1,
    avgProcessingTime: "~ 18 sec",
    lastQueueUpdate: "Oct 28, 2026 04:35 PM",
  };
}

/**
 * Filter, sort, and paginate queue items
 */
export function queryQueueItems(
  options: AiQueueFilterOptions = {}
): {
  items: AiQueueItem[];
  failedItems: AiQueueItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const all = getAllQueueItems();
  let filtered = [...all];

  // Separate failed items for the dedicated failed requests section
  const failedItems = all.filter((r) => r.status === "failed");

  // Query search
  if (options.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.prompt.toLowerCase().includes(q) ||
        r.presetName.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (options.status && options.status !== "All Statuses" && options.status !== "All") {
    filtered = filtered.filter(
      (r) => r.status.toLowerCase() === options.status?.toLowerCase()
    );
  }

  // Sorting
  if (options.sortBy === "oldest") {
    filtered.sort((a, b) => a.submittedTimestamp - b.submittedTimestamp);
  } else {
    // Default newest first
    filtered.sort((a, b) => b.submittedTimestamp - a.submittedTimestamp);
  }

  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 4; // Reference shows 4 rows in main table
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    failedItems: failedItems.slice(0, 5),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get single queue item by ID
 */
export function getQueueItemById(id: string): AiQueueItem | undefined {
  const all = getAllQueueItems();
  return all.find((r) => r.id === id);
}

/**
 * Retry a failed request: creates a new queue attempt
 */
export function retryQueueRequest(
  id: string,
  adminName: string = "Parth Patel"
): { success: boolean; item?: AiQueueItem; error?: string } {
  void adminName;
  const all = getAllQueueItems();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) {
    return { success: false, error: "Request not found" };
  }

  const req = all[index];
  if (req.status !== "failed") {
    return {
      success: false,
      error: `Cannot retry request with status "${req.status}". Only failed requests can be retried.`,
    };
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const updated: AiQueueItem = {
    ...req,
    status: "processing", // Re-queue into processing
    retryCount: (req.retryCount || 0) + 1,
    processingStartedAt: `${dateStr}, ${timeStr}`,
    errorMessage: null,
    errorCode: null,
    workerId: "worker-01",
  };

  all[index] = updated;
  saveAllQueueItems(all);

  return { success: true, item: updated };
}

/**
 * Cancel a pending or processing request
 */
export function cancelQueueRequest(
  id: string,
  adminName: string = "Parth Patel",
  reason: string = "Cancelled by Administrator"
): { success: boolean; item?: AiQueueItem; error?: string } {
  const all = getAllQueueItems();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) {
    return { success: false, error: "Request not found" };
  }

  const req = all[index];
  if (req.status === "completed") {
    return { success: false, error: "Cannot cancel an already completed request" };
  }

  const updated: AiQueueItem = {
    ...req,
    status: "cancelled",
    errorMessage: `Job cancelled: ${reason} (${adminName})`,
  };

  all[index] = updated;
  saveAllQueueItems(all);

  return { success: true, item: updated };
}

/**
 * Reset Queue data to canonical state
 */
export function resetQueueData(): { items: AiQueueItem[]; settings: AiQueueSettings } {
  const canonical = [...CANONICAL_QUEUE_ITEMS, ...generateCompletedSeedItems()];
  saveAllQueueItems(canonical);
  saveQueueSettings(CANONICAL_SETTINGS);
  return {
    items: canonical,
    settings: { ...CANONICAL_SETTINGS },
  };
}
