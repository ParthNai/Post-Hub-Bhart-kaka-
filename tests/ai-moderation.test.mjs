import test from "node:test";
import assert from "node:assert/strict";
import {
  getModerationPolicy,
  saveModerationPolicy,
  toggleRule,
  addRule,
  updateRule,
  deleteRule,
  toggleCategory,
  updateCategory,
  addRejectionReason,
  toggleRejectionReason,
  deleteRejectionReason,
  getPolicyVersionHistory,
  restorePolicyRevision,
  resetModerationPolicy,
} from "../lib/ai-moderation-storage.ts";
import { evaluatePolicyRules } from "../lib/ai-moderation.ts";

test("Screen 23 — AI Image Moderation Rules & Policy Configuration Test Suite", async (t) => {
  // Always reset to canonical reference state before running tests
  resetModerationPolicy();

  await t.test("1. Initializes canonical configuration matching Screen 23 reference specifications", () => {
    const policy = getModerationPolicy();

    // Verify Globals
    assert.equal(policy.globals.enableModerationWorkflow, true);
    assert.equal(policy.globals.automaticModerationAvailability, true);
    assert.equal(policy.globals.manualReviewRequirement, true);
    assert.equal(policy.globals.defaultModerationBehavior, "Flag for Review");
    assert.equal(policy.globals.unknownResultHandling, "Treat as Suspicious");
    assert.equal(policy.globals.policyVersion, "v2.1.0");
    assert.equal(policy.globals.lastUpdated, "Nov 2, 2025 • 4:30 PM");

    // Verify 4 KPI Metrics
    assert.equal(policy.metrics.activePolicies, 8, "Must show 8 active policies");
    assert.equal(policy.metrics.enabledChecks, 6, "Must show 6 enabled checks");
    assert.equal(policy.metrics.pendingReviewRules, 2, "Must show 2 pending review rules");
    assert.equal(policy.metrics.lastPolicyUpdate, "Nov 2, 2025 • 4:30 PM");
    assert.equal(policy.metrics.policyStatusBadge, "Live");

    // Verify 8 Categories
    assert.equal(policy.categories.length, 8, "Must contain exactly 8 policy categories");
    const catUnsafe = policy.categories.find((c) => c.id === "cat-unsafe");
    assert.ok(catUnsafe, "Unsafe category must exist");
    assert.equal(catUnsafe.name, "Unsafe or Harmful Imagery");
    assert.equal(catUnsafe.enabled, true);
    assert.equal(catUnsafe.reviewRequired, true);
    assert.equal(catUnsafe.resultingAction, "Reject");

    const catExplicit = policy.categories.find((c) => c.id === "cat-explicit");
    assert.ok(catExplicit);
    assert.equal(catExplicit.resultingAction, "Reject");

    const catHate = policy.categories.find((c) => c.id === "cat-hate");
    assert.ok(catHate);
    assert.equal(catHate.resultingAction, "Flag");

    const catCopyright = policy.categories.find((c) => c.id === "cat-copyright");
    assert.ok(catCopyright);
    assert.equal(catCopyright.resultingAction, "Flag");

    // Verify 4 Automatic Rules
    assert.equal(policy.rules.length, 4, "Must contain 4 canonical automatic rules");

    const rule1 = policy.rules[0];
    assert.equal(rule1.name, "Explicit Content Rule");
    assert.equal(rule1.triggerCondition, "Adult content detected");
    assert.equal(rule1.detectionSource, "Vision AI");
    assert.equal(rule1.severity, "High");
    assert.equal(rule1.resultingAction, "Reject");
    assert.equal(rule1.enabled, true);

    const rule2 = policy.rules[1];
    assert.equal(rule2.name, "Violence Detection");
    assert.equal(rule2.triggerCondition, "Violent imagery found");
    assert.equal(rule2.detectionSource, "Vision AI");
    assert.equal(rule2.severity, "High");
    assert.equal(rule2.resultingAction, "Flag for Review");
    assert.equal(rule2.enabled, true);

    const rule3 = policy.rules[2];
    assert.equal(rule3.name, "Hate Speech");
    assert.equal(rule3.triggerCondition, "Hate content detected");
    assert.equal(rule3.detectionSource, "Vision AI + NLP");
    assert.equal(rule3.severity, "Medium");
    assert.equal(rule3.resultingAction, "Reject");

    const rule4 = policy.rules[3];
    assert.equal(rule4.name, "Copyright Content");
    assert.equal(rule4.triggerCondition, "Copyright logo detected");
    assert.equal(rule4.detectionSource, "Vision AI");
    assert.equal(rule4.severity, "Low");
    assert.equal(rule4.resultingAction, "Flag for Review");

    // Verify 6 Rejection Reasons
    assert.equal(policy.reasons.length, 6, "Must contain 6 rejection categories");
    assert.ok(policy.reasons.some((r) => r.category === "Policy Violation"));
    assert.ok(policy.reasons.some((r) => r.category === "Copyright Concern"));
    assert.ok(policy.reasons.some((r) => r.category === "Inappropriate Content"));
    assert.ok(policy.reasons.some((r) => r.category === "Misleading Content"));
    assert.ok(policy.reasons.some((r) => r.category === "Quality Issue"));
    assert.ok(policy.reasons.some((r) => r.category === "Other"));

    // Verify Manual Review & Error Handling
    assert.equal(policy.manualReview.reviewRequiredConditions, "On Policy Violation or Uncertain Result");
    assert.equal(policy.manualReview.reviewerRole, "Content Moderator");
    assert.equal(policy.manualReview.reviewPriority, "High for Harmful Content");
    assert.equal(policy.manualReview.escalationRules, "After 24 Hours");
    assert.equal(policy.manualReview.reviewDecisionRequired, true);

    assert.equal(policy.errorHandling.serviceUnavailable, "Allow with Warning");
    assert.equal(policy.errorHandling.timeout, "Flag for Review");
    assert.equal(policy.errorHandling.inconclusiveResult, "Flag for Review");
    assert.equal(policy.errorHandling.unsupportedFormat, "Reject");
    assert.equal(policy.errorHandling.missingResponse, "Flag for Review");
  });

  await t.test("2. Saving policy changes, semver bump, and audit history logging", () => {
    const updated = saveModerationPolicy(
      {
        globals: {
          defaultModerationBehavior: "Escalate to Manual Review",
        },
      },
      "Parth Patel (Administrator)",
      "Testing policy update and semver bump"
    );

    assert.equal(updated.globals.defaultModerationBehavior, "Escalate to Manual Review");
    assert.equal(updated.globals.policyVersion, "v2.1.1", "Version patch should increment");

    const history = getPolicyVersionHistory();
    assert.ok(history.length >= 4, "Should record new revision in history");
    assert.equal(history[0].version, "v2.1.1");
    assert.equal(history[0].updatedBy, "Parth Patel (Administrator)");
    assert.equal(history[0].summary, "Testing policy update and semver bump");
  });

  await t.test("3. Rule management (toggle, add, update, delete)", () => {
    // Toggle rule
    const toggled = toggleRule("rule-copyright", false);
    assert.ok(toggled);
    assert.equal(toggled.enabled, false);

    // Add new rule
    const newRule = addRule({
      name: "Watermark Detection",
      triggerCondition: "Stock watermark detected",
      detectionSource: "Vision AI",
      severity: "Low",
      resultingAction: "Flag for Review",
      enabled: true,
      description: "Flag images with visible watermark remnants.",
    });
    assert.ok(newRule.id);
    assert.equal(newRule.name, "Watermark Detection");

    // Update rule
    const updated = updateRule(newRule.id, { severity: "Medium" });
    assert.ok(updated);
    assert.equal(updated.severity, "Medium");

    // Delete rule
    const deleted = deleteRule(newRule.id);
    assert.equal(deleted, true);

    // Restore rule-copyright
    toggleRule("rule-copyright", true);
  });

  await t.test("4. Category and rejection reason operations", () => {
    // Category action update
    const updatedCat = updateCategory("cat-hate", { resultingAction: "Reject" });
    assert.ok(updatedCat);
    assert.equal(updatedCat.resultingAction, "Reject");

    // Category toggle
    const toggledCat = toggleCategory("cat-other", false);
    assert.ok(toggledCat);
    assert.equal(toggledCat.enabled, false);

    // Rejection reason add
    const newReason = addRejectionReason({
      category: "Unlicensed Audio / Media",
      description: "Contains unlicensed media elements",
      status: "Active",
    });
    assert.ok(newReason.id);
    assert.equal(newReason.category, "Unlicensed Audio / Media");

    // Toggle reason status
    const toggledReason = toggleRejectionReason(newReason.id);
    assert.ok(toggledReason);
    assert.equal(toggledReason.status, "Disabled");

    // Delete reason
    const deletedReason = deleteRejectionReason(newReason.id);
    assert.equal(deletedReason, true);
  });

  await t.test("5. Automated Policy Rule Evaluation Engine", () => {
    const policy = getModerationPolicy();

    // 1. Safe Festive Poster
    const safeRes = evaluatePolicyRules(
      "Beautiful Diwali poster with golden lamps and traditional lights",
      policy.categories,
      policy.rules
    );
    assert.equal(safeRes.decision, "Approved");
    assert.equal(safeRes.matchedRules.length, 0);

    // 2. Explicit Content Trigger
    const explicitRes = evaluatePolicyRules(
      "Adult glamour photo with explicit nude model",
      policy.categories,
      policy.rules
    );
    assert.equal(explicitRes.decision, "Rejected");
    assert.ok(explicitRes.matchedRules.some((r) => r.id === "rule-explicit"));

    // 3. Violence Detection Trigger
    const violenceRes = evaluatePolicyRules(
      "War action scene with bloody weapon and violence",
      policy.categories,
      policy.rules
    );
    assert.equal(violenceRes.decision, "Manual Review");
    assert.ok(violenceRes.matchedRules.some((r) => r.id === "rule-violence"));

    // 4. Copyright Content Trigger
    const copyrightRes = evaluatePolicyRules(
      "Sports poster with prominent Nike logo overlay",
      policy.categories,
      policy.rules
    );
    assert.equal(copyrightRes.decision, "Manual Review");
    assert.ok(copyrightRes.matchedRules.some((r) => r.id === "rule-copyright"));
  });

  await t.test("6. Policy Version Rollback / Restore", () => {
    // Restore historical revision REV-20251015-001 (v2.0.0)
    const restored = restorePolicyRevision("REV-20251015-001", "Parth Patel (Administrator)");
    assert.ok(restored, "Should successfully restore earlier version");
    assert.equal(restored.globals.policyVersion, "v2.0.0");

    const history = getPolicyVersionHistory();
    assert.ok(history[0].summary.includes("Restored policy configuration from version v2.0.0"));
  });

  // Reset back to canonical reference state after tests
  resetModerationPolicy();
});
