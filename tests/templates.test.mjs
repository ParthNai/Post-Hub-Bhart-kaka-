import test from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_TEMPLATES,
  TEMPLATE_CATEGORIES,
  filterAndSortTemplates,
  calculateTemplateMetrics,
  validateTemplateInput,
} from "../lib/templates.ts";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  duplicateTemplate,
  toggleArchiveTemplate,
  deleteTemplate,
  resetTemplates,
} from "../lib/templates-storage.ts";

test("Screen 13 — Templates Management Dashboard Test Suite", async (t) => {
  // Ensure we start with clean canonical templates
  resetTemplates();

  await t.test("1. Initializes with 8 canonical templates matching reference specification", () => {
    assert.equal(CANONICAL_TEMPLATES.length, 8, "Must contain exactly 8 canonical templates");

    const expected = [
      { id: "TPL-001", name: "Business Promotion Poster", category: "Business", format: "3:4", status: "Published" },
      { id: "TPL-002", name: "Diwali Festival Greeting", category: "Festival", format: "4:5", status: "Draft" },
      { id: "TPL-003", name: "Education Admission Poster", category: "Education", format: "9:16", status: "Published" },
      { id: "TPL-004", name: "Product Promotion Poster", category: "Promotion", format: "3:4", status: "Archived" },
      { id: "TPL-005", name: "Summer Sale Poster", category: "Promotion", format: "4:5", status: "Draft" },
      { id: "TPL-006", name: "Real Estate Poster", category: "Business", format: "3:4", status: "Published" },
      { id: "TPL-007", name: "Tech Conference Poster", category: "Business", format: "9:16", status: "Draft" },
      { id: "TPL-008", name: "Home Decor Poster", category: "Promotion", format: "4:5", status: "Published" },
    ];

    expected.forEach((exp, idx) => {
      const template = CANONICAL_TEMPLATES[idx];
      assert.equal(template.id, exp.id, `Template ${idx} id mismatch`);
      assert.equal(template.name, exp.name, `Template ${idx} name mismatch`);
      assert.equal(template.category, exp.category, `Template ${idx} category mismatch`);
      assert.equal(template.format, exp.format, `Template ${idx} format mismatch`);
      assert.equal(template.status, exp.status, `Template ${idx} status mismatch`);
      assert.ok(template.updatedAt, "Must have an update date");
      assert.ok(template.fileSize, "Must specify a file size");
    });

    assert.equal(TEMPLATE_CATEGORIES.length, 4, "Must define 4 core categories");
  });

  await t.test("2. Metrics calculation accurately counts template distributions", () => {
    const metrics = calculateTemplateMetrics(CANONICAL_TEMPLATES);
    assert.equal(metrics.total, 8, "Total count must be 8");
    assert.equal(metrics.published, 4, "Published count must be 4");
    assert.equal(metrics.drafts, 3, "Drafts count must be 3");
    assert.equal(metrics.archived, 1, "Archived count must be 1");
  });

  await t.test("3. Search query filters by name, ID, category, or tags", () => {
    const byId = filterAndSortTemplates(CANONICAL_TEMPLATES, { query: "TPL-002" });
    assert.equal(byId.length, 1);
    assert.equal(byId[0].id, "TPL-002");

    const byName = filterAndSortTemplates(CANONICAL_TEMPLATES, { query: "summer" });
    assert.equal(byName.length, 1);
    assert.equal(byName[0].id, "TPL-005");

    const byTag = filterAndSortTemplates(CANONICAL_TEMPLATES, { query: "luxury" });
    assert.equal(byTag.length, 1);
    assert.equal(byTag[0].id, "TPL-006");

    const nonExistent = filterAndSortTemplates(CANONICAL_TEMPLATES, { query: "xyzNonExistent999" });
    assert.equal(nonExistent.length, 0);
  });

  await t.test("4. Category filter partitions templates into expected subsets", () => {
    const business = filterAndSortTemplates(CANONICAL_TEMPLATES, { category: "Business" });
    assert.equal(business.length, 3, "Business should have 3 templates (TPL-001, TPL-006, TPL-007)");

    const festival = filterAndSortTemplates(CANONICAL_TEMPLATES, { category: "Festival" });
    assert.equal(festival.length, 1, "Festival should have 1 template (TPL-002)");

    const education = filterAndSortTemplates(CANONICAL_TEMPLATES, { category: "Education" });
    assert.equal(education.length, 1, "Education should have 1 template (TPL-003)");

    const promotion = filterAndSortTemplates(CANONICAL_TEMPLATES, { category: "Promotion" });
    assert.equal(promotion.length, 3, "Promotion should have 3 templates (TPL-004, TPL-005, TPL-008)");
  });

  await t.test("5. Status filter isolates Published, Draft, and Archived templates", () => {
    const published = filterAndSortTemplates(CANONICAL_TEMPLATES, { status: "Published" });
    assert.equal(published.length, 4);

    const drafts = filterAndSortTemplates(CANONICAL_TEMPLATES, { status: "Draft" });
    assert.equal(drafts.length, 3);

    const archived = filterAndSortTemplates(CANONICAL_TEMPLATES, { status: "Archived" });
    assert.equal(archived.length, 1);
    assert.equal(archived[0].id, "TPL-004");
  });

  await t.test("6. Format filter partitions by 3:4, 4:5, and 9:16 aspect ratios", () => {
    const f34 = filterAndSortTemplates(CANONICAL_TEMPLATES, { format: "3:4" });
    assert.equal(f34.length, 3);

    const f45 = filterAndSortTemplates(CANONICAL_TEMPLATES, { format: "4:5" });
    assert.equal(f45.length, 3);

    const f916 = filterAndSortTemplates(CANONICAL_TEMPLATES, { format: "9:16" });
    assert.equal(f916.length, 2);
  });

  await t.test("7. Sorting operates on alphabetical and chronological criteria", () => {
    const alphaAsc = filterAndSortTemplates(CANONICAL_TEMPLATES, { sort: "Name (A-Z)" });
    assert.equal(alphaAsc[0].name, "Business Promotion Poster");
    assert.equal(alphaAsc[alphaAsc.length - 1].name, "Tech Conference Poster");

    const alphaDesc = filterAndSortTemplates(CANONICAL_TEMPLATES, { sort: "Name (Z-A)" });
    assert.equal(alphaDesc[0].name, "Tech Conference Poster");
    assert.equal(alphaDesc[alphaDesc.length - 1].name, "Business Promotion Poster");
  });

  await t.test("8. Validation checks reject invalid fields and accept valid specifications", () => {
    const emptyName = validateTemplateInput({ name: "" });
    assert.equal(emptyName.valid, false);
    assert.ok(emptyName.errors.length > 0);

    const shortName = validateTemplateInput({ name: "ab" });
    assert.equal(shortName.valid, false);

    const invalidCat = validateTemplateInput({ name: "Valid Name", category: "InvalidCategory" });
    assert.equal(invalidCat.valid, false);

    const invalidFmt = validateTemplateInput({ name: "Valid Name", format: "16:9" });
    assert.equal(invalidFmt.valid, false);

    const valid = validateTemplateInput({
      name: "New Poster",
      category: "Business",
      format: "3:4",
      status: "Draft",
    });
    assert.equal(valid.valid, true);
    assert.equal(valid.errors.length, 0);
  });

  await t.test("9. Storage lifecycle: Create, update, duplicate, archive, and delete operations", () => {
    // Create
    const createRes = createTemplate({
      name: "Unit Test Autumn Poster",
      category: "Festival",
      format: "4:5",
      status: "Draft",
      description: "Test description for poster",
    });
    assert.equal(createRes.success, true);
    assert.ok(createRes.template);
    const newId = createRes.template.id;
    assert.ok(newId.startsWith("TPL-"));

    // Duplicate
    const dupRes = duplicateTemplate(newId);
    assert.equal(dupRes.success, true);
    assert.ok(dupRes.template);
    assert.equal(dupRes.template.name, "Unit Test Autumn Poster (Copy)");
    const dupId = dupRes.template.id;

    // Update
    const updateRes = updateTemplate(newId, {
      name: "Updated Autumn Poster Title",
      status: "Published",
    });
    assert.equal(updateRes.success, true);
    assert.equal(updateRes.template.name, "Updated Autumn Poster Title");
    assert.equal(updateRes.template.status, "Published");

    // Archive Toggle
    const archiveRes = toggleArchiveTemplate(newId);
    assert.equal(archiveRes.success, true);
    assert.equal(archiveRes.template.status, "Archived");

    const unarchiveRes = toggleArchiveTemplate(newId);
    assert.equal(unarchiveRes.success, true);
    assert.equal(unarchiveRes.template.status, "Draft");

    // Delete
    const del1 = deleteTemplate(newId);
    assert.equal(del1.success, true);

    const del2 = deleteTemplate(dupId);
    assert.equal(del2.success, true);

    // Reset back to canonical defaults
    resetTemplates();
    const finalTemplates = getTemplates();
    assert.equal(finalTemplates.length, 8);
  });
});
