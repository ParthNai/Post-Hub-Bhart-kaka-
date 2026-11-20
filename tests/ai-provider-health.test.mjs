import test from "node:test";
import assert from "node:assert/strict";
import {
  getProviderHealthData,
  queryModels,
  getProviderById,
  executeHealthCheck,
  updateMonitoringSettings,
  resetProviderHealthData,
} from "../lib/ai-provider-health-storage.ts";
import { formatDuration } from "../lib/ai-provider-health.ts";

test("Screen 28 — AI Generation Provider Health & Performance Test Suite", async (t) => {
  // Ensure canonical state before starting
  resetProviderHealthData();

  await t.test("1. Initializes canonical provider health metrics matching Screen 28 specifications", () => {
    const data = getProviderHealthData();
    assert.equal(data.summary.configuredProviders, 4);
    assert.equal(data.summary.healthyProviders, 2);
    assert.equal(data.summary.providersWithIssues, 1);
    assert.equal(data.summary.monitoringCoverage, "75%");
    assert.equal(data.providers.length, 4);

    const openaiDetails = getProviderById("openai");
    assert.ok(openaiDetails.provider);
    assert.equal(openaiDetails.provider.name, "OpenAI");
    assert.ok(openaiDetails.models.length >= 1);
  });

  await t.test("2. Verifies canonical provider status overview rows and secret redaction", () => {
    const data = getProviderHealthData();
    const openai = data.providers.find((p) => p.id === "openai");
    const stability = data.providers.find((p) => p.id === "stability");
    const firefly = data.providers.find((p) => p.id === "adobe-firefly");
    const gemini = data.providers.find((p) => p.id === "gemini");

    assert.ok(openai, "OpenAI must be configured");
    assert.equal(openai.status, "Healthy");
    assert.equal(openai.modelCount, 4);
    assert.equal(openai.responseTimeMs, 840);
    assert.equal(openai.endpointMasked, "https://api.openai.com/*");
    assert.equal(openai.authStatus, "Configured");
    assert.ok(!JSON.stringify(openai).includes("sk-"), "No secret tokens should leak");

    assert.ok(stability, "Stability AI must be configured");
    assert.equal(stability.status, "Degraded");
    assert.equal(stability.recentError, "API Errors");
    assert.equal(stability.hasError, true);

    assert.ok(firefly, "Adobe Firefly must be configured");
    assert.equal(firefly.status, "Unknown");
    assert.equal(firefly.recentError, "No Data");

    assert.ok(gemini, "Gemini must be configured");
    assert.equal(gemini.status, "Checking");
  });

  await t.test("3. Verifies canonical model performance records matching reference table", () => {
    const data = getProviderHealthData();
    assert.equal(data.models.length, 5);

    const gpt4o = data.models.find((m) => m.name === "gpt-4o");
    assert.ok(gpt4o);
    assert.equal(gpt4o.provider, "OpenAI");
    assert.equal(gpt4o.status, "Healthy");
    assert.equal(gpt4o.avgResponseText, "820ms");
    assert.equal(gpt4o.successfulRequests, 12450);
    assert.equal(gpt4o.failedRequests, 120);

    const claude = data.models.find((m) => m.name === "claude-3.5-sonnet");
    assert.ok(claude);
    assert.equal(claude.provider, "Anthropic");
    assert.equal(claude.status, "Degraded");
    assert.equal(claude.avgResponseText, "1.6s");

    const sdxl = data.models.find((m) => m.name === "stable-diffusion-xl");
    assert.ok(sdxl);
    assert.equal(sdxl.status, "Error");
    assert.equal(sdxl.avgResponseText, "2.1s");
  });

  await t.test("4. Queries and filters models by search term, provider, and status", () => {
    const searchRes = queryModels("gpt");
    assert.equal(searchRes.length, 1);
    assert.equal(searchRes[0].name, "gpt-4o");

    const providerRes = queryModels(undefined, "Anthropic");
    assert.equal(providerRes.length, 1);
    assert.equal(providerRes[0].name, "claude-3.5-sonnet");

    const statusRes = queryModels(undefined, undefined, "Error");
    assert.equal(statusRes.length, 1);
    assert.equal(statusRes[0].name, "stable-diffusion-xl");
  });

  await t.test("5. Executes server-side health checks and appends to monitoring history", async () => {
    const checkOutcome = await executeHealthCheck("openai", "Test Runner");
    assert.equal(checkOutcome.success, true);
    assert.ok(checkOutcome.results.length >= 1);

    const data = getProviderHealthData();
    assert.ok(data.monitoringHistory.length >= 4);
    const latestCheck = data.monitoringHistory[0];
    assert.equal(latestCheck.providerId, "openai");
    assert.ok(latestCheck.latencyMs !== null);
  });

  await t.test("6. Updates and validates monitoring settings", () => {
    const updateRes = updateMonitoringSettings({
      schedule: "Every 5 Minutes",
      alertThreshold: "Response > 2s",
      timeoutSeconds: 15,
      notificationDestination: "ops-alert@posthub.io",
    });

    assert.equal(updateRes.success, true);
    assert.equal(updateRes.settings.schedule, "Every 5 Minutes");
    assert.equal(updateRes.settings.alertThreshold, "Response > 2s");
    assert.equal(updateRes.settings.timeoutSeconds, 15);
    assert.equal(updateRes.settings.notificationDestination, "ops-alert@posthub.io");

    const retrieved = getProviderHealthData();
    assert.equal(retrieved.settings.schedule, "Every 5 Minutes");
  });

  await t.test("7. Verifies duration formatting utility", () => {
    assert.equal(formatDuration(null), "—");
    assert.equal(formatDuration(undefined), "—");
    assert.equal(formatDuration(840), "840ms");
    assert.equal(formatDuration(1800), "1.8s");
    assert.equal(formatDuration(2100), "2.1s");
  });

  // Clean up back to canonical state after tests
  resetProviderHealthData();
});
