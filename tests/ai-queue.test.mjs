import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllQueueItems,
  getQueueItemById,
  getQueueMetrics,
  getQueueOverview,
  queryQueueItems,
  retryQueueRequest,
  cancelQueueRequest,
  getQueueSettings,
  saveQueueSettings,
  resetQueueData,
} from "../lib/ai-queue-storage.ts";
import { generateQueueCsv } from "../lib/ai-queue.ts";

test("Screen 21 — AI Generation Queue & Processing Monitor Test Suite", async (t) => {
  // Always reset to canonical state before testing
  resetQueueData();

  await t.test("1. Initializes canonical queue items matching Screen 21 reference specifications", () => {
    const all = getAllQueueItems();
    assert.ok(all.length >= 130, "Should initialize all queue items (pending, processing, completed, failed)");

    // Inspect REQ-001247 (Parth Patel, Processing)
    const req1247 = getQueueItemById("REQ-001247");
    assert.ok(req1247, "REQ-001247 must exist in queue");
    assert.equal(req1247.userName, "Parth Patel");
    assert.equal(req1247.presetName, "Diwali Festival");
    assert.equal(req1247.provider, "OpenAI / DALL-E 3");
    assert.equal(req1247.submittedAt, "Oct 28, 04:32 PM");
    assert.equal(req1247.processingStartedAt, "Oct 28, 04:33 PM");
    assert.equal(req1247.status, "processing");

    // Inspect REQ-001246 (Priya Shah, Pending)
    const req1246 = getQueueItemById("REQ-001246");
    assert.ok(req1246, "REQ-001246 must exist in queue");
    assert.equal(req1246.userName, "Priya Shah");
    assert.equal(req1246.presetName, "Education Admission");
    assert.equal(req1246.provider, "OpenAI / DALL-E 3");
    assert.equal(req1246.submittedAt, "Oct 28, 04:28 PM");
    assert.equal(req1246.processingStartedAt, "Oct 28, 04:29 PM");
    assert.equal(req1246.status, "pending");

    // Inspect REQ-001245 (Amit Desai, Pending)
    const req1245 = getQueueItemById("REQ-001245");
    assert.ok(req1245, "REQ-001245 must exist in queue");
    assert.equal(req1245.userName, "Amit Desai");
    assert.equal(req1245.presetName, "Business Growth");
    assert.equal(req1245.provider, "Google / Imagen");
    assert.equal(req1245.status, "pending");

    // Inspect REQ-001244 (Neha Patel, Completed)
    const req1244 = getQueueItemById("REQ-001244");
    assert.ok(req1244, "REQ-001244 must exist in queue");
    assert.equal(req1244.userName, "Neha Patel");
    assert.equal(req1244.presetName, "Product Launch");
    assert.equal(req1244.status, "completed");
    assert.equal(req1244.durationSec, 18);

    // Inspect REQ-001240 (Rohan Mehta, Failed)
    const req1240 = getQueueItemById("REQ-001240");
    assert.ok(req1240, "REQ-001240 must exist in failed requests");
    assert.equal(req1240.userName, "Rohan Mehta");
    assert.equal(req1240.status, "failed");
    assert.equal(req1240.errorCode, 429);
    assert.equal(req1240.errorMessage, "Rate limit exceeded");
  });

  await t.test("2. Correctly calculates KPI metrics matching reference values", () => {
    const metrics = getQueueMetrics();
    assert.equal(metrics.pendingRequests, 3, "Pending requests count must equal 3");
    assert.equal(metrics.processingRequests, 2, "Processing requests count must equal 2");
    assert.equal(metrics.completedRequests24h, 124, "Completed requests in last 24h must equal 124");
    assert.equal(metrics.failedRequests, 7, "Failed requests count must equal 7");
  });

  await t.test("3. Verifies Processing Overview strip values", () => {
    const overview = getQueueOverview();
    assert.equal(overview.queueStatus, "Healthy");
    assert.equal(overview.activeJobs, 2);
    assert.equal(overview.workersOnline, 1);
    assert.equal(overview.avgProcessingTime, "~ 18 sec");
    assert.equal(overview.lastQueueUpdate, "Oct 28, 2026 04:35 PM");
  });

  await t.test("4. Querying, searching, and filtering queue items", () => {
    // Search by Request ID
    const searchId = queryQueueItems({ query: "REQ-001247" });
    assert.equal(searchId.items.length, 1);
    assert.equal(searchId.items[0].id, "REQ-001247");

    // Search by User name
    const searchUser = queryQueueItems({ query: "Priya Shah" });
    assert.equal(searchUser.items.length, 1);
    assert.equal(searchUser.items[0].userName, "Priya Shah");

    // Filter by Pending status
    const pendingQuery = queryQueueItems({ status: "Pending", pageSize: 10 });
    assert.equal(pendingQuery.items.length, 3);
    assert.ok(pendingQuery.items.every((r) => r.status === "pending"));

    // Filter by Processing status
    const processingQuery = queryQueueItems({ status: "Processing", pageSize: 10 });
    assert.equal(processingQuery.items.length, 2);
    assert.ok(processingQuery.items.every((r) => r.status === "processing"));

    // Failed items section
    assert.equal(pendingQuery.failedItems.length, 5);
    assert.equal(pendingQuery.failedItems[0].id, "REQ-001240");
  });

  await t.test("5. Retry workflow on failed requests", () => {
    // Attempting retry on completed request must fail
    const invalidRetry = retryQueueRequest("REQ-001244", "Parth Patel");
    assert.equal(invalidRetry.success, false);
    assert.ok(invalidRetry.error?.includes("Only failed requests can be retried"));

    // Valid retry on REQ-001240
    const validRetry = retryQueueRequest("REQ-001240", "Parth Patel");
    assert.equal(validRetry.success, true);
    assert.ok(validRetry.item);
    assert.equal(validRetry.item.status, "processing");
    assert.equal(validRetry.item.retryCount, 1);
    assert.equal(validRetry.item.errorCode, null);

    // Verify updated metrics
    const updatedMetrics = getQueueMetrics();
    assert.equal(updatedMetrics.processingRequests, 3);
    assert.equal(updatedMetrics.failedRequests, 6);
  });

  await t.test("6. Cancellation workflow on pending/processing requests", () => {
    // Attempting cancellation on completed request must fail
    const invalidCancel = cancelQueueRequest("REQ-001244", "Parth Patel");
    assert.equal(invalidCancel.success, false);
    assert.ok(invalidCancel.error?.includes("Cannot cancel an already completed request"));

    // Valid cancel on REQ-001245 (pending)
    const validCancel = cancelQueueRequest("REQ-001245", "Parth Patel", "Client requested changes");
    assert.equal(validCancel.success, true);
    assert.ok(validCancel.item);
    assert.equal(validCancel.item.status, "cancelled");

    // Verify metrics updated
    const updatedMetrics = getQueueMetrics();
    assert.equal(updatedMetrics.pendingRequests, 2);
  });

  await t.test("7. Queue settings persistence", () => {
    const settings = getQueueSettings();
    assert.equal(settings.maxConcurrentJobs, 5);

    const updated = saveQueueSettings({
      maxConcurrentJobs: 8,
      pollingIntervalSec: 20,
    });
    assert.equal(updated.maxConcurrentJobs, 8);
    assert.equal(updated.pollingIntervalSec, 20);

    const reloaded = getQueueSettings();
    assert.equal(reloaded.maxConcurrentJobs, 8);
    assert.equal(reloaded.pollingIntervalSec, 20);
  });

  await t.test("8. CSV export generation", () => {
    const items = getAllQueueItems();
    const csv = generateQueueCsv(items.slice(0, 5));
    assert.ok(csv.startsWith("Request ID,User,Preset"));
    assert.ok(csv.includes("REQ-001247"));
    assert.ok(csv.includes("Parth Patel"));
    assert.ok(csv.includes("Diwali Festival"));
    assert.ok(!csv.includes("apiKey")); // Security: no secret leaks
  });

  await t.test("9. Reset restores canonical dataset", () => {
    const reset = resetQueueData();
    const metrics = getQueueMetrics(reset.items);
    assert.equal(metrics.pendingRequests, 3);
    assert.equal(metrics.processingRequests, 2);
    assert.equal(metrics.completedRequests24h, 124);
    assert.equal(metrics.failedRequests, 7);
  });
});
