import fs from "fs";
import path from "path";
import {
  type PosterTemplate,
  CANONICAL_TEMPLATES,
  validateTemplateInput,
} from "./templates.ts";

const DATA_DIR = path.join(process.cwd(), ".data");

export const isTestEnv =
  process.env.NODE_ENV === "test" ||
  Boolean(process.env.npm_lifecycle_event === "test") ||
  (typeof process !== "undefined" &&
    Array.isArray(process.argv) &&
    process.argv.some(
      (arg) =>
        typeof arg === "string" &&
        (arg.includes(".test.") ||
          arg.includes("tests/") ||
          arg.includes("tests\\"))
    ));

const TEMPLATES_FILE = isTestEnv
  ? path.join(DATA_DIR, "templates.test.json")
  : path.join(DATA_DIR, "templates.json");

const CUSTOM_TEMPLATES_FILE = path.join(DATA_DIR, "custom-templates.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load custom templates from custom-templates.json (for runtime persistence)
 */
function getCustomTemplates(): PosterTemplate[] {
  if (isTestEnv) return [];
  ensureDataDir();
  if (!fs.existsSync(CUSTOM_TEMPLATES_FILE)) return [];
  try {
    const raw = fs.readFileSync(CUSTOM_TEMPLATES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist custom templates to custom-templates.json
 */
function persistCustomTemplates(templates: PosterTemplate[]): void {
  if (isTestEnv) return;
  ensureDataDir();
  const canonicalIds = new Set(CANONICAL_TEMPLATES.map((c) => c.id));
  const custom = templates.filter((t) => !canonicalIds.has(t.id));
  try {
    fs.writeFileSync(CUSTOM_TEMPLATES_FILE, JSON.stringify(custom, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist custom templates:", err);
  }
}

/**
 * Load all templates from storage or seed canonical items
 */
export function getTemplates(): PosterTemplate[] {
  ensureDataDir();

  if (!fs.existsSync(TEMPLATES_FILE)) {
    const initial = JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
    if (!isTestEnv) {
      const custom = getCustomTemplates();
      for (const ct of custom) {
        if (!initial.some((t: PosterTemplate) => t.id === ct.id)) {
          initial.unshift(ct);
        }
      }
    }
    try {
      fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to seed initial templates file:", err);
    }
    return initial;
  }

  try {
    const raw = fs.readFileSync(TEMPLATES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    let list: PosterTemplate[] =
      Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));

    if (!isTestEnv) {
      const custom = getCustomTemplates();
      let modified = false;
      for (const ct of custom) {
        const idx = list.findIndex((t) => t.id === ct.id);
        if (idx === -1) {
          list.unshift(ct);
          modified = true;
        }
      }
      if (modified) {
        try {
          fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(list, null, 2), "utf-8");
        } catch {}
      }
    }

    return list;
  } catch (error) {
    console.error("Failed to read templates.json, returning canonical defaults:", error);
    return JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
  }
}

/**
 * Persist template list to storage
 */
export function saveTemplates(templates: PosterTemplate[]): void {
  ensureDataDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), "utf-8");
  if (!isTestEnv) {
    persistCustomTemplates(templates);
  }
}

/**
 * Get single template by ID
 */
export function getTemplateById(id: string): PosterTemplate | null {
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Helper to generate next template ID: TPL-009, TPL-010, etc.
 */
function generateNextId(templates: PosterTemplate[]): string {
  let maxNum = 0;
  for (const t of templates) {
    const match = t.id.match(/^TPL-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const next = maxNum + 1;
  return `TPL-${String(next).padStart(3, "0")}`;
}

/**
 * Helper to format current date: "Apr 29, 2026"
 */
function formatCurrentDate(): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  return `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, "0")}, ${now.getFullYear()}`;
}

/**
 * Create a new template
 */
export function createTemplate(
  data: Omit<PosterTemplate, "id" | "updatedAt" | "fileSize" | "aspectRatio"> & {
    id?: string;
    fileSize?: string;
    aspectRatio?: string;
  }
): { success: boolean; template?: PosterTemplate; error?: string } {
  const validation = validateTemplateInput(data);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(" ") };
  }

  const templates = getTemplates();
  const newId = data.id || generateNextId(templates);

  // Check unique ID
  if (templates.some((t) => t.id === newId)) {
    return { success: false, error: `Template with ID "${newId}" already exists.` };
  }

  const newTemplate: PosterTemplate = {
    id: newId,
    name: data.name.trim(),
    category: data.category || "Business",
    format: data.format || "3:4",
    status: data.status || "Draft",
    updatedAt: formatCurrentDate(),
    fileSize: data.fileSize || "240 KB",
    description: data.description ? data.description.trim() : "Custom poster template created in Post Hub Admin.",
    theme: data.theme || "custom-theme",
    headline: data.headline || data.name.trim(),
    subheadline: data.subheadline || "Custom Headline",
    ctaText: data.ctaText || "Learn More",
    primaryColor: data.primaryColor || "#7956C9",
    accentColor: data.accentColor || "#6846B5",
    tags: data.tags || [data.category || "Business", "Poster"],
    aspectRatio: data.format || "3:4",
    assetFileName: data.assetFileName || `${newId.toLowerCase()}-poster.jpg`,
    assetDimensions: data.assetDimensions || "1024 × 1365 px",
    editableTextFields: data.editableTextFields || ["Title", "Subtitle"],
    textColours: data.textColours || ["#1E3A8A", "#7956C9", "#24213A", "#FFFFFF"],
    fontSelection: data.fontSelection || "Poppins",
    imageSlots: data.imageSlots || ["Main Image", "Logo"],
    alignment: data.alignment || "Center",
    backgroundImageUrl: data.backgroundImageUrl,
    slotZones: data.slotZones,
  };

  templates.unshift(newTemplate);
  saveTemplates(templates);

  return { success: true, template: newTemplate };
}

/**
 * Update an existing template
 */
export function updateTemplate(
  id: string,
  updates: Partial<PosterTemplate>
): { success: boolean; template?: PosterTemplate; error?: string } {
  const validation = validateTemplateInput(updates);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(" ") };
  }

  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  const existing = templates[index];
  const updated: PosterTemplate = {
    ...existing,
    ...updates,
    id: existing.id, // ID cannot be overwritten
    updatedAt: formatCurrentDate(),
    aspectRatio: updates.format || existing.format,
  };

  templates[index] = updated;
  saveTemplates(templates);

  return { success: true, template: updated };
}

