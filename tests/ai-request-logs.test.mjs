import test from "node:test";
import assert from "node:assert/strict";
import {
  getRequestLogsDataset,
  queryRequestLogs,
  getRequestLogDetails,
  updateLogRetentionConfig,
  triggerLogCleanup,
  resetRequestLogsData,
} from "../lib/ai-request-logs-storage.ts";
import { generateRequestLogsCsv, redactSensitiveLogData } from "../lib/ai-request-logs.ts";

test("Screen 33 — AI Generation Request Logs & API Activity Monitor Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  resetRequestLogsData();

  await t.test("1. Initializes canonical summary metrics and seed records matching Screen 33", () => {
    const data = getRequestLogsDataset();

    assert.equal(data.summary.totalRequests, "—");
    assert.equal(data.summary.successfulResponses, "—");
    assert.equal(data.summary.failedRequests, "—");
    assert.equal(data.summary.averageApiLatency, "—");
    assert.equal(data.logs.length, 5);
  });

  await t.test("2. Verifies canonical API request logs rows matching reference table (REQ-4587 to REQ-4583)", () => {
    const data = getRequestLogsDataset();

    // 1. REQ-4587
    const r1 = data.logs.find((l) => l.id === "REQ-4587");
    assert.ok(r1);
    assert.equal(r1.correlationId, "CORR-7845");
    assert.equal(r1.relatedJobId, "JOB-7845");
    assert.equal(r1.endpoint, "/api/generate-image");
    assert.equal(r1.method, "POST");
    assert.equal(r1.responseCode, 200);
    assert.equal(r1.latency, "850ms");
    assert.equal(r1.requestSource, "Admin Panel");
    assert.equal(r1.status, "Success");

    // 2. REQ-4586 (Failed)
    const r2 = data.logs.find((l) => l.id === "REQ-4586");
    assert.ok(r2);
    assert.equal(r2.responseCode, 500);
    assert.equal(r2.latency, "1.2s");
    assert.equal(r2.requestSource, "System");
    assert.equal(r2.status, "Failed");
    assert.equal(r2.errorCategory, "Server Error");

    // 5. REQ-4583 (Retry)
    const r5 = data.logs.find((l) => l.id === "REQ-4583");
    assert.ok(r5);
    assert.equal(r5.responseCode, 429);
    assert.equal(r5.latency, "1.5s");
    assert.equal(r5.requestSource, "Mobile App");
    assert.equal(r5.status, "Retry");
    assert.equal(r5.errorCategory, "Rate Limit");
  });

  await t.test("3. Verifies request activity trends matching 5 time coordinate checkpoints", () => {
    const data = getRequestLogsDataset();
    assert.equal(data.activityTrends.length, 5);

    assert.equal(data.activityTrends[0].time, "10 AM");
    assert.equal(data.activityTrends[1].time, "10:15 AM");
    assert.equal(data.activityTrends[2].time, "10:30 AM");
    assert.equal(data.activityTrends[3].time, "10:45 AM");
    assert.equal(data.activityTrends[4].time, "11 AM");

    // Check peak point at 10:30 AM
    assert.equal(data.activityTrends[2].incomingRequests, 89);
    assert.equal(data.activityTrends[2].successfulResponses, 68);
  });

  await t.test("4. Verifies HTTP status, error category, endpoint activity and latency distribution analytics", () => {
    const data = getRequestLogsDataset();

    // HTTP Status
    assert.equal(data.httpStatusDistribution.length, 4);
    assert.equal(data.httpStatusDistribution[0].category, "2xx");
    assert.equal(data.httpStatusDistribution[0].percentage, 75);

    // Common Errors
    assert.equal(data.errorCategories.length, 5);
    assert.equal(data.errorCategories[0].category, "Rate Limit");

    // Endpoint Activity
    assert.equal(data.endpointActivity.length, 4);
    assert.equal(data.endpointActivity[0].endpoint, "/generate");

    // Latency Distribution
    assert.equal(data.latencyDistribution.length, 4);
    assert.equal(data.latencyDistribution[0].range, "< 500ms");
  });

  await t.test("5. Verifies multi-field log searching, endpoint, method, and status filtering", () => {
    // Search by Request ID
    const searchRes = queryRequestLogs({ search: "REQ-4587" });
    assert.equal(searchRes.total, 1);
    assert.equal(searchRes.logs[0].id, "REQ-4587");

    // Filter by Status: Failed
    const failedRes = queryRequestLogs({ status: "Failed" });
    assert.equal(failedRes.total, 1);
    assert.equal(failedRes.logs[0].id, "REQ-4586");

    // Filter by Status: Retry
    const retryRes = queryRequestLogs({ status: "Retry" });
    assert.equal(retryRes.total, 1);
    assert.equal(retryRes.logs[0].id, "REQ-4583");

    // Filter by Endpoint
    const epRes = queryRequestLogs({ endpoint: "/api/generate-image" });
    assert.equal(epRes.total, 5);
  });

  await t.test("6. Validates backend pagination logic and page limits", () => {
    const page1 = queryRequestLogs({ page: 1, pageSize: 2 });
    assert.equal(page1.logs.length, 2);
    assert.equal(page1.page, 1);
    assert.equal(page1.totalPages, 3);
    assert.equal(page1.logs[0].id, "REQ-4587");
    assert.equal(page1.logs[1].id, "REQ-4586");

    const page2 = queryRequestLogs({ page: 2, pageSize: 2 });
    assert.equal(page2.logs.length, 2);
    assert.equal(page2.page, 2);
    assert.equal(page2.logs[0].id, "REQ-4585");
  });

  await t.test("7. Validates single request detail lookup by Request ID and server-side redaction", () => {
    const detail = getRequestLogDetails("REQ-4587");
    assert.ok(detail);
    assert.equal(detail.id, "REQ-4587");
    assert.equal(detail.requestMetadata.generationType, "Image");
    assert.equal(detail.requestMetadata.model, "OpenAI / GPT-4o");
    assert.equal(detail.responseMetadata.processingStatus, "Success");

    // Redaction testing
    const sensitiveSample = {
      apiKey: "sk-proj-super-secret-key-12345",
      authorization: "Bearer secret-jwt-token-abc",
      nested: { password: "admin-secret-password" },
      safeField: "1024x1024",
    };
    const redacted = redactSensitiveLogData(sensitiveSample);
    assert.equal(redacted.apiKey, "[REDACTED]");
    assert.equal(redacted.authorization, "[REDACTED]");
    assert.equal(redacted.nested.password, "[REDACTED]");
    assert.equal(redacted.safeField, "1024x1024");
  });

  await t.test("8. Validates CSV export formatting for request logs", () => {
    const data = getRequestLogsDataset();
    const csv = generateRequestLogsCsv(data.logs);

    assert.ok(csv.includes("Request ID,Timestamp,Correlation ID,Related Job ID,Endpoint,Method,Response Code,Latency,Request Source,Status,Error Category"));
    assert.ok(csv.includes('"REQ-4587"'));
    assert.ok(csv.includes('"CORR-7845"'));
    assert.ok(csv.includes('"JOB-7845"'));
    assert.ok(csv.includes('"/api/generate-image"'));
    assert.ok(csv.includes('"200"'));
  });

  await t.test("9. Updates log retention window and automated cleanup toggles", () => {
    const updated = updateLogRetentionConfig({
      retentionDays: 60,
      autoCleanupEnabled: false,
    });
    assert.equal(updated.success, true);
    assert.equal(updated.config.retentionDays, 60);
    assert.equal(updated.config.autoCleanupEnabled, false);

    const reloaded = getRequestLogsDataset();
    assert.equal(reloaded.retentionConfig.retentionDays, 60);
  });

  await t.test("10. Executes manual log cleanup and records last cleanup timestamp", () => {
    const cleanupRes = triggerLogCleanup();
    assert.equal(cleanupRes.success, true);
    assert.ok(cleanupRes.config.lastCleanupTime);

    const reloaded = getRequestLogsDataset();
    assert.equal(reloaded.retentionConfig.lastCleanupTime, cleanupRes.config.lastCleanupTime);
  });

  await t.test("11. Resets request logs dataset back to canonical pristine state", () => {
    resetRequestLogsData();
    const restored = getRequestLogsDataset();
    assert.equal(restored.retentionConfig.retentionDays, 30);
    assert.equal(restored.retentionConfig.autoCleanupEnabled, true);
    assert.equal(restored.logs.length, 5);
  });
});
