export type ColorCategory =
  | "All Colors"
  | "Brand"
  | "Backgrounds"
  | "Text"
  | "Borders"
  | "Components";

export interface ColorTokenUsage {
  title: string;
  description: string;
  iconType: "button" | "navigation" | "link" | "control" | "badge" | "card";
}

export interface DetailedColorToken {
  id: string; // stable identifier / slug
  key: string; // canonical dot-notation token key (e.g. color.primary)
  name: string; // display name (e.g. Primary Violet)
  hex: string; // #7956C9
  category: "Brand" | "Backgrounds" | "Text" | "Borders" | "Components";
  description: string;
  isCustom?: boolean;
  usage: ColorTokenUsage[];
}

export const INITIAL_COLOR_TOKENS: DetailedColorToken[] = [
  {
    id: "primary-violet",
    key: "color.primary",
    name: "Primary Violet",
    hex: "#7956C9",
    category: "Brand",
    description: "Core brand color utilized for primary action triggers, key active states, and brand highlights.",
    usage: [
      {
        title: "Primary buttons",
        description: "Used for main actions and key CTAs.",
        iconType: "button",
      },
      {
        title: "Active navigation",
        description: "Used for selected states in navigation.",
        iconType: "navigation",
      },
      {
        title: "Interactive links",
        description: "Used for links and clickable text.",
        iconType: "link",
      },
      {
        title: "Selected controls",
        description: "Used for active states in form controls.",
        iconType: "control",
      },
    ],
  },
  {
    id: "soft-lavender",
    key: "color.lavender",
    name: "Soft Lavender",
    hex: "#E8DFF5",
    category: "Brand",
    description: "Subtle brand accent tint utilized for filter pill fills, badge backgrounds, and hover backdrops.",
    usage: [
      {
        title: "Category chips",
        description: "Used for active and selected filter pill backgrounds.",
        iconType: "badge",
      },
      {
        title: "Subtle badges",
        description: "Used for status chips and draft indicators.",
        iconType: "badge",
      },
      {
        title: "Card accents",
        description: "Soft tint for secondary callout cards and highlights.",
        iconType: "card",
      },
    ],
  },
  {
    id: "warm-ivory",
    key: "color.ivory",
    name: "Warm Ivory",
    hex: "#FAF7F2",
    category: "Backgrounds",
    description: "Neutral warm page background providing low-contrast comfort across all views.",
    usage: [
      {
        title: "Page canvas",
        description: "Global desktop and mobile screen canvas backdrop.",
        iconType: "card",
      },
      {
        title: "Container backdrops",
        description: "Soft background fill for preview frames and canvas stages.",
        iconType: "card",
      },
    ],
  },
  {
    id: "main-text",
    key: "color.text.primary",
    name: "Main Text",
    hex: "#24213A",
    category: "Text",
    description: "Deep charcoal tone engineered for optimal legibility across high-priority typography.",
    usage: [
      {
        title: "Headings",
        description: "H1 through H4 typography on light surfaces.",
        iconType: "button",
      },
      {
        title: "Body primary",
        description: "Primary copy, table text, and card titles.",
        iconType: "card",
      },
      {
        title: "Input text",
        description: "User input values and active text fields.",
        iconType: "control",
      },
    ],
  },
  {
    id: "secondary-text",
    key: "color.text.secondary",
    name: "Secondary Text",
    hex: "#777184",
    category: "Text",
    description: "Muted slate tone for supporting descriptions, metadata, placeholders, and subtle indicators.",
    usage: [
      {
        title: "Subtitles",
        description: "Supporting secondary text beneath headings.",
        iconType: "card",
      },
      {
        title: "Metadata",
        description: "Timestamps, dimensions, and author tags.",
        iconType: "badge",
      },
      {
        title: "Input placeholders",
        description: "Form control hints and empty states.",
        iconType: "control",
      },
    ],
  },
  {
    id: "border",
    key: "color.border",
    name: "Border",
    hex: "#EAE4EE",
    category: "Borders",
    description: "Delicate outline tone defining structural boundaries for panels, inputs, and card containers.",
    usage: [
      {
        title: "Card outlines",
        description: "Universal border contour on cards and panels.",
        iconType: "card",
      },
      {
        title: "Input strokes",
        description: "Border stroke on text fields and dropdowns.",
        iconType: "control",
      },
      {
        title: "Dividers",
        description: "Subtle horizontal rules separating sections.",
        iconType: "navigation",
      },
    ],
  },
];

// Color Validation & Conversion Helpers
export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

export function normalizeHex(hex: string): string {
  let clean = hex.trim();
  if (!clean.startsWith("#")) {
    clean = "#" + clean;
  }
  if (clean.length === 4) {
    clean = "#" + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
  }
  return clean.toUpperCase();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHex(hex)) return null;
  let clean = hex.trim().replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function formatRgbString(r: number, g: number, b: number): string {
  return `${r}, ${g}, ${b}`;
}

// WCAG 2.1 Relative Luminance Calculation
export function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const [sR, sG, sB] = [r, g, b].map((val) => {
    const v = val / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

export interface ContrastResult {
  ratio: number;
  ratioFormatted: string;
  meetsNormalAA: boolean; // >= 4.5:1
  meetsLargeAA: boolean; // >= 3.0:1
  meetsAAA: boolean; // >= 7.0:1
  statusText: string;
}

export function calculateContrastRatio(hex1: string, hex2: string): ContrastResult {
  const rgb1 = hexToRgb(hex1) || { r: 0, g: 0, b: 0 };
  const rgb2 = hexToRgb(hex2) || { r: 255, g: 255, b: 255 };

  const lum1 = calculateRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const rawRatio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(rawRatio * 100) / 100;
  const ratioFormatted = `${roundedRatio.toFixed(2)} : 1`;

  const meetsNormalAA = roundedRatio >= 4.5;
  const meetsLargeAA = roundedRatio >= 3.0;
  const meetsAAA = roundedRatio >= 7.0;

  let statusText = "Does not meet WCAG AA";
  if (meetsAAA) {
    statusText = "Passes WCAG AAA (Enhanced)";
  } else if (meetsNormalAA) {
    statusText = "Meets WCAG AA";
  } else if (meetsLargeAA) {
    statusText = "Meets WCAG AA (Large text only)";
  }

  return {
    ratio: roundedRatio,
    ratioFormatted,
    meetsNormalAA,
    meetsLargeAA,
    meetsAAA,
    statusText,
  };
}
