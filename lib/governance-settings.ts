export type NamingStyle = "kebab-case" | "dot-notation";
export type MeasurementUnit = "px" | "rem" | "em" | "pt";
export type PolicyStatus = "Supported" | "Required" | "Unavailable" | "Not enforced" | "Not supported";

export interface GovernanceGeneralConfig {
  displayName: string;
  description: string;
  namespace: string;
  defaultUnit: MeasurementUnit;
  activeSchemaVersion: string;
  environment: string;
}

export interface GovernanceNamingConfig {
  namingStyle: NamingStyle;
  prefixNamespace: string;
  categoryNamingConvention: string;
  previewTokenName: string;
}

export interface GovernanceValidationRulesConfig {
  rejectDuplicateTokens: boolean;
  validateSchemaValues: boolean; // Required & always enforced
  rejectUnsupportedCategories: boolean;
  validateAliases: boolean; // Unavailable
  requireImportConfirmation: boolean;
}

export interface GovernanceSchemaCompatibilityConfig {
  currentSchemaVersion: string;
  currentSchemaStatus: string;
  supportedImportVersions: string;
  supportedImportStatus: string;
  migrationAvailability: string;
  migrationStatus: string;
  compatibilityPolicy: string;
  compatibilityStatus: string;
  lastSuccessfulValidation: string;
  lastValidationStatus: string;
}

export interface GovernanceChangeProtectionConfig {
  protectPublished: boolean;
  protectPublishedStatus: PolicyStatus;
  confirmDestructiveRemoval: boolean;
  confirmDestructiveRemovalStatus: PolicyStatus;
  preserveHistoricalVersions: boolean;
  preserveHistoricalVersionsStatus: PolicyStatus;
  auditConfigurationChanges: boolean;
  auditConfigurationChangesStatus: PolicyStatus;
}

export interface GovernanceSettingsConfig {
  general: GovernanceGeneralConfig;
  naming: GovernanceNamingConfig;
  validationRules: GovernanceValidationRulesConfig;
  schemaCompatibility: GovernanceSchemaCompatibilityConfig;
  changeProtection: GovernanceChangeProtectionConfig;
  status: "draft" | "saved";
  lastSavedAt: string | null;
  lastSavedBy?: string;
}

export const DEFAULT_GOVERNANCE_SETTINGS: GovernanceSettingsConfig = {
  general: {
    displayName: "Post Hub Design System",
    description: "Design tokens and configuration for Post Hub application ecosystem.",
    namespace: "posthub",
    defaultUnit: "px",
    activeSchemaVersion: "Not configured",
    environment: "Not configured",
  },
  naming: {
    namingStyle: "kebab-case",
    prefixNamespace: "posthub",
    categoryNamingConvention: "Use lowercase category names",
    previewTokenName: "color",
  },
  validationRules: {
    rejectDuplicateTokens: true,
    validateSchemaValues: true, // Always required
    rejectUnsupportedCategories: true,
    validateAliases: false, // Unavailable
    requireImportConfirmation: true,
  },
  schemaCompatibility: {
    currentSchemaVersion: "Not configured",
    currentSchemaStatus: "Not available",
    supportedImportVersions: "Not configured",
    supportedImportStatus: "Not available",
    migrationAvailability: "Not configured",
    migrationStatus: "Not available",
    compatibilityPolicy: "Not configured",
    compatibilityStatus: "Not available",
    lastSuccessfulValidation: "Not configured",
    lastValidationStatus: "Validation data unavailable",
  },
  changeProtection: {
    protectPublished: false,
    protectPublishedStatus: "Not enforced",
    confirmDestructiveRemoval: false,
    confirmDestructiveRemovalStatus: "Not enforced",
    preserveHistoricalVersions: false,
    preserveHistoricalVersionsStatus: "Not supported",
    auditConfigurationChanges: false,
    auditConfigurationChangesStatus: "Not supported",
  },
  status: "draft",
  lastSavedAt: null,
};

/**
 * Validate token namespace format
 */
export function validateTokenNamespace(namespace: string): { valid: boolean; error?: string } {
  if (!namespace || !namespace.trim()) {
    return { valid: false, error: "Token namespace cannot be empty." };
  }
  const clean = namespace.trim();
  if (clean.length < 2 || clean.length > 32) {
    return { valid: false, error: "Token namespace must be between 2 and 32 characters." };
  }
  if (!/^[a-z0-9_-]+$/.test(clean)) {
    return { valid: false, error: "Namespace must contain only lowercase letters, numbers, hyphens, and underscores." };
  }
  return { valid: true };
}

/**
 * Live token naming preview generator
 */
export function formatTokenNamingPreview(input: string, style: NamingStyle): string {
  const cleanInput = (input || "color").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  if (!cleanInput) return "color.primary";

  if (style === "dot-notation") {
    return cleanInput.includes(".") ? cleanInput : `${cleanInput}.primary`;
  }
  // kebab-case
  const parts = cleanInput.split(/[._-]/).filter(Boolean);
  if (parts.length > 1) {
    return parts.join("-");
  }
  return `${cleanInput}-primary`;
}

/**
 * Comprehensive server/client validator for governance configuration
 */
export function validateGovernanceSettings(settings: Partial<GovernanceSettingsConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.general) {
    if (!settings.general.displayName || !settings.general.displayName.trim()) {
      errors.push("Design system name cannot be empty.");
    }
    const nsValidation = validateTokenNamespace(settings.general.namespace || "");
    if (!nsValidation.valid && nsValidation.error) {
      errors.push(nsValidation.error);
    }
    if (settings.general.defaultUnit && !["px", "rem", "em", "pt"].includes(settings.general.defaultUnit)) {
      errors.push(`Invalid default measurement unit: "${settings.general.defaultUnit}".`);
    }
  }

  if (settings.naming) {
    if (settings.naming.namingStyle && !["kebab-case", "dot-notation"].includes(settings.naming.namingStyle)) {
      errors.push(`Invalid naming style: "${settings.naming.namingStyle}".`);
    }
    if (settings.naming.prefixNamespace) {
      const nsValidation = validateTokenNamespace(settings.naming.prefixNamespace);
      if (!nsValidation.valid && nsValidation.error) {
        errors.push(`Prefix namespace: ${nsValidation.error}`);
      }
    }
  }

  // Required policies cannot be disabled
  if (settings.validationRules) {
    if (settings.validationRules.validateSchemaValues === false) {
      errors.push("The 'Validate token values against the active schema' policy is required and cannot be disabled.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

