import fs from "fs";
import path from "path";
import type { SpacingAndLayoutConfig } from "./spacing-tokens.ts";
import { DEFAULT_SPACING_CONFIG, validateSpacingConfig } from "./spacing-tokens.ts";

export interface BrandAsset {
  id: string; // "primary-logo" | "app-icon" | "light-logo" | "dark-logo"
  title: string;
  format: string; // e.g. "PNG · 1200 × 400"
  status: "available" | "not_uploaded";
  dimensions: string; // e.g. "1200 × 400"
  filename?: string;
  url?: string;
  updatedAt?: string;
}

export interface BrandGuidelines {
  brandTone: string; // "Professional" | "Creative & Bold" | "Playful & Friendly" | "Minimal & Clean" | "Authoritative"
  visualStyle: string; // "Clean and editorial" | "Modern Vibrant" | "Corporate Minimal" | "Artistic Festival" | "Bold Typography"
  theme: string; // "Light" | "Dark" | "Auto / System"
  accentColor: string; // "Violet" | "Indigo" | "Electric Purple" | "Emerald" | "Amber"
}

export interface ColorTokens {
  primaryViolet: string; // "#7956C9"
  softLavender: string; // "#E8DFF5"
  warmIvory: string; // "#FAF7F2"
  mainText: string; // "#24213A"
  secondaryText: string; // "#777184"
  border: string; // "#EAE4EE"
}

export interface TypographyTokens {
  fontFamily: string; // "Inter, -apple-system, sans-serif"
  headlineSize: string; // "24px"
  headlineWeight: string; // "700"
  bodySize: string; // "14px"
  bodyLineHeight: string; // "1.5"
  metadataSize: string; // "11px"
}

export interface IconTokens {
  iconSet: string;
  defaultSize: string;
  strokeWidth: string;
}

export interface ComponentTokens {
  borderRadius: string; // "8px"
  cardBorderRadius: string; // "16px"
  buttonPadding: string; // "10px 20px"
  shadowIntensity: "subtle" | "medium" | "elevated";
}

export interface SpacingTokens {
  baseUnit: string; // "4px"
  containerPadding: string; // "24px"
  cardGap: string; // "16px"
}

export interface DesignSystemVersionHistory {
  version: number;
  savedAt: string;
  savedBy: string;
  summary: string;
  tokens: {
    colors: ColorTokens;
    guidelines: BrandGuidelines;
    typography: TypographyTokens;
  };
}

export interface DesignSystemConfig {
  version: number;
  status: "draft" | "published";
  lastSavedAt: string | null;
  lastSavedBy?: string;
  brandAssets: BrandAsset[];
  guidelines: BrandGuidelines;
  colorTokens: ColorTokens;
  typography: TypographyTokens;
  icons: IconTokens;
  components: ComponentTokens;
  spacing: SpacingTokens;
  spacingAndLayout?: SpacingAndLayoutConfig;
  history: DesignSystemVersionHistory[];
}

export const DEFAULT_BRAND_ASSETS: BrandAsset[] = [
  {
    id: "primary-logo",
    title: "Primary Logo",
    format: "PNG · 1200 × 400",
    status: "available",
    dimensions: "1200 × 400",
    filename: "posthub_primary_logo.png",
    updatedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "app-icon",
    title: "App Icon",
    format: "PNG · 1024 × 1024",
    status: "available",
    dimensions: "1024 × 1024",
    filename: "posthub_app_icon.png",
    updatedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "light-logo",
    title: "Light Background Logo",
    format: "PNG · 1200 × 400",
    status: "available",
    dimensions: "1200 × 400",
    filename: "posthub_light_logo.png",
    updatedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "dark-logo",
    title: "Dark Background Logo",
    format: "PNG · 1200 × 400",
    status: "not_uploaded",
    dimensions: "1200 × 400",
  },
];

export const DEFAULT_BRAND_GUIDELINES: BrandGuidelines = {
  brandTone: "Professional",
  visualStyle: "Clean and editorial",
  theme: "Light",
  accentColor: "Violet",
};

export const DEFAULT_COLOR_TOKENS: ColorTokens = {
  primaryViolet: "#7956C9",
  softLavender: "#E8DFF5",
  warmIvory: "#FAF7F2",
  mainText: "#24213A",
  secondaryText: "#777184",
  border: "#EAE4EE",
};

