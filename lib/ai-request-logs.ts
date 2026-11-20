/**
 * Authoritative types, models, and canonical seed for
 * Screen 33: AI Generation Request Logs & API Activity Monitor
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type RequestLogStatus = "Success" | "Failed" | "Retry";

export type RequestSource = "Admin Panel" | "System" | "Web App" | "Mobile App";

export interface RequestMetadata {
  generationType: string; // e.g. "Image"
  model: string; // e.g. "OpenAI / GPT-4o"
  priority: "Critical" | "High" | "Normal" | "Low"; // e.g. "High"
  dimensions?: string; // e.g. "1024x1024"
  aspectRatio?: string; // e.g. "1:1"
  preset?: string; // e.g. "Cinematic Poster"
  promptTokens?: number; // e.g. 142
  clientIp?: string; // Redacted, e.g. "192.168.***.***"
}

export interface ResponseMetadata {
  processingStatus: "Success" | "Failed" | "Rate Limited" | "Server Error";
  resultSize: string; // e.g. "1.2 MB"
  outputAssetRef?: string | null; // e.g. "s3://posthub-assets/posters/ast_7845.png"
  providerResponseTime?: string; // e.g. "1.1s"
  queueWaitDuration?: string; // e.g. "80ms"
  workerProcessingDuration?: string; // e.g. "770ms"
  cacheHit?: boolean;
}

export interface RelatedExecutionEvent {
  step: string;
  timestamp: string;
  component: string;
  status: "Success" | "Failed" | "Pending";
  details: string;
}

export interface ApiRequestLog {
  id: string; // e.g. "REQ-4587"
  timestamp: string; // e.g. "Nov 19, 10:46 AM"
  fullTimestamp: string; // e.g. "Nov 19, 2025, 10:46 AM"
  correlationId: string; // e.g. "CORR-7845"
  relatedJobId: string; // e.g. "JOB-7845"
  endpoint: string; // e.g. "/api/generate-image"
  method: HttpMethod; // "POST"
  responseCode: number; // e.g. 200, 500, 429
  latency: string; // e.g. "850ms", "1.2s"
  latencyMs: number; // e.g. 850, 1200
  requestSource: RequestSource;
  status: RequestLogStatus;
  requestMetadata: RequestMetadata;
  responseMetadata: ResponseMetadata;
  relatedEvents?: RelatedExecutionEvent[];
  errorCategory?: string; // e.g. "Rate Limit", "Server Error", "Timeout"
  errorMessage?: string;
}

export interface RequestActivityPoint {
  time: string; // e.g. "10 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11 AM"
  incomingRequests: number; // e.g. 52, 60, 85, 70, 68
  successfulResponses: number; // e.g. 35, 48, 68, 52, 45
  failedResponses: number; // e.g. 10, 15, 12, 10, 8
}

export interface LogSummaryMetrics {
  totalRequests: number | string; // 1280 or "—"
  successfulResponses: number | string; // 1192 or "—"
  failedRequests: number | string; // 88 or "—"
  averageApiLatency: string; // "850ms" or "—"
}

export interface HttpStatusDistribution {
  category: "2xx" | "4xx" | "5xx" | "Others";
  count: number;
  percentage: number;
  color: string;
}

export interface ErrorCategoryItem {
  category: string; // "Rate Limit", "Timeout", "Invalid Request", "Server Error", "Others"
  count: number;
  percentage: number;
}

export interface EndpointActivityItem {
  endpoint: string; // "/generate", "/edit", "/status", "/upload"
  count: number;
  percentage: number;
}

export interface LatencyDistributionItem {
  range: "< 500ms" | "500ms – 1s" | "1s – 2s" | "> 2s";
  count: number;
  percentage: number;
  color: string;
}

export interface LogRetentionConfig {
  retentionDays: number; // e.g. 30
  autoCleanupEnabled: boolean;
  lastCleanupTime: string; // e.g. "Nov 19, 2025, 04:00 AM"
  totalStoredLogs: number;
  estimatedStorageSize: string; // e.g. "48.5 MB"
}

export interface RequestLogsDataset {
  summary: LogSummaryMetrics;
  activityTrends: RequestActivityPoint[];
  logs: ApiRequestLog[];
  httpStatusDistribution: HttpStatusDistribution[];
  errorCategories: ErrorCategoryItem[];
  endpointActivity: EndpointActivityItem[];
  latencyDistribution: LatencyDistributionItem[];
  retentionConfig: LogRetentionConfig;
  lastUpdated: string;
}

// Canonical 5 rows matching Screen 33 reference photo table exactly
export const CANONICAL_REQUEST_LOGS: ApiRequestLog[] = [
  {
    id: "REQ-4587",
    timestamp: "Nov 19, 10:46 AM",
    fullTimestamp: "Nov 19, 2025, 10:46 AM",
    correlationId: "CORR-7845",
    relatedJobId: "JOB-7845",
    endpoint: "/api/generate-image",
    method: "POST",
    responseCode: 200,
    latency: "850ms",
    latencyMs: 850,
    requestSource: "Admin Panel",
    status: "Success",
    requestMetadata: {
      generationType: "Image",
      model: "OpenAI / GPT-4o",
      priority: "High",
      dimensions: "1024x1024",
      aspectRatio: "1:1",
      preset: "Festival Poster",
      promptTokens: 142,
      clientIp: "192.168.***.***",
    },
    responseMetadata: {
      processingStatus: "Success",
      resultSize: "1.2 MB",
      outputAssetRef: "s3://posthub-assets/posters/ast_7845.png",
      providerResponseTime: "1.1s",
      queueWaitDuration: "80ms",
      workerProcessingDuration: "770ms",
      cacheHit: false,
    },
    relatedEvents: [
      {
        step: "API Request Ingested",
        timestamp: "Nov 19, 2025, 10:46:00 AM",
        component: "API Gateway",
        status: "Success",
        details: "Validated authorization and rate tokens",
      },
      {
        step: "Queue Dispatch",
        timestamp: "Nov 19, 2025, 10:46:01 AM",
        component: "Queue Manager",
        status: "Success",
        details: "Assigned to Image Pool with Critical priority",
      },
      {
        step: "Worker Claim",
        timestamp: "Nov 19, 2025, 10:46:02 AM",
        component: "Worker WK-1001",
        status: "Success",
        details: "Claimed and dispatched to OpenAI GPT-4o",
      },
    ],
  },
  {
    id: "REQ-4586",
    timestamp: "Nov 19, 10:44 AM",
    fullTimestamp: "Nov 19, 2025, 10:44 AM",
    correlationId: "CORR-7844",
    relatedJobId: "JOB-7844",
    endpoint: "/api/generate-image",
    method: "POST",
    responseCode: 500,
    latency: "1.2s",
    latencyMs: 1200,
    requestSource: "System",
    status: "Failed",
    errorCategory: "Server Error",
    errorMessage: "External provider returned HTTP 500 Internal Error",
    requestMetadata: {
      generationType: "Image",
      model: "Gemini / 1.5 Pro",
      priority: "Normal",
      dimensions: "1024x1024",
      aspectRatio: "1:1",
      promptTokens: 98,
      clientIp: "10.0.***.***",
    },
    responseMetadata: {
      processingStatus: "Server Error",
      resultSize: "0 KB",
      outputAssetRef: null,
      providerResponseTime: "1.2s",
      cacheHit: false,
    },
    relatedEvents: [
      {
        step: "API Request Ingested",
        timestamp: "Nov 19, 2025, 10:44:00 AM",
        component: "API Gateway",
        status: "Success",
        details: "Ingested from scheduled campaign runner",
      },
      {
        step: "Provider Upstream Error",
        timestamp: "Nov 19, 2025, 10:44:02 AM",
        component: "Gemini Adapter",
        status: "Failed",
        details: "Remote endpoint timed out on generation payload",
      },
    ],
  },
  {
    id: "REQ-4585",
    timestamp: "Nov 19, 10:42 AM",
    fullTimestamp: "Nov 19, 2025, 10:42 AM",
    correlationId: "CORR-7843",
    relatedJobId: "JOB-7843",
    endpoint: "/api/generate-image",
    method: "POST",
    responseCode: 200,
    latency: "780ms",
    latencyMs: 780,
    requestSource: "Web App",
    status: "Success",
    requestMetadata: {
      generationType: "Image",
      model: "Stability AI / SDXL",
      priority: "Normal",
      dimensions: "1024x1024",
      aspectRatio: "1:1",
      promptTokens: 110,
      clientIp: "172.16.***.***",
    },
    responseMetadata: {
      processingStatus: "Success",
      resultSize: "1.4 MB",
      outputAssetRef: "s3://posthub-assets/posters/ast_7843.png",
      providerResponseTime: "750ms",
      cacheHit: false,
    },
    relatedEvents: [
      {
        step: "API Request Ingested",
        timestamp: "Nov 19, 2025, 10:42:00 AM",
        component: "API Gateway",
        status: "Success",
        details: "Web user session validated",
      },
      {
        step: "Generation Completed",
        timestamp: "Nov 19, 2025, 10:42:01 AM",
        component: "Storage Engine",
        status: "Success",
        details: "PNG poster saved to asset bucket",
      },
    ],
  },
  {
    id: "REQ-4584",
    timestamp: "Nov 19, 10:40 AM",
    fullTimestamp: "Nov 19, 2025, 10:40 AM",
    correlationId: "CORR-7842",
    relatedJobId: "JOB-7842",
    endpoint: "/api/generate-image",
    method: "POST",
    responseCode: 200,
    latency: "720ms",
    latencyMs: 720,
    requestSource: "Admin Panel",
    status: "Success",
    requestMetadata: {
      generationType: "Image",
      model: "OpenAI / GPT-4o",
      priority: "High",
      dimensions: "1024x1024",
      aspectRatio: "1:1",
      promptTokens: 85,
      clientIp: "192.168.***.***",
    },
    responseMetadata: {
      processingStatus: "Success",
      resultSize: "1.1 MB",
      outputAssetRef: "s3://posthub-assets/posters/ast_7842.png",
      providerResponseTime: "680ms",
      cacheHit: false,
    },
    relatedEvents: [
      {
        step: "Admin Ingest",
        timestamp: "Nov 19, 2025, 10:40:00 AM",
        component: "API Gateway",
        status: "Success",
        details: "Admin test run initiated",
      },
      {
        step: "Result Stored",
        timestamp: "Nov 19, 2025, 10:40:01 AM",
        component: "Worker WK-1001",
        status: "Success",
        details: "Image rendering completed",
      },
    ],
  },
  {
    id: "REQ-4583",
    timestamp: "Nov 19, 10:38 AM",
    fullTimestamp: "Nov 19, 2025, 10:38 AM",
    correlationId: "CORR-7841",
    relatedJobId: "JOB-7841",
    endpoint: "/api/generate-image",
    method: "POST",
    responseCode: 429,
    latency: "1.5s",
    latencyMs: 1500,
    requestSource: "Mobile App",
    status: "Retry",
    errorCategory: "Rate Limit",
    errorMessage: "Upstream rate limit exceeded (429 Too Many Requests)",
    requestMetadata: {
      generationType: "Image",
      model: "OpenAI / GPT-4o",
      priority: "Normal",
      dimensions: "1024x1024",
      aspectRatio: "1:1",
      promptTokens: 130,
      clientIp: "49.36.***.***",
    },
    responseMetadata: {
      processingStatus: "Rate Limited",
      resultSize: "0 KB",
      outputAssetRef: null,
      providerResponseTime: "1.5s",
      cacheHit: false,
    },
    relatedEvents: [
      {
        step: "API Request Ingested",
        timestamp: "Nov 19, 2025, 10:38:00 AM",
        component: "API Gateway",
        status: "Success",
        details: "Mobile device client request received",
      },
      {
        step: "Rate Limit Encountered",
        timestamp: "Nov 19, 2025, 10:38:02 AM",
        component: "OpenAI Adapter",
        status: "Failed",
        details: "Retry scheduled via exponential backoff queue",
      },
    ],
  },
];

// Activity Trends matching Screen 33 spline curve coordinates
export const CANONICAL_ACTIVITY_TRENDS: RequestActivityPoint[] = [
  { time: "10 AM", incomingRequests: 53, successfulResponses: 35, failedResponses: 13 },
  { time: "10:15 AM", incomingRequests: 62, successfulResponses: 49, failedResponses: 18 },
  { time: "10:30 AM", incomingRequests: 89, successfulResponses: 68, failedResponses: 15 },
  { time: "10:45 AM", incomingRequests: 72, successfulResponses: 52, failedResponses: 14 },
  { time: "11 AM", incomingRequests: 60, successfulResponses: 42, failedResponses: 12 },
];

// Canonical seed dataset matching Screen 33 reference photo exactly
export const CANONICAL_REQUEST_LOGS_SEED: RequestLogsDataset = {
  summary: {
    totalRequests: "—",
    successfulResponses: "—",
    failedRequests: "—",
    averageApiLatency: "—",
  },
  activityTrends: CANONICAL_ACTIVITY_TRENDS,
  logs: CANONICAL_REQUEST_LOGS,
  httpStatusDistribution: [
    { category: "2xx", count: 960, percentage: 75, color: "#10B981" },
    { category: "4xx", count: 180, percentage: 14, color: "#F59E0B" },
    { category: "5xx", count: 100, percentage: 8, color: "#EF4444" },
    { category: "Others", count: 40, percentage: 3, color: "#7956C9" },
  ],
  errorCategories: [
    { category: "Rate Limit", count: 78, percentage: 48 },
    { category: "Timeout", count: 42, percentage: 26 },
    { category: "Invalid Request", count: 24, percentage: 15 },
    { category: "Server Error", count: 12, percentage: 8 },
    { category: "Others", count: 5, percentage: 3 },
  ],
  endpointActivity: [
    { endpoint: "/generate", count: 850, percentage: 66 },
    { endpoint: "/edit", count: 210, percentage: 16 },
    { endpoint: "/status", count: 160, percentage: 13 },
    { endpoint: "/upload", count: 60, percentage: 5 },
  ],
  latencyDistribution: [
    { range: "< 500ms", count: 480, percentage: 38, color: "#7956C9" },
    { range: "500ms – 1s", count: 540, percentage: 42, color: "#9F7AEA" },
    { range: "1s – 2s", count: 200, percentage: 16, color: "#B794F4" },
    { range: "> 2s", count: 60, percentage: 4, color: "#D6BCFA" },
  ],
  retentionConfig: {
    retentionDays: 30,
    autoCleanupEnabled: true,
    lastCleanupTime: "Nov 19, 2025, 04:00 AM",
    totalStoredLogs: 1280,
    estimatedStorageSize: "48.5 MB",
  },
  lastUpdated: "Nov 19, 2025, 10:48 AM",
};

/**
 * Redacts sensitive fields from request and response metadata
 */
