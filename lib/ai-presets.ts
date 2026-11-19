export type AiPresetStatus = "active" | "draft" | "archived";

export type AiPresetCategory =
  | "Festivals"
  | "Business"
  | "Education"
  | "Offers"
  | "Events"
  | "Product"
  | "Social Media"
  | "Healthcare"
  | "Real Estate";

export interface AiPromptPreset {
  id: string; // e.g., "PST-001"
  name: string; // e.g., "Diwali Festival"
  category: AiPresetCategory;
  description: string;
  basePrompt: string;
  designStyle: string;
  typographyGuidance: string;
  colorGuidance: string;
  defaultAspectRatio: string; // "1:1", "4:5", "9:16", "3:4"
  defaultFormat: string; // "PNG, JPG"
  status: AiPresetStatus;
  associatedRules: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  thumbnailType:
    | "diwali"
    | "business"
    | "education"
    | "sale"
    | "newyear"
    | "product"
    | "social"
    | "corporate"
    | "health"
    | "realestate"
    | "food"
    | "tech";
}

export interface AiGlobalPromptRules {
  basePromptInstructions: string;
  designStyleInstructions: string;
  typographyGuidance: string;
  colorGuidance: string;
  layoutGuidance?: string;
  negativePrompts?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AiPresetMetrics {
  totalPresets: number;
  activePresets: number;
  activePercentage: string;
  draftPresets: number;
  defaultPromptRules: number;
}

export interface AiPresetFilterOptions {
  query?: string;
  category?: string;
  status?: string;
  sortBy?: "updatedAt" | "name" | "category";
}

/**
 * Prompt Composition Engine:
 * Deterministically combines user prompt with applicable preset rules and global rules
 */
export function composeAiPrompt(
  userPrompt: string,
  preset?: AiPromptPreset | null,
  globalRules?: AiGlobalPromptRules | null
): {
  composedPrompt: string;
  appliedRules: string[];
  estimatedTokens: number;
} {
  const parts: string[] = [];
  const applied: string[] = [];

  // 1. User core prompt
  if (userPrompt && userPrompt.trim().length > 0) {
    parts.push(`Subject: ${userPrompt.trim()}`);
    applied.push("User Custom Prompt");
  }

  // 2. Preset Base Prompt & Instructions
  if (preset) {
    if (preset.basePrompt) {
      parts.push(preset.basePrompt);
      applied.push(`Preset: ${preset.name}`);
    }
    if (preset.designStyle) {
      parts.push(`Style: ${preset.designStyle}`);
      applied.push("Preset Design Style");
    }
    if (preset.typographyGuidance) {
      parts.push(`Typography: ${preset.typographyGuidance}`);
      applied.push("Preset Typography");
    }
    if (preset.colorGuidance) {
      parts.push(`Color Palette: ${preset.colorGuidance}`);
      applied.push("Preset Color Palette");
    }
  }

  // 3. Global Prompt Rules
  if (globalRules) {
    if (globalRules.basePromptInstructions) {
      parts.push(globalRules.basePromptInstructions);
      applied.push("Global Base Instructions");
    }
    if (globalRules.designStyleInstructions && (!preset || !preset.designStyle)) {
      parts.push(`Style: ${globalRules.designStyleInstructions}`);
      applied.push("Global Style Guidance");
    }
    if (globalRules.typographyGuidance && (!preset || !preset.typographyGuidance)) {
      parts.push(`Typography: ${globalRules.typographyGuidance}`);
      applied.push("Global Typography");
    }
    if (globalRules.colorGuidance && (!preset || !preset.colorGuidance)) {
      parts.push(`Colors: ${globalRules.colorGuidance}`);
      applied.push("Global Color Guidance");
    }
  }

  const composedPrompt = parts.join(". ");
  // Approximate 4 chars per token
  const estimatedTokens = Math.ceil(composedPrompt.length / 4);

  return {
    composedPrompt,
    appliedRules: applied,
    estimatedTokens,
  };
}
