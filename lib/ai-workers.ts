/**
 * Authoritative types, models, and canonical datasets for
 * Screen 31: AI Generation Queue Worker Management & Processing Controls
 */

export type WorkerRuntimeStatus =
  | "Running"
  | "Idle"
  | "Draining"
  | "Paused"
  | "Error"
  | "Unknown";

export type PoolState = "Active" | "Idle" | "Unavailable" | "Degraded";

export interface WorkerPool {
  id: string; // e.g. "pool-1"
  poolName: string; // e.g. "Image Generation Pool"
  assignedQueue: string; // e.g. "Main Queue"
  assignedProvider: string; // e.g. "OpenAI"
  configuredConcurrency: number; // e.g. 5
  currentWorkers: number; // e.g. 3
  poolState: PoolState;
  maxCapacity?: number;
}

export interface WorkerItem {
  id: string; // e.g. "WK-1001"
  workerPool: string; // e.g. "Image Pool"
  poolId: string;
  assignedQueue: string; // e.g. "Main Queue"
  aiProvider: string; // e.g. "OpenAI"
  runtimeStatus: WorkerRuntimeStatus;
  currentJobs: number;
  concurrencyCapacity: number;
  lastHeartbeat: string; // e.g. "Nov 19, 10:45 AM"
  lastHeartbeatTimestamp: number;
  workerVersion: string; // e.g. "v1.2.0"
  activeJobIds?: string[];
  recentActivity?: {
    time: string;
    event: string;
  }[];
  diagnostics?: {
    uptime: string;
    memoryUsage: string;
    cpuUsage: string;
    networkLatency: string;
  };
  errorMessage?: string | null;
}

export interface WorkerSummaryMetrics {
  configuredWorkers: number; // 5
  activeWorkers: number; // 3
  idleWorkers: number; // 1
  workersWithIssues: number; // 1
  lastUpdated: string; // "Nov 19, 2025 10:48 AM"
}

export interface WorkerSchedulingConfig {
  autoRestart: boolean; // true
  restartDelay: string; // "5 min"
  maxJobsPerWorker: number; // 5
  heartbeatThresholdSeconds: number; // 60
}

export interface WorkerActivityEvent {
  id: string; // e.g. "EVT-W-01"
  time: string; // e.g. "Nov 19, 10:45 AM"
  event: string; // e.g. "Worker Started"
  workerId: string; // e.g. "WK-1001"
  details: string; // e.g. "Pool: Image Pool"
  fullDateTime?: string;
}

export interface WorkerManagementDataset {
  summary: WorkerSummaryMetrics;
  pools: WorkerPool[];
  workers: WorkerItem[];
  activityHistory: WorkerActivityEvent[];
  configuration: WorkerSchedulingConfig;
  lastUpdated: string;
}

// Canonical Pools matching Screen 31 reference image exactly
export const CANONICAL_WORKER_POOLS: WorkerPool[] = [
  {
    id: "pool-image",
    poolName: "Image Generation Pool",
    assignedQueue: "Main Queue",
    assignedProvider: "OpenAI",
    configuredConcurrency: 5,
    currentWorkers: 3,
    poolState: "Active",
    maxCapacity: 10,
  },
  {
    id: "pool-text",
    poolName: "Text Generation Pool",
    assignedQueue: "Text Queue",
    assignedProvider: "Gemini",
    configuredConcurrency: 3,
    currentWorkers: 1,
    poolState: "Idle",
    maxCapacity: 6,
  },
  {
    id: "pool-creative",
    poolName: "Creative Pool",
    assignedQueue: "Creative Queue",
    assignedProvider: "Stability AI",
    configuredConcurrency: 4,
    currentWorkers: 0,
    poolState: "Unavailable",
    maxCapacity: 8,
  },
];

