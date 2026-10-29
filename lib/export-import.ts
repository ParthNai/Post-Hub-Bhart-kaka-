import type {
  DesignSystemConfig,
  ColorTokens,
  TypographyTokens,
} from "./design-system.ts";
import {
  type SpacingScaleItem,
  type ComponentSpacingTokens,
  type BorderRadiusTokens,
  type LayoutDimensionTokens,
  DEFAULT_SPACING_CONFIG,
  validateSpacingValue,
} from "./spacing-tokens.ts";

export type ExportCategory = "colors" | "typography" | "spacing" | "radius" | "layout" | "complete";

export interface ExportTokenPayload {
  $schema?: string;
  schemaVersion: "1.0.0";
  source: string;
  exportedAt: string;
  exportedBy?: string;
  categories: ("colors" | "typography" | "spacing" | "radius" | "layout")[];
  tokens: {
    colors?: ColorTokens;
    typography?: TypographyTokens;
    spacing?: {
      scale: SpacingScaleItem[];
      components?: ComponentSpacingTokens;
    };
    radius?: BorderRadiusTokens & {
      borderRadius?: string;
      cardBorderRadius?: string;
    };
    layout?: LayoutDimensionTokens;
  };
}

export type ImportValidationStatus = "not_run" | "valid" | "valid_with_warnings" | "invalid";
export type DiffChangeType = "added" | "modified" | "unchanged" | "invalid";

export interface ImportDiffItem {
  token: string;
  category: "Colors" | "Typography" | "Spacing" | "Radius" | "Layout" | "General";
  previousValue: string;
  newValue: string;
  changeType: DiffChangeType;
  unit?: string;
  note?: string;
}

export interface ImportValidationResult {
  status: ImportValidationStatus;
  fileName: string;
  fileSizeFormatted: string;
  tokensDetected: number;
  addedTokens: number;
  modifiedTokens: number;
  unchangedTokens: number;
  invalidEntries: number;
  diffs: ImportDiffItem[];
  errors: string[];
  warnings: string[];
  parsedPayload?: ExportTokenPayload;
}

// 2MB Application Limit
export const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024;

// Color Hex validation regex
export function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

// Human readable file size formatter
export function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Safe fallback tokens when currentConfig is not supplied
const FALLBACK_CONFIG: DesignSystemConfig = {
  version: 1,
  status: "draft",
  lastSavedAt: null,
  brandAssets: [],
  guidelines: {
    brandTone: "Professional",
    visualStyle: "Clean and editorial",
    theme: "Light",
    accentColor: "Violet",
  },
  colorTokens: {
    primaryViolet: "#7956C9",
    softLavender: "#E8DFF5",
    warmIvory: "#FAF7F2",
    mainText: "#24213A",
    secondaryText: "#777184",
    border: "#EAE4EE",
  },
  typography: {
    fontFamily: "Inter, -apple-system, sans-serif",
    headlineSize: "32px",
    headlineWeight: "700",
    bodySize: "16px",
    bodyLineHeight: "1.5",
    metadataSize: "11px",
  },
  icons: {
    iconSet: "Lucide Outline",
    defaultSize: "18px",
    strokeWidth: "2px",
  },
  components: {
    borderRadius: "8px",
    cardBorderRadius: "16px",
    buttonPadding: "10px 20px",
    shadowIntensity: "subtle",
  },
  spacing: {
    baseUnit: "4px",
    containerPadding: "24px",
    cardGap: "16px",
  },
  spacingAndLayout: DEFAULT_SPACING_CONFIG,
  history: [],
};

/**
 * Generate canonical export payload based on selected categories
 */
