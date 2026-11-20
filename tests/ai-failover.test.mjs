import test from "node:test";
import assert from "node:assert/strict";
import {
  getRoutingData,
  saveRoutingRule,
  deleteRoutingRule,
  updateProviderPriorities,
  toggleProviderRouting,
  updateFailoverConditions,
  evaluateFailoverRouting,
  recordRoutingEvent,
  resetRoutingData,
} from "../lib/ai-failover-storage.ts";

test("Screen 29 — AI Generation Provider Failover & Routing Test Suite", async (t) => {
  // Reset to canonical baseline
  resetRoutingData();

  await t.test("1. Initializes canonical routing metrics matching Screen 29 reference specifications", () => {
    const data = getRoutingData();
    assert.equal(data.summary.activeRoutingRules, 6);
    assert.equal(data.summary.configuredProviders, 3);
    assert.equal(data.summary.fallbackRules, 4);
    assert.equal(data.providerPriorities.length, 3);
  });

  await t.test("2. Verifies canonical provider priority table records and health status", () => {
    const data = getRoutingData();
    const p1 = data.providerPriorities.find((p) => p.priority === 1);
    const p2 = data.providerPriorities.find((p) => p.priority === 2);
    const p3 = data.providerPriorities.find((p) => p.priority === 3);

    assert.ok(p1);
    assert.equal(p1.providerName, "OpenAI");
    assert.equal(p1.model, "GPT-4o");
    assert.equal(p1.generationType, "Text + Image");
    assert.equal(p1.healthStatus, "Healthy");
    assert.equal(p1.routingEnabled, true);

    assert.ok(p2);
    assert.equal(p2.providerName, "Stability AI");
    assert.equal(p2.model, "Stable Diffusion XL");
    assert.equal(p2.generationType, "Image");

    assert.ok(p3);
    assert.equal(p3.providerName, "Gemini");
    assert.equal(p3.model, "Gemini 1.5 Pro");
    assert.equal(p3.generationType, "Text + Image");
  });

  await t.test("3. Verifies canonical routing rules matching reference table", () => {
    const data = getRoutingData();
    const rule1 = data.rules.find((r) => r.id === "rule-1");
    const rule2 = data.rules.find((r) => r.id === "rule-2");
    const rule3 = data.rules.find((r) => r.id === "rule-3");

    assert.ok(rule1);
    assert.equal(rule1.ruleName, "High Quality Images");
    assert.equal(rule1.requestType, "Image");
    assert.equal(rule1.modelRequirement, "DALL·E 3");
    assert.equal(rule1.preferredProvider, "OpenAI");
    assert.equal(rule1.fallbackPolicy, "All Fallbacks");
    assert.equal(rule1.priority, 1);
    assert.equal(rule1.status, "Active");

    assert.ok(rule2);
    assert.equal(rule2.ruleName, "Fast Text Generation");
    assert.equal(rule2.preferredProvider, "OpenAI");
    assert.equal(rule2.fallbackPolicy, "Stability AI");

    assert.ok(rule3);
    assert.equal(rule3.ruleName, "Creative Images");
    assert.equal(rule3.preferredProvider, "Stability AI");
    assert.equal(rule3.fallbackPolicy, "Gemini");
  });

  await t.test("4. Prevents invalid circular fallback chains", () => {
    assert.throws(
      () => {
        saveRoutingRule({
          ruleName: "Invalid Circular Rule",
          preferredProvider: "OpenAI",
          preferredModel: "GPT-4o",
          fallbackProvider: "OpenAI",
          fallbackModel: "GPT-4o",
        });
      },
      /Circular fallback detected/
    );
  });

  await t.test("5. Evaluates failover routing and constructs fallback chain", () => {
    const decision = evaluateFailoverRouting("Image", "DALL·E 3");
    assert.equal(decision.primaryProvider, "OpenAI");
    assert.equal(decision.primaryModel, "GPT-4o");
    assert.ok(decision.fallbackChain.length >= 1);
    assert.equal(decision.fallbackChain[0].provider, "Stability AI");
  });

  await t.test("6. Toggles provider routing, updates priorities and failover conditions", () => {
    const toggleOutcome = toggleProviderRouting("stability", false);
    assert.equal(toggleOutcome.success, true);
    assert.equal(toggleOutcome.provider.routingEnabled, false);

    const dataBefore = getRoutingData();
    const updatedPriorities = [...dataBefore.providerPriorities].reverse();
    const prioOutcome = updateProviderPriorities(updatedPriorities);
    assert.equal(prioOutcome.success, true);

    const conditionsOutcome = updateFailoverConditions({
      providerTimeout: true,
      maxAttempts: 4,
      retryIntervalSeconds: 45,
    });
    assert.equal(conditionsOutcome.success, true);
    assert.equal(conditionsOutcome.conditions.maxAttempts, 4);
    assert.equal(conditionsOutcome.conditions.retryIntervalSeconds, 45);
  });

  await t.test("7. Records routing events into persistent audit history and deletes rules", () => {
    const newEvent = recordRoutingEvent({
      requestId: "REQ-9999",
      selectedProvider: "OpenAI",
      fallback: true,
      finalProvider: "Gemini",
      result: "Success",
      timestamp: "11:20 AM",
      reason: "Automated test simulated failover event.",
    });

    assert.ok(newEvent.eventId.startsWith("RH-"));
    const data = getRoutingData();
    assert.equal(data.recentHistory[0].requestId, "REQ-9999");

    const deleteOutcome = deleteRoutingRule("rule-6");
    assert.equal(deleteOutcome.success, true);
    const dataAfter = getRoutingData();
    assert.equal(dataAfter.rules.some((r) => r.id === "rule-6"), false);
  });

  // Clean up back to canonical state after test
  resetRoutingData();
});
