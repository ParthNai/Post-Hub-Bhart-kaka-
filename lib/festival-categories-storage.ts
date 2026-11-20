/**
 * Persistent Storage Engine for Screen 37: Festival & Event Categories Management
 * Persists data in `.data/festival-categories.json` and connects with `.data/festivals.json`
 */

import fs from "fs/promises";
import path from "path";
import {
  type FestivalCategoriesDataset,
  type FestivalCategory,
  type CategoryDisplaySettings,
  type CategoryAuditEntry,
  CANONICAL_FESTIVAL_CATEGORIES_DATASET,
  recalculateCategoryMetrics,
} from "./festival-categories.ts";
import { getFestivalsDataset, saveFestivalsDataset } from "./festivals-storage.ts";
import { type FestivalEvent } from "./festivals.ts";

const STORAGE_FILE = path.join(process.cwd(), ".data", "festival-categories.json");

/**
 * Loads the festival categories dataset from disk or initializes with canonical seed
 */
export async function getFestivalCategoriesDataset(): Promise<FestivalCategoriesDataset> {
  let dataset: FestivalCategoriesDataset;
  try {
    const raw = await fs.readFile(STORAGE_FILE, "utf-8");
    dataset = JSON.parse(raw) as FestivalCategoriesDataset;
  } catch {
    dataset = JSON.parse(JSON.stringify(CANONICAL_FESTIVAL_CATEGORIES_DATASET)) as FestivalCategoriesDataset;
    await saveFestivalCategoriesDataset(dataset);
  }

  // Cross-reference live event counts from festivals storage
  try {
    const festivalsData = await getFestivalsDataset();
    const liveEvents = festivalsData.events;

    dataset.categories = dataset.categories.map((cat) => {
      const matchingCount = liveEvents.filter(
        (e) =>
          e.category?.toLowerCase() === cat.type.toLowerCase() ||
          e.category?.toLowerCase() === cat.name.toLowerCase() ||
          cat.name.toLowerCase().includes(e.category?.toLowerCase() || "")
      ).length;

      // Keep canonical count if event database is at base size, else use live count
      const computedCount = matchingCount > 0 ? matchingCount : cat.eventCount;
      return {
        ...cat,
        eventCount: cat.status === "Inactive" && cat.id === "CAT-FEST-009" ? 0 : computedCount,
      };
    });

    dataset.summary = recalculateCategoryMetrics(dataset.categories, liveEvents);
  } catch {
    dataset.summary = recalculateCategoryMetrics(dataset.categories);
  }

  return dataset;
}

/**
 * Persists festival categories dataset to disk
 */
export async function saveFestivalCategoriesDataset(
  dataset: FestivalCategoriesDataset
): Promise<void> {
  const dir = path.dirname(STORAGE_FILE);
  await fs.mkdir(dir, { recursive: true });

  dataset.summary = recalculateCategoryMetrics(dataset.categories);
  dataset.lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await fs.writeFile(STORAGE_FILE, JSON.stringify(dataset, null, 2), "utf-8");
}

/**
 * Creates a new festival category
 */
