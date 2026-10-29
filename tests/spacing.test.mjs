import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SPACING_SCALE,
  DEFAULT_COMPONENT_SPACING,
  DEFAULT_BORDER_RADII,
  DEFAULT_LAYOUT_DIMENSIONS,
  DEFAULT_SPACING_CONFIG,
  validateSpacingValue,
  validateSpacingConfig,
  SPACING_TOKEN_USAGE_REGISTRY,
} from "../lib/spacing-tokens.ts";
import {
  getDesignSystemConfig,
  saveDesignSystemDraft,
} from "../lib/design-system.ts";

test("Screen 08 — Spacing & Layout Tokens Test Suite", async (t) => {
  await t.test("1. Initializes with 8 canonical reference spacing scale tokens", () => {
    assert.equal(DEFAULT_SPACING_SCALE.length, 8);

    const expected = [
      { id: "space-1", label: "Space 1", value: 4, unit: "px" },
      { id: "space-2", label: "Space 2", value: 8, unit: "px" },
      { id: "space-3", label: "Space 3", value: 12, unit: "px" },
      { id: "space-4", label: "Space 4", value: 16, unit: "px" },
      { id: "space-5", label: "Space 5", value: 24, unit: "px" },
      { id: "space-6", label: "Space 6", value: 32, unit: "px" },
      { id: "space-7", label: "Space 7", value: 48, unit: "px" },
      { id: "space-8", label: "Space 8", value: 64, unit: "px" },
    ];

    assert.deepEqual(DEFAULT_SPACING_SCALE, expected);
  });

  await t.test("2. Canonical component spacing defaults match reference image", () => {
    assert.equal(DEFAULT_COMPONENT_SPACING.buttonPaddingX, 16);
    assert.equal(DEFAULT_COMPONENT_SPACING.buttonPaddingY, 10);
    assert.equal(DEFAULT_COMPONENT_SPACING.inputPaddingX, 12);
    assert.equal(DEFAULT_COMPONENT_SPACING.inputPaddingY, 10);
    assert.equal(DEFAULT_COMPONENT_SPACING.cardPadding, 20);
    assert.equal(DEFAULT_COMPONENT_SPACING.cardGap, 12);
    assert.equal(DEFAULT_COMPONENT_SPACING.formFieldGap, 16);
    assert.equal(DEFAULT_COMPONENT_SPACING.sectionGap, 24);
  });

  await t.test("3. Canonical corner radius options and default selection match reference", () => {
    assert.equal(DEFAULT_BORDER_RADII.none, 0);
    assert.equal(DEFAULT_BORDER_RADII.small, 4);
    assert.equal(DEFAULT_BORDER_RADII.medium, 8);
    assert.equal(DEFAULT_BORDER_RADII.large, 12);
    assert.equal(DEFAULT_BORDER_RADII.extraLarge, 16);
    assert.equal(DEFAULT_BORDER_RADII.pill, 999);
    assert.equal(DEFAULT_BORDER_RADII.activeKey, "medium");
  });

  await t.test("4. Canonical layout dimensions match reference image", () => {
    assert.equal(DEFAULT_LAYOUT_DIMENSIONS.contentMaxWidth, 1200);
    assert.equal(DEFAULT_LAYOUT_DIMENSIONS.sidebarWidth, 248);
    assert.equal(DEFAULT_LAYOUT_DIMENSIONS.standardControlHeight, 44);
    assert.equal(DEFAULT_LAYOUT_DIMENSIONS.compactControlHeight, 36);
    assert.equal(DEFAULT_LAYOUT_DIMENSIONS.gridGutter, 24);
  });

  await t.test("5. Spacing value validator accurately validates bounds", () => {
    assert.equal(validateSpacingValue(0, 0, 100), true);
    assert.equal(validateSpacingValue(50, 0, 100), true);
    assert.equal(validateSpacingValue(100, 0, 100), true);
    assert.equal(validateSpacingValue(-1, 0, 100), false);
    assert.equal(validateSpacingValue(101, 0, 100), false);
    assert.equal(validateSpacingValue(NaN, 0, 100), false);
    assert.equal(validateSpacingValue(Infinity, 0, 100), false);
    assert.equal(validateSpacingValue("16", 0, 100), false);
  });

  await t.test("6. Spacing configuration validator passes on valid config and rejects invalid", () => {
    const validResult = validateSpacingConfig(DEFAULT_SPACING_CONFIG);
    assert.equal(validResult.valid, true);
    assert.equal(validResult.errors.length, 0);

    const invalidConfig = {
      ...DEFAULT_SPACING_CONFIG,
      scale: [
        { id: "space-1", label: "Space 1", value: -4, unit: "px" },
        ...DEFAULT_SPACING_CONFIG.scale.slice(1),
      ],
      components: {
        ...DEFAULT_SPACING_CONFIG.components,
        buttonPaddingX: 999, // exceeds max 64
      },
      dimensions: {
        ...DEFAULT_SPACING_CONFIG.dimensions,
        contentMaxWidth: 100, // below min 600
      },
    };

    const invalidResult = validateSpacingConfig(invalidConfig);
    assert.equal(invalidResult.valid, false);
    assert.ok(invalidResult.errors.length >= 3);
  });

  await t.test("7. Spacing token usage registry contains detailed real consumers", () => {
    assert.ok(SPACING_TOKEN_USAGE_REGISTRY.length >= 8);
    for (const ref of SPACING_TOKEN_USAGE_REGISTRY) {
      assert.ok(ref.token.length > 0);
      assert.ok(ref.value.length > 0);
      assert.ok(ref.usageDescription.length > 0);
      assert.ok(Array.isArray(ref.consumers) && ref.consumers.length > 0);
    }
  });

  await t.test("8. Integration: getDesignSystemConfig includes spacingAndLayout", () => {
    const config = getDesignSystemConfig();
    assert.ok(config);
    assert.ok(config.spacingAndLayout);
    assert.equal(config.spacingAndLayout.scale.length, 8);
    assert.equal(config.spacingAndLayout.dimensions.contentMaxWidth, 1200);
  });

  await t.test("9. Integration: saveDesignSystemDraft persists updated spacing tokens", () => {
    const customConfig = {
      ...DEFAULT_SPACING_CONFIG,
      components: {
        ...DEFAULT_SPACING_CONFIG.components,
        buttonPaddingX: 18,
      },
    };

    const saveResult = saveDesignSystemDraft(
      { spacingAndLayout: customConfig },
      "Unit Test Runner"
    );

    assert.equal(saveResult.success, true);
    assert.ok(saveResult.config);
    assert.equal(saveResult.config.spacingAndLayout.components.buttonPaddingX, 18);

    // Re-read from disk to ensure persistence
    const reloaded = getDesignSystemConfig();
    assert.equal(reloaded.spacingAndLayout.components.buttonPaddingX, 18);

    // Revert back to default
    saveDesignSystemDraft({ spacingAndLayout: DEFAULT_SPACING_CONFIG }, "Unit Test Runner");
    const reverted = getDesignSystemConfig();
    assert.equal(reloaded.spacingAndLayout.components.buttonPaddingX, 18);
    assert.equal(reverted.spacingAndLayout.components.buttonPaddingX, 16);
  });
});