export const DEFAULT_TYPOGRAPHY_TOKENS: TypographyTokens = {
  fontFamily: "Inter, -apple-system, sans-serif",
  headlineSize: "24px",
  headlineWeight: "700",
  bodySize: "14px",
  bodyLineHeight: "1.5",
  metadataSize: "11px",
};

export const DEFAULT_ICON_TOKENS: IconTokens = {
  iconSet: "Lucide Outline",
  defaultSize: "18px",
  strokeWidth: "2px",
};

export const DEFAULT_COMPONENT_TOKENS: ComponentTokens = {
  borderRadius: "8px",
  cardBorderRadius: "16px",
  buttonPadding: "10px 20px",
  shadowIntensity: "subtle",
};

export const DEFAULT_SPACING_TOKENS: SpacingTokens = {
  baseUnit: "4px",
  containerPadding: "24px",
  cardGap: "16px",
};

export const DEFAULT_DESIGN_SYSTEM: DesignSystemConfig = {
  version: 1,
  status: "draft",
  lastSavedAt: null, // "Not saved yet" in initial draft state
  lastSavedBy: undefined,
  brandAssets: DEFAULT_BRAND_ASSETS,
  guidelines: DEFAULT_BRAND_GUIDELINES,
  colorTokens: DEFAULT_COLOR_TOKENS,
  typography: DEFAULT_TYPOGRAPHY_TOKENS,
  icons: DEFAULT_ICON_TOKENS,
  components: DEFAULT_COMPONENT_TOKENS,
  spacing: DEFAULT_SPACING_TOKENS,
  spacingAndLayout: DEFAULT_SPACING_CONFIG,
  history: [],
};

// Hex color validator
export function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DESIGN_TOKENS_FILE = path.join(DATA_DIR, "design-tokens.json");

// Security sanitization helper
function sanitizePlainString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

