import fs from "fs";
import path from "path";
import {
  type TemplateCategoryRecord,
  type CategoryMetrics,
  CANONICAL_CATEGORIES,
  calculateCategoryMetrics,
  validateCategoryInput,
} from "./template-categories.ts";
import { getTemplates } from "./templates-storage.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const CATEGORIES_FILE = path.join(DATA_DIR, "template-categories.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Format current timestamp: "Oct 28, 2026 10:24 AM"
 */
function formatCurrentTimestamp(): string {
  const date = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const strHours = String(hours).padStart(2, "0");

  return `${month} ${day}, ${year} ${strHours}:${minutes} ${ampm}`;
}

/**
 * Generate next category ID: CAT-007, CAT-008, etc.
 */
function generateNextCategoryId(categories: TemplateCategoryRecord[]): string {
  let maxNum = 0;
  for (const c of categories) {
    const match = c.id.match(/^CAT-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const next = maxNum + 1;
  return `CAT-${String(next).padStart(3, "0")}`;
}

/**
 * Calculate dynamic template associations for each category
 */
function enhanceCategoriesWithTemplateCounts(
  categories: TemplateCategoryRecord[]
): TemplateCategoryRecord[] {
  try {
    const templates = getTemplates();
    return categories.map((cat) => {
      // Find templates created or matching this category name or id
      const matchedTemplates = templates.filter(
        (t) =>
          t.category.toLowerCase() === cat.name.toLowerCase() ||
          (t as unknown as { categoryId?: string }).categoryId === cat.id
      );

      // Return the larger of base templateCount or actual matched count
      const dynamicCount = Math.max(cat.templateCount || 0, matchedTemplates.length);
      return {
        ...cat,
        templateCount: dynamicCount,
      };
    });
  } catch {
    return categories;
  }
}

/**
 * Read categories from storage or seed defaults
 */
export function getCategories(): TemplateCategoryRecord[] {
  ensureDataDir();

  if (!fs.existsSync(CATEGORIES_FILE)) {
    const initial = JSON.parse(JSON.stringify(CANONICAL_CATEGORIES));
    try {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to seed initial categories file:", err);
    }
    return enhanceCategoriesWithTemplateCounts(initial);
  }

  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return enhanceCategoriesWithTemplateCounts(parsed);
    }
    return enhanceCategoriesWithTemplateCounts(JSON.parse(JSON.stringify(CANONICAL_CATEGORIES)));
  } catch (error) {
    console.error("Failed to read template-categories.json, returning canonical defaults:", error);
    return enhanceCategoriesWithTemplateCounts(JSON.parse(JSON.stringify(CANONICAL_CATEGORIES)));
  }
}

/**
 * Persist category records
 */
export function saveCategories(categories: TemplateCategoryRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

/**
 * Get single category by ID
 */
export function getCategoryById(id: string): TemplateCategoryRecord | null {
  const categories = getCategories();
  return categories.find((c) => c.id === id) || null;
}

/**
 * Create a new category
 */
export function createCategory(
  data: Partial<TemplateCategoryRecord>
): { success: boolean; category?: TemplateCategoryRecord; error?: string } {
  const categories = getCategories();
  const validation = validateCategoryInput(data, categories);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(" ") };
  }

  const newId = data.id || generateNextCategoryId(categories);
  const now = formatCurrentTimestamp();

  const newCategory: TemplateCategoryRecord = {
    id: newId,
    name: data.name!.trim(),
    description: data.description ? data.description.trim() : "",
    icon: data.icon || "briefcase",
    status: data.status || "Active",
    templateCount: 0,
    updatedAt: now,
    createdAt: now,
  };

  categories.push(newCategory);
  saveCategories(categories);

  return { success: true, category: newCategory };
}

/**
 * Update an existing category
 */
export function updateCategory(
  id: string,
  updates: Partial<TemplateCategoryRecord>
): { success: boolean; category?: TemplateCategoryRecord; error?: string } {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, error: `Category with ID "${id}" was not found.` };
  }

  const existing = categories[index];
  const merged: TemplateCategoryRecord = {
    ...existing,
    ...updates,
    id: existing.id, // Cannot overwrite ID
    updatedAt: formatCurrentTimestamp(),
  };

  const validation = validateCategoryInput(merged, categories, id);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(" ") };
  }

  categories[index] = merged;
  saveCategories(categories);

  return { success: true, category: merged };
}

/**
 * Archive or restore category
 */
export function toggleArchiveCategory(
  id: string
): { success: boolean; category?: TemplateCategoryRecord; error?: string } {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, error: `Category with ID "${id}" was not found.` };
  }

  const existing = categories[index];
  const newStatus = existing.status === "Active" ? "Archived" : "Active";
  const updated: TemplateCategoryRecord = {
    ...existing,
    status: newStatus,
    updatedAt: formatCurrentTimestamp(),
  };

  categories[index] = updated;
  saveCategories(categories);

  return { success: true, category: updated };
}

/**
 * Delete a category
 * Enforces business rule: if category is referenced by templates (templateCount > 0),
 * deletion is blocked with an honest dependency conflict error.
 */
export function deleteCategory(
  id: string
): { success: boolean; error?: string; conflict?: boolean } {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, error: `Category with ID "${id}" was not found.` };
  }

  const category = categories[index];

  // Check if any templates reference this category
  if (category.templateCount > 0) {
    return {
      success: false,
      conflict: true,
      error: `Category "${category.name}" cannot be deleted because it is currently used by ${category.templateCount} poster template${category.templateCount === 1 ? "" : "s"}.`,
    };
  }

  categories.splice(index, 1);
  saveCategories(categories);

  return { success: true };
}

/**
 * Reset categories to canonical baseline
 */
export function resetCategories(): void {
  const initial = JSON.parse(JSON.stringify(CANONICAL_CATEGORIES));
  saveCategories(initial);
}

/**
 * Get category summary metrics
 */
export function getCategoriesWithMetrics(): {
  categories: TemplateCategoryRecord[];
  metrics: CategoryMetrics;
} {
  const categories = getCategories();
  const metrics = calculateCategoryMetrics(categories, 18);
  return { categories, metrics };
}
