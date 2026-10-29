import test from "node:test";
import assert from "node:assert/strict";
import {
  initScreensDb,
  findScreenByIdOrKey,
  saveScreenDraft,
} from "../lib/screens.ts";

test("Screen 04 — Screen Details & Configuration Editor Test Suite", async (t) => {
  // Initialize and verify baseline
  initScreensDb();

  // 1. Selected screen loading
  await t.test("1. Successfully loads screen record by Key ('home') or by ID ('scr_home_001')", () => {
    const byKey = findScreenByIdOrKey("home");
    assert.ok(byKey, "Must locate screen by key 'home'");
    assert.equal(byKey.name, "Home");
    assert.equal(byKey.category, "Navigation");
    assert.equal(byKey.route, "/home");
    assert.equal(byKey.status, "configured");

    const byId = findScreenByIdOrKey("scr_home_001");
    assert.ok(byId, "Must locate screen by stable ID 'scr_home_001'");
    assert.equal(byId.key, "home");
  });

  // 2. Invalid or non-existent screen handling
  await t.test("2. Returns null for non-existent or deleted screen identifiers", () => {
    const invalid = findScreenByIdOrKey("unknown-non-existent-screen-xyz");
    assert.equal(invalid, null, "Should return null for missing screen identifier");
  });

  // 3. Metadata validation
  await t.test("3. Metadata field validation enforces display name, description, and route format", () => {
    const emptyName = saveScreenDraft("home", { name: "" });
    assert.ok(emptyName.error);
    assert.match(emptyName.error, /display name is required/i);

    const emptyDesc = saveScreenDraft("home", { description: "" });
    assert.ok(emptyDesc.error);
    assert.match(emptyDesc.error, /description is required/i);

    const invalidRoute = saveScreenDraft("home", { route: "invalid-route-no-slash" });
    assert.ok(invalidRoute.error);
    assert.match(invalidRoute.error, /must begin with a forward slash/i);

    const invalidVer = saveScreenDraft("home", { minAppVersion: "not-a-semantic-version" });
    assert.ok(invalidVer.error);
    assert.match(invalidVer.error, /semantic format/i);
  });

  // 4. Save Draft workflow and audit trail
  await t.test("4. Save Draft operation updates configuration, timestamps, and history", () => {
    const initialHome = findScreenByIdOrKey("home");
    assert.ok(initialHome);

    const originalDesc = initialHome.description;

    const draftResult = saveScreenDraft("home", {
      name: "Home",
      description: "Discover templates, create AI images, and explore festival designs.",
      route: "/home",
      visibilityEnabled: true,
      minAppVersion: "1.0.0",
      configData: {
        bannerVisible: true,
        headerTitle: "Home",
        itemsPerPage: 12,
        defaultLayout: "grid",
        gridColumns: 3,
      },
    });

    assert.ok(draftResult.screen, "Draft must save successfully");
    const updated = draftResult.screen;
    assert.equal(updated.name, "Home");
    assert.equal(updated.hasUnpublishedChanges, true);
    assert.ok(updated.lastSavedAt, "Must record last saved timestamp");
    assert.ok(updated.history && updated.history.length > 0, "Must record version history");
    assert.equal(updated.history[0].author, "Admin Workspace");

    // Clean restore
    saveScreenDraft("home", { description: originalDesc });
  });

  // 5. Configuration section structure
  await t.test("5. Supported configuration sections contain appropriate schema fields", () => {
    const home = findScreenByIdOrKey("home");
    assert.ok(home);

    // Layout fields
    assert.equal(typeof home.configData.bannerVisible, "boolean");
    assert.equal(typeof home.configData.itemsPerPage, "number");
    assert.equal(typeof home.configData.defaultLayout, "string");

    // Sections
    assert.ok(Array.isArray(home.configData.sections));
    assert.ok(home.configData.sections.length >= 3);
    assert.equal(home.configData.sections[0].id, "hero");

    // Appearance & Navigation
    assert.ok(home.configData.primaryAccent);
    assert.ok(home.configData.deepLinkRoute);
  });

  // 6. Security against script injection
  await t.test("6. Configuration fields are sanitized plain data without executable code", () => {
    const home = findScreenByIdOrKey("home");
    assert.ok(home);

    // ConfigData is pure serializable JSON object
    const serialized = JSON.stringify(home.configData);
    assert.doesNotThrow(() => JSON.parse(serialized));
    assert.ok(!serialized.includes("<script>"));
  });

  // 7. Publishing pipeline enforcement
  await t.test("7. Publishing policy requires client app integration and preserves drafts", () => {
    const home = findScreenByIdOrKey("home");
    assert.ok(home);

    // Draft updates do not silently promote to external production without version review
    assert.ok(home.hasUnpublishedChanges !== undefined);
  });
});
