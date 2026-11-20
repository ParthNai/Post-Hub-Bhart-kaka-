/**
 * Authoritative types, models, and canonical datasets for
 * Screen 32: AI Generation Queue Job Details & Execution Trace Viewer
 */

export type JobLifecycleStageId =
  | "request_received"
  | "validation"
  | "queue_assignment"
  | "worker_assignment"
  | "provider_request"
  | "image_processing"
  | "result_storage"
  | "completion";

export interface JobLifecycleStage {
  id: JobLifecycleStageId;
  label: string;
  status: "completed" | "active" | "pending" | "failed";
  timestamp?: string | null;
}

export interface ExecutionTraceEvent {
  id: string; // e.g. "TRC-01"
  timestamp: string; // e.g. "Nov 19, 2025, 10:46 AM"
  event: string; // e.g. "Job Created"
  component: string; // e.g. "API Gateway"
  workerId: string; // e.g. "—", "WK-1001"
  duration: string; // e.g. "—", "120ms", "2.3s"
  result: "Success" | "Failed" | "Pending";
  details: string; // e.g. "Request accepted"
  metadata?: Record<string, unknown>;
}

export interface JobRetryRecord {
  attempt: number; // e.g. 1
  failureCategory: string; // e.g. "Provider Error"
  errorCode: string; // e.g. "P500"
  retryDecision: string; // e.g. "Retry"
  retryTimestamp: string; // e.g. "Nov 19, 10:47 AM"
  workerProvider: string; // e.g. "WK-1001 / OpenAI"
}

export interface JobGeneratedOutput {
  assetReference: string; // e.g. "—"
  dimensions: string; // e.g. "—"
  storageStatus: string; // e.g. "—"
  createdAt: string; // e.g. "—"
  moderation: string; // e.g. "—"
  previewUrl?: string | null;
  isAvailable: boolean; // false
}

export interface JobWorkerDetails {
  workerId: string; // "WK-1001"
  workerPool: string; // "Image Pool"
  assignedQueue: string; // "Main Queue"
  workerVersion: string; // "v1.2.0"
  assignmentTime: string; // "Nov 19, 2025, 10:46 AM"
}

export interface JobProviderDetails {
  provider: string; // "OpenAI"
  model: string; // "GPT-4o"
  requestRef: string; // "REQ-4587"
  responseStatus: "Success" | "Failed" | "Pending"; // "Success"
  processingTime: string; // "1.1s"
}

export interface JobOverviewDetails {
  jobId: string; // "JOB-7845"
  requestId: string; // "REQ-4587"
  userReference: string; // "user_2847"
  queueName: string; // "Image Generation Queue"
  priority: "Critical" | "High" | "Normal" | "Low"; // "Critical"
  status: "Processing" | "Completed" | "Failed" | "Cancelled" | "Waiting"; // "Processing"
  createdAt: string; // "Nov 19, 2025, 10:45 AM"
  startedAt: string; // "Nov 19, 2025, 10:46 AM"
  completedAt: string; // "—"
  assignedWorker: string; // "WK-1001"
  providerModel: string; // "OpenAI / GPT-4o"
}

export interface JobTraceDataset {
  overview: JobOverviewDetails;
  lifecycleStages: JobLifecycleStage[];
  executionTrace: ExecutionTraceEvent[];
  retryHistory: JobRetryRecord[];
  generatedOutput: JobGeneratedOutput;
  workerDetails: JobWorkerDetails;
  providerDetails: JobProviderDetails;
  related: {
    relatedQueue: string; // "Main Queue"
    relatedJob: string; // "JOB-7845"
    relatedRequest: string; // "REQ-4587"
  };
  lastUpdated: string;
}

// Canonical Job Lifecycle Stages for JOB-7845
export const CANONICAL_LIFECYCLE_STAGES: JobLifecycleStage[] = [
  { id: "request_received", label: "Request Received", status: "completed", timestamp: "10:45 AM" },
  { id: "validation", label: "Validation", status: "completed", timestamp: "10:46 AM" },
  { id: "queue_assignment", label: "Queue Assignment", status: "completed", timestamp: "10:46 AM" },
  { id: "worker_assignment", label: "Worker Assignment", status: "active", timestamp: "10:46 AM" },
  { id: "provider_request", label: "Provider Request", status: "pending", timestamp: null },
  { id: "image_processing", label: "Image Processing", status: "pending", timestamp: null },
  { id: "result_storage", label: "Result Storage", status: "pending", timestamp: null },
  { id: "completion", label: "Completion", status: "pending", timestamp: null },
];

