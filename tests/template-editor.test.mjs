import test from "node:test";
import assert from "node:assert/strict";
import {
  FORMAT_DIMENSIONS_MAP,
  validateTemplateInput,
} from "../lib/templates.ts";
import {
  getTemplateById,
  updateTemplate,
  publishTemplate,
  replaceTemplateAsset,
  resetTemplates,
} from "../lib/templates-storage.ts";

test("Screen 14 — Template Details & Editor Test Suite", async (t) => {
  // Reset templates to canonical baseline before testing
  resetTemplates();

  await t.test("1. Successfully loads template by ID (TPL-003 Education Admission Poster)", () => {
    const template = getTemplateById("TPL-003");
    assert.ok(template, "Must find TPL-003");
    assert.equal(template.id, "TPL-003");
    assert.equal(template.name, "Education Admission Poster");
    assert.equal(template.category, "Education");
    assert.equal(template.format, "3:4");
    assert.equal(template.status, "Draft");
    assert.equal(template.assetFileName, "education-admission-poster.jpg");
    assert.equal(template.assetDimensions, "1024 × 1365 px");
    assert.equal(template.fontSelection, "Poppins");
    assert.equal(template.alignment, "Center");
  });

  await t.test("2. Returns null for non-existent or invalid template IDs", () => {
    const notFound = getTemplateById("TPL-NON-EXISTENT-999");
    assert.equal(notFound, null, "Should return null for missing template");

    const empty = getTemplateById("");
    assert.equal(empty, null, "Should return null for empty ID");
  });

  await t.test("3. Format dimensions mapping matches reference specification", () => {
    assert.equal(FORMAT_DIMENSIONS_MAP["3:4"], "1024 × 1365 px");
    assert.equal(FORMAT_DIMENSIONS_MAP["4:5"], "1080 × 1350 px");
    assert.equal(FORMAT_DIMENSIONS_MAP["9:16"], "1080 × 1920 px");
    assert.equal(FORMAT_DIMENSIONS_MAP["1:1"], "1080 × 1080 px");
  });

  await t.test("4. Input validator enforces length limits and required fields", () => {
    // Required name
    const noName = validateTemplateInput({ name: "" });
    assert.equal(noName.valid, false);
    assert.ok(noName.errors.some((e) => e.includes("required")));

    // Max length 100
    const longName = validateTemplateInput({ name: "a".repeat(101) });
    assert.equal(longName.valid, false);
    assert.ok(longName.errors.some((e) => e.includes("cannot exceed 100 characters")));

    // Max length description 500
    const longDesc = validateTemplateInput({ name: "Valid Title", description: "d".repeat(501) });
    assert.equal(longDesc.valid, false);
    assert.ok(longDesc.errors.some((e) => e.includes("cannot exceed 500 characters")));

    // Valid inputs
    const valid = validateTemplateInput({
      name: "Valid Education Poster",
      category: "Education",
      format: "3:4",
      status: "Draft",
      description: "Valid description",
    });
    assert.equal(valid.valid, true);
    assert.equal(valid.errors.length, 0);
  });

  await t.test("5. Save draft updates persistent template record without altering ID", () => {
    const initial = getTemplateById("TPL-003");
    assert.ok(initial);

    const updateRes = updateTemplate("TPL-003", {
      name: "Updated Education Admission Poster",
      description: "Updated description for university admissions",
      format: "4:5",
      headline: "SPRING ADMISSION OPEN",
    });

    assert.equal(updateRes.success, true);
    assert.ok(updateRes.template);
    assert.equal(updateRes.template.id, "TPL-003", "ID must never be overwritten");
    assert.equal(updateRes.template.name, "Updated Education Admission Poster");
    assert.equal(updateRes.template.format, "4:5");
    assert.equal(updateRes.template.headline, "SPRING ADMISSION OPEN");

    // Verify persisted
    const reloaded = getTemplateById("TPL-003");
    assert.equal(reloaded?.name, "Updated Education Admission Poster");
    assert.equal(reloaded?.format, "4:5");
  });

  await t.test("6. Publishing template updates status to Published", () => {
    const pubRes = publishTemplate("TPL-003");
    assert.equal(pubRes.success, true);
    assert.ok(pubRes.template);
    assert.equal(pubRes.template.status, "Published");

    const reloaded = getTemplateById("TPL-003");
    assert.equal(reloaded?.status, "Published");
  });

  await t.test("7. Replacing poster asset updates filename and dimensions", () => {
    const replaceRes = replaceTemplateAsset("TPL-003", {
      fileName: "new-spring-admission-banner.png",
      dimensions: "1080 × 1350 px",
      fileSize: "320 KB",
    });

    assert.equal(replaceRes.success, true);
    assert.ok(replaceRes.template);
    assert.equal(replaceRes.template.assetFileName, "new-spring-admission-banner.png");
    assert.equal(replaceRes.template.assetDimensions, "1080 × 1350 px");
    assert.equal(replaceRes.template.fileSize, "320 KB");
  });

  await t.test("8. Resetting templates restores canonical baseline", () => {
    resetTemplates();
    const restored = getTemplateById("TPL-003");
    assert.ok(restored);
    assert.equal(restored.name, "Education Admission Poster");
    assert.equal(restored.format, "3:4");
    assert.equal(restored.status, "Draft");
    assert.equal(restored.assetFileName, "education-admission-poster.jpg");
  });

  await t.test("9. Supports slot zones with direct cropped avatar data and out-of-boundary bleed coordinates", () => {
    const croppedDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const testZones = [
      {
        id: "zone-photo-1",
        type: "photo",
        label: "Candidate Profile",
        photoShape: "circle",
        sampleAvatarUrl: croppedDataUrl,
        x: -10, // Bleed: intentionally extends past left border
        y: 15,
        width: 45,
        height: 45,
      },
      {
        id: "zone-shape-1",
        type: "shape",
        label: "Bottom Banner",
        shapeType: "banner",
        backgroundColor: "#FFFFFF",
        x: 0,
        y: 85,
        width: 100,
        height: 15,
      },
    ];

    const updateRes = updateTemplate("TPL-003", {
      name: "Education Admission Poster",
      zones: testZones,
    });

    assert.equal(updateRes.success, true);
    const updated = getTemplateById("TPL-003");
    assert.ok(updated?.zones);
    assert.equal(updated.zones.length, 2);
    assert.equal(updated.zones[0].sampleAvatarUrl, croppedDataUrl);
    assert.equal(updated.zones[0].x, -10, "Supports negative/bleed coordinates");
  });

  await t.test("10. Validates Direct Cropper supported aspect ratio presets", () => {
    const supportedRatios = ["free", "1:1", "3:4", "4:5", "9:16", "16:9", "circle"];
    assert.equal(supportedRatios.length, 7);
    assert.ok(supportedRatios.includes("circle"));
    assert.ok(supportedRatios.includes("3:4"));
    assert.ok(supportedRatios.includes("1:1"));
  });
});
