import test from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_CATEGORIES,
  calculateCategoryMetrics,
  filterAndSortCategories,
  validateCategoryInput,
} from "../lib/template-categories.ts";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleArchiveCategory,
  deleteCategory,
  resetCategories,
} from "../lib/template-categories-storage.ts";

test("Screen 15 — Template Categories Management Test Suite", async (t) => {
  // Ensure clean baseline before tests
  resetCategories();

  await t.test("1. Initializes with 6 canonical categories matching Screen 15 reference specs", () => {
    assert.equal(CANONICAL_CATEGORIES.length, 6, "Must define exactly 6 canonical categories");

    const expected = [
      { id: "CAT-001", name: "Business", templates: 12, status: "Active", icon: "briefcase" },
      { id: "CAT-002", name: "Festivals & Events", templates: 24, status: "Active", icon: "party-popper" },
      { id: "CAT-003", name: "Education", templates: 8, status: "Active", icon: "graduation-cap" },
      { id: "CAT-004", name: "Product Promotion", templates: 15, status: "Active", icon: "tag" },
      { id: "CAT-005", name: "Social Media", templates: 0, status: "Archived", icon: "layout-grid" },
      { id: "CAT-006", name: "Seasonal Greetings", templates: 6, status: "Active", icon: "snowflake" },
    ];

    expected.forEach((exp, idx) => {
      const cat = CANONICAL_CATEGORIES[idx];
      assert.equal(cat.id, exp.id, `Category ${idx} id mismatch`);
      assert.equal(cat.name, exp.name, `Category ${idx} name mismatch`);
      assert.equal(cat.templateCount, exp.templates, `Category ${idx} templateCount mismatch`);
      assert.equal(cat.status, exp.status, `Category ${idx} status mismatch`);
      assert.equal(cat.icon, exp.icon, `Category ${idx} icon mismatch`);
      assert.ok(cat.description, `Category ${idx} description must exist`);
      assert.ok(cat.updatedAt, `Category ${idx} updatedAt must exist`);
    });
  });

  await t.test("2. Accurately calculates summary metrics matching reference values", () => {
    const metrics = calculateCategoryMetrics(CANONICAL_CATEGORIES, 18);
    assert.equal(metrics.total, 6, "Total Categories must be 6");
    assert.equal(metrics.active, 5, "Active Categories must be 5");
    assert.equal(metrics.unassigned, 18, "Unassigned Templates must be 18");
  });

  await t.test("3. Search query filters by category name, ID, or description", () => {
    const byName = filterAndSortCategories(CANONICAL_CATEGORIES, { search: "business" });
    assert.equal(byName.length, 1);
    assert.equal(byName[0].id, "CAT-001");

    const byId = filterAndSortCategories(CANONICAL_CATEGORIES, { search: "CAT-003" });
    assert.equal(byId.length, 1);
    assert.equal(byId[0].name, "Education");

    const byDesc = filterAndSortCategories(CANONICAL_CATEGORIES, { search: "special occasions" });
    assert.equal(byDesc.length, 1);
    assert.equal(byDesc[0].id, "CAT-002");

    const nonExistent = filterAndSortCategories(CANONICAL_CATEGORIES, { search: "non-existent-xyz" });
    assert.equal(nonExistent.length, 0);
  });

  await t.test("4. Status filter isolates Active and Archived categories", () => {
    const active = filterAndSortCategories(CANONICAL_CATEGORIES, { status: "Active" });
    assert.equal(active.length, 5, "Must find 5 active categories");

    const archived = filterAndSortCategories(CANONICAL_CATEGORIES, { status: "Archived" });
    assert.equal(archived.length, 1, "Must find 1 archived category");
    assert.equal(archived[0].id, "CAT-005");
    assert.equal(archived[0].name, "Social Media");
  });

  await t.test("5. Sorting operates on alphabetical and template count criteria", () => {
    const nameAsc = filterAndSortCategories(CANONICAL_CATEGORIES, { sort: "Name A–Z" });
    assert.equal(nameAsc[0].name, "Business");
    assert.equal(nameAsc[nameAsc.length - 1].name, "Social Media");

    const nameDesc = filterAndSortCategories(CANONICAL_CATEGORIES, { sort: "Name Z–A" });
    assert.equal(nameDesc[0].name, "Social Media");
    assert.equal(nameDesc[nameDesc.length - 1].name, "Business");

    const mostTemplates = filterAndSortCategories(CANONICAL_CATEGORIES, { sort: "Most Templates" });
    assert.equal(mostTemplates[0].id, "CAT-002", "Festivals & Events has 24 templates");
    assert.equal(mostTemplates[mostTemplates.length - 1].id, "CAT-005", "Social Media has 0 templates");
  });

  await t.test("6. Input validation enforces required name, uniqueness, and length limits", () => {
    // Required name
    const emptyName = validateCategoryInput({ name: "" });
    assert.equal(emptyName.valid, false);
    assert.ok(emptyName.errors.some((e) => e.includes("required")));

    // Max length 60
    const longName = validateCategoryInput({ name: "a".repeat(61) });
    assert.equal(longName.valid, false);
    assert.ok(longName.errors.some((e) => e.includes("cannot exceed 60 characters")));

    // Uniqueness check
    const duplicate = validateCategoryInput({ name: "Business" }, CANONICAL_CATEGORIES);
    assert.equal(duplicate.valid, false);
    assert.ok(duplicate.errors.some((e) => e.includes("already exists")));

    // Updating existing category with same name allowed
    const sameSelf = validateCategoryInput({ name: "Business" }, CANONICAL_CATEGORIES, "CAT-001");
    assert.equal(sameSelf.valid, true);

    // Max description 300
    const longDesc = validateCategoryInput({ name: "New Category", description: "d".repeat(301) });
    assert.equal(longDesc.valid, false);
    assert.ok(longDesc.errors.some((e) => e.includes("300 characters")));
  });

  await t.test("7. Storage lifecycle: create, update, and toggle archive", () => {
    // Create
    const createRes = createCategory({
      name: "Ecommerce Posters",
      description: "Templates for online stores and digital storefront promotions.",
      icon: "tag",
    });
    assert.equal(createRes.success, true);
    assert.ok(createRes.category);
    assert.equal(createRes.category.id, "CAT-007");
    assert.equal(createRes.category.name, "Ecommerce Posters");
    assert.equal(createRes.category.status, "Active");
    assert.equal(createRes.category.templateCount, 0);

    // Update
    const updateRes = updateCategory("CAT-007", {
      description: "Updated description for digital storefront promotions.",
      icon: "layout-grid",
    });
    assert.equal(updateRes.success, true);
    assert.equal(updateRes.category.description, "Updated description for digital storefront promotions.");
    assert.equal(updateRes.category.icon, "layout-grid");

    // Toggle Archive
    const archiveRes = toggleArchiveCategory("CAT-007");
    assert.equal(archiveRes.success, true);
    assert.equal(archiveRes.category.status, "Archived");

    const restoreRes = toggleArchiveCategory("CAT-007");
    assert.equal(restoreRes.success, true);
    assert.equal(restoreRes.category.status, "Active");
  });

  await t.test("8. Deletion prevention protects categories with associated templates", () => {
    // Attempt to delete CAT-001 (Business, has 12 templates)
    const delBlocked = deleteCategory("CAT-001");
    assert.equal(delBlocked.success, false);
    assert.equal(delBlocked.conflict, true);
    assert.ok(delBlocked.error.includes("cannot be deleted"));

    // Verify CAT-001 still exists
    const categories = getCategories();
    assert.ok(categories.some((c) => c.id === "CAT-001"));
  });

  await t.test("9. Deletion succeeds for categories with 0 templates", () => {
    // CAT-007 was created with 0 templates
    const delRes = deleteCategory("CAT-007");
    assert.equal(delRes.success, true);

    const categories = getCategories();
    assert.equal(categories.some((c) => c.id === "CAT-007"), false);
  });

  await t.test("10. Reset restores canonical Screen 15 categories", () => {
    resetCategories();
    const categories = getCategories();
    assert.equal(categories.length, 6);
    assert.equal(categories[0].id, "CAT-001");
    assert.equal(categories[4].id, "CAT-005");
    assert.equal(categories[4].status, "Archived");
  });
});
