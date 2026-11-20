import test from "node:test";
import assert from "node:assert/strict";
import {
  getJobTraceDataset,
  retryJobExecution,
  cancelJobExecution,
  resetJobTraceData,
} from "../lib/ai-job-trace-storage.ts";
import { generateExecutionTraceCsv } from "../lib/ai-job-trace.ts";

test("Screen 32 — AI Generation Queue Job Details & Execution Trace Viewer Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  resetJobTraceData();

  await t.test("1. Initializes canonical Job Overview details matching Screen 32 specifications", () => {
    const data = getJobTraceDataset("JOB-7845");

    assert.equal(data.overview.jobId, "JOB-7845");
    assert.equal(data.overview.requestId, "REQ-4587");
    assert.equal(data.overview.userReference, "user_2847");
    assert.equal(data.overview.queueName, "Image Generation Queue");
    assert.equal(data.overview.priority, "Critical");
    assert.equal(data.overview.status, "Processing");
    assert.equal(data.overview.createdAt, "Nov 19, 2025, 10:45 AM");
    assert.equal(data.overview.startedAt, "Nov 19, 2025, 10:46 AM");
    assert.equal(data.overview.completedAt, "—");
    assert.equal(data.overview.assignedWorker, "WK-1001");
    assert.equal(data.overview.providerModel, "OpenAI / GPT-4o");
  });

  await t.test("2. Verifies canonical 8-stage lifecycle timeline and active stage positioning", () => {
    const data = getJobTraceDataset("JOB-7845");
    assert.equal(data.lifecycleStages.length, 8);

    const stages = data.lifecycleStages;
    assert.equal(stages[0].id, "request_received");
    assert.equal(stages[0].status, "completed");

    assert.equal(stages[1].id, "validation");
    assert.equal(stages[1].status, "completed");

    assert.equal(stages[2].id, "queue_assignment");
    assert.equal(stages[2].status, "completed");

    // Stage 4: Worker Assignment is actively highlighted in the reference photo
    assert.equal(stages[3].id, "worker_assignment");
    assert.equal(stages[3].status, "active");

    // Later stages remain pending during processing
    assert.equal(stages[4].id, "provider_request");
    assert.equal(stages[4].status, "pending");

    assert.equal(stages[5].id, "image_processing");
    assert.equal(stages[5].status, "pending");

    assert.equal(stages[6].id, "result_storage");
    assert.equal(stages[6].status, "pending");

    assert.equal(stages[7].id, "completion");
    assert.equal(stages[7].status, "pending");
  });

  await t.test("3. Verifies canonical Execution Trace events and components", () => {
    const data = getJobTraceDataset("JOB-7845");
    assert.equal(data.executionTrace.length, 8);

    // TRC-01: Job Created
    assert.equal(data.executionTrace[0].id, "TRC-01");
    assert.equal(data.executionTrace[0].event, "Job Created");
    assert.equal(data.executionTrace[0].component, "API Gateway");
    assert.equal(data.executionTrace[0].workerId, "—");
    assert.equal(data.executionTrace[0].result, "Success");

    // TRC-04: Worker Claimed by WK-1001
    assert.equal(data.executionTrace[3].id, "TRC-04");
    assert.equal(data.executionTrace[3].event, "Worker Claimed");
    assert.equal(data.executionTrace[3].component, "Worker Pool");
    assert.equal(data.executionTrace[3].workerId, "WK-1001");
    assert.equal(data.executionTrace[3].duration, "300ms");

    // TRC-06: Provider Response Received
    assert.equal(data.executionTrace[5].id, "TRC-06");
    assert.equal(data.executionTrace[5].event, "Provider Response Received");
    assert.equal(data.executionTrace[5].component, "OpenAI");
    assert.equal(data.executionTrace[5].duration, "1.1s");
  });

  await t.test("4. Verifies Retry & Error History card dataset", () => {
    const data = getJobTraceDataset("JOB-7845");
    assert.equal(data.retryHistory.length, 1);

    const retry = data.retryHistory[0];
    assert.equal(retry.attempt, 1);
    assert.equal(retry.failureCategory, "Provider Error");
    assert.equal(retry.errorCode, "P500");
    assert.equal(retry.retryDecision, "Retry");
    assert.equal(retry.retryTimestamp, "Nov 19, 10:47 AM");
    assert.equal(retry.workerProvider, "WK-1001 / OpenAI");
  });

  await t.test("5. Verifies Generated Output placeholder and metadata", () => {
    const data = getJobTraceDataset("JOB-7845");
    assert.equal(data.generatedOutput.isAvailable, false);
    assert.equal(data.generatedOutput.assetReference, "—");
    assert.equal(data.generatedOutput.dimensions, "—");
    assert.equal(data.generatedOutput.storageStatus, "—");
    assert.equal(data.generatedOutput.createdAt, "—");
    assert.equal(data.generatedOutput.moderation, "—");
  });

  await t.test("6. Verifies Worker, Provider and Related contextual records", () => {
    const data = getJobTraceDataset("JOB-7845");

    // Worker Details
    assert.equal(data.workerDetails.workerId, "WK-1001");
    assert.equal(data.workerDetails.workerPool, "Image Pool");
    assert.equal(data.workerDetails.assignedQueue, "Main Queue");
    assert.equal(data.workerDetails.workerVersion, "v1.2.0");
    assert.equal(data.workerDetails.assignmentTime, "Nov 19, 2025, 10:46 AM");

    // Provider Details
    assert.equal(data.providerDetails.provider, "OpenAI");
    assert.equal(data.providerDetails.model, "GPT-4o");
    assert.equal(data.providerDetails.requestRef, "REQ-4587");
    assert.equal(data.providerDetails.responseStatus, "Success");
    assert.equal(data.providerDetails.processingTime, "1.1s");

    // Related Information
    assert.equal(data.related.relatedQueue, "Main Queue");
    assert.equal(data.related.relatedJob, "JOB-7845");
    assert.equal(data.related.relatedRequest, "REQ-4587");
  });

  await t.test("7. Validates CSV trace export formatting", () => {
    const data = getJobTraceDataset("JOB-7845");
    const csv = generateExecutionTraceCsv(data.executionTrace, "JOB-7845");

    assert.ok(csv.includes("Event ID,Job ID,Timestamp,Event,Component,Worker ID,Duration,Result,Details"));
    assert.ok(csv.includes('"TRC-01","JOB-7845"'));
    assert.ok(csv.includes('"Worker Claimed"'));
    assert.ok(csv.includes('"WK-1001"'));
  });

  await t.test("8. Executes job retry action and verifies trace & retry history mutation", () => {
    const retryRes = retryJobExecution("JOB-7845", "parth");
    assert.equal(retryRes.success, true);
    assert.ok(retryRes.dataset);

    // Verify retry record appended
    const updated = retryRes.dataset;
    assert.equal(updated.retryHistory.length, 2);
    assert.equal(updated.retryHistory[1].attempt, 2);
    assert.equal(updated.retryHistory[1].retryDecision, "Manual Retry by parth");

    // Verify trace event added
    const lastEvent = updated.executionTrace[updated.executionTrace.length - 1];
    assert.equal(lastEvent.event, "Job Retry Triggered");
    assert.equal(lastEvent.result, "Success");
  });

  await t.test("9. Executes job cancellation and verifies state transitions", () => {
    const cancelRes = cancelJobExecution("JOB-7845", "Administrative intervention", "parth");
    assert.equal(cancelRes.success, true);
    assert.ok(cancelRes.dataset);

    const cancelledData = cancelRes.dataset;
    assert.equal(cancelledData.overview.status, "Cancelled");

    // Verify cancel trace event
    const lastEvent = cancelledData.executionTrace[cancelledData.executionTrace.length - 1];
    assert.equal(lastEvent.event, "Job Cancelled");
    assert.equal(lastEvent.result, "Failed");
    assert.ok(lastEvent.details.includes("Administrative intervention"));
  });

  await t.test("10. Resets dataset back to canonical pristine state", () => {
    resetJobTraceData();
    const restored = getJobTraceDataset("JOB-7845");
    assert.equal(restored.overview.status, "Processing");
    assert.equal(restored.retryHistory.length, 1);
    assert.equal(restored.executionTrace.length, 8);
  });
});
