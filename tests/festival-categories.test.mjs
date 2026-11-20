import test from "node:test";
import assert from "node:assert/strict";

import {
  getFestivalCategoriesDataset,
  createFestivalCategory,
  updateFestivalCategory,
  deleteFestivalCategory,
  duplicateFestivalCategory,
  reorderCategories,
  toggleCategoryStatus,
  updateCategoryDisplaySettings,
  getCategoryEvents,
  resetFestivalCategoriesData,
} from "../lib/festival-categories-storage.ts";
import { CANONICAL_CATEGORIES_SEED } from "../lib/festival-categories.ts";

test.describe("Screen 37 — Festival & Event Categories Management Test Suite", () => {
  test("1. Initializes canonical summary metrics matching Screen 37", async () => {
    await resetFestivalCategoriesData();
    const dataset = await getFestivalCategoriesDataset();

    assert.ok(dataset, "Dataset should exist");
    assert.strictEqual(dataset.summary.totalCategories, 9, "Total categories must be 9");
    assert.strictEqual(dataset.summary.activeCategories, 8, "Active categories must be 8");
    assert.strictEqual(dataset.summary.totalAssociatedEvents, 48, "Total associated events must be 48");
    assert.strictEqual(dataset.summary.categoriesWithoutEvents, 1, "Categories without events must be 1");
    assert.strictEqual(dataset.summary.totalCategoriesTrend, "+1");
    assert.strictEqual(dataset.summary.activeCategoriesTrend, "+1");
    assert.strictEqual(dataset.summary.totalAssociatedEventsTrend, "+5");
  });

  test("2. Verifies canonical 9 categories matching reference cards", async () => {
    const dataset = await getFestivalCategoriesDataset();
    assert.strictEqual(dataset.categories.length, 9, "Should have 9 categories");

    const cat1 = dataset.categories.find((c) => c.slug === "religious-festivals");
    assert.ok(cat1, "Religious Festivals must exist");
    assert.strictEqual(cat1.name, "Religious Festivals");
    assert.strictEqual(cat1.type, "Religious");
    assert.strictEqual(cat1.icon, "hands-praying");
    assert.strictEqual(cat1.displayColor, "#7956C9");
    assert.strictEqual(cat1.displayPriority, 1);
    assert.strictEqual(cat1.status, "Active");

    const cat2 = dataset.categories.find((c) => c.slug === "national-holidays");
    assert.ok(cat2, "National Holidays must exist");
    assert.strictEqual(cat2.icon, "flag");
    assert.strictEqual(cat2.displayPriority, 2);
    assert.strictEqual(cat2.status, "Active");

    const cat9 = dataset.categories.find((c) => c.slug === "community-celebrations");
    assert.ok(cat9, "Community Celebrations must exist");
    assert.strictEqual(cat9.icon, "users");
    assert.strictEqual(cat9.displayPriority, 9);
    assert.strictEqual(cat9.status, "Inactive");
    assert.strictEqual(cat9.eventCount, 0);
  });

  test("3. Verifies canonical display settings matching reference card", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const settings = dataset.displaySettings;

    assert.ok(settings, "Display settings must exist");
    assert.strictEqual(settings.categoryVisibility, true);
    assert.strictEqual(settings.displayOrder, "By Priority");
    assert.strictEqual(settings.featuredCategory, false);
    assert.strictEqual(settings.appDisplay, true);
    assert.strictEqual(settings.websiteDisplay, true);
    assert.strictEqual(settings.languageAvailability, "All Languages");
  });

  test("4. Creates a new festival category with slug generation and audit logging", async () => {
    const created = await createFestivalCategory({
      name: "Music & Art Festivals",
      description: "Music festivals, creative arts, and live performances.",
      type: "Cultural",
      icon: "theater",
      displayColor: "#EC4899",
      displayPriority: 10,
      status: "Active",
    });

    assert.ok(created.id.startsWith("CAT-FEST-"), "Should generate valid ID");
    assert.strictEqual(created.slug, "music-art-festivals", "Should auto-generate slug");
    assert.strictEqual(created.name, "Music & Art Festivals");
    assert.strictEqual(created.displayPriority, 10);

    const dataset = await getFestivalCategoriesDataset();
    assert.strictEqual(dataset.summary.totalCategories, 10, "Total categories should increment to 10");

    const latestAudit = dataset.auditHistory[0];
    assert.strictEqual(latestAudit.action, "Category Created");
    assert.strictEqual(latestAudit.categoryId, created.id);
  });

  test("5. Prevents creating a category with duplicate slug", async () => {
    await assert.rejects(
      async () => {
        await createFestivalCategory({
          name: "Duplicate Religious",
          slug: "religious-festivals", // already taken
          type: "Religious",
        });
      },
      /already exists/,
      "Must reject duplicate slug"
    );
  });

  test("6. Updates category metadata and priority", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const cat = dataset.categories.find((c) => c.slug === "music-art-festivals");
    assert.ok(cat, "Created category must exist");

    const updated = await updateFestivalCategory(cat.id, {
      description: "Updated description for live music and performances.",
      displayColor: "#14B8A6",
    });

    assert.strictEqual(updated.description, "Updated description for live music and performances.");
    assert.strictEqual(updated.displayColor, "#14B8A6");

    const freshDataset = await getFestivalCategoriesDataset();
    const freshCat = freshDataset.categories.find((c) => c.id === cat.id);
    assert.strictEqual(freshCat.displayColor, "#14B8A6");
  });

  test("7. Duplicates category with unique slug and inactive status", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const source = dataset.categories.find((c) => c.slug === "national-holidays");
    assert.ok(source);

    const duplicate = await duplicateFestivalCategory(source.id);
    assert.ok(duplicate.id.startsWith("CAT-FEST-"));
    assert.strictEqual(duplicate.name, "National Holidays (Copy)");
    assert.strictEqual(duplicate.status, "Inactive", "Duplicated category must start as Inactive");
    assert.strictEqual(duplicate.eventCount, 0);
    assert.ok(duplicate.slug.includes("national-holidays-copy-"));
  });

  test("8. Blocks category deletion when associated events exist without reassignment", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const cat = dataset.categories.find((c) => c.slug === "religious-festivals");
    assert.ok(cat);
    assert.ok(cat.eventCount > 0, "Religious category should have events");

    await assert.rejects(
      async () => {
        await deleteFestivalCategory(cat.id); // no reassignToId passed
      },
      /associated events/,
      "Must prevent deletion without reassignment"
    );
  });

  test("9. Deletes category with successful event reassignment and logs audit", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const targetCategory = dataset.categories.find((c) => c.slug === "cultural-events");
    const categoryToDelete = dataset.categories.find((c) => c.slug === "music-art-festivals");

    assert.ok(categoryToDelete, "Category to delete must exist");
    assert.ok(targetCategory, "Target category must exist");

    const result = await deleteFestivalCategory(categoryToDelete.id, targetCategory.id);
    assert.strictEqual(result.success, true);

    const freshDataset = await getFestivalCategoriesDataset();
    assert.strictEqual(
      freshDataset.categories.some((c) => c.id === categoryToDelete.id),
      false,
      "Deleted category must no longer exist"
    );

    const latestAudit = freshDataset.auditHistory[0];
    assert.strictEqual(latestAudit.action, "Category Deleted");
  });

  test("10. Toggles category status between Active and Inactive and recalculates metrics", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const cat = dataset.categories.find((c) => c.slug === "community-celebrations");
    assert.ok(cat);
    assert.strictEqual(cat.status, "Inactive");

    const toggled = await toggleCategoryStatus(cat.id);
    assert.strictEqual(toggled.status, "Active");

    const fresh = await getFestivalCategoriesDataset();
    const freshCat = fresh.categories.find((c) => c.id === cat.id);
    assert.strictEqual(freshCat.status, "Active");

    // Toggle back to Inactive
    await toggleCategoryStatus(cat.id);
  });

  test("11. Reorders category priorities", async () => {
    const dataset = await getFestivalCategoriesDataset();
    const initialFirst = dataset.categories[0];
    const initialSecond = dataset.categories[1];

    const reversedIds = dataset.categories.map((c) => c.id).reverse();
    const reordered = await reorderCategories(reversedIds);

    assert.strictEqual(reordered[0].id, reversedIds[0]);
    assert.strictEqual(reordered[0].displayPriority, 1);
  });

  test("12. Updates category display settings", async () => {
    const updated = await updateCategoryDisplaySettings({
      categoryVisibility: true,
      displayOrder: "Alphabetical",
      featuredCategory: true,
      appDisplay: true,
      websiteDisplay: false,
      languageAvailability: "English",
    });

    assert.strictEqual(updated.displayOrder, "Alphabetical");
    assert.strictEqual(updated.featuredCategory, true);
    assert.strictEqual(updated.websiteDisplay, false);

    const fresh = await getFestivalCategoriesDataset();
    assert.strictEqual(fresh.displaySettings.displayOrder, "Alphabetical");
  });

  test("13. Queries associated events for a given category", async () => {
    const events = await getCategoryEvents("Religious Festivals");
    assert.ok(Array.isArray(events), "Events should be an array");
    assert.ok(events.length > 0, "Should have associated events for Religious category");
  });

  test("14. Resets festival categories back to canonical seed", async () => {
    const reset = await resetFestivalCategoriesData();
    assert.strictEqual(reset.categories.length, 9);
    assert.strictEqual(reset.summary.totalCategories, 9);
    assert.strictEqual(reset.summary.activeCategories, 8);
    assert.strictEqual(reset.summary.totalAssociatedEvents, 48);
    assert.strictEqual(reset.summary.categoriesWithoutEvents, 1);
    assert.strictEqual(reset.displaySettings.displayOrder, "By Priority");
  });
});