/**
 * Publish template (sets status: "Published")
 */
export function publishTemplate(id: string): {
  success: boolean;
  template?: PosterTemplate;
  error?: string;
} {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  const existing = templates[index];
  const updated: PosterTemplate = {
    ...existing,
    status: "Published",
    updatedAt: formatCurrentDate(),
  };

  templates[index] = updated;
  saveTemplates(templates);

  return { success: true, template: updated };
}

/**
 * Replace template asset
 */
export function replaceTemplateAsset(
  id: string,
  asset: { fileName: string; dimensions?: string; fileSize?: string; url?: string }
): { success: boolean; template?: PosterTemplate; error?: string } {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  const existing = templates[index];
  const updated: PosterTemplate = {
    ...existing,
    assetFileName: asset.fileName,
    assetDimensions: asset.dimensions || existing.assetDimensions,
    fileSize: asset.fileSize || existing.fileSize,
    assetUrl: asset.url || existing.assetUrl,
    updatedAt: formatCurrentDate(),
  };

  templates[index] = updated;
  saveTemplates(templates);

  return { success: true, template: updated };
}

/**
 * Duplicate a template
 */
export function duplicateTemplate(id: string): {
  success: boolean;
  template?: PosterTemplate;
  error?: string;
} {
  const templates = getTemplates();
  const source = templates.find((t) => t.id === id);
  if (!source) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  const newId = generateNextId(templates);
  const duplicate: PosterTemplate = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    status: "Draft",
    updatedAt: formatCurrentDate(),
  };

  templates.splice(templates.indexOf(source) + 1, 0, duplicate);
  saveTemplates(templates);

  return { success: true, template: duplicate };
}

/**
 * Toggle Archive status
 */
export function toggleArchiveTemplate(id: string): {
  success: boolean;
  template?: PosterTemplate;
  error?: string;
} {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  const existing = templates[index];
  const newStatus = existing.status === "Archived" ? "Draft" : "Archived";
  const updated: PosterTemplate = {
    ...existing,
    status: newStatus,
    updatedAt: formatCurrentDate(),
  };

  templates[index] = updated;
  saveTemplates(templates);

  return { success: true, template: updated };
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string): {
  success: boolean;
  error?: string;
} {
  const templates = getTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) {
    return { success: false, error: `Template with ID "${id}" was not found.` };
  }

  templates.splice(index, 1);
  saveTemplates(templates);

  if (!isTestEnv) {
    const custom = getCustomTemplates().filter((t) => t.id !== id);
    try {
      fs.writeFileSync(CUSTOM_TEMPLATES_FILE, JSON.stringify(custom, null, 2), "utf-8");
    } catch {}
  }

  return { success: true };
}

/**
 * Reset storage back to canonical reference items
 */
export function resetTemplates(forceWipeAll: boolean = false): void {
  const canonical = JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
  if (isTestEnv || forceWipeAll) {
    saveTemplates(canonical);
  } else {
    const custom = getCustomTemplates();
    const merged = [...custom, ...canonical];
    saveTemplates(merged);
  }
}