export function generateExportPayload(
  selectedCategories: ExportCategory[],
  customConfig?: DesignSystemConfig,
  exportedBy = "System Administrator"
): ExportTokenPayload {
  const config = customConfig || FALLBACK_CONFIG;
  const isComplete = selectedCategories.includes("complete");

  const effectiveCategories: ("colors" | "typography" | "spacing" | "radius" | "layout")[] = [];

  if (isComplete || selectedCategories.includes("colors")) effectiveCategories.push("colors");
  if (isComplete || selectedCategories.includes("typography")) effectiveCategories.push("typography");
  if (isComplete || selectedCategories.includes("spacing")) effectiveCategories.push("spacing");
  if (isComplete || selectedCategories.includes("radius")) effectiveCategories.push("radius");
  if (isComplete || selectedCategories.includes("layout")) effectiveCategories.push("layout");

  const tokensPayload: ExportTokenPayload["tokens"] = {};

  if (effectiveCategories.includes("colors")) {
    tokensPayload.colors = {
      primaryViolet: config.colorTokens.primaryViolet,
      softLavender: config.colorTokens.softLavender,
      warmIvory: config.colorTokens.warmIvory,
      mainText: config.colorTokens.mainText,
      secondaryText: config.colorTokens.secondaryText,
      border: config.colorTokens.border,
    };
  }

  if (effectiveCategories.includes("typography")) {
    tokensPayload.typography = {
      fontFamily: config.typography.fontFamily,
      headlineSize: config.typography.headlineSize,
      headlineWeight: config.typography.headlineWeight,
      bodySize: config.typography.bodySize,
      bodyLineHeight: config.typography.bodyLineHeight,
      metadataSize: config.typography.metadataSize,
    };
  }

  if (effectiveCategories.includes("spacing")) {
    tokensPayload.spacing = {
      scale: config.spacingAndLayout?.scale || [],
      components: config.spacingAndLayout?.components,
    };
  }

  if (effectiveCategories.includes("radius")) {
    const radii = config.spacingAndLayout?.radii;
    tokensPayload.radius = {
      none: radii?.none ?? 0,
      small: radii?.small ?? 4,
      medium: radii?.medium ?? 8,
      large: radii?.large ?? 12,
      extraLarge: radii?.extraLarge ?? 16,
      pill: radii?.pill ?? 999,
      activeKey: radii?.activeKey ?? "medium",
      borderRadius: config.components?.borderRadius || "8px",
      cardBorderRadius: config.components?.cardBorderRadius || "16px",
    };
  }

  if (effectiveCategories.includes("layout")) {
    tokensPayload.layout = config.spacingAndLayout?.dimensions ? {
      contentMaxWidth: config.spacingAndLayout.dimensions.contentMaxWidth,
      sidebarWidth: config.spacingAndLayout.dimensions.sidebarWidth,
      standardControlHeight: config.spacingAndLayout.dimensions.standardControlHeight,
      compactControlHeight: config.spacingAndLayout.dimensions.compactControlHeight,
      gridGutter: config.spacingAndLayout.dimensions.gridGutter,
    } : {
      contentMaxWidth: 1200,
      sidebarWidth: 248,
      standardControlHeight: 44,
      compactControlHeight: 36,
      gridGutter: 24,
    };
  }

  return {
    $schema: "https://posthub.internal/schemas/design-tokens-v1.json",
    schemaVersion: "1.0.0",
    source: "Post Hub Design System",
    exportedAt: new Date().toISOString(),
    exportedBy,
    categories: effectiveCategories,
    tokens: tokensPayload,
  };
}

/**
 * Validate imported JSON content against canonical Post Hub schema and compute real diffs
 */
