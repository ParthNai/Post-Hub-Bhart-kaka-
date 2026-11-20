import test from "node:test";
import assert from "node:assert/strict";
import {
  getWorkerDataset,
  pauseWorker,
  resumeWorker,
  drainWorker,
  restartWorker,
  updateWorkerConfiguration,
  updateWorkerPool,
  queryWorkers,
  recalculateWorkerMetrics,
  resetWorkerData,
} from "../lib/ai-workers-storage.ts";

test("Screen 31 — AI Generation Queue Worker Management & Processing Controls Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  resetWorkerData();

  await t.test("1. Initializes canonical worker summary metrics matching Screen 31 specifications", () => {
    const data = getWorkerDataset();

    assert.equal(data.summary.configuredWorkers, 5);
    assert.equal(data.summary.activeWorkers, 3);
    assert.equal(data.summary.idleWorkers, 1);
    assert.equal(data.summary.workersWithIssues, 1);
  });

  await t.test("2. Verifies canonical worker pools matching reference overview", () => {
    const data = getWorkerDataset();
    assert.equal(data.pools.length, 3);

    // Pool 1: Image Generation Pool
    assert.equal(data.pools[0].poolName, "Image Generation Pool");
    assert.equal(data.pools[0].assignedQueue, "Main Queue");
    assert.equal(data.pools[0].assignedProvider, "OpenAI");
    assert.equal(data.pools[0].configuredConcurrency, 5);
    assert.equal(data.pools[0].currentWorkers, 3);
    assert.equal(data.pools[0].poolState, "Active");

    // Pool 2: Text Generation Pool
    assert.equal(data.pools[1].poolName, "Text Generation Pool");
    assert.equal(data.pools[1].assignedQueue, "Text Queue");
    assert.equal(data.pools[1].assignedProvider, "Gemini");
    assert.equal(data.pools[1].configuredConcurrency, 3);
    assert.equal(data.pools[1].currentWorkers, 1);
    assert.equal(data.pools[1].poolState, "Idle");

    // Pool 3: Creative Pool
    assert.equal(data.pools[2].poolName, "Creative Pool");
    assert.equal(data.pools[2].assignedQueue, "Creative Queue");
    assert.equal(data.pools[2].assignedProvider, "Stability AI");
    assert.equal(data.pools[2].configuredConcurrency, 4);
    assert.equal(data.pools[2].currentWorkers, 0);
    assert.equal(data.pools[2].poolState, "Unavailable");
  });

  await t.test("3. Verifies canonical worker management records and status classifications", () => {
    const data = getWorkerDataset();
    assert.equal(data.workers.length, 5);

    // WK-1001: Running
    const wk1 = data.workers.find((w) => w.id === "WK-1001");
    assert.ok(wk1);
    assert.equal(wk1.workerPool, "Image Pool");
    assert.equal(wk1.assignedQueue, "Main Queue");
    assert.equal(wk1.aiProvider, "OpenAI");
    assert.equal(wk1.runtimeStatus, "Running");
    assert.equal(wk1.currentJobs, 3);
    assert.equal(wk1.concurrencyCapacity, 5);
    assert.equal(wk1.workerVersion, "v1.2.0");

    // WK-1002: Idle
    const wk2 = data.workers.find((w) => w.id === "WK-1002");
    assert.ok(wk2);
    assert.equal(wk2.runtimeStatus, "Idle");
    assert.equal(wk2.currentJobs, 0);

    // WK-1003: Draining
    const wk3 = data.workers.find((w) => w.id === "WK-1003");
    assert.ok(wk3);
    assert.equal(wk3.runtimeStatus, "Draining");
    assert.equal(wk3.currentJobs, 1);

    // WK-1004: Error
    const wk4 = data.workers.find((w) => w.id === "WK-1004");
    assert.ok(wk4);
    assert.equal(wk4.runtimeStatus, "Error");
    assert.equal(wk4.currentJobs, 0);

    // WK-1005: Unknown
    const wk5 = data.workers.find((w) => w.id === "WK-1005");
    assert.ok(wk5);
    assert.equal(wk5.runtimeStatus, "Unknown");
  });

  await t.test("4. Pauses and resumes worker with audit activity recording", () => {
    // Pause WK-1001
    const pauseRes = pauseWorker("WK-1001", "parth");
    assert.equal(pauseRes.success, true);
    assert.equal(pauseRes.worker.runtimeStatus, "Paused");

    let data = getWorkerDataset();
    assert.equal(data.activityHistory[0].event, "Worker Paused");
    assert.equal(data.activityHistory[0].workerId, "WK-1001");

    // Resume WK-1001 (has 3 jobs -> should restore to Running)
    const resumeRes = resumeWorker("WK-1001", "parth");
    assert.equal(resumeRes.success, true);
    assert.equal(resumeRes.worker.runtimeStatus, "Running");

    data = getWorkerDataset();
    assert.equal(data.activityHistory[0].event, "Worker Resumed");
  });

  await t.test("5. Drains worker and logs maintenance rationale", () => {
    const drainRes = drainWorker("WK-1002", "Scheduled node maintenance", "parth");
    assert.equal(drainRes.success, true);
    assert.equal(drainRes.worker.runtimeStatus, "Draining");

    const data = getWorkerDataset();
    const latestEvent = data.activityHistory[0];
    assert.equal(latestEvent.event, "Worker Drained");
    assert.equal(latestEvent.workerId, "WK-1002");
    assert.equal(latestEvent.details, "Scheduled node maintenance");
  });

  await t.test("6. Restarts worker cleanly and refreshes heartbeat", () => {
    // Restart WK-1004 (which was in Error state)
    const restartRes = restartWorker("WK-1004", "parth");
    assert.equal(restartRes.success, true);
    assert.equal(restartRes.worker.runtimeStatus, "Running");
    assert.equal(restartRes.worker.errorMessage, null);
    assert.ok(restartRes.worker.lastHeartbeatTimestamp > 0);

    const data = getWorkerDataset();
    assert.equal(data.activityHistory[0].event, "Worker Restarted");
  });

  await t.test("7. Updates scheduling configuration and worker pool capacity", () => {
    const configRes = updateWorkerConfiguration({
      autoRestart: false,
      restartDelay: "10 min",
      maxJobsPerWorker: 8,
    });
    assert.equal(configRes.success, true);
    assert.equal(configRes.configuration.autoRestart, false);
    assert.equal(configRes.configuration.restartDelay, "10 min");
    assert.equal(configRes.configuration.maxJobsPerWorker, 8);

    const poolRes = updateWorkerPool("pool-image", { configuredConcurrency: 8 });
    assert.equal(poolRes.success, true);
    assert.equal(poolRes.pool.configuredConcurrency, 8);
  });

  await t.test("8. Filters workers by search term, pool, and status", () => {
    resetWorkerData();

    // Search by ID
    const searchRes = queryWorkers({ search: "WK-1001" });
    assert.equal(searchRes.workers.length, 1);
    assert.equal(searchRes.workers[0].id, "WK-1001");

    // Filter by Pool
    const poolRes = queryWorkers({ pool: "Text Pool" });
    assert.equal(poolRes.workers.length, 2); // WK-1002 and WK-1005

    // Filter by Status
    const statusRes = queryWorkers({ status: "Running" });
    assert.equal(statusRes.workers.length, 1);
    assert.equal(statusRes.workers[0].id, "WK-1001");
  });
});
