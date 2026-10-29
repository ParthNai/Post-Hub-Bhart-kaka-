import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  getDesignSystemConfig,
  saveDesignSystemDraft,
  resetDesignSystemToDefaults,
  updateBrandAsset,
  isValidHexColor,
  DEFAULT_COLOR_TOKENS,
  DEFAULT_BRAND_GUIDELINES,
} from "../lib/design-system.ts";

test("Screen 05 — Design System & Branding Overview Test Suite", async (t) => {
  const dataDir = path.join(process.cwd(), ".data");
  const tokenFile = path.join(dataDir, "design-tokens.json");
  let backupContent = null;

  // Setup: backup existing file if present
  if (fs.existsSync(tokenFile)) {
    backupContent = fs.readFileSync(tokenFile, "utf-8");
  }

  t.after(() => {
    // Teardown: restore original file or reset
    if (backupContent !== null) {
      fs.writeFileSync(tokenFile, backupContent, "utf-8");
    } else if (fs.existsSync(tokenFile)) {
      fs.unlinkSync(tokenFile);
    }
  });

  await t.test("1. Initializes with 4 reference brand assets and expected statuses", () => {
    const config = getDesignSystemConfig();
    assert.ok(config, "Config should load successfully");
    assert.equal(config.brandAssets.length, 4, "Should have 4 brand assets");

    const primaryLogo = config.brandAssets.find((a) => a.id === "primary-logo");
    const appIcon = config.brandAssets.find((a) => a.id === "app-icon");
    const lightLogo = config.brandAssets.find((a) => a.id === "light-logo");
    const darkLogo = config.brandAssets.find((a) => a.id === "dark-logo");

    assert.ok(primaryLogo, "Primary Logo asset exists");
    assert.equal(primaryLogo.status, "available");
    assert.equal(primaryLogo.dimensions, "1200 × 400");

    assert.ok(appIcon, "App Icon asset exists");
    assert.equal(appIcon.status, "available");
    assert.equal(appIcon.dimensions, "1024 × 1024");

    assert.ok(lightLogo, "Light Logo asset exists");
    assert.equal(lightLogo.status, "available");

    assert.ok(darkLogo, "Dark Logo asset exists");
    assert.equal(darkLogo.status, "not_uploaded", "Dark Background Logo defaults to 'not_uploaded'");
  });

  await t.test("2. Initial Brand Guidelines match approved reference specifications", () => {
    const config = getDesignSystemConfig();
    assert.equal(config.guidelines.brandTone, "Professional");
    assert.equal(config.guidelines.visualStyle, "Clean and editorial");
    assert.equal(config.guidelines.theme, "Light");
    assert.equal(config.guidelines.accentColor, "Violet");
  });

  await t.test("3. Initial 6 Color Tokens match approved reference hex values", () => {
    const config = getDesignSystemConfig();
    assert.equal(config.colorTokens.primaryViolet, "#7956C9");
    assert.equal(config.colorTokens.softLavender, "#E8DFF5");
    assert.equal(config.colorTokens.warmIvory, "#FAF7F2");
    assert.equal(config.colorTokens.mainText, "#24213A");
    assert.equal(config.colorTokens.secondaryText, "#777184");
    assert.equal(config.colorTokens.border, "#EAE4EE");
  });

  await t.test("4. Hex color validation enforces valid format and rejects malformed values", () => {
    assert.equal(isValidHexColor("#7956C9"), true);
    assert.equal(isValidHexColor("#FFF"), true);
    assert.equal(isValidHexColor("#000000"), true);
    assert.equal(isValidHexColor("7956C9"), false, "Missing '#' should fail validation");
    assert.equal(isValidHexColor("#GGGGGG"), false, "Non-hex characters should fail");
    assert.equal(isValidHexColor("rgb(121,86,201)"), false, "RGB functions not allowed in hex field");
    assert.equal(isValidHexColor("<script>alert(1)</script>"), false, "XSS attempts rejected");
  });

  await t.test("5. Save Draft updates configuration, increments version, and records audit history", () => {
    const initial = getDesignSystemConfig();
    const initialVersion = initial.version;

    const result = saveDesignSystemDraft(
      {
        guidelines: {
          ...initial.guidelines,
          brandTone: "Creative & Bold",
        },
        colorTokens: {
          ...initial.colorTokens,
          primaryViolet: "#6D28D9",
        },
      },
      "Test Administrator"
    );

    assert.equal(result.success, true, "Save draft should succeed");
    assert.ok(result.config, "Config should be returned");
    assert.equal(result.config.version, initialVersion + 1, "Version number should increment");
    assert.equal(result.config.guidelines.brandTone, "Creative & Bold");
    assert.equal(result.config.colorTokens.primaryViolet, "#6D28D9");
    assert.ok(result.config.lastSavedAt, "lastSavedAt timestamp must be set");
    assert.equal(result.config.lastSavedBy, "Test Administrator");

    // Verify history audit record
    assert.ok(result.config.history.length > 0, "History entry must be appended");
    assert.equal(result.config.history[0].version, initialVersion);
    assert.equal(result.config.history[0].savedBy, "Test Administrator");
  });

  await t.test("6. Update Brand Asset modifies status, url, and timestamp", () => {
    const updateResult = updateBrandAsset("dark-logo", {
      status: "available",
      filename: "dark_logo_custom.png",
      url: "/assets/uploads/dark_logo_custom.png",
    });

    assert.equal(updateResult.success, true, "Asset update should succeed");
    const updatedDarkLogo = updateResult.config.brandAssets.find((a) => a.id === "dark-logo");
    assert.equal(updatedDarkLogo.status, "available");
    assert.equal(updatedDarkLogo.filename, "dark_logo_custom.png");
    assert.equal(updatedDarkLogo.url, "/assets/uploads/dark_logo_custom.png");
    assert.ok(updatedDarkLogo.updatedAt, "Asset update timestamp must be recorded");
  });

  await t.test("7. Security: Sanitizes brand guidelines against HTML and script injection", () => {
    const xssDraft = {
      guidelines: {
        brandTone: "<script>alert('pwned')</script>Professional",
        visualStyle: "Clean <img src=x onerror=alert(1)>",
        theme: "Light",
        accentColor: "Violet",
      },
    };

    const res = saveDesignSystemDraft(xssDraft);
    assert.equal(res.success, true);
    assert.ok(!res.config.guidelines.brandTone.includes("<script>"), "Must strip script tags");
    assert.ok(!res.config.guidelines.visualStyle.includes("<img"), "Must strip img tags");
  });

  await t.test("8. Reset to Defaults restores canonical system defaults", () => {
    const resetRes = resetDesignSystemToDefaults("System Administrator");
    assert.equal(resetRes.success, true);
    assert.equal(resetRes.config.colorTokens.primaryViolet, DEFAULT_COLOR_TOKENS.primaryViolet);
    assert.equal(resetRes.config.guidelines.brandTone, DEFAULT_BRAND_GUIDELINES.brandTone);
    assert.equal(resetRes.config.version, 1);
  });
});