export async function createFestivalCategory(
  input: Partial<FestivalCategory>
): Promise<FestivalCategory> {
  const dataset = await getFestivalCategoriesDataset();

  if (!input.name || input.name.trim().length === 0) {
    throw new Error("Category name is required.");
  }

  const generatedSlug =
    input.slug?.trim() ||
    input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Duplicate slug check
  if (dataset.categories.some((c) => c.slug.toLowerCase() === generatedSlug.toLowerCase())) {
    throw new Error(`Category slug '${generatedSlug}' already exists. Please choose a unique slug.`);
  }

  const id = `CAT-FEST-${Date.now().toString().slice(-4)}`;
  const priority = input.displayPriority ?? dataset.categories.length + 1;

  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const newCategory: FestivalCategory = {
    id,
    name: input.name.trim(),
    slug: generatedSlug,
    description: input.description?.trim() || "Event category for festival poster templates.",
    type: input.type || "Special",
    icon: input.icon || "star",
    displayColor: input.displayColor || "#7956C9",
    displayPriority: priority,
    status: input.status || "Active",
    isFeatured: input.isFeatured ?? false,
    isAppVisible: input.isAppVisible ?? true,
    isWebsiteVisible: input.isWebsiteVisible ?? true,
    supportedLanguages: input.supportedLanguages || ["All Languages", "English", "Hindi"],
    translations: input.translations,
    eventCount: 0,
    createdAt: nowFormatted,
    updatedAt: nowFormatted,
    createdBy: "Parth Admin",
    updatedBy: "Parth Admin",
  };

  dataset.categories.push(newCategory);

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: id,
    categoryName: newCategory.name,
    action: "Category Created",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Created new category '${newCategory.name}' with priority ${newCategory.displayPriority}.`,
    updatedData: { ...newCategory },
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return newCategory;
}

/**
 * Updates an existing festival category
 */
export async function updateFestivalCategory(
  id: string,
  input: Partial<FestivalCategory>
): Promise<FestivalCategory> {
  const dataset = await getFestivalCategoriesDataset();
  const index = dataset.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Category with ID '${id}' not found.`);
  }

  const existing = dataset.categories[index];

  // Slug uniqueness check if slug is changing
  if (input.slug && input.slug.toLowerCase() !== existing.slug.toLowerCase()) {
    const slugExists = dataset.categories.some(
      (c) => c.id !== id && c.slug.toLowerCase() === input.slug!.toLowerCase()
    );
    if (slugExists) {
      throw new Error(`Category slug '${input.slug}' is already in use by another category.`);
    }
  }

  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const updated: FestivalCategory = {
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: nowFormatted,
    updatedBy: "Parth Admin",
  };

  dataset.categories[index] = updated;

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: updated.id,
    categoryName: updated.name,
    action: "Category Updated",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Updated category '${updated.name}' metadata and settings.`,
    previousData: { ...existing },
    updatedData: { ...updated },
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return updated;
}

/**
 * Deletes a category safely with dependency check
 */
export async function deleteFestivalCategory(
  id: string,
  reassignToId?: string
): Promise<{ success: boolean; message: string }> {
  const dataset = await getFestivalCategoriesDataset();
  const category = dataset.categories.find((c) => c.id === id);

  if (!category) {
    throw new Error(`Category with ID '${id}' not found.`);
  }

  // Check event dependencies
  const festivalsData = await getFestivalsDataset();
  const associatedEvents = festivalsData.events.filter(
    (e) =>
      e.category?.toLowerCase() === category.type.toLowerCase() ||
      e.category?.toLowerCase() === category.name.toLowerCase()
  );

  if (associatedEvents.length > 0) {
    if (!reassignToId) {
      throw new Error(
        `Category '${category.name}' has ${associatedEvents.length} associated events. Please reassign them before deleting.`
      );
    }

    const targetCategory = dataset.categories.find((c) => c.id === reassignToId);
    if (!targetCategory) {
      throw new Error(`Reassignment target category '${reassignToId}' does not exist.`);
    }

    // Reassign events
    festivalsData.events = festivalsData.events.map((e) => {
      if (
        e.category?.toLowerCase() === category.type.toLowerCase() ||
        e.category?.toLowerCase() === category.name.toLowerCase()
      ) {
        return {
          ...e,
          category: targetCategory.type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        };
      }
      return e;
    });

    await saveFestivalsDataset(festivalsData);
  }

  dataset.categories = dataset.categories.filter((c) => c.id !== id);

  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: category.id,
    categoryName: category.name,
    action: "Category Deleted",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Deleted category '${category.name}'. Reassigned events: ${reassignToId || "None"}.`,
    previousData: { ...category },
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return { success: true, message: `Category '${category.name}' deleted successfully.` };
}

/**
 * Duplicates a category
 */