// Canonical Execution Trace Events for JOB-7845 matching Screen 32 reference table exactly
export const CANONICAL_EXECUTION_TRACE: ExecutionTraceEvent[] = [
  {
    id: "TRC-01",
    timestamp: "Nov 19, 2025, 10:46 AM",
    event: "Job Created",
    component: "API Gateway",
    workerId: "—",
    duration: "—",
    result: "Success",
    details: "Request accepted",
  },
  {
    id: "TRC-02",
    timestamp: "Nov 19, 2025, 10:46 AM",
    event: "Validation Passed",
    component: "Validator",
    workerId: "—",
    duration: "120ms",
    result: "Success",
    details: "Input validated",
  },
  {
    id: "TRC-03",
    timestamp: "Nov 19, 2025, 10:46 AM",
    event: "Queue Accepted",
    component: "Queue Manager",
    workerId: "—",
    duration: "80ms",
    result: "Success",
    details: "Added to queue",
  },
  {
    id: "TRC-04",
    timestamp: "Nov 19, 2025, 10:47 AM",
    event: "Worker Claimed",
    component: "Worker Pool",
    workerId: "WK-1001",
    duration: "300ms",
    result: "Success",
    details: "Assigned to worker",
  },
  {
    id: "TRC-05",
    timestamp: "Nov 19, 2025, 10:47 AM",
    event: "Provider Request Started",
    component: "OpenAI",
    workerId: "WK-1001",
    duration: "2.3s",
    result: "Success",
    details: "Sending to provider",
  },
  {
    id: "TRC-06",
    timestamp: "Nov 19, 2025, 10:47 AM",
    event: "Provider Response Received",
    component: "OpenAI",
    workerId: "WK-1001",
    duration: "1.1s",
    result: "Success",
    details: "Response received",
  },
  {
    id: "TRC-07",
    timestamp: "Nov 19, 2025, 10:47 AM",
    event: "Image Stored",
    component: "Storage",
    workerId: "WK-1001",
    duration: "450ms",
    result: "Success",
    details: "Saved to storage",
  },
  {
    id: "TRC-08",
    timestamp: "Nov 19, 2025, 10:47 AM",
    event: "Job Completed",
    component: "Queue Manager",
    workerId: "WK-1001",
    duration: "200ms",
    result: "Success",
    details: "Processing finished",
  },
];

// Canonical Seed Dataset matching Screen 32 reference image exactly
export const CANONICAL_JOB_TRACE_SEED: JobTraceDataset = {
  overview: {
    jobId: "JOB-7845",
    requestId: "REQ-4587",
    userReference: "user_2847",
    queueName: "Image Generation Queue",
    priority: "Critical",
    status: "Processing",
    createdAt: "Nov 19, 2025, 10:45 AM",
    startedAt: "Nov 19, 2025, 10:46 AM",
    completedAt: "—",
    assignedWorker: "WK-1001",
    providerModel: "OpenAI / GPT-4o",
  },
  lifecycleStages: CANONICAL_LIFECYCLE_STAGES,
  executionTrace: CANONICAL_EXECUTION_TRACE,
  retryHistory: [
    {
      attempt: 1,
      failureCategory: "Provider Error",
      errorCode: "P500",
      retryDecision: "Retry",
      retryTimestamp: "Nov 19, 10:47 AM",
      workerProvider: "WK-1001 / OpenAI",
    },
  ],
  generatedOutput: {
    assetReference: "—",
    dimensions: "—",
    storageStatus: "—",
    createdAt: "—",
    moderation: "—",
    previewUrl: null,
    isAvailable: false,
  },
  workerDetails: {
    workerId: "WK-1001",
    workerPool: "Image Pool",
    assignedQueue: "Main Queue",
    workerVersion: "v1.2.0",
    assignmentTime: "Nov 19, 2025, 10:46 AM",
  },
  providerDetails: {
    provider: "OpenAI",
    model: "GPT-4o",
    requestRef: "REQ-4587",
    responseStatus: "Success",
    processingTime: "1.1s",
  },
  related: {
    relatedQueue: "Main Queue",
    relatedJob: "JOB-7845",
    relatedRequest: "REQ-4587",
  },
  lastUpdated: "Nov 19, 2025 10:48 AM",
};

/**
 * Generate CSV export text for execution trace events
 */
export function generateExecutionTraceCsv(events: ExecutionTraceEvent[], jobId: string): string {
  const headers = [
    "Event ID",
    "Job ID",
    "Timestamp",
    "Event",
    "Component",
    "Worker ID",
    "Duration",
    "Result",
    "Details",
  ];

  const escapeCsv = (str: string | number | null | undefined): string => {
    if (str === null || str === undefined) return "";
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = events.map((e) => [
    escapeCsv(e.id),
    escapeCsv(jobId),
    escapeCsv(e.timestamp),
    escapeCsv(e.event),
    escapeCsv(e.component),
    escapeCsv(e.workerId),
    escapeCsv(e.duration),
    escapeCsv(e.result),
    escapeCsv(e.details),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
