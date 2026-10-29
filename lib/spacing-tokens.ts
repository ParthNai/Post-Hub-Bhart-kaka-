export interface SpacingScaleItem {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export interface ComponentSpacingTokens {
  buttonPaddingX: number; // 16px
  buttonPaddingY: number; // 10px
  inputPaddingX: number; // 12px
  inputPaddingY: number; // 10px
  cardPadding: number; // 20px
  cardGap: number; // 12px
  formFieldGap: number; // 16px
  sectionGap: number; // 24px
}

export type RadiusKey = "none" | "small" | "medium" | "large" | "extraLarge" | "pill";

export interface BorderRadiusTokens {
  none: number; // 0px
  small: number; // 4px
  medium: number; // 8px
  large: number; // 12px
  extraLarge: number; // 16px
  pill: number; // 999px
  activeKey: RadiusKey;
}

export interface LayoutDimensionTokens {
  contentMaxWidth: number; // 1200px
  sidebarWidth: number; // 248px
  standardControlHeight: number; // 44px
  compactControlHeight: number; // 36px
  gridGutter: number; // 24px
}

export interface SpacingAndLayoutConfig {
  scale: SpacingScaleItem[];
  components: ComponentSpacingTokens;
  radii: BorderRadiusTokens;
  dimensions: LayoutDimensionTokens;
}

export const DEFAULT_SPACING_SCALE: SpacingScaleItem[] = [
  { id: "space-1", label: "Space 1", value: 4, unit: "px" },
  { id: "space-2", label: "Space 2", value: 8, unit: "px" },
  { id: "space-3", label: "Space 3", value: 12, unit: "px" },
  { id: "space-4", label: "Space 4", value: 16, unit: "px" },
  { id: "space-5", label: "Space 5", value: 24, unit: "px" },
  { id: "space-6", label: "Space 6", value: 32, unit: "px" },
  { id: "space-7", label: "Space 7", value: 48, unit: "px" },
  { id: "space-8", label: "Space 8", value: 64, unit: "px" },
];

export const DEFAULT_COMPONENT_SPACING: ComponentSpacingTokens = {
  buttonPaddingX: 16,
  buttonPaddingY: 10,
  inputPaddingX: 12,
  inputPaddingY: 10,
  cardPadding: 20,
  cardGap: 12,
  formFieldGap: 16,
  sectionGap: 24,
};

export const DEFAULT_BORDER_RADII: BorderRadiusTokens = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  extraLarge: 16,
  pill: 999,
  activeKey: "medium",
};

export const DEFAULT_LAYOUT_DIMENSIONS: LayoutDimensionTokens = {
  contentMaxWidth: 1200,
  sidebarWidth: 248,
  standardControlHeight: 44,
  compactControlHeight: 36,
  gridGutter: 24,
};

export const DEFAULT_SPACING_CONFIG: SpacingAndLayoutConfig = {
  scale: DEFAULT_SPACING_SCALE,
  components: DEFAULT_COMPONENT_SPACING,
  radii: DEFAULT_BORDER_RADII,
  dimensions: DEFAULT_LAYOUT_DIMENSIONS,
};

// Validation helpers
export function validateSpacingValue(val: number, min = 0, max = 500): boolean {
  return typeof val === "number" && !isNaN(val) && isFinite(val) && val >= min && val <= max;
}

export function validateSpacingConfig(config: SpacingAndLayoutConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const item of config.scale) {
    if (!validateSpacingValue(item.value, 1, 256)) {
      errors.push(`${item.label} must be a number between 1px and 256px.`);
    }
  }

  const { buttonPaddingX, buttonPaddingY, inputPaddingX, inputPaddingY, cardPadding, cardGap, formFieldGap, sectionGap } = config.components;
  if (!validateSpacingValue(buttonPaddingX, 0, 64)) errors.push("Button horizontal padding must be between 0 and 64px.");
  if (!validateSpacingValue(buttonPaddingY, 0, 48)) errors.push("Button vertical padding must be between 0 and 48px.");
  if (!validateSpacingValue(inputPaddingX, 0, 48)) errors.push("Input horizontal padding must be between 0 and 48px.");
  if (!validateSpacingValue(inputPaddingY, 0, 48)) errors.push("Input vertical padding must be between 0 and 48px.");
  if (!validateSpacingValue(cardPadding, 0, 80)) errors.push("Card internal padding must be between 0 and 80px.");
  if (!validateSpacingValue(cardGap, 0, 64)) errors.push("Card content gap must be between 0 and 64px.");
  if (!validateSpacingValue(formFieldGap, 0, 64)) errors.push("Form field gap must be between 0 and 64px.");
  if (!validateSpacingValue(sectionGap, 0, 120)) errors.push("Section gap must be between 0 and 120px.");

  const { contentMaxWidth, sidebarWidth, standardControlHeight, compactControlHeight, gridGutter } = config.dimensions;
  if (!validateSpacingValue(contentMaxWidth, 600, 2560)) errors.push("Content maximum width must be between 600px and 2560px.");
  if (!validateSpacingValue(sidebarWidth, 160, 400)) errors.push("Sidebar width must be between 160px and 400px.");
  if (!validateSpacingValue(standardControlHeight, 28, 72)) errors.push("Standard control height must be between 28px and 72px.");
  if (!validateSpacingValue(compactControlHeight, 20, 60)) errors.push("Compact control height must be between 20px and 60px.");
  if (!validateSpacingValue(gridGutter, 4, 64)) errors.push("Grid gutter must be between 4px and 64px.");

  return { valid: errors.length === 0, errors };
}

// Token usage metadata registry
export interface TokenUsageRef {
  token: string;
  value: string;
  usageDescription: string;
  consumers: string[];
}

export const SPACING_TOKEN_USAGE_REGISTRY: TokenUsageRef[] = [
  {
    token: "Space 1 (4px)",
    value: "4px",
    usageDescription: "Micro increments for chip padding, badge gaps, and fine alignment.",
    consumers: ["Category Chips", "Status Badges", "Icon Offsets"],
  },
  {
    token: "Space 2 (8px)",
    value: "8px",
    usageDescription: "Standard compact padding, button padding Y, and tight list item gaps.",
    consumers: ["Form Inputs", "Dropdown Options", "Sidebar Nav Items"],
  },
  {
    token: "Space 3 (12px)",
    value: "12px",
    usageDescription: "Card content gaps, toolbar item gaps, and table row spacing.",
    consumers: ["Recent Activity List", "Screen Cards", "Toolbar Controls"],
  },
  {
    token: "Space 4 (16px)",
    value: "16px",
    usageDescription: "Universal component padding, standard container gaps, and form fields.",
    consumers: ["Metric Cards", "System Status Panel", "Button Padding X"],
  },
  {
    token: "Space 5 (24px)",
    value: "24px",
    usageDescription: "Panel internal padding, section margins, and modal dialog padding.",
    consumers: ["Dashboard Main Grid", "Design System Cards", "Page Gutter"],
  },
  {
    token: "Space 6 (32px)",
    value: "32px",
    usageDescription: "Major page padding and section divisions.",
    consumers: ["Admin Header Padding", "Main Canvas Container"],
  },
  {
    token: "Corner Radius Medium",
    value: "8px",
    usageDescription: "Universal interactive element contour.",
    consumers: ["Primary & Secondary Buttons", "Text Fields", "Action Tiles"],
  },
  {
    token: "Corner Radius Extra Large",
    value: "16px",
    usageDescription: "Surface container and elevated card radius.",
    consumers: ["Dashboard Metric Cards", "Design System Overview Panels", "Preview Frames"],
  },
];

