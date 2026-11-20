import fs from "fs";
import path from "path";
import {
  type JobTraceDataset,
  type ExecutionTraceEvent,
  type JobRetryRecord,
  CANONICAL_JOB_TRACE_SEED,
} from "./ai-job-trace.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORAGE_FILE = path.join(DATA_DIR, "ai-job-traces.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load authoritative Job Trace dataset
 */
export function getJobTraceDataset(jobId: string = "JOB-7845"): JobTraceDataset {
  ensureDataDir();

  if (!fs.existsSync(STORAGE_FILE)) {
    const initialMap: Record<string, JobTraceDataset> = {
      "JOB-7845": CANONICAL_JOB_TRACE_SEED,
    };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialMap, null, 2), "utf-8");
    return JSON.parse(JSON.stringify(CANONICAL_JOB_TRACE_SEED));
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      if (parsed[jobId]) {
        return parsed[jobId];
      }
      // If requested job is not in map, fallback to JOB-7845 seed or create template
      if (parsed["JOB-7845"]) {
        return parsed["JOB-7845"];
      }
    }
    const initialMap: Record<string, JobTraceDataset> = {
      "JOB-7845": CANONICAL_JOB_TRACE_SEED,
    };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialMap, null, 2), "utf-8");
    return JSON.parse(JSON.stringify(CANONICAL_JOB_TRACE_SEED));
  } catch (err) {
    console.error("Error reading ai-job-traces.json:", err);
    return JSON.parse(JSON.stringify(CANONICAL_JOB_TRACE_SEED));
  }
}

/**
 * Save Job Trace dataset
 */
export function saveJobTraceDataset(jobId: string, dataset: JobTraceDataset): void {
  ensureDataDir();
  let map: Record<string, JobTraceDataset> = {};

  if (fs.existsSync(STORAGE_FILE)) {
    try {
      map = JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
    } catch {
      map = {};
    }
  }

  map[jobId] = dataset;
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(map, null, 2), "utf-8");
}

/**
 * Retry a job
 */
export function retryJobExecution(
  jobId: string = "JOB-7845",
  adminName: string = "parth"
): { success: boolean; dataset?: JobTraceDataset; error?: string } {
  void adminName;
  const data = getJobTraceDataset(jobId);

  // Check retry eligibility
  if (data.overview.status === "Completed") {
    return { success: false, error: "Cannot retry an already completed job." };
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const newAttemptNumber = data.retryHistory.length + 1;
  const newRetryRecord: JobRetryRecord = {
    attempt: newAttemptNumber,
    failureCategory: "Provider Timeout",
    errorCode: "P504",
    retryDecision: `Manual Retry by ${adminName}`,
    retryTimestamp: `${dateStr}, ${timeStr}`,
    workerProvider: `${data.workerDetails.workerId} / ${data.providerDetails.provider}`,
  };

  data.retryHistory.push(newRetryRecord);

  // Append execution trace event
  const newTraceEvent: ExecutionTraceEvent = {
    id: `TRC-0${data.executionTrace.length + 1}`,
    timestamp: `${dateStr}, ${now.getFullYear()}, ${timeStr}`,
    event: "Job Retry Triggered",
    component: "Queue Manager",
    workerId: data.workerDetails.workerId,
    duration: "150ms",
    result: "Success",
    details: `Retry attempt #${newAttemptNumber} dispatched by ${adminName}`,
  };

  data.executionTrace.push(newTraceEvent);
  data.overview.status = "Processing";
  data.lastUpdated = `${dateStr}, ${now.getFullYear()} ${timeStr}`;

  saveJobTraceDataset(jobId, data);
  return { success: true, dataset: data };
}

/**
 * Cancel a job
 */
export function cancelJobExecution(
  jobId: string = "JOB-7845",
  reason: string = "Cancelled by Administrator",
  adminName: string = "parth"
): { success: boolean; dataset?: JobTraceDataset; error?: string } {
  void adminName;
  const data = getJobTraceDataset(jobId);

  if (data.overview.status === "Completed") {
    return { success: false, error: "Cannot cancel an already completed job." };
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  data.overview.status = "Cancelled";
  data.overview.completedAt = `${dateStr}, ${timeStr}`;

  // Update lifecycle stages: mark active as failed/cancelled
  data.lifecycleStages = data.lifecycleStages.map((stage) => {
    if (stage.status === "active") {
      return { ...stage, status: "failed" };
    }
    return stage;
  });

  const cancelEvent: ExecutionTraceEvent = {
    id: `TRC-0${data.executionTrace.length + 1}`,
    timestamp: `${dateStr}, ${now.getFullYear()}, ${timeStr}`,
    event: "Job Cancelled",
    component: "Queue Manager",
    workerId: data.workerDetails.workerId,
    duration: "60ms",
    result: "Failed",
    details: `Cancelled: ${reason} (${adminName})`,
  };

  data.executionTrace.push(cancelEvent);
  data.lastUpdated = `${dateStr}, ${now.getFullYear()} ${timeStr}`;

  saveJobTraceDataset(jobId, data);
  return { success: true, dataset: data };
}

/**
 * Reset job trace data to canonical seed
 */
export function resetJobTraceData(): JobTraceDataset {
  const seed = JSON.parse(JSON.stringify(CANONICAL_JOB_TRACE_SEED));
  saveJobTraceDataset("JOB-7845", seed);
  return seed;
}
