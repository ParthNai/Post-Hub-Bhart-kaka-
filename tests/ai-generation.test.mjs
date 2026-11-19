import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllAiRequests,
  queryAiRequests,
  getAiRequestById,
  retryAiRequest,
  cancelAiRequest,
  saveAiProviderConfig,
  testAiProviderConnection,
  resetAiRequests,
} from "../lib/ai-generation-storage.ts";
import { filterAiRequests, maskApiKey } from "../lib/ai-generation.ts";

test("Screen 18 — AI Image Generation Management Test Suite", async (t) => {
  // Always reset to canonical dataset first
  resetAiRequests();

  await t.test("1. Initializes canonical requests matching Screen 18 reference specifications", () => {
    const all = getAllAiRequests();
    assert.equal(all.length, 842, "Should initialize exactly 842 total requests matching reference photo");

    // Inspect REQ-001247 (Diwali festival poster)
    const req1247 = all.find((r) => r.id === "REQ-001247");
    assert.ok(req1247, "REQ-001247 must exist");
    assert.equal(req1247.userName, "Parth Patel");
    assert.equal(req1247.status, "completed");
    assert.equal(req1247.format, "PNG");
    assert.equal(req1247.provider, "OpenAI (DALL-E 3)");
    assert.equal(req1247.submittedAt, "Oct 28, 2026 04:32 PM");

    // Inspect REQ-001246 (Business growth banner)
    const req1246 = all.find((r) => r.id === "REQ-001246");
    assert.ok(req1246, "REQ-001246 must exist");
    assert.equal(req1246.status, "processing");
    assert.equal(req1246.format, "JPG");
    assert.equal(req1246.provider, "Google Imagen");

    // Inspect REQ-001245 (Education admission poster)
    const req1245 = all.find((r) => r.id === "REQ-001245");
    assert.ok(req1245, "REQ-001245 must exist");
    assert.equal(req1245.status, "failed");
    assert.equal(req1245.format, "PNG");
    assert.ok(req1245.errorMessage, "Failed request must contain error message");

    // Inspect REQ-001244 (Big sale offer poster)
    const req1244 = all.find((r) => r.id === "REQ-001244");
    assert.ok(req1244, "REQ-001244 must exist");
    assert.equal(req1244.status, "pending");
    assert.equal(req1244.format, "JPG");

    // Inspect REQ-001243 (New year greeting)
    const req1243 = all.find((r) => r.id === "REQ-001243");
    assert.ok(req1243, "REQ-001243 must exist");
    assert.equal(req1243.status, "cancelled");
  });

  await t.test("2. Correctly calculates KPI metrics matching reference values", () => {
    const result = queryAiRequests({ page: 1, pageSize: 5 });
    const { metrics } = result;

    assert.equal(metrics.totalRequests, 842, "Total requests should equal 842");
    assert.equal(metrics.totalChange, "↑ 12%");
    assert.equal(metrics.completedCount, 768, "Completed count should equal 768");
    assert.equal(metrics.completedChange, "↑ 14%");
    assert.equal(metrics.successRate, "91.2%", "Success rate should match ~91%");
    assert.equal(metrics.failedCount, 74, "Failed count should equal 74");
    assert.equal(metrics.failedChange, "↓ 3%");
    assert.equal(metrics.pendingCount, 23, "Pending/Processing count should equal 23");
    assert.equal(metrics.pendingChange, "↑ 5%");
  });

  await t.test("3. Search and filtering operates accurately", () => {
    const all = getAllAiRequests();

    // Search by Request ID
    const searchId = filterAiRequests(all, { query: "REQ-001247" });
    assert.equal(searchId.filtered.length, 1);
    assert.equal(searchId.filtered[0].id, "REQ-001247");

    // Search by User Name
    const searchUser = filterAiRequests(all, { query: "Parth Patel" });
    assert.ok(searchUser.filtered.length >= 1);
    assert.ok(searchUser.filtered.every((r) => r.userName.includes("Parth Patel")));

    // Status filter: completed
    const filterCompleted = filterAiRequests(all, { status: "completed" });
    assert.ok(filterCompleted.filtered.length >= 700);
    assert.ok(filterCompleted.filtered.every((r) => r.status === "completed"));

    // Status filter: failed
    const filterFailed = filterAiRequests(all, { status: "failed" });
    assert.equal(filterFailed.filtered.length, 74);
    assert.ok(filterFailed.filtered.every((r) => r.status === "failed"));

    // Format filter: PNG
    const filterPng = filterAiRequests(all, { format: "PNG" });
    assert.ok(filterPng.filtered.length > 0);
    assert.ok(filterPng.filtered.every((r) => r.format === "PNG"));

    // Provider filter: google
    const filterGoogle = filterAiRequests(all, { provider: "google" });
    assert.ok(filterGoogle.filtered.length > 0);
    assert.ok(filterGoogle.filtered.every((r) => r.providerId === "google"));
  });

  await t.test("4. Pagination mechanics calculate properly", () => {
    const page1 = queryAiRequests({ page: 1, pageSize: 5 });
    assert.equal(page1.requests.length, 5);
    assert.equal(page1.requests[0].id, "REQ-001247");
    assert.equal(page1.page, 1);
    assert.equal(page1.pageSize, 5);
    assert.equal(page1.totalPages, 169); // 842 / 5 = 168.4 -> 169 pages

    const page2 = queryAiRequests({ page: 2, pageSize: 5 });
    assert.equal(page2.requests.length, 5);
    assert.notEqual(page2.requests[0].id, page1.requests[0].id);
  });

  await t.test("5. Retry workflow validates eligibility and updates request status", () => {
    // REQ-001247 is completed, should reject retry
    const invalidRetry = retryAiRequest("REQ-001247");
    assert.equal(invalidRetry.success, false);
    assert.ok(invalidRetry.error.includes("Only failed or cancelled"));

    // REQ-001245 is failed, should succeed
    const validRetry = retryAiRequest("REQ-001245");
    assert.equal(validRetry.success, true);
    assert.equal(validRetry.request.status, "completed");
    assert.equal(validRetry.request.errorMessage, null);
    assert.ok(validRetry.request.retryCount >= 1);

    // Verify persisted
    const updated = getAiRequestById("REQ-001245");
    assert.equal(updated.status, "completed");
  });

  await t.test("6. Cancellation workflow prevents cancelling completed requests and succeeds on pending/processing", () => {
    // REQ-001247 is completed, should reject cancellation
    const invalidCancel = cancelAiRequest("REQ-001247");
    assert.equal(invalidCancel.success, false);
    assert.ok(invalidCancel.error.includes("cannot be cancelled"));

    // REQ-001244 is pending, should succeed
    const validCancel = cancelAiRequest("REQ-001244", "User changed mind");
    assert.equal(validCancel.success, true);
    assert.equal(validCancel.request.status, "cancelled");
    assert.equal(validCancel.request.cancellationReason, "User changed mind");
  });

  await t.test("7. API key masking and provider configuration security", () => {
    assert.equal(maskApiKey(""), "");
    assert.equal(maskApiKey("short"), "••••••••");
    assert.equal(maskApiKey("sk-proj-1234567890abcdef"), "sk-...****cdef");

    // Saving config without exposing plain text in config payload
    const saved = saveAiProviderConfig(
      {
        providerId: "openai",
        name: "OpenAI (DALL-E 3)",
        model: "dall-e-3",
      },
      "sk-proj-testkey9988776655"
    );

    assert.equal(saved.hasApiKey, true);
    assert.equal(saved.status, "connected");
    assert.ok(saved.apiKeyMasked.includes("****"));
    assert.equal(saved.apiKeyMasked.includes("9988776655"), false);
  });

  await t.test("8. Provider connection health check behaves honestly", async () => {
    // Missing key
    const missing = await testAiProviderConnection("openai", "");
    assert.equal(missing.success, false);
    assert.equal(missing.status, "not_configured");

    // Invalid key
    const invalid = await testAiProviderConnection("openai", "invalid-key");
    assert.equal(invalid.success, false);
    assert.equal(invalid.status, "verification_failed");

    // Valid format key
    const valid = await testAiProviderConnection("openai", "sk-proj-validformatkey123");
    assert.equal(valid.success, true);
    assert.equal(valid.status, "connected");
    assert.ok(valid.latencyMs >= 0);
  });

  // Clean up
  resetAiRequests();
});

