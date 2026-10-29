import fs from "fs";
import path from "path";
import {
  type PosterTemplate,
  CANONICAL_TEMPLATES,
  validateTemplateInput,
} from "./templates.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load all templates from storage or seed canonical items
 */
export function getTemplates(): PosterTemplate[] {
  ensureDataDir();

  if (!fs.existsSync(TEMPLATES_FILE)) {
    const initial = JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
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
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
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

  return { success: true };
}

/**
 * Reset storage back to canonical reference items
 */
export function resetTemplates(): void {
  const initial = JSON.parse(JSON.stringify(CANONICAL_TEMPLATES));
  saveTemplates(initial);
}