// Canonical Workers matching Screen 31 reference table exactly
export const CANONICAL_WORKERS: WorkerItem[] = [
  {
    id: "WK-1001",
    workerPool: "Image Pool",
    poolId: "pool-image",
    assignedQueue: "Main Queue",
    aiProvider: "OpenAI",
    runtimeStatus: "Running",
    currentJobs: 3,
    concurrencyCapacity: 5,
    lastHeartbeat: "Nov 19, 10:45 AM",
    lastHeartbeatTimestamp: 1795085100000,
    workerVersion: "v1.2.0",
    activeJobIds: ["REQ-4587", "REQ-4586", "REQ-4585"],
    recentActivity: [
      { time: "10:45 AM", event: "Job Claimed" },
      { time: "10:44 AM", event: "Job Completed" },
      { time: "10:43 AM", event: "Heartbeat Received" },
    ],
    diagnostics: {
      uptime: "48h 12m",
      memoryUsage: "482 MB / 1024 MB",
      cpuUsage: "34%",
      networkLatency: "42ms",
    },
  },
  {
    id: "WK-1002",
    workerPool: "Text Pool",
    poolId: "pool-text",
    assignedQueue: "Text Queue",
    aiProvider: "Gemini",
    runtimeStatus: "Idle",
    currentJobs: 0,
    concurrencyCapacity: 3,
    lastHeartbeat: "Nov 19, 10:44 AM",
    lastHeartbeatTimestamp: 1795085040000,
    workerVersion: "v1.2.0",
    activeJobIds: [],
    recentActivity: [
      { time: "10:44 AM", event: "Heartbeat Received" },
      { time: "10:39 AM", event: "Job Completed" },
      { time: "10:35 AM", event: "Job Claimed" },
    ],
    diagnostics: {
      uptime: "24h 05m",
      memoryUsage: "290 MB / 1024 MB",
      cpuUsage: "4%",
      networkLatency: "28ms",
    },
  },
  {
    id: "WK-1003",
    workerPool: "Creative Pool",
    poolId: "pool-creative",
    assignedQueue: "Creative Queue",
    aiProvider: "Stable Diffusion",
    runtimeStatus: "Draining",
    currentJobs: 1,
    concurrencyCapacity: 4,
    lastHeartbeat: "Nov 19, 10:42 AM",
    lastHeartbeatTimestamp: 1795084920000,
    workerVersion: "v1.1.8",
    activeJobIds: ["REQ-4570"],
    recentActivity: [
      { time: "10:42 AM", event: "Worker Drained" },
      { time: "10:40 AM", event: "Job Claimed" },
      { time: "10:38 AM", event: "Heartbeat Received" },
    ],
    diagnostics: {
      uptime: "12h 45m",
      memoryUsage: "612 MB / 1024 MB",
      cpuUsage: "18%",
      networkLatency: "65ms",
    },
  },
  {
    id: "WK-1004",
    workerPool: "Image Pool",
    poolId: "pool-image",
    assignedQueue: "Main Queue",
    aiProvider: "OpenAI",
    runtimeStatus: "Error",
    currentJobs: 0,
    concurrencyCapacity: 5,
    lastHeartbeat: "Nov 19, 10:40 AM",
    lastHeartbeatTimestamp: 1795084800000,
    workerVersion: "v1.2.0",
    activeJobIds: [],
    recentActivity: [
      { time: "10:40 AM", event: "Heartbeat Missed" },
      { time: "10:37 AM", event: "Connection Dropped" },
    ],
    diagnostics: {
      uptime: "6h 20m",
      memoryUsage: "520 MB / 1024 MB",
      cpuUsage: "0%",
      networkLatency: "Timeout (> 5s)",
    },
    errorMessage: "Connection dropped: Socket hangup on remote node ip-10-0-4-12",
  },
  {
    id: "WK-1005",
    workerPool: "Text Pool",
    poolId: "pool-text",
    assignedQueue: "Text Queue",
    aiProvider: "Gemini",
    runtimeStatus: "Unknown",
    currentJobs: 0,
    concurrencyCapacity: 3,
    lastHeartbeat: "Nov 19, 10:38 AM",
    lastHeartbeatTimestamp: 1795084680000,
    workerVersion: "v1.1.9",
    activeJobIds: [],
    recentActivity: [
      { time: "10:38 AM", event: "Heartbeat Stale" },
      { time: "10:30 AM", event: "Job Completed" },
    ],
    diagnostics: {
      uptime: "1h 10m",
      memoryUsage: "Unknown",
      cpuUsage: "Unknown",
      networkLatency: "Unreachable",
    },
    errorMessage: "Heartbeat stale (> 10m elapsed without ping)",
  },
];

// Canonical Activity History matching Screen 31 reference image exactly
export const CANONICAL_WORKER_HISTORY: WorkerActivityEvent[] = [
  {
    id: "EVT-W-01",
    time: "Nov 19, 10:45 AM",
    event: "Worker Started",
    workerId: "WK-1001",
    details: "Pool: Image Pool",
    fullDateTime: "Nov 19, 2025 • 10:45:12 AM",
  },
  {
    id: "EVT-W-02",
    time: "Nov 19, 10:44 AM",
    event: "Job Completed",
    workerId: "WK-1001",
    details: "Request: REQ-4587",
    fullDateTime: "Nov 19, 2025 • 10:44:35 AM",
  },
  {
    id: "EVT-W-03",
    time: "Nov 19, 10:42 AM",
    event: "Worker Drained",
    workerId: "WK-1003",
    details: "Due to maintenance",
    fullDateTime: "Nov 19, 2025 • 10:42:04 AM",
  },
];

// Canonical Seed Dataset
export const CANONICAL_WORKER_SEED: WorkerManagementDataset = {
  summary: {
    configuredWorkers: 5,
    activeWorkers: 3, // WK-1001, plus pools capacity active
    idleWorkers: 1, // WK-1002
    workersWithIssues: 1, // WK-1004 (Error)
    lastUpdated: "Nov 19, 2025 10:48 AM",
  },
  pools: CANONICAL_WORKER_POOLS,
  workers: CANONICAL_WORKERS,
  activityHistory: CANONICAL_WORKER_HISTORY,
  configuration: {
    autoRestart: true,
    restartDelay: "5 min",
    maxJobsPerWorker: 5,
    heartbeatThresholdSeconds: 60,
  },
  lastUpdated: "Nov 19, 2025 10:48 AM",
};
