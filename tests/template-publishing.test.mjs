import test from "node:test";
import assert from "node:assert/strict";
import {
  runPrePublishValidation,
} from "../lib/template-publishing.ts";
import {
  publishTemplateWorkflow,
  getPublications,
} from "../lib/template-publishing-storage.ts";
import {
  getTemplateById,
  resetTemplates,
} from "../lib/templates-storage.ts";
import {
  getCategories,
  resetCategories,
} from "../lib/template-categories-storage.ts";

test("Screen 16 — Template Preview & Publishing Workflow Test Suite", async (t) => {
  // Ensure clean baseline before tests
  resetTemplates();
  resetCategories();

  await t.test("1. Successfully executes 6 pre-publish validation checks on TPL-001", () => {
    const template = getTemplateById("TPL-001");
    assert.ok(template, "TPL-001 must exist");

    const categories = getCategories();
    const { checks, readiness } = runPrePublishValidation(template, categories);

    assert.equal(checks.length, 6, "Must perform exactly 6 pre-flight validation checks");

    // Check specific checks
    const tokenCheck = checks.find((c) => c.id === "chk-design-tokens");
    assert.ok(tokenCheck);
    assert.equal(tokenCheck.status, "Passed");

    const assetCheck = checks.find((c) => c.id === "chk-asset-quality");
    assert.ok(assetCheck);
    assert.equal(assetCheck.status, "Passed");

    const textCheck = checks.find((c) => c.id === "chk-required-slots");
    assert.ok(textCheck);
    assert.equal(textCheck.status, "Passed");

    const contrastCheck = checks.find((c) => c.id === "chk-contrast");
    assert.ok(contrastCheck);
    assert.equal(contrastCheck.status, "Warning", "Contrast check has WCAG AA warning");

    const catCheck = checks.find((c) => c.id === "chk-category-status");
    assert.ok(catCheck);
    assert.equal(catCheck.status, "Passed");

    const mobileCheck = checks.find((c) => c.id === "chk-mobile-delivery");
    assert.ok(mobileCheck);
    assert.equal(mobileCheck.status, "Passed");

    // Readiness summary
    assert.equal(readiness.passedCount, 5);
    assert.equal(readiness.warningCount, 1);
    assert.equal(readiness.failedCount, 0);
    assert.equal(readiness.canPublish, true, "Warnings allow publishing with review");
  });

  await t.test("2. Flags missing font or invalid colors as blocking failure", () => {
    const template = getTemplateById("TPL-001");
    const badTemplate = {
      ...template,
      fontSelection: "",
      primaryColor: "invalid-color",
    };

    const categories = getCategories();
    const { checks, readiness } = runPrePublishValidation(badTemplate, categories);

    const tokenCheck = checks.find((c) => c.id === "chk-design-tokens");
    assert.equal(tokenCheck.status, "Failed");
    assert.equal(readiness.canPublish, false, "Blocking check failure must prevent publication");
  });

  await t.test("3. Flags missing asset or dimensions as blocking failure", () => {
    const template = getTemplateById("TPL-001");
    const noAssetTemplate = {
      ...template,
      assetFileName: "",
      assetDimensions: "",
    };

    const categories = getCategories();
    const { checks, readiness } = runPrePublishValidation(noAssetTemplate, categories);

    const assetCheck = checks.find((c) => c.id === "chk-asset-quality");
    assert.equal(assetCheck.status, "Failed");
    assert.equal(readiness.canPublish, false);
  });

  await t.test("4. Flags missing headline as blocking failure", () => {
    const template = getTemplateById("TPL-001");
    const noHeadlineTemplate = {
      ...template,
      headline: "",
    };

    const categories = getCategories();
    const { checks, readiness } = runPrePublishValidation(noHeadlineTemplate, categories);

    const textCheck = checks.find((c) => c.id === "chk-required-slots");
    assert.equal(textCheck.status, "Failed");
    assert.equal(readiness.canPublish, false);
  });

  await t.test("5. Publishing workflow persists published status and audit record", () => {
    const pubRes = publishTemplateWorkflow("TPL-001", {
      revisionNote: "Screen 16 automated test publication",
    });

    assert.equal(pubRes.success, true);
    assert.ok(pubRes.publication);
    assert.equal(pubRes.publication.templateId, "TPL-001");
    assert.equal(pubRes.publication.revision, "v1.2");
    assert.equal(pubRes.publication.targetChannel, "Production - App Store / Play Store");

    // Verify template status updated
    const updated = getTemplateById("TPL-001");
    assert.equal(updated.status, "Published");

    // Verify stored publication record
    const publications = getPublications();
    assert.ok(publications.some((p) => p.templateId === "TPL-001"));
  });

  await t.test("6. Publishing workflow rejects non-existent templates honestly", () => {
    const notFound = publishTemplateWorkflow("TPL-DOES-NOT-EXIST");
    assert.equal(notFound.success, false);
    assert.ok(notFound.error.includes("not found"));
  });
});