export async function duplicateFestivalCategory(id: string): Promise<FestivalCategory> {
  const dataset = await getFestivalCategoriesDataset();
  const source = dataset.categories.find((c) => c.id === id);

  if (!source) {
    throw new Error(`Category with ID '${id}' not found.`);
  }

  const newId = `CAT-FEST-${Date.now().toString().slice(-4)}`;
  const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-3)}`;
  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const duplicate: FestivalCategory = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    slug: newSlug,
    status: "Inactive", // Duplicated category starts inactive per specification
    eventCount: 0,
    displayPriority: dataset.categories.length + 1,
    createdAt: nowFormatted,
    updatedAt: nowFormatted,
    createdBy: "Parth Admin",
    updatedBy: "Parth Admin",
  };

  dataset.categories.push(duplicate);

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: duplicate.id,
    categoryName: duplicate.name,
    action: "Category Duplicated",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Duplicated from '${source.name}' (ID: ${source.id}). Marked as Inactive for review.`,
    updatedData: { ...duplicate },
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return duplicate;
}

/**
 * Reorders categories by priority
 */
export async function reorderCategories(orderedIds: string[]): Promise<FestivalCategory[]> {
  const dataset = await getFestivalCategoriesDataset();

  dataset.categories = dataset.categories.map((cat) => {
    const index = orderedIds.indexOf(cat.id);
    if (index !== -1) {
      return {
        ...cat,
        displayPriority: index + 1,
      };
    }
    return cat;
  });

  dataset.categories.sort((a, b) => a.displayPriority - b.displayPriority);

  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: "BATCH",
    categoryName: "All Categories",
    action: "Categories Reordered",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Updated display priorities for ${orderedIds.length} categories.`,
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return dataset.categories;
}

/**
 * Toggles category status between Active and Inactive
 */
export async function toggleCategoryStatus(id: string): Promise<FestivalCategory> {
  const dataset = await getFestivalCategoriesDataset();
  const category = dataset.categories.find((c) => c.id === id);

  if (!category) {
    throw new Error(`Category with ID '${id}' not found.`);
  }

  const previousStatus = category.status;
  category.status = previousStatus === "Active" ? "Inactive" : "Active";
  category.updatedAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: category.id,
    categoryName: category.name,
    action: `Category ${category.status === "Active" ? "Activated" : "Deactivated"}`,
    admin: "Parth Admin",
    timestamp: `${category.updatedAt}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Toggled status from ${previousStatus} to ${category.status}.`,
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return category;
}

/**
 * Updates Category Display Settings
 */
export async function updateCategoryDisplaySettings(
  settings: Partial<CategoryDisplaySettings>
): Promise<CategoryDisplaySettings> {
  const dataset = await getFestivalCategoriesDataset();
  dataset.displaySettings = {
    ...dataset.displaySettings,
    ...settings,
  };

  const nowFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const auditEntry: CategoryAuditEntry = {
    id: `AUD-CAT-${Date.now().toString().slice(-4)}`,
    categoryId: "SETTINGS",
    categoryName: "Display Settings",
    action: "Display Settings Updated",
    admin: "Parth Admin",
    timestamp: `${nowFormatted}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    details: `Updated category visibility and presentation settings.`,
    updatedData: { ...dataset.displaySettings },
    result: "Success",
  };

  dataset.auditHistory.unshift(auditEntry);
  await saveFestivalCategoriesDataset(dataset);

  return dataset.displaySettings;
}

/**
 * Gets events associated with a given category ID or category name
 */
export async function getCategoryEvents(categoryIdOrName: string): Promise<FestivalEvent[]> {
  const dataset = await getFestivalCategoriesDataset();
  const category = dataset.categories.find(
    (c) => c.id === categoryIdOrName || c.name.toLowerCase() === categoryIdOrName.toLowerCase()
  );

  const festivalsData = await getFestivalsDataset();
  if (!category) {
    return festivalsData.events;
  }

  return festivalsData.events.filter(
    (e) =>
      e.category?.toLowerCase() === category.type.toLowerCase() ||
      e.category?.toLowerCase() === category.name.toLowerCase() ||
      category.name.toLowerCase().includes(e.category?.toLowerCase() || "")
  );
}

/**
 * Resets festival categories data back to canonical seed
 */
export async function resetFestivalCategoriesData(): Promise<FestivalCategoriesDataset> {
  const seed = JSON.parse(JSON.stringify(CANONICAL_FESTIVAL_CATEGORIES_DATASET)) as FestivalCategoriesDataset;
  await saveFestivalCategoriesDataset(seed);
  return seed;
}