export function validateImportPayload(
  rawContent: string,
  fileName = "unknown.json",
  fileSize = 0,
  currentConfigOverride?: DesignSystemConfig
): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const diffs: ImportDiffItem[] = [];

  const fileSizeFormatted = fileSize > 0 ? formatBytes(fileSize) : formatBytes(new Blob([rawContent]).size);

  // File size guard
  if (fileSize > MAX_IMPORT_FILE_SIZE) {
    return {
      status: "invalid",
      fileName,
      fileSizeFormatted,
      tokensDetected: 0,
      addedTokens: 0,
      modifiedTokens: 0,
      unchangedTokens: 0,
      invalidEntries: 1,
      diffs: [],
      errors: [`File size exceeds the 2MB application limit (detected: ${fileSizeFormatted}).`],
      warnings: [],
    };
  }

  // Empty check
  if (!rawContent || !rawContent.trim()) {
    return {
      status: "invalid",
      fileName,
      fileSizeFormatted,
      tokensDetected: 0,
      addedTokens: 0,
      modifiedTokens: 0,
      unchangedTokens: 0,
      invalidEntries: 1,
      diffs: [],
      errors: ["File is empty. Please choose a valid JSON design-token configuration file."],
      warnings: [],
    };
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      status: "invalid",
      fileName,
      fileSizeFormatted,
      tokensDetected: 0,
      addedTokens: 0,
      modifiedTokens: 0,
      unchangedTokens: 0,
      invalidEntries: 1,
      diffs: [],
      errors: [`Malformed JSON syntax: ${msg}`],
      warnings: [],
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      status: "invalid",
      fileName,
      fileSizeFormatted,
      tokensDetected: 0,
      addedTokens: 0,
      modifiedTokens: 0,
      unchangedTokens: 0,
      invalidEntries: 1,
      diffs: [],
      errors: ["Root JSON entity must be an object."],
      warnings: [],
    };
  }

  const root = parsed as Record<string, unknown>;

  // Schema version checking
  if (root.schemaVersion && typeof root.schemaVersion === "string") {
    if (root.schemaVersion !== "1.0.0") {
      warnings.push(`File specifies schema version "${root.schemaVersion}". Supported version is "1.0.0". Attempting backward-compatible parsing.`);
    }
  } else {
    warnings.push("No explicit schemaVersion attribute detected. Using standard Post Hub 1.0.0 token structure.");
  }

  // Extract tokens container
  let rawTokens: Record<string, unknown> = {};
  if (root.tokens && typeof root.tokens === "object" && !Array.isArray(root.tokens)) {
    rawTokens = root.tokens as Record<string, unknown>;
  } else {
    rawTokens = root;
  }

  const current = currentConfigOverride || FALLBACK_CONFIG;
  let tokensDetected = 0;
  let addedTokens = 0;
  let modifiedTokens = 0;
  let unchangedTokens = 0;
  let invalidEntries = 0;

  const effectivePayloadTokens: ExportTokenPayload["tokens"] = {};
  const recognizedCategories = new Set<"colors" | "typography" | "spacing" | "radius" | "layout">();

  // 1. Validate Colors
  const rawColors = (rawTokens.colors || rawTokens.colorTokens) as Record<string, unknown> | undefined;
  if (rawColors && typeof rawColors === "object" && !Array.isArray(rawColors)) {
    recognizedCategories.add("colors");
    const validColors: Partial<ColorTokens> = {};
    for (const [key, val] of Object.entries(rawColors)) {
      tokensDetected++;
      const currentVal = (current.colorTokens as unknown as Record<string, string>)[key];
      if (typeof val !== "string" || !isValidHexColor(val)) {
        invalidEntries++;
        errors.push(`Invalid color format for "${key}": "${val}". Must be a valid hex code (e.g. #7956C9).`);
        diffs.push({
          token: `color.${key}`,
          category: "Colors",
          previousValue: currentVal || "—",
          newValue: String(val),
          changeType: "invalid",
          note: "Invalid hex format",
        });
      } else {
        (validColors as Record<string, string>)[key] = val;
        if (!currentVal) {
          addedTokens++;
          diffs.push({
            token: `color.${key}`,
            category: "Colors",
            previousValue: "—",
            newValue: val,
            changeType: "added",
          });
        } else if (currentVal.toLowerCase() !== val.toLowerCase()) {
          modifiedTokens++;
          diffs.push({
            token: `color.${key}`,
            category: "Colors",
            previousValue: currentVal,
            newValue: val,
            changeType: "modified",
          });
        } else {
          unchangedTokens++;
          diffs.push({
            token: `color.${key}`,
            category: "Colors",
            previousValue: currentVal,
            newValue: val,
            changeType: "unchanged",
          });
        }
      }
    }
    if (Object.keys(validColors).length > 0) {
      effectivePayloadTokens.colors = {
        ...current.colorTokens,
        ...validColors,
      };
    }
  }

  // 2. Validate Typography
  const rawTypo = rawTokens.typography as Record<string, unknown> | undefined;
  if (rawTypo && typeof rawTypo === "object" && !Array.isArray(rawTypo)) {
    recognizedCategories.add("typography");
    const validTypo: Partial<TypographyTokens> = {};
    for (const [key, val] of Object.entries(rawTypo)) {
      tokensDetected++;
      const currentVal = (current.typography as unknown as Record<string, string>)[key];
      if (typeof val !== "string" || !val.trim()) {
        invalidEntries++;
        errors.push(`Invalid typography value for "${key}": "${val}". Must be a non-empty string.`);
        diffs.push({
          token: `typography.${key}`,
          category: "Typography",
          previousValue: currentVal || "—",
          newValue: String(val),
          changeType: "invalid",
          note: "Non-empty string expected",
        });
      } else {
        (validTypo as Record<string, string>)[key] = val.trim();
        if (!currentVal) {
          addedTokens++;
          diffs.push({
            token: `typography.${key}`,
            category: "Typography",
            previousValue: "—",
            newValue: val.trim(),
            changeType: "added",
          });
        } else if (currentVal !== val.trim()) {
          modifiedTokens++;
          diffs.push({
            token: `typography.${key}`,
            category: "Typography",
            previousValue: currentVal,
            newValue: val.trim(),
            changeType: "modified",
          });
        } else {
          unchangedTokens++;
          diffs.push({
            token: `typography.${key}`,
            category: "Typography",
            previousValue: currentVal,
            newValue: val.trim(),
            changeType: "unchanged",
          });
        }
      }
    }
    if (Object.keys(validTypo).length > 0) {
      effectivePayloadTokens.typography = {
        ...current.typography,
        ...validTypo,
      };
    }
  }

  // 3. Validate Spacing Scale
  const rawSpacing = (rawTokens.spacing || rawTokens.spacingAndLayout) as Record<string, unknown> | undefined;
  if (rawSpacing && typeof rawSpacing === "object") {
    recognizedCategories.add("spacing");
    const rawScale = (Array.isArray(rawSpacing) ? rawSpacing : (rawSpacing.scale || [])) as unknown[];
    const validScale: SpacingScaleItem[] = [];

    if (Array.isArray(rawScale)) {
      for (const item of rawScale) {
        tokensDetected++;
        if (typeof item !== "object" || item === null) {
          invalidEntries++;
          errors.push("Invalid spacing item format: object expected.");
          continue;
        }
        const scaleObj = item as Record<string, unknown>;
        const id = String(scaleObj.id || `space-${validScale.length + 1}`);
        const label = String(scaleObj.label || id);
        const value = typeof scaleObj.value === "number" ? scaleObj.value : parseInt(String(scaleObj.value), 10);
        const unit = String(scaleObj.unit || "px");

        const currentScaleItem = current.spacingAndLayout?.scale.find((s) => s.id === id);

        if (!validateSpacingValue(value, 0, 500)) {
          invalidEntries++;
          errors.push(`Spacing value for "${id}" must be a number between 0 and 500 px (got: ${value}).`);
          diffs.push({
            token: `spacing.${id}`,
            category: "Spacing",
            previousValue: currentScaleItem ? `${currentScaleItem.value}${currentScaleItem.unit}` : "—",
            newValue: `${value}${unit}`,
            changeType: "invalid",
            note: "Out of range [0-500px]",
          });
        } else {
          validScale.push({ id, label, value, unit });
          if (!currentScaleItem) {
            addedTokens++;
            diffs.push({
              token: `spacing.${id}`,
              category: "Spacing",
              previousValue: "—",
              newValue: `${value}${unit}`,
              changeType: "added",
            });
          } else if (currentScaleItem.value !== value || currentScaleItem.unit !== unit) {
            modifiedTokens++;
            diffs.push({
              token: `spacing.${id}`,
              category: "Spacing",
              previousValue: `${currentScaleItem.value}${currentScaleItem.unit}`,
              newValue: `${value}${unit}`,
              changeType: "modified",
            });
          } else {
            unchangedTokens++;
            diffs.push({
              token: `spacing.${id}`,
              category: "Spacing",
              previousValue: `${currentScaleItem.value}${currentScaleItem.unit}`,
              newValue: `${value}${unit}`,
              changeType: "unchanged",
            });
          }
        }
      }
    }

    effectivePayloadTokens.spacing = {
      scale: validScale.length > 0 ? validScale : (current.spacingAndLayout?.scale || []),
    };
  }

  // 4. Validate Radius
  const rawRadius = (rawTokens.radius || rawTokens.radii) as Record<string, unknown> | undefined;
  if (rawRadius && typeof rawRadius === "object" && !Array.isArray(rawRadius)) {
    recognizedCategories.add("radius");
    const currentRadii = current.spacingAndLayout?.radii;
    const validRadius: Record<string, unknown> = {};

    const radiusKeys = ["none", "small", "medium", "large", "extraLarge", "pill"] as const;
    for (const rk of radiusKeys) {
      if (rk in rawRadius) {
        tokensDetected++;
        const val = rawRadius[rk];
        const numVal = typeof val === "number" ? val : parseInt(String(val), 10);
        const curVal = currentRadii ? currentRadii[rk] : undefined;

        if (isNaN(numVal) || numVal < 0 || numVal > 1000) {
          invalidEntries++;
          errors.push(`Corner radius for "${rk}" must be a number between 0 and 1000px.`);
          diffs.push({
            token: `radius.${rk}`,
            category: "Radius",
            previousValue: curVal !== undefined ? `${curVal}px` : "—",
            newValue: String(val),
            changeType: "invalid",
            note: "Invalid pixel value",
          });
        } else {
          validRadius[rk] = numVal;
          if (curVal === undefined) {
            addedTokens++;
            diffs.push({
              token: `radius.${rk}`,
              category: "Radius",
              previousValue: "—",
              newValue: `${numVal}px`,
              changeType: "added",
            });
          } else if (curVal !== numVal) {
            modifiedTokens++;
            diffs.push({
              token: `radius.${rk}`,
              category: "Radius",
              previousValue: `${curVal}px`,
              newValue: `${numVal}px`,
              changeType: "modified",
            });
          } else {
            unchangedTokens++;
            diffs.push({
              token: `radius.${rk}`,
              category: "Radius",
              previousValue: `${curVal}px`,
              newValue: `${numVal}px`,
              changeType: "unchanged",
            });
          }
        }
      }
    }

    effectivePayloadTokens.radius = {
      ...(current.spacingAndLayout?.radii || {
        none: 0,
        small: 4,
        medium: 8,
        large: 12,
        extraLarge: 16,
        pill: 999,
        activeKey: "medium",
      }),
      ...validRadius,
    } as BorderRadiusTokens;
  }

  // 5. Validate Layout Dimensions
  const rawLayout = (rawTokens.layout || rawTokens.dimensions) as Record<string, unknown> | undefined;
  if (rawLayout && typeof rawLayout === "object" && !Array.isArray(rawLayout)) {
    recognizedCategories.add("layout");
    const currentDim = current.spacingAndLayout?.dimensions;
    const validLayout: Record<string, unknown> = {};

    const dimKeys = [
      "contentMaxWidth",
      "sidebarWidth",
      "standardControlHeight",
      "compactControlHeight",
      "gridGutter",
    ] as const;

    for (const dk of dimKeys) {
      if (dk in rawLayout) {
        tokensDetected++;
        const val = rawLayout[dk];
        const numVal = typeof val === "number" ? val : parseInt(String(val), 10);
        const curVal = currentDim ? currentDim[dk] : undefined;

        if (isNaN(numVal) || numVal < 10 || numVal > 5000) {
          invalidEntries++;
          errors.push(`Layout dimension for "${dk}" must be a number between 10 and 5000px.`);
          diffs.push({
            token: `layout.${dk}`,
            category: "Layout",
            previousValue: curVal !== undefined ? `${curVal}px` : "—",
            newValue: String(val),
            changeType: "invalid",
            note: "Invalid dimension bounds",
          });
        } else {
          validLayout[dk] = numVal;
          if (curVal === undefined) {
            addedTokens++;
            diffs.push({
              token: `layout.${dk}`,
              category: "Layout",
              previousValue: "—",
              newValue: `${numVal}px`,
              changeType: "added",
            });
          } else if (curVal !== numVal) {
            modifiedTokens++;
            diffs.push({
              token: `layout.${dk}`,
              category: "Layout",
              previousValue: `${curVal}px`,
              newValue: `${numVal}px`,
              changeType: "modified",
            });
          } else {
            unchangedTokens++;
            diffs.push({
              token: `layout.${dk}`,
              category: "Layout",
              previousValue: `${curVal}px`,
              newValue: `${numVal}px`,
              changeType: "unchanged",
            });
          }
        }
      }
    }

    effectivePayloadTokens.layout = {
      ...(current.spacingAndLayout?.dimensions || {
        contentMaxWidth: 1200,
        sidebarWidth: 248,
        standardControlHeight: 44,
        compactControlHeight: 36,
        gridGutter: 24,
      }),
      ...validLayout,
    } as LayoutDimensionTokens;
  }

  // Detect unknown top-level keys
  const allowedKeys = new Set([
    "$schema",
    "schemaVersion",
    "source",
    "exportedAt",
    "exportedBy",
    "categories",
    "tokens",
    "colors",
    "colorTokens",
    "typography",
    "spacing",
    "spacingAndLayout",
    "radius",
    "radii",
    "layout",
    "dimensions",
  ]);

  for (const k of Object.keys(root)) {
    if (!allowedKeys.has(k)) {
      warnings.push(`Unrecognized top-level property "${k}". Ignored during import.`);
    }
  }

  if (tokensDetected === 0) {
    errors.push("No valid design tokens (Colors, Typography, Spacing, Radius, or Layout) found in this file.");
  }

  let status: ImportValidationStatus = "valid";
  if (errors.length > 0 || invalidEntries > 0 || tokensDetected === 0) {
    status = "invalid";
  } else if (warnings.length > 0) {
    status = "valid_with_warnings";
  }

  const parsedPayload: ExportTokenPayload = {
    $schema: "https://posthub.internal/schemas/design-tokens-v1.json",
    schemaVersion: "1.0.0",
    source: typeof root.source === "string" ? root.source : "Imported File",
    exportedAt: new Date().toISOString(),
    exportedBy: typeof root.exportedBy === "string" ? root.exportedBy : undefined,
    categories: Array.from(recognizedCategories),
    tokens: effectivePayloadTokens,
  };

  return {
    status,
    fileName,
    fileSizeFormatted,
    tokensDetected,
    addedTokens,
    modifiedTokens,
    unchangedTokens,
    invalidEntries,
    diffs,
    errors,
    warnings,
    parsedPayload: status !== "invalid" ? parsedPayload : undefined,
  };
}

