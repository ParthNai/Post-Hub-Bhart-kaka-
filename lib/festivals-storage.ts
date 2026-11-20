/**
 * Persistent Storage Engine for Screen 36: Festivals & Events Management Dashboard
 * Persists datasets in `.data/festivals.json`
 */

import fs from "fs/promises";
import path from "path";
import {
  type FestivalsDataset,
  type FestivalEvent,
  CANONICAL_FESTIVALS_SEED,
  recalculateFestivalMetrics,
} from "./festivals.ts";

const STORAGE_FILE = path.join(process.cwd(), ".data", "festivals.json");

/**
 * Loads the festivals dataset from disk or initializes with canonical seed
 */
export async function getFestivalsDataset(): Promise<FestivalsDataset> {
  try {
    const raw = await fs.readFile(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as FestivalsDataset;
    const { summary, contentPreparation, updatedCategories } = recalculateFestivalMetrics(
      parsed.events,
      parsed.categories
    );
    parsed.summary = summary;
    parsed.contentPreparation = contentPreparation;
    parsed.categories = updatedCategories;
    return parsed;
  } catch {
    const seed = JSON.parse(JSON.stringify(CANONICAL_FESTIVALS_SEED)) as FestivalsDataset;
    await saveFestivalsDataset(seed);
    return seed;
  }
}

/**
 * Persists the festivals dataset to disk
 */
export async function saveFestivalsDataset(dataset: FestivalsDataset): Promise<void> {
  const dir = path.dirname(STORAGE_FILE);
  await fs.mkdir(dir, { recursive: true });

  const { summary, contentPreparation, updatedCategories } = recalculateFestivalMetrics(
    dataset.events,
    dataset.categories
  );
  dataset.summary = summary;
  dataset.contentPreparation = contentPreparation;
  dataset.categories = updatedCategories;
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
 * Creates a new festival event
 */
export async function createFestivalEvent(
  input: Partial<FestivalEvent>
): Promise<FestivalEvent> {
  const dataset = await getFestivalsDataset();

  if (!input.name || input.name.trim().length === 0) {
    throw new Error("Event name is required.");
  }
  if (!input.startDate) {
    throw new Error("Start date is required.");
  }

  const id = `EVT-FEST-${Date.now().toString().slice(-4)}`;
  const slug =
    input.slug?.trim() ||
    input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const dateObj = new Date(input.startDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : input.startDate;

  const newEvent: FestivalEvent = {
    id,
    name: input.name.trim(),
    slug,
    iconEmoji: input.iconEmoji || "🎉",
    shortDescription: input.shortDescription || "Festival celebration with dedicated poster designs.",
    fullDescription: input.fullDescription || input.shortDescription || "",
    type: input.type || "Festival",
    category: input.category || "Religious",
    startDate: input.startDate,
    endDate: input.endDate || input.startDate,
    formattedDate,
    isAllDay: input.isAllDay ?? true,
    isRecurringAnnual: input.isRecurringAnnual ?? true,
    region: input.region || "India",
    states: input.states && input.states.length > 0 ? input.states : ["All"],
    language: input.language || "English",
    supportedLanguages: input.supportedLanguages || ["English"],
    contentStatus: input.contentStatus || "Draft",
    templateStatus: input.templateStatus || "Missing",
    associatedTemplateIds: input.associatedTemplateIds || [],
    coverImageUrl: input.coverImageUrl || "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80",
    templateThumbnails: input.templateThumbnails || [],
    isFeatured: input.isFeatured ?? false,
    displayPriority: input.displayPriority ?? 10,
    createdAt: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    updatedAt: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  };

  dataset.events.unshift(newEvent);
  await saveFestivalsDataset(dataset);
  return newEvent;
}

/**
 * Updates an existing festival event
 */
export async function updateFestivalEvent(
  id: string,
  updates: Partial<FestivalEvent>
): Promise<FestivalEvent> {
  const dataset = await getFestivalsDataset();
  const index = dataset.events.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error(`Event with ID ${id} not found.`);
  }

  const existing = dataset.events[index];
  let formattedDate = existing.formattedDate;
  if (updates.startDate) {
    const d = new Date(updates.startDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    }
  }

  const updated: FestivalEvent = {
    ...existing,
    ...updates,
    formattedDate,
    updatedAt: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  };

  dataset.events[index] = updated;
  await saveFestivalsDataset(dataset);
  return updated;
}

/**
 * Deletes a festival event
 */
export async function deleteFestivalEvent(id: string): Promise<boolean> {
  const dataset = await getFestivalsDataset();
  const index = dataset.events.findIndex((e) => e.id === id);
  if (index === -1) return false;

  dataset.events.splice(index, 1);
  await saveFestivalsDataset(dataset);
  return true;
}

/**
 * Duplicates a festival event
 */
export async function duplicateFestivalEvent(id: string): Promise<FestivalEvent> {
  const dataset = await getFestivalsDataset();
  const target = dataset.events.find((e) => e.id === id);
  if (!target) {
    throw new Error(`Event with ID ${id} not found.`);
  }

  const copy = await createFestivalEvent({
    ...target,
    name: `${target.name} (Copy)`,
    slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
    contentStatus: "Draft",
  });

  return copy;
}

/**
 * Batch imports festival events from CSV/JSON payload
 */
export async function importFestivalEvents(
  items: Partial<FestivalEvent>[]
): Promise<{ importedCount: number; duplicatesSkipped: number; events: FestivalEvent[] }> {
  const dataset = await getFestivalsDataset();
  const existingNames = new Set(dataset.events.map((e) => e.name.toLowerCase()));

  let importedCount = 0;
  let duplicatesSkipped = 0;
  const newEvents: FestivalEvent[] = [];

  for (const item of items) {
    if (!item.name || existingNames.has(item.name.toLowerCase().trim())) {
      duplicatesSkipped++;
      continue;
    }

    const created = await createFestivalEvent(item);
    newEvents.push(created);
    existingNames.add(item.name.toLowerCase().trim());
    importedCount++;
  }

  return { importedCount, duplicatesSkipped, events: newEvents };
}

/**
 * Resets dataset back to pristine canonical state
 */
export async function resetFestivalsData(): Promise<void> {
  const seed = JSON.parse(JSON.stringify(CANONICAL_FESTIVALS_SEED)) as FestivalsDataset;
  await saveFestivalsDataset(seed);
}
