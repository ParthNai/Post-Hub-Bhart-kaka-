import fs from "fs";
import path from "path";
import type {
  AiPromptPreset,
  AiGlobalPromptRules,
  AiPresetMetrics,
  AiPresetFilterOptions,
} from "./ai-presets";

const DATA_DIR = path.join(process.cwd(), ".data");
const PRESETS_FILE = path.join(DATA_DIR, "ai-presets.json");
const GLOBAL_RULES_FILE = path.join(DATA_DIR, "ai-global-rules.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Canonical 12 presets exactly matching Screen 20
export const CANONICAL_PRESETS: AiPromptPreset[] = [
  {
    id: "PST-001",
    name: "Diwali Festival",
    category: "Festivals",
    description: "Traditional Diwali poster with warm colors.",
    basePrompt: "Vibrant traditional Diwali celebration poster with glowing clay diyas, golden sparkles, ornamental mandalas, and festive warm ambient illumination.",
    designStyle: "Festive, warm, golden glow, rich Indian cultural motifs",
    typographyGuidance: "Elegant festive serif headings with clean modern subtexts",
    colorGuidance: "Deep maroon, festive gold #D4AF37, glowing amber, rich warm accents",
    defaultAspectRatio: "1:1",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Color Scheme"],
    createdAt: "Oct 10, 2026 10:00 AM",
    updatedAt: "Oct 28, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "diwali",
  },
  {
    id: "PST-002",
    name: "Business Growth",
    category: "Business",
    description: "Professional business growth poster.",
    basePrompt: "Corporate business growth banner featuring upward financial trend graphics, modern office executive, subtle isometric charts, and glass architecture.",
    designStyle: "Corporate modern, minimal, sharp lines, confident tech aesthetic",
    typographyGuidance: "Bold geometric sans-serif (Inter/Poppins) with strong visual hierarchy",
    colorGuidance: "Deep navy blue #1E3A8A, electric cyan #06B6D4, clean crisp white",
    defaultAspectRatio: "4:5",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Typography", "Color Scheme"],
    createdAt: "Oct 12, 2026 11:30 AM",
    updatedAt: "Oct 26, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "business",
  },
  {
    id: "PST-003",
    name: "Education Admission",
    category: "Education",
    description: "School/college admission poster.",
    basePrompt: "Modern educational institute admission announcement poster with smiling diverse students holding notebooks, university campus backdrop, and achievement badges.",
    designStyle: "Inspiring, friendly, structured academic feel with bright accents",
    typographyGuidance: "High-contrast bold headline with readable friendly body copy",
    colorGuidance: "Academic royal blue #2563EB, sunshine yellow #FBBF24, soft ivory",
    defaultAspectRatio: "3:4",
    defaultFormat: "PNG, JPG",
    status: "draft",
    associatedRules: ["Base Prompt", "Typography"],
    createdAt: "Oct 14, 2026 02:15 PM",
    updatedAt: "Oct 24, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "education",
  },
  {
    id: "PST-004",
    name: "Summer Sale",
    category: "Offers",
    description: "Summer sale promotional poster.",
    basePrompt: "Sunny summer seasonal mega discount poster with tropical palm shadows, sunburst rays, modern beach elements, bold percentage badges, and sunglasses.",
    designStyle: "High energy, sunny tropical vibe, vibrant promotional layout",
    typographyGuidance: "Chunky bold display typography for sale discounts and percentages",
    colorGuidance: "Coral orange #F97316, radiant yellow #FDE047, teal turquoise #0D9488",
    defaultAspectRatio: "4:5",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Color Scheme"],
    createdAt: "Oct 15, 2026 09:00 AM",
    updatedAt: "Oct 22, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "sale",
  },
  {
    id: "PST-005",
    name: "New Year 2026",
    category: "Events",
    description: "New year celebration poster.",
    basePrompt: "Glamorous New Year 2026 celebration banner with explosive golden fireworks, luxury champagne shimmer, dark night sky, and 3D metallic typography.",
    designStyle: "Luxury celebration, dark mode backdrop with golden particle shimmer",
    typographyGuidance: "Grand metallic 3D serif typography with sparkling accents",
    colorGuidance: "Midnight obsidian #09090B, champagne gold #EAB308, rose gold accents",
    defaultAspectRatio: "1:1",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Typography", "Color Scheme"],
    createdAt: "Oct 16, 2026 04:45 PM",
    updatedAt: "Oct 20, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "newyear",
  },
  {
    id: "PST-006",
    name: "Product Launch",
    category: "Product",
    description: "Product launch poster.",
    basePrompt: "Sleek studio product showcase featuring modern wireless headphones floating in soft ambient lighting, clean pedestal, and minimalist shadows.",
    designStyle: "Studio minimalist, premium industrial design, soft depth of field",
    typographyGuidance: "Ultra-clean modern sans-serif with generous tracking and letter spacing",
    colorGuidance: "Matte graphite #27272A, warm studio beige #E7E5E4, pure white",
    defaultAspectRatio: "3:4",
    defaultFormat: "PNG, JPG",
    status: "archived",
    associatedRules: ["Base Prompt", "Design Style"],
    createdAt: "Oct 17, 2026 01:20 PM",
    updatedAt: "Oct 18, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "product",
  },
  {
    id: "PST-007",
    name: "Social Media Post",
    category: "Social Media",
    description: "Engaging social media post.",
    basePrompt: "Dynamic social media engagement post with floating interactive 3D app icons (like, share, heart, speech bubbles), gradient curves, and cheerful composition.",
    designStyle: "Trendy 3D claymorphism and playful vibrant vectors",
    typographyGuidance: "Punchy, modern, mobile-optimized high legibility bold type",
    colorGuidance: "Instagram purple #833AB4, vibrant coral #FD1D1D, bright sunburst yellow",
    defaultAspectRatio: "1:1",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Color Scheme"],
    createdAt: "Oct 18, 2026 10:10 AM",
    updatedAt: "Oct 16, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "social",
  },
  {
    id: "PST-008",
    name: "Corporate Design",
    category: "Business",
    description: "Corporate announcement poster.",
    basePrompt: "Authoritative corporate announcement poster with angled glass skyscraper facade reaching towards clear blue sky, clean branding bar, and refined grid structure.",
    designStyle: "Executive, trustworthy architectural corporate layout",
    typographyGuidance: "Authoritative serif or grotesque sans with structured metadata headers",
    colorGuidance: "Steel corporate blue #0369A1, slate grey #475569, crisp white",
    defaultAspectRatio: "4:5",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Typography"],
    createdAt: "Oct 18, 2026 03:00 PM",
    updatedAt: "Oct 15, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "corporate",
  },
  {
    id: "PST-009",
    name: "Restaurant Menu",
    category: "Offers",
    description: "Delicious dining & gourmet promotion poster.",
    basePrompt: "Artisan gourmet restaurant promotion poster with beautifully plated dish, rustic wooden table texture, fresh culinary herbs, and warm restaurant atmosphere.",
    designStyle: "Rustic elegance, mouth-watering warm food photography style",
    typographyGuidance: "Handcrafted serif with sophisticated menu typography",
    colorGuidance: "Rich burgundy #881337, olive green #4D7C0F, warm parchment #FEF3C7",
    defaultAspectRatio: "3:4",
    defaultFormat: "PNG, JPG",
    status: "draft",
    associatedRules: ["Base Prompt", "Color Scheme"],
    createdAt: "Oct 19, 2026 11:00 AM",
    updatedAt: "Oct 12, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "food",
  },
  {
    id: "PST-010",
    name: "Healthcare Clinic",
    category: "Healthcare",
    description: "Medical clinic & wellness checkup poster.",
    basePrompt: "Professional healthcare and medical wellness clinic poster with caring medical doctor, high-tech stethoscope, clean hospital setting, and trust badge.",
    designStyle: "Clean clinical, reassuring, empathetic and hygienic atmosphere",
    typographyGuidance: "Clean humanist sans-serif with calming hierarchy",
    colorGuidance: "Medical cyan #0EA5E9, tranquil mint #10B981, soft sterile white",
    defaultAspectRatio: "4:5",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Color Scheme"],
    createdAt: "Oct 19, 2026 02:30 PM",
    updatedAt: "Oct 10, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "health",
  },
  {
    id: "PST-011",
    name: "Real Estate Modern",
    category: "Real Estate",
    description: "Luxury property & architecture showcase.",
    basePrompt: "Luxury residential real estate showcase poster featuring two-story modern architectural villa with infinity pool, twilight warm interior lighting, and manicured lawn.",
    designStyle: "High-end luxury real estate, dramatic twilight lighting",
    typographyGuidance: "Refined luxury architectural typography with understated price tag",
    colorGuidance: "Sophisticated charcoal #18181B, warm golden amber #D97706, clean white",
    defaultAspectRatio: "3:4",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Typography", "Color Scheme"],
    createdAt: "Oct 20, 2026 09:15 AM",
    updatedAt: "Oct 08, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "realestate",
  },
  {
    id: "PST-012",
    name: "Tech Conference 2026",
    category: "Events",
    description: "Annual technology summit & keynote poster.",
    basePrompt: "Futuristic artificial intelligence and technology summit poster with glowing neural network nodes, deep purple holographic lights, and stage auditorium backdrop.",
    designStyle: "Cyberpunk high-tech, futuristic neon gradient and digital waves",
    typographyGuidance: "Futuristic sci-fi display font for keynote title and speaker list",
    colorGuidance: "Post Hub purple #7956C9, electric violet #8B5CF6, deep space black",
    defaultAspectRatio: "9:16",
    defaultFormat: "PNG, JPG",
    status: "active",
    associatedRules: ["Base Prompt", "Design Style", "Color Scheme"],
    createdAt: "Oct 20, 2026 01:45 PM",
    updatedAt: "Oct 05, 2026",
    createdBy: "Parth Patel",
    thumbnailType: "tech",
  },
];

// Canonical Global Rules matching Screen 20 text exactly
export const CANONICAL_GLOBAL_RULES: AiGlobalPromptRules = {
  basePromptInstructions:
    "Create a professional, high-quality poster with clean design, modern typography and attractive visuals.",
  designStyleInstructions: "Use a clean and premium design style.",
  typographyGuidance: "Use clear and bold fonts, modern and readable.",
  colorGuidance: "Use brand colors: purple, white and elegant tones.",
  layoutGuidance: "Ensure clear visual hierarchy, balanced negative space, and mobile-friendly focus points.",
  negativePrompts: "blurry, low quality, distorted text, ugly faces, extra limbs, watermark, artifacts, pixelated",
  updatedAt: "Oct 28, 2026 04:32 PM",
  updatedBy: "Parth Patel",
};

/**
 * Read presets from JSON storage or initialize with canonical presets
 */
export function getAllPresets(): AiPromptPreset[] {
  ensureDataDir();
  if (!fs.existsSync(PRESETS_FILE)) {
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(CANONICAL_PRESETS, null, 2), "utf-8");
    return [...CANONICAL_PRESETS];
  }
  try {
    const raw = fs.readFileSync(PRESETS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(CANONICAL_PRESETS, null, 2), "utf-8");
    return [...CANONICAL_PRESETS];
  } catch (err) {
    console.error("Error reading presets file, falling back to canonical:", err);
    return [...CANONICAL_PRESETS];
  }
}

