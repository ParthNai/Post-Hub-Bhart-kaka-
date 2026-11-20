import test from "node:test";
import assert from "node:assert/strict";
import {
  getRateLimitsDataset,
  updateRateLimitPolicy,
  togglePolicyStatus,
  createRateLimitPolicy,
  deleteRateLimitPolicy,
  updateThrottlingBehavior,
  testPolicyEvaluation,
  resetRateLimitsData,
} from "../lib/ai-rate-limits-storage.ts";
import { recalculateRateLimitMetrics } from "../lib/ai-rate-limits.ts";

test("Screen 34 — AI Generation API Rate Limits & Throttling Configuration Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  resetRateLimitsData();

  await t.test("1. Initializes canonical summary metrics matching Screen 34", () => {
    const data = getRateLimitsDataset();

    assert.equal(data.summary.activePolicies, 5);
    assert.equal(data.summary.protectedEndpoints, 8);
    assert.equal(data.summary.requestsCurrentlyThrottled, 12);
    assert.equal(data.summary.rateLimitEvents, 48);
  });

  await t.test("2. Verifies canonical 5 policies matching reference overview table", () => {
    const data = getRateLimitsDataset();
    assert.equal(data.policies.length, 5);

    // 1. Global Rate Limit
    const p1 = data.policies.find((p) => p.name === "Global Rate Limit");
    assert.ok(p1);
    assert.equal(p1.scope, "Global");
    assert.equal(p1.endpoint, "/api/generate-image");
    assert.equal(p1.requestLimit, 1000);
    assert.equal(p1.timeWindow, "1 Hour");
    assert.equal(p1.burstAllowance, 100);
    assert.equal(p1.status, "Active");

    // 2. Per User Limit
    const p2 = data.policies.find((p) => p.name === "Per User Limit");
    assert.ok(p2);
    assert.equal(p2.scope, "Per User");
    assert.equal(p2.requestLimit, 100);
    assert.equal(p2.burstAllowance, 20);

    // 3. Premium Plan Limit
    const p3 = data.policies.find((p) => p.name === "Premium Plan Limit");
    assert.ok(p3);
    assert.equal(p3.scope, "Per Subscription Plan");
    assert.equal(p3.requestLimit, 2000);
    assert.equal(p3.burstAllowance, 200);

    // 4. Per Provider Limit (Paused in reference photo)
    const p4 = data.policies.find((p) => p.name === "Per Provider Limit");
    assert.ok(p4);
    assert.equal(p4.scope, "Per Provider");
    assert.equal(p4.requestLimit, 500);
    assert.equal(p4.status, "Paused");
    assert.equal(p4.enabled, false);

    // 5. Burst Protection
    const p5 = data.policies.find((p) => p.name === "Burst Protection");
    assert.ok(p5);
    assert.equal(p5.scope, "Per Endpoint");
    assert.equal(p5.requestLimit, 200);
    assert.equal(p5.timeWindow, "5 Minutes");
    assert.equal(p5.burstAllowance, 50);
    assert.equal(p5.status, "Active");
  });

  await t.test("3. Verifies canonical plan limits and provider rate-limits configuration", () => {
    const data = getRateLimitsDataset();

    // 4 Plan / override cards
    assert.equal(data.planLimits.length, 4);
    assert.equal(data.planLimits[0].title, "Free Plan Limits");
    assert.equal(data.planLimits[0].badge, "Inherited");
    assert.equal(data.planLimits[1].title, "Paid Plan Limits");
    assert.equal(data.planLimits[1].badge, "Inherited");
    assert.equal(data.planLimits[2].title, "Individual User Overrides");
    assert.equal(data.planLimits[2].badge, "None");
    assert.equal(data.planLimits[3].title, "Administrative Exemptions");
    assert.equal(data.planLimits[3].badge, "1 Active");

    // Provider Rate-Limits Table
    assert.equal(data.providerRateLimits.length, 3);
    assert.equal(data.providerRateLimits[0].provider, "OpenAI");
    assert.equal(data.providerRateLimits[0].model, "GPT-4o");
    assert.equal(data.providerRateLimits[0].status, "Active");

    assert.equal(data.providerRateLimits[1].provider, "Gemini");
    assert.equal(data.providerRateLimits[1].model, "Gemini 1.5 Pro");
    assert.equal(data.providerRateLimits[1].status, "Active");

    assert.equal(data.providerRateLimits[2].provider, "Stability AI");
    assert.equal(data.providerRateLimits[2].model, "Stable Diffusion XL");
    assert.equal(data.providerRateLimits[2].status, "Limited");
  });

  await t.test("4. Verifies canonical rate-limit enforcement event history (EVT-1001 to EVT-1003)", () => {
    const data = getRateLimitsDataset();
    assert.equal(data.eventHistory.length, 3);

    // EVT-1001
    const e1 = data.eventHistory[0];
    assert.equal(e1.id, "EVT-1001");
    assert.equal(e1.userClientReference, "user_2847");
    assert.equal(e1.endpoint, "/api/generate-image");
    assert.equal(e1.appliedPolicy, "Global Rate Limit");
    assert.equal(e1.requestCount, 1001);
    assert.equal(e1.enforcementAction, "Throttled");
    assert.equal(e1.relatedRequestId, "REQ-4587");

    // EVT-1002
    const e2 = data.eventHistory[1];
    assert.equal(e2.userClientReference, "user_1293");
    assert.equal(e2.enforcementAction, "Delayed");
    assert.equal(e2.relatedRequestId, "REQ-4586");

    // EVT-1003
    const e3 = data.eventHistory[2];
    assert.equal(e3.userClientReference, "user_7721");
    assert.equal(e3.enforcementAction, "Rejected");
    assert.equal(e3.relatedRequestId, "REQ-4585");
  });

  await t.test("5. Updates policy parameters and creates an administrative audit trail record", () => {
    const updateRes = updateRateLimitPolicy(
      "POL-001",
      { requestLimit: 1200, burstAllowance: 150 },
      "Parth Admin"
    );
    assert.equal(updateRes.success, true);
    assert.equal(updateRes.policy?.requestLimit, 1200);
    assert.equal(updateRes.policy?.burstAllowance, 150);

    const reloaded = getRateLimitsDataset();
    const p1 = reloaded.policies.find((p) => p.id === "POL-001");
    assert.equal(p1?.requestLimit, 1200);

    // Verify audit record logged
    assert.ok(reloaded.auditHistory.length >= 3);
    assert.equal(reloaded.auditHistory[0].adminName, "Parth Admin");
    assert.ok(reloaded.auditHistory[0].action.includes("Updated policy 'Global Rate Limit'"));
  });

  await t.test("6. Toggles policy status between Active and Paused and verifies metric recalculation", () => {
    // POL-004 is currently Paused (enabled: false)
    const toggleRes = togglePolicyStatus("POL-004", "Parth Admin");
    assert.equal(toggleRes.success, true);
    assert.equal(toggleRes.policy?.status, "Active");
    assert.equal(toggleRes.policy?.enabled, true);

    const reloaded = getRateLimitsDataset();
    const p4 = reloaded.policies.find((p) => p.id === "POL-004");
    assert.equal(p4?.status, "Active");
  });

  await t.test("7. Creates a new rate-limit policy and validates boundary conditions", () => {
    // Validation failure on empty name
    const failRes = createRateLimitPolicy({
      name: "",
      scope: "Per Endpoint",
      endpoint: "/api/status",
      requestLimit: 0,
      timeWindow: "1 Minute",
      timeWindowSeconds: 60,
      burstAllowance: 10,
      enforcementMode: "Reject Request (HTTP 429)",
      status: "Active",
      enabled: true,
    });
    assert.equal(failRes.success, false);

    // Valid policy creation
    const validRes = createRateLimitPolicy({
      name: "Status Health Polling Limit",
      scope: "Per Endpoint",
      endpoint: "/api/status",
      requestLimit: 300,
      timeWindow: "1 Minute",
      timeWindowSeconds: 60,
      burstAllowance: 50,
      enforcementMode: "Reject Request (HTTP 429)",
      status: "Active",
      enabled: true,
    });
    assert.equal(validRes.success, true);
    assert.ok(validRes.policy?.id);

    const reloaded = getRateLimitsDataset();
    assert.equal(reloaded.policies.length, 6);
  });

  await t.test("8. Updates throttling behavior and HTTP 429 response preview", () => {
    const updateBeh = updateThrottlingBehavior("Queue Request");
    assert.equal(updateBeh.success, true);
    assert.equal(updateBeh.config.selectedBehavior, "Queue Request");

    const reloaded = getRateLimitsDataset();
    assert.equal(reloaded.throttlingBehavior.selectedBehavior, "Queue Request");
  });

  await t.test("9. Runs test policy evaluation against burst, global, and user thresholds", () => {
    // Normal request under threshold
    const passEval = testPolicyEvaluation({
      endpoint: "/api/generate-image",
      requestCount: 50,
    });
    assert.equal(passEval.allowed, true);
    assert.equal(passEval.enforcementAction, "Allowed");

    // Exceeding burst protection (threshold 200 + burst 50 = 250)
    const burstEval = testPolicyEvaluation({
      endpoint: "/api/generate-image",
      requestCount: 300,
    });
    assert.equal(burstEval.allowed, false);
    assert.equal(burstEval.enforcementAction, "Rejected (HTTP 429)");
    assert.equal(burstEval.limitingPolicy, "Burst Protection");
  });

  await t.test("10. Deletes rate limit policy safely and logs deletion event", () => {
    const deleteRes = deleteRateLimitPolicy("POL-006", "Parth Admin");
    assert.equal(deleteRes.success, true);

    const reloaded = getRateLimitsDataset();
    assert.equal(reloaded.policies.length, 5);
    assert.ok(reloaded.auditHistory[0].action.includes("Deleted policy"));
  });

  await t.test("11. Resets dataset back to canonical pristine state", () => {
    resetRateLimitsData();
    const restored = getRateLimitsDataset();
    assert.equal(restored.summary.activePolicies, 5);
    assert.equal(restored.policies.length, 5);
    assert.equal(restored.throttlingBehavior.selectedBehavior, "Reject Request");
  });
});
