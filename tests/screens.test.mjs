import test from "node:test";
import assert from "node:assert/strict";
import {
  initScreensDb,
  getAllScreens,
  findScreenByKey,
  findScreenById,
  createScreen,
  updateScreen,
  archiveScreen,
  deleteScreen,
} from "../lib/screens.ts";

test("Screen 03 — App Screens Management Test Suite", async (t) => {
  // 1. Initial inventory verification
  await t.test("1. Screens database initializes with 6 approved reference screens", () => {
    const screens = initScreensDb();
    assert.ok(screens.length >= 6, "Must contain at least the 6 reference screens");

    const expectedKeys = [
      "home",
      "templates",
      "ai-generator",
      "festivals",
      "my-creations",
      "profile-settings",
    ];

    expectedKeys.forEach((key) => {
      const found = findScreenByKey(key);
      assert.ok(found, `Expected screen key "${key}" to exist`);
      assert.ok(found.name, `Screen ${key} must have display name`);
      assert.ok(found.route, `Screen ${key} must have app route destination`);
      assert.ok(found.category, `Screen ${key} must belong to a category`);
    });
  });

  // 2. Truthful configuration status verification
  await t.test("2. Configuration status matches approved reference specifications", () => {
    const home = findScreenByKey("home");
    const templates = findScreenByKey("templates");
    const aiGen = findScreenByKey("ai-generator");
    const festivals = findScreenByKey("festivals");
    const creations = findScreenByKey("my-creations");
    const profile = findScreenByKey("profile-settings");

    assert.equal(home.status, "configured");
    assert.equal(templates.status, "configured");
    assert.equal(aiGen.status, "needs_setup");
    assert.equal(festivals.status, "configured");
    assert.equal(creations.status, "configured");
    assert.equal(profile.status, "needs_setup");
  });

  // 3. Category distribution verification
  await t.test("3. Category assignments match reference layout", () => {
    const home = findScreenByKey("home");
    const templates = findScreenByKey("templates");
    const aiGen = findScreenByKey("ai-generator");
    const festivals = findScreenByKey("festivals");
    const creations = findScreenByKey("my-creations");
    const profile = findScreenByKey("profile-settings");

    assert.equal(home.category, "Navigation");
    assert.equal(templates.category, "Content");
    assert.equal(aiGen.category, "Creation");
    assert.equal(festivals.category, "Content");
    assert.equal(creations.category, "Account");
    assert.equal(profile.category, "Account");
  });

  // 4. Duplicate key prevention
  await t.test("4. Add Screen workflow rejects duplicate screen keys", () => {
    const duplicateAttempt = createScreen({
      name: "Another Home",
      key: "home", // already exists
      description: "Duplicate home test",
      category: "Navigation",
    });

    assert.ok(duplicateAttempt.error, "Should return an error for duplicate key");
    assert.match(duplicateAttempt.error, /already exists/i);
  });

  // 5. Validation of required fields
  await t.test("5. Add Screen enforces required fields validation", () => {
    const emptyName = createScreen({
      name: "",
      key: "valid-key",
      description: "Some desc",
      category: "Content",
    });
    assert.ok(emptyName.error);
    assert.match(emptyName.error, /name is required/i);

    const emptyDesc = createScreen({
      name: "Valid Name",
      key: "valid-key",
      description: "",
      category: "Content",
    });
    assert.ok(emptyDesc.error);
    assert.match(emptyDesc.error, /description is required/i);
  });

  // 6. Successful Screen Creation, Modification, and Archival
  await t.test("6. Full screen lifecycle: create, update config, and soft archive", () => {
    const testKey = `test-screen-${Date.now()}`;
    const createResult = createScreen({
      name: "Test Screen Automated",
      key: testKey,
      description: "Automated test description",
      category: "Content",
      route: `/app/${testKey}`,
      iconName: "FileText",
    });

    assert.ok(createResult.screen, "Screen should be created successfully");
    const createdId = createResult.screen.id;

    // Verify retrieval
    const retrieved = findScreenById(createdId);
    assert.ok(retrieved);
    assert.equal(retrieved.key, testKey);
    assert.equal(retrieved.version, 1);

    // Update configuration
    const updateResult = updateScreen(createdId, {
      configData: {
        bannerVisible: true,
        headerTitle: "Updated Automated Title",
        itemsPerPage: 16,
      },
      status: "configured",
    });

    assert.ok(updateResult.screen);
    assert.equal(updateResult.screen.version, 2, "Version must increment after configuration change");
    assert.equal(updateResult.screen.configData.headerTitle, "Updated Automated Title");
    assert.equal(updateResult.screen.status, "configured");

    // Soft archival
    const archiveResult = archiveScreen(createdId);
    assert.ok(archiveResult.success);

    const archived = findScreenById(createdId);
    assert.equal(archived.status, "archived");

    // Cleanup test record
    deleteScreen(createdId);
    assert.equal(findScreenById(createdId), null);
  });

  // 7. Client Filtering Logic
  await t.test("7. Search and category filter calculations", () => {
    const screens = getAllScreens();

    // Category filter: Content
    const contentScreens = screens.filter((s) => s.category === "Content" && s.status !== "archived");
    assert.ok(contentScreens.some((s) => s.key === "templates"));
    assert.ok(contentScreens.some((s) => s.key === "festivals"));
    assert.ok(!contentScreens.some((s) => s.key === "home"));

    // Status filter: needs_setup
    const needsSetupScreens = screens.filter((s) => s.status === "needs_setup");
    assert.ok(needsSetupScreens.some((s) => s.key === "ai-generator"));
    assert.ok(needsSetupScreens.some((s) => s.key === "profile-settings"));
    assert.ok(!needsSetupScreens.some((s) => s.key === "home"));

    // Search query matching
    const searchMatch = screens.filter((s) => s.name.toLowerCase().includes("generator"));
    assert.equal(searchMatch.length, 1);
    assert.equal(searchMatch[0].key, "ai-generator");
  });
});
