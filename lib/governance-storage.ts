import fs from "fs";
import path from "path";
import {
  type GovernanceSettingsConfig,
  DEFAULT_GOVERNANCE_SETTINGS,
  validateGovernanceSettings,
} from "./governance-settings.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const SETTINGS_FILE = path.join(DATA_DIR, "governance-settings.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load governance settings from persistence or return defaults
 */
export function getGovernanceSettings(): GovernanceSettingsConfig {
  ensureDataDir();

  if (!fs.existsSync(SETTINGS_FILE)) {
    return JSON.parse(JSON.stringify(DEFAULT_GOVERNANCE_SETTINGS));
  }

  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GOVERNANCE_SETTINGS,
      ...parsed,
      general: { ...DEFAULT_GOVERNANCE_SETTINGS.general, ...parsed.general },
      naming: { ...DEFAULT_GOVERNANCE_SETTINGS.naming, ...parsed.naming },
      validationRules: {
        ...DEFAULT_GOVERNANCE_SETTINGS.validationRules,
        ...parsed.validationRules,
        validateSchemaValues: true, // Always enforce required rule
      },
      schemaCompatibility: {
        ...DEFAULT_GOVERNANCE_SETTINGS.schemaCompatibility,
        ...parsed.schemaCompatibility,
      },
      changeProtection: {
        ...DEFAULT_GOVERNANCE_SETTINGS.changeProtection,
        ...parsed.changeProtection,
      },
    };
  } catch (error) {
    console.error("Failed to read governance-settings.json, falling back to defaults:", error);
    return JSON.parse(JSON.stringify(DEFAULT_GOVERNANCE_SETTINGS));
  }
}

/**
 * Save governance settings as draft
 */
export function saveGovernanceSettingsDraft(
  draftUpdates: Partial<GovernanceSettingsConfig>,
  savedBy = "System Administrator"
): { success: boolean; settings?: GovernanceSettingsConfig; errors?: string[] } {
  ensureDataDir();
  const current = getGovernanceSettings();

  const merged: GovernanceSettingsConfig = {
    ...current,
    ...draftUpdates,
    general: { ...current.general, ...(draftUpdates.general || {}) },
    naming: { ...current.naming, ...(draftUpdates.naming || {}) },
    validationRules: {
      ...current.validationRules,
      ...(draftUpdates.validationRules || {}),
      validateSchemaValues: true, // Enforce required policy
    },
    schemaCompatibility: {
      ...current.schemaCompatibility,
      ...(draftUpdates.schemaCompatibility || {}),
    },
    changeProtection: {
      ...current.changeProtection,
      ...(draftUpdates.changeProtection || {}),
    },
    status: "draft",
    lastSavedAt: new Date().toISOString(),
    lastSavedBy: savedBy,
  };

  const validation = validateGovernanceSettings(merged);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
    return {
      success: true,
      settings: merged,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      errors: [`Failed to write governance settings to disk: ${msg}`],
    };
  }
}
