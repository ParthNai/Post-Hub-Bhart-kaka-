import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllPresets,
  getPresetById,
  createPreset,
  updatePreset,
  duplicatePreset,
  togglePresetStatus,
  archivePreset,
  deletePreset,
  getGlobalRules,
  saveGlobalRules,
  getPresetMetrics,
  filterPresets,
  resetAiPresets,
} from "../lib/ai-presets-storage.ts";
import { composeAiPrompt } from "../lib/ai-presets.ts";

test("Screen 20 — AI Generation Prompt Rules & Preset Management Test Suite", async (t) => {
  // Reset storage to canonical state before testing
  resetAiPresets();

  await t.test("1. Initializes canonical 12 presets matching Screen 20 reference specifications", () => {
    const presets = getAllPresets();
    assert.equal(presets.length, 12, "Should initialize exactly 12 total presets");

    // Test getPresetById lookup
    const pst001 = getPresetById("PST-001");
    assert.ok(pst001, "Preset PST-001 must be retrievable by ID");
    assert.equal(pst001.name, "Diwali Festival");

    // Inspect Diwali Festival
    const diwali = presets.find((p) => p.name === "Diwali Festival");
    assert.ok(diwali, "Diwali Festival preset must exist");
    assert.equal(diwali.category, "Festivals");
    assert.equal(diwali.status, "active");
    assert.equal(diwali.description, "Traditional Diwali poster with warm colors.");
    assert.equal(diwali.defaultAspectRatio, "1:1");
    assert.equal(diwali.defaultFormat, "PNG, JPG");
    assert.deepEqual(diwali.associatedRules, ["Base Prompt", "Design Style", "Color Scheme"]);

    // Inspect Business Growth
    const business = presets.find((p) => p.name === "Business Growth");
    assert.ok(business, "Business Growth preset must exist");
    assert.equal(business.category, "Business");
    assert.equal(business.status, "active");
    assert.equal(business.description, "Professional business growth poster.");

    // Inspect Education Admission
    const education = presets.find((p) => p.name === "Education Admission");
    assert.ok(education, "Education Admission preset must exist");
    assert.equal(education.category, "Education");
    assert.equal(education.status, "draft");
    assert.equal(education.description, "School/college admission poster.");

    // Inspect Summer Sale
    const sale = presets.find((p) => p.name === "Summer Sale");
    assert.ok(sale, "Summer Sale preset must exist");
    assert.equal(sale.category, "Offers");
    assert.equal(sale.status, "active");

    // Inspect New Year 2026
    const newyear = presets.find((p) => p.name === "New Year 2026");
    assert.ok(newyear, "New Year 2026 preset must exist");
    assert.equal(newyear.category, "Events");
    assert.equal(newyear.status, "active");

    // Inspect Product Launch
    const product = presets.find((p) => p.name === "Product Launch");
    assert.ok(product, "Product Launch preset must exist");
    assert.equal(product.category, "Product");
    assert.equal(product.status, "archived");

    // Inspect Social Media Post
    const social = presets.find((p) => p.name === "Social Media Post");
    assert.ok(social, "Social Media Post preset must exist");
    assert.equal(social.category, "Social Media");
    assert.equal(social.status, "active");

    // Inspect Corporate Design
    const corporate = presets.find((p) => p.name === "Corporate Design");
    assert.ok(corporate, "Corporate Design preset must exist");
    assert.equal(corporate.category, "Business");
    assert.equal(corporate.status, "active");
  });

  await t.test("2. Correctly computes KPI metrics matching reference values", () => {
    const metrics = getPresetMetrics();
    assert.equal(metrics.totalPresets, 12, "Total presets must equal 12");
    assert.equal(metrics.activePresets, 9, "Active presets must equal 9");
    assert.equal(metrics.activePercentage, "75% of total", "Active percentage must equal 75% of total");
    assert.equal(metrics.draftPresets, 2, "Draft presets must equal 2");
    assert.equal(metrics.defaultPromptRules, 1, "Default prompt rules must equal 1");
  });

  await t.test("3. Verifies canonical Global Prompt Rules matching Screen 20 text", () => {
    const rules = getGlobalRules();
    assert.equal(
      rules.basePromptInstructions,
      "Create a professional, high-quality poster with clean design, modern typography and attractive visuals."
    );
    assert.equal(rules.designStyleInstructions, "Use a clean and premium design style.");
    assert.equal(rules.typographyGuidance, "Use clear and bold fonts, modern and readable.");
    assert.equal(rules.colorGuidance, "Use brand colors: purple, white and elegant tones.");
  });

  await t.test("4. Deterministic AI Prompt Composition engine works as expected", () => {
    const presets = getAllPresets();
    const diwali = presets.find((p) => p.name === "Diwali Festival");
    const globalRules = getGlobalRules();

    const composition = composeAiPrompt(
      "Grand Diwali celebration with family",
      diwali,
      globalRules
    );

    assert.ok(composition.composedPrompt.includes("Subject: Grand Diwali celebration with family"));
    assert.ok(composition.composedPrompt.includes(diwali.basePrompt));
    assert.ok(composition.composedPrompt.includes(diwali.designStyle));
    assert.ok(composition.composedPrompt.includes(globalRules.basePromptInstructions));
    assert.ok(composition.appliedRules.includes("User Custom Prompt"));
    assert.ok(composition.appliedRules.includes("Preset: Diwali Festival"));
    assert.ok(composition.appliedRules.includes("Global Base Instructions"));
    assert.ok(composition.estimatedTokens > 0);
  });

  await t.test("5. Filtering and sorting preset library", () => {
    const all = getAllPresets();

    // Query search
    const searchFestival = filterPresets(all, { query: "diwali" });
    assert.equal(searchFestival.length, 1);
    assert.equal(searchFestival[0].name, "Diwali Festival");

    // Category filter
    const businessOnly = filterPresets(all, { category: "Business" });
    assert.equal(businessOnly.length, 2);

    // Status filter
    const draftOnly = filterPresets(all, { status: "draft" });
    assert.equal(draftOnly.length, 2);

    const archivedOnly = filterPresets(all, { status: "archived" });
    assert.equal(archivedOnly.length, 1);
    assert.equal(archivedOnly[0].name, "Product Launch");
  });

  await t.test("6. Full CRUD actions: Create, Update, Duplicate, Status Toggle, Archive, Delete", () => {
    // 6a. Create
    const created = createPreset({
      name: "Spring Fashion Week",
      category: "Events",
      description: "Fashion show and runway promo poster.",
      basePrompt: "High-end spring fashion runway with models, spotlights and luxury apparel.",
      designStyle: "Vogue haute-couture, glossy, editorial",
      typographyGuidance: "Ultra-condensed serif",
      colorGuidance: "Pastel pink, champagne, soft jade",
      defaultAspectRatio: "4:5",
      defaultFormat: "PNG, JPG",
      status: "draft",
      associatedRules: ["Base Prompt", "Design Style"],
      thumbnailType: "tech",
    });
    assert.ok(created.id.startsWith("PST-"));
    assert.equal(created.name, "Spring Fashion Week");

    let metrics = getPresetMetrics();
    assert.equal(metrics.totalPresets, 13);
    assert.equal(metrics.draftPresets, 3);

    // 6b. Update
    const updated = updatePreset(created.id, {
      description: "Updated description for runway poster.",
      status: "active",
    });
    assert.ok(updated);
    assert.equal(updated.description, "Updated description for runway poster.");
    assert.equal(updated.status, "active");

    // 6c. Duplicate
    const duplicated = duplicatePreset(created.id);
    assert.ok(duplicated);
    assert.equal(duplicated.name, "Spring Fashion Week (Copy)");
    assert.equal(duplicated.status, "draft");

    // 6d. Toggle Status
    const toggled = togglePresetStatus(duplicated.id);
    assert.ok(toggled);
    assert.equal(toggled.status, "active");

    // 6e. Archive
    const archived = archivePreset(duplicated.id);
    assert.ok(archived);
    assert.equal(archived.status, "archived");

    // 6f. Delete
    const deleted1 = deletePreset(duplicated.id);
    assert.equal(deleted1, true);
    const deleted2 = deletePreset(created.id);
    assert.equal(deleted2, true);

    // Verify metrics restored to 12
    metrics = getPresetMetrics();
    assert.equal(metrics.totalPresets, 12);
  });

  await t.test("7. Updates and persists Global Rules", () => {
    const updatedRules = saveGlobalRules({
      designStyleInstructions: "Updated clean and premium modern aesthetic.",
    });
    assert.equal(updatedRules.designStyleInstructions, "Updated clean and premium modern aesthetic.");

    const readBack = getGlobalRules();
    assert.equal(readBack.designStyleInstructions, "Updated clean and premium modern aesthetic.");

    // Reset back to canonical
    resetAiPresets();
    const finalRules = getGlobalRules();
    assert.equal(finalRules.designStyleInstructions, "Use a clean and premium design style.");
  });
});