export function redactSensitiveLogData<T extends Record<string, unknown>>(data: T): T {
  const sensitiveKeys = [
    "authorization",
    "apikey",
    "api_key",
    "token",
    "secret",
    "password",
    "cookie",
    "bearer",
    "private_key",
  ];

  const clone = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;

  const scrub = (obj: Record<string, unknown>) => {
    for (const key of Object.keys(obj)) {
      const lower = key.toLowerCase();
      if (sensitiveKeys.some((s) => lower.includes(s))) {
        obj[key] = "[REDACTED]";
      } else if (obj[key] && typeof obj[key] === "object") {
        scrub(obj[key] as Record<string, unknown>);
      }
    }
  };

  scrub(clone);
  return clone as T;
}

/**
 * Generate CSV export text for API request logs
 */
export function generateRequestLogsCsv(logs: ApiRequestLog[]): string {
  const headers = [
    "Request ID",
    "Timestamp",
    "Correlation ID",
    "Related Job ID",
    "Endpoint",
    "Method",
    "Response Code",
    "Latency",
    "Request Source",
    "Status",
    "Error Category",
  ];

  const escapeCsv = (str: string | number | null | undefined): string => {
    if (str === null || str === undefined) return "";
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = logs.map((log) => [
    escapeCsv(log.id),
    escapeCsv(log.fullTimestamp),
    escapeCsv(log.correlationId),
    escapeCsv(log.relatedJobId),
    escapeCsv(log.endpoint),
    escapeCsv(log.method),
    escapeCsv(log.responseCode),
    escapeCsv(log.latency),
    escapeCsv(log.requestSource),
    escapeCsv(log.status),
    escapeCsv(log.errorCategory || "—"),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