// Ensure .data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load design system configuration
export function getDesignSystemConfig(): DesignSystemConfig {
  ensureDataDir();

  if (!fs.existsSync(DESIGN_TOKENS_FILE)) {
    return JSON.parse(JSON.stringify(DEFAULT_DESIGN_SYSTEM));
  }

  try {
    const raw = fs.readFileSync(DESIGN_TOKENS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DESIGN_SYSTEM,
      ...parsed,
      brandAssets: parsed.brandAssets || DEFAULT_BRAND_ASSETS,
      guidelines: { ...DEFAULT_BRAND_GUIDELINES, ...parsed.guidelines },
      colorTokens: { ...DEFAULT_COLOR_TOKENS, ...parsed.colorTokens },
      typography: { ...DEFAULT_TYPOGRAPHY_TOKENS, ...parsed.typography },
      icons: { ...DEFAULT_ICON_TOKENS, ...parsed.icons },
      components: { ...DEFAULT_COMPONENT_TOKENS, ...parsed.components },
      spacing: { ...DEFAULT_SPACING_TOKENS, ...parsed.spacing },
      spacingAndLayout: parsed.spacingAndLayout || DEFAULT_SPACING_CONFIG,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch (error) {
    console.error("Failed to read design-tokens.json, falling back to defaults:", error);
    return JSON.parse(JSON.stringify(DEFAULT_DESIGN_SYSTEM));
  }
}

// Save draft design system configuration
export function saveDesignSystemDraft(
  draft: Partial<DesignSystemConfig>,
  savedBy: string = "System Administrator"
): { success: boolean; config?: DesignSystemConfig; errors?: string[] } {
  ensureDataDir();
  const current = getDesignSystemConfig();
  const errors: string[] = [];

  // Validate color tokens if provided
  const updatedColors = { ...current.colorTokens, ...draft.colorTokens };
  for (const [key, val] of Object.entries(updatedColors)) {
    if (!isValidHexColor(val)) {
      errors.push(`Invalid hex color for "${key}": "${val}". Must be a valid hex color like #7956C9.`);
    }
  }

  // Validate guidelines if provided
  const updatedGuidelines: BrandGuidelines = {
    brandTone: sanitizePlainString(draft.guidelines?.brandTone || current.guidelines.brandTone),
    visualStyle: sanitizePlainString(draft.guidelines?.visualStyle || current.guidelines.visualStyle),
    theme: sanitizePlainString(draft.guidelines?.theme || current.guidelines.theme),
    accentColor: sanitizePlainString(draft.guidelines?.accentColor || current.guidelines.accentColor),
  };

  // Validate typography if provided
  const updatedTypography: TypographyTokens = {
    fontFamily: sanitizePlainString(draft.typography?.fontFamily || current.typography.fontFamily),
    headlineSize: sanitizePlainString(draft.typography?.headlineSize || current.typography.headlineSize),
    headlineWeight: sanitizePlainString(draft.typography?.headlineWeight || current.typography.headlineWeight),
    bodySize: sanitizePlainString(draft.typography?.bodySize || current.typography.bodySize),
    bodyLineHeight: sanitizePlainString(draft.typography?.bodyLineHeight || current.typography.bodyLineHeight),
    metadataSize: sanitizePlainString(draft.typography?.metadataSize || current.typography.metadataSize),
  };

  // Validate spacing and layout if provided
  if (draft.spacingAndLayout) {
    const spacingValidation = validateSpacingConfig(draft.spacingAndLayout);
    if (!spacingValidation.valid) {
      errors.push(...spacingValidation.errors);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const now = new Date().toISOString();
  const newVersion = current.version + 1;

  // Create audit history entry
  const historyEntry: DesignSystemVersionHistory = {
    version: current.version,
    savedAt: now,
    savedBy,
    summary: `Updated design tokens and brand guidelines (v${newVersion})`,
    tokens: {
      colors: current.colorTokens,
      guidelines: current.guidelines,
      typography: current.typography,
    },
  };

  const newConfig: DesignSystemConfig = {
    ...current,
    version: newVersion,
    status: "draft",
    lastSavedAt: now,
    lastSavedBy: savedBy,
    brandAssets: draft.brandAssets || current.brandAssets,
    guidelines: updatedGuidelines,
    colorTokens: updatedColors,
    typography: updatedTypography,
    icons: draft.icons || current.icons,
    components: draft.components || current.components,
    spacing: draft.spacing || current.spacing,
    spacingAndLayout: draft.spacingAndLayout || current.spacingAndLayout || DEFAULT_SPACING_CONFIG,
    history: [historyEntry, ...current.history].slice(0, 20),
  };

  try {
    fs.writeFileSync(DESIGN_TOKENS_FILE, JSON.stringify(newConfig, null, 2), "utf-8");
    return { success: true, config: newConfig };
  } catch (err) {
    console.error("Failed to write design-tokens.json:", err);
    return { success: false, errors: ["Failed to persist configuration to storage."] };
  }
}

// Reset design system to defaults
export function resetDesignSystemToDefaults(
  savedBy: string = "System Administrator"
): { success: boolean; config: DesignSystemConfig } {
  ensureDataDir();
  const now = new Date().toISOString();
  const resetConfig: DesignSystemConfig = {
    ...DEFAULT_DESIGN_SYSTEM,
    version: 1,
    lastSavedAt: now,
    lastSavedBy: savedBy,
    spacingAndLayout: DEFAULT_SPACING_CONFIG,
  };

  fs.writeFileSync(DESIGN_TOKENS_FILE, JSON.stringify(resetConfig, null, 2), "utf-8");
  return { success: true, config: resetConfig };
}

// Update specific brand asset (e.g. upload or replace)
export function updateBrandAsset(
  assetId: string,
  updates: Partial<BrandAsset>
): { success: boolean; config?: DesignSystemConfig; error?: string } {
  const current = getDesignSystemConfig();
  const assetIndex = current.brandAssets.findIndex((a) => a.id === assetId);

  if (assetIndex === -1) {
    return { success: false, error: `Brand asset with id "${assetId}" not found.` };
  }

  const updatedAssets = [...current.brandAssets];
  updatedAssets[assetIndex] = {
    ...updatedAssets[assetIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const newConfig: DesignSystemConfig = {
    ...current,
    brandAssets: updatedAssets,
  };

  try {
    fs.writeFileSync(DESIGN_TOKENS_FILE, JSON.stringify(newConfig, null, 2), "utf-8");
    return { success: true, config: newConfig };
  } catch (err) {
    console.error("Failed to update brand asset:", err);
    return { success: false, error: "Failed to persist asset changes." };
  }
}
