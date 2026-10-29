import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  DEFAULT_GOVERNANCE_SETTINGS,
  validateTokenNamespace,
  formatTokenNamingPreview,
  validateGovernanceSettings,
} from "../lib/governance-settings.ts";
import {
  getGovernanceSettings,
  saveGovernanceSettingsDraft,
} from "../lib/governance-storage.ts";

test("Screen 12 — Design System Settings & Governance Test Suite", async (t) => {
  const dataDir = path.join(process.cwd(), ".data");
  const settingsFile = path.join(dataDir, "governance-settings.json");
  let backupContent = null;

  if (fs.existsSync(settingsFile)) {
    backupContent = fs.readFileSync(settingsFile, "utf-8");
  }

  t.after(() => {
    if (backupContent !== null) {
      fs.writeFileSync(settingsFile, backupContent, "utf-8");
    } else if (fs.existsSync(settingsFile)) {
      fs.unlinkSync(settingsFile);
    }
  });

  await t.test("1. Initializes with canonical reference default settings matching Screen 12", () => {
    const defaults = DEFAULT_GOVERNANCE_SETTINGS;
    assert.equal(defaults.general.displayName, "Post Hub Design System");
    assert.equal(defaults.general.description, "Design tokens and configuration for Post Hub application ecosystem.");
    assert.equal(defaults.general.namespace, "posthub");
    assert.equal(defaults.general.defaultUnit, "px");
    assert.equal(defaults.general.activeSchemaVersion, "Not configured");
    assert.equal(defaults.general.environment, "Not configured");

    assert.equal(defaults.naming.namingStyle, "kebab-case");
    assert.equal(defaults.naming.prefixNamespace, "posthub");
    assert.equal(defaults.naming.categoryNamingConvention, "Use lowercase category names");

    assert.equal(defaults.validationRules.rejectDuplicateTokens, true);
    assert.equal(defaults.validationRules.validateSchemaValues, true); // Required
    assert.equal(defaults.validationRules.rejectUnsupportedCategories, true);
    assert.equal(defaults.validationRules.validateAliases, false); // Unavailable
    assert.equal(defaults.validationRules.requireImportConfirmation, true);

    assert.equal(defaults.changeProtection.protectPublished, false);
    assert.equal(defaults.changeProtection.protectPublishedStatus, "Not enforced");
  });

  await t.test("2. Token namespace validator enforces lowercase alphanumeric and length bounds", () => {
    assert.equal(validateTokenNamespace("posthub").valid, true);
    assert.equal(validateTokenNamespace("my-brand_01").valid, true);

    assert.equal(validateTokenNamespace("").valid, false);
    assert.equal(validateTokenNamespace("a").valid, false); // Too short (< 2)
    assert.equal(validateTokenNamespace("INVALID_CAPS").valid, false);
    assert.equal(validateTokenNamespace("invalid spaces").valid, false);
    assert.equal(validateTokenNamespace("invalid$char").valid, false);
  });

  await t.test("3. Live token naming preview generator formats kebab-case and dot-notation accurately", () => {
    // kebab-case
    assert.equal(formatTokenNamingPreview("color", "kebab-case"), "color-primary");
    assert.equal(formatTokenNamingPreview("spacing.4", "kebab-case"), "spacing-4");

    // dot-notation
    assert.equal(formatTokenNamingPreview("color", "dot-notation"), "color.primary");
    assert.equal(formatTokenNamingPreview("typography.body", "dot-notation"), "typography.body");
  });

  await t.test("4. Required policy protection strictly forbids disabling schema validation", () => {
    const invalidSettings = {
      validationRules: {
        rejectDuplicateTokens: true,
        validateSchemaValues: false, // Attempt to disable required policy
        rejectUnsupportedCategories: true,
        validateAliases: false,
        requireImportConfirmation: true,
      },
    };

    const validation = validateGovernanceSettings(invalidSettings);
    assert.equal(validation.valid, false);
    assert.ok(validation.errors.some((e) => e.includes("is required and cannot be disabled")));
  });

  await t.test("5. Loading and saving governance settings persists correctly as draft", () => {
    const update = {
      general: {
        displayName: "Post Hub Design System v2",
        description: "Updated description for test.",
        namespace: "posthub-v2",
        defaultUnit: "rem",
        activeSchemaVersion: "Not configured",
        environment: "Not configured",
      },
    };

    const saveResult = saveGovernanceSettingsDraft(update, "Automated Governance Tester");
    assert.equal(saveResult.success, true);
    assert.ok(saveResult.settings);
    assert.equal(saveResult.settings.general.displayName, "Post Hub Design System v2");
    assert.equal(saveResult.settings.general.namespace, "posthub-v2");
    assert.equal(saveResult.settings.general.defaultUnit, "rem");
    assert.equal(saveResult.settings.status, "draft");
    assert.equal(saveResult.settings.lastSavedBy, "Automated Governance Tester");

    // Verify loaded settings match persisted data
    const loaded = getGovernanceSettings();
    assert.equal(loaded.general.displayName, "Post Hub Design System v2");
    assert.equal(loaded.general.namespace, "posthub-v2");
    assert.equal(loaded.validationRules.validateSchemaValues, true); // Required policy retained
  });

  await t.test("6. Server validator rejects invalid measurement units and invalid naming styles", () => {
    const invalidUnit = validateGovernanceSettings({
      general: {
        displayName: "Post Hub",
        description: "Desc",
        namespace: "posthub",
        defaultUnit: "invalid_unit",
        activeSchemaVersion: "Not configured",
        environment: "Not configured",
      },
    });
    assert.equal(invalidUnit.valid, false);
    assert.ok(invalidUnit.errors.some((e) => e.includes("Invalid default measurement unit")));

    const invalidStyle = validateGovernanceSettings({
      naming: {
        namingStyle: "snake_case",
        prefixNamespace: "posthub",
        categoryNamingConvention: "Use lowercase category names",
        previewTokenName: "color",
      },
    });
    assert.equal(invalidStyle.valid, false);
    assert.ok(invalidStyle.errors.some((e) => e.includes("Invalid naming style")));
  });

  await t.test("7. Schema and compatibility metrics truthfully report unconfigured status", () => {
    const settings = getGovernanceSettings();
    assert.equal(settings.schemaCompatibility.currentSchemaVersion, "Not configured");
    assert.equal(settings.schemaCompatibility.currentSchemaStatus, "Not available");
    assert.equal(settings.schemaCompatibility.migrationAvailability, "Not configured");
    assert.equal(settings.schemaCompatibility.lastValidationStatus, "Validation data unavailable");
  });

  await t.test("8. Change protection settings properly distinguish not enforced and not supported", () => {
    const settings = getGovernanceSettings();
    assert.equal(settings.changeProtection.protectPublishedStatus, "Not enforced");
    assert.equal(settings.changeProtection.confirmDestructiveRemovalStatus, "Not enforced");
    assert.equal(settings.changeProtection.preserveHistoricalVersionsStatus, "Not supported");
    assert.equal(settings.changeProtection.auditConfigurationChangesStatus, "Not supported");
  });
});
