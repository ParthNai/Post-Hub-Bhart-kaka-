import fs from "fs";
import path from "path";
import {
  type RequestLogsDataset,
  type ApiRequestLog,
  type LogRetentionConfig,
  CANONICAL_REQUEST_LOGS_SEED,
  redactSensitiveLogData,
} from "./ai-request-logs.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORAGE_FILE = path.join(DATA_DIR, "ai-request-logs.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load authoritative Request Logs dataset
 */
export function getRequestLogsDataset(): RequestLogsDataset {
  ensureDataDir();

  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(
      STORAGE_FILE,
      JSON.stringify(CANONICAL_REQUEST_LOGS_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_REQUEST_LOGS_SEED));
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.logs)) {
      return parsed as RequestLogsDataset;
    }
    fs.writeFileSync(
      STORAGE_FILE,
      JSON.stringify(CANONICAL_REQUEST_LOGS_SEED, null, 2),
      "utf-8"
    );
    return JSON.parse(JSON.stringify(CANONICAL_REQUEST_LOGS_SEED));
  } catch (err) {
    console.error("Error reading ai-request-logs.json:", err);
    return JSON.parse(JSON.stringify(CANONICAL_REQUEST_LOGS_SEED));
  }
}

/**
 * Save Request Logs dataset
 */
export function saveRequestLogsDataset(dataset: RequestLogsDataset): void {
  ensureDataDir();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(dataset, null, 2), "utf-8");
}

export interface RequestLogQueryParams {
  search?: string;
  endpoint?: string;
  method?: string;
  status?: string;
  timeRange?: string;
  page?: number;
  pageSize?: number;
}

export interface RequestLogQueryResult {
  logs: ApiRequestLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Query logs with searching, multi-field filtering and pagination
 */
export function queryRequestLogs(params: RequestLogQueryParams = {}): RequestLogQueryResult {
  const dataset = getRequestLogsDataset();
  let list = [...dataset.logs];

  // 1. Search Query
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (l) =>
        l.id.toLowerCase().includes(q) ||
        l.correlationId.toLowerCase().includes(q) ||
        l.relatedJobId.toLowerCase().includes(q) ||
        l.endpoint.toLowerCase().includes(q) ||
        l.requestSource.toLowerCase().includes(q)
    );
  }

  // 2. Endpoint Filter
  if (params.endpoint && params.endpoint !== "All Endpoints") {
    list = list.filter((l) => l.endpoint.toLowerCase() === params.endpoint?.toLowerCase());
  }

  // 3. Method Filter
  if (params.method && params.method !== "All Methods") {
    list = list.filter((l) => l.method.toUpperCase() === params.method?.toUpperCase());
  }

  // 4. Status Filter
  if (params.status && params.status !== "All Status") {
    list = list.filter((l) => l.status.toLowerCase() === params.status?.toLowerCase());
  }

  const total = list.length;
  const pageSize = params.pageSize || 5;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, params.page || 1), totalPages);

  const start = (page - 1) * pageSize;
  const pagedLogs = list.slice(start, start + pageSize);

  return {
    logs: pagedLogs,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get single request log details by ID with server-side redaction applied
 */
export function getRequestLogDetails(requestId: string): ApiRequestLog | null {
  const dataset = getRequestLogsDataset();
  const found = dataset.logs.find((l) => l.id.toLowerCase() === requestId.toLowerCase());
  if (!found) return null;

  return redactSensitiveLogData(found);
}

/**
 * Update Log Retention Configuration
 */
export function updateLogRetentionConfig(
  partial: Partial<LogRetentionConfig>
): { success: boolean; config: LogRetentionConfig } {
  const dataset = getRequestLogsDataset();
  dataset.retentionConfig = {
    ...dataset.retentionConfig,
    ...partial,
  };

  const now = new Date();
  dataset.lastUpdated = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  saveRequestLogsDataset(dataset);
  return { success: true, config: dataset.retentionConfig };
}

/**
 * Trigger simulated or real log cleanup based on retention days
 */
export function triggerLogCleanup(): {
  success: boolean;
  purgedCount: number;
  config: LogRetentionConfig;
} {
  const dataset = getRequestLogsDataset();
  const now = new Date();
  const formattedNow = now.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  dataset.retentionConfig.lastCleanupTime = formattedNow;
  saveRequestLogsDataset(dataset);

  return {
    success: true,
    purgedCount: 0,
    config: dataset.retentionConfig,
  };
}

/**
 * Reset request logs data back to canonical pristine state
 */
export function resetRequestLogsData(): void {
  ensureDataDir();
  fs.writeFileSync(
    STORAGE_FILE,
    JSON.stringify(CANONICAL_REQUEST_LOGS_SEED, null, 2),
    "utf-8"
  );
}
