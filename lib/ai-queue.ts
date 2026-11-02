export type AiQueueStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface AiQueueItem {
  id: string; // e.g. "REQ-001247"
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  prompt: string;
  promptPreview: string;
  presetName: string;
  thumbnailType: string;
  provider: string; // e.g. "OpenAI / DALL-E 3"
  providerId: string;
  model: string;
  submittedAt: string; // e.g. "Oct 28, 04:32 PM"
  submittedTimestamp: number;
  processingStartedAt?: string | null; // e.g. "Oct 28, 04:33 PM"
  completedAt?: string | null;
  status: AiQueueStatus;
  durationSec?: number | null;
  dimensions?: string;
  format?: string;
  errorCode?: string | number | null;
  errorMessage?: string | null;
  retryCount: number;
  maxRetries: number;
  workerId?: string;
  priority?: number; // 1-10
}

export interface AiQueueMetrics {
  pendingRequests: number;
  processingRequests: number;
  completedRequests24h: number;
  failedRequests: number;
}

export interface AiQueueOverview {
  queueStatus: "Healthy" | "Degraded" | "Paused";
  activeJobs: number;
  workersOnline: number;
  avgProcessingTime: string;
  lastQueueUpdate: string;
}

export interface AiQueueSettings {
  maxConcurrentJobs: number;
  workerTimeoutSec: number;
  autoRetryFailed: boolean;
  maxRetryAttempts: number;
  pollingIntervalSec: number;
  maintenanceMode: boolean;
}

export interface AiQueueFilterOptions {
  query?: string;
  status?: string;
  sortBy?: "newest" | "oldest" | "priority";
  page?: number;
  pageSize?: number;
}

export interface AiQueueResponse {
  items: AiQueueItem[];
  failedItems: AiQueueItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  metrics: AiQueueMetrics;
  overview: AiQueueOverview;
  settings: AiQueueSettings;
}

/**
 * Generate CSV text for Queue Records export
 */
export function generateQueueCsv(records: AiQueueItem[]): string {
  const headers = [
    "Request ID",
    "User",
    "Preset",
    "Provider / Model",
    "Status",
    "Submitted At",
    "Processing Started",
    "Completed At",
    "Duration (sec)",
    "Error Code",
    "Error Message",
    "Prompt",
  ];

  const escapeCsv = (str: string | number | null | undefined): string => {
    if (str === null || str === undefined) return "";
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.userName),
    escapeCsv(r.presetName),
    escapeCsv(r.provider),
    escapeCsv(r.status),
    escapeCsv(r.submittedAt),
    escapeCsv(r.processingStartedAt || "—"),
    escapeCsv(r.completedAt || "—"),
    escapeCsv(r.durationSec !== undefined && r.durationSec !== null ? r.durationSec : "—"),
    escapeCsv(r.errorCode || ""),
    escapeCsv(r.errorMessage || ""),
    escapeCsv(r.prompt),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