/**
 * Apply validated import payload into canonical draft configuration
 */
export function applyImportAsDraft(
  payload: ExportTokenPayload,
  current: DesignSystemConfig,
  saveFn: (draft: Partial<DesignSystemConfig>, user?: string) => { success: boolean; config?: DesignSystemConfig; errors?: string[] },
  importedBy = "System Administrator"
): { success: boolean; message: string; config?: DesignSystemConfig; errors?: string[] } {
  const draftUpdates: Partial<DesignSystemConfig> = {};

  if (payload.tokens.colors) {
    draftUpdates.colorTokens = {
      ...current.colorTokens,
      ...payload.tokens.colors,
    };
  }

  if (payload.tokens.typography) {
    draftUpdates.typography = {
      ...current.typography,
      ...payload.tokens.typography,
    };
  }

  if (payload.tokens.spacing || payload.tokens.radius || payload.tokens.layout) {
    draftUpdates.spacingAndLayout = {
      scale: payload.tokens.spacing?.scale || current.spacingAndLayout?.scale || [],
      components: payload.tokens.spacing?.components || current.spacingAndLayout?.components || {
        buttonPaddingX: 16,
        buttonPaddingY: 10,
        inputPaddingX: 12,
        inputPaddingY: 10,
        cardPadding: 20,
        cardGap: 12,
        formFieldGap: 16,
        sectionGap: 24,
      },
      radii: (payload.tokens.radius ? {
        none: payload.tokens.radius.none ?? 0,
        small: payload.tokens.radius.small ?? 4,
        medium: payload.tokens.radius.medium ?? 8,
        large: payload.tokens.radius.large ?? 12,
        extraLarge: payload.tokens.radius.extraLarge ?? 16,
        pill: payload.tokens.radius.pill ?? 999,
        activeKey: payload.tokens.radius.activeKey || "medium",
      } : current.spacingAndLayout?.radii) || {
        none: 0,
        small: 4,
        medium: 8,
        large: 12,
        extraLarge: 16,
        pill: 999,
        activeKey: "medium",
      },
      dimensions: payload.tokens.layout ? {
        contentMaxWidth: payload.tokens.layout.contentMaxWidth,
        sidebarWidth: payload.tokens.layout.sidebarWidth,
        standardControlHeight: payload.tokens.layout.standardControlHeight,
        compactControlHeight: payload.tokens.layout.compactControlHeight,
        gridGutter: payload.tokens.layout.gridGutter,
      } : (current.spacingAndLayout?.dimensions || {
        contentMaxWidth: 1200,
        sidebarWidth: 248,
        standardControlHeight: 44,
        compactControlHeight: 36,
        gridGutter: 24,
      }),
    };
  }

  if (payload.tokens.radius?.borderRadius || payload.tokens.radius?.cardBorderRadius) {
    draftUpdates.components = {
      ...current.components,
      borderRadius: payload.tokens.radius.borderRadius || current.components.borderRadius,
      cardBorderRadius: payload.tokens.radius.cardBorderRadius || current.components.cardBorderRadius,
    };
  }

  // Save as draft - never publishes
  const saveResult = saveFn(draftUpdates, importedBy);

  if (!saveResult.success) {
    return {
      success: false,
      message: "Failed to persist draft configuration.",
      errors: saveResult.errors || ["Unknown persistence failure."],
    };
  }

  return {
    success: true,
    message: `Successfully imported tokens from ${payload.categories.join(", ")} as draft.`,
    config: saveResult.config,
  };
}