/**
 * Save presets to JSON storage
 */
export function saveAllPresets(presets: AiPromptPreset[]): void {
  ensureDataDir();
  fs.writeFileSync(PRESETS_FILE, JSON.stringify(presets, null, 2), "utf-8");
}

/**
 * Read global prompt rules from JSON storage
 */
export function getGlobalRules(): AiGlobalPromptRules {
  ensureDataDir();
  if (!fs.existsSync(GLOBAL_RULES_FILE)) {
    fs.writeFileSync(GLOBAL_RULES_FILE, JSON.stringify(CANONICAL_GLOBAL_RULES, null, 2), "utf-8");
    return { ...CANONICAL_GLOBAL_RULES };
  }
  try {
    const raw = fs.readFileSync(GLOBAL_RULES_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.basePromptInstructions) {
      return data;
    }
    fs.writeFileSync(GLOBAL_RULES_FILE, JSON.stringify(CANONICAL_GLOBAL_RULES, null, 2), "utf-8");
    return { ...CANONICAL_GLOBAL_RULES };
  } catch (err) {
    console.error("Error reading global rules, falling back to canonical:", err);
    return { ...CANONICAL_GLOBAL_RULES };
  }
}

/**
 * Save global prompt rules to JSON storage
 */
export function saveGlobalRules(rules: Partial<AiGlobalPromptRules>, updatedBy: string = "Parth Patel"): AiGlobalPromptRules {
  ensureDataDir();
  const current = getGlobalRules();
  const updated: AiGlobalPromptRules = {
    ...current,
    ...rules,
    updatedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " " + new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedBy,
  };
  fs.writeFileSync(GLOBAL_RULES_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/**
 * Calculate KPI Metrics
 */
export function getPresetMetrics(presets?: AiPromptPreset[]): AiPresetMetrics {
  const list = presets || getAllPresets();
  const total = list.length;
  const active = list.filter((p) => p.status === "active").length;
  const draft = list.filter((p) => p.status === "draft").length;
  const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

  return {
    totalPresets: total,
    activePresets: active,
    activePercentage: `${percentage}% of total`,
    draftPresets: draft,
    defaultPromptRules: 1, // Global rules set
  };
}

/**
 * Filter and sort presets
 */
export function filterPresets(
  presets: AiPromptPreset[],
  options: AiPresetFilterOptions
): AiPromptPreset[] {
  let result = [...presets];

  if (options.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  if (options.category && options.category !== "All" && options.category !== "All Categories") {
    result = result.filter(
      (p) => p.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options.status && options.status !== "All" && options.status !== "All Statuses") {
    result = result.filter(
      (p) => p.status.toLowerCase() === options.status?.toLowerCase()
    );
  }

  if (options.sortBy === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options.sortBy === "category") {
    result.sort((a, b) => a.category.localeCompare(b.category));
  } else {
    // Default: prioritize canonical order or id
    // Maintain list order or ID order
  }

  return result;
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): AiPromptPreset | undefined {
  const presets = getAllPresets();
  return presets.find((p) => p.id === id);
}

/**
 * Create a new Preset
 */
export function createPreset(
  presetData: Omit<AiPromptPreset, "id" | "createdAt" | "updatedAt">,
  adminName: string = "Parth Patel"
): AiPromptPreset {
  const presets = getAllPresets();
  const maxNum = presets.reduce((max, p) => {
    const match = p.id.match(/PST-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);

  const nextId = `PST-${String(maxNum + 1).padStart(3, "0")}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newPreset: AiPromptPreset = {
    ...presetData,
    id: nextId,
    createdAt: `${dateStr} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    updatedAt: dateStr,
    createdBy: adminName,
  };

  presets.unshift(newPreset);
  saveAllPresets(presets);
  return newPreset;
}

/**
 * Update an existing Preset
 */
export function updatePreset(
  id: string,
  updates: Partial<AiPromptPreset>
): AiPromptPreset | null {
  const presets = getAllPresets();
  const index = presets.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const updated: AiPromptPreset = {
    ...presets[index],
    ...updates,
    id, // Preserve id
    updatedAt: dateStr,
  };

  presets[index] = updated;
  saveAllPresets(presets);
  return updated;
}

/**
 * Duplicate a Preset
 */
export function duplicatePreset(id: string, adminName: string = "Parth Patel"): AiPromptPreset | null {
  const presets = getAllPresets();
  const original = presets.find((p) => p.id === id);
  if (!original) return null;

  const maxNum = presets.reduce((max, p) => {
    const match = p.id.match(/PST-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);

  const nextId = `PST-${String(maxNum + 1).padStart(3, "0")}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const duplicated: AiPromptPreset = {
    ...original,
    id: nextId,
    name: `${original.name} (Copy)`,
    status: "draft",
    createdAt: `${dateStr} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    updatedAt: dateStr,
    createdBy: adminName,
  };

  presets.unshift(duplicated);
  saveAllPresets(presets);
  return duplicated;
}

/**
 * Toggle Preset status between active and draft
 */
export function togglePresetStatus(id: string): AiPromptPreset | null {
  const presets = getAllPresets();
  const index = presets.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = presets[index];
  const newStatus = current.status === "active" ? "draft" : "active";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  presets[index] = {
    ...current,
    status: newStatus,
    updatedAt: dateStr,
  };

  saveAllPresets(presets);
  return presets[index];
}

/**
 * Archive Preset
 */
export function archivePreset(id: string): AiPromptPreset | null {
  const presets = getAllPresets();
  const index = presets.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  presets[index] = {
    ...presets[index],
    status: "archived",
    updatedAt: dateStr,
  };

  saveAllPresets(presets);
  return presets[index];
}

/**
 * Delete Preset
 */
export function deletePreset(id: string): boolean {
  const presets = getAllPresets();
  const filtered = presets.filter((p) => p.id !== id);
  if (filtered.length === presets.length) return false;

  saveAllPresets(filtered);
  return true;
}

/**
 * Reset Presets & Rules back to Canonical state
 */
export function resetAiPresets(): { presets: AiPromptPreset[]; globalRules: AiGlobalPromptRules } {
  saveAllPresets(CANONICAL_PRESETS);
  ensureDataDir();
  fs.writeFileSync(GLOBAL_RULES_FILE, JSON.stringify(CANONICAL_GLOBAL_RULES, null, 2), "utf-8");
  return {
    presets: [...CANONICAL_PRESETS],
    globalRules: { ...CANONICAL_GLOBAL_RULES },
  };
}
