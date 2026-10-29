import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  generateExportPayload,
  validateImportPayload,
  applyImportAsDraft,
  formatBytes,
  MAX_IMPORT_FILE_SIZE,
} from "../lib/export-import.ts";
import { getDesignSystemConfig, saveDesignSystemDraft } from "../lib/design-system.ts";

test("Screen 11 — Design System Export & Import Test Suite", async (t) => {
  const dataDir = path.join(process.cwd(), ".data");
  const tokensFile = path.join(dataDir, "design-tokens.json");
  let tokensBackup = null;

  if (fs.existsSync(tokensFile)) {
    tokensBackup = fs.readFileSync(tokensFile, "utf-8");
  }

  t.after(() => {
    if (tokensBackup !== null) {
      fs.writeFileSync(tokensFile, tokensBackup, "utf-8");
    }
  });

  await t.test("1. Exporting individual token categories includes only requested tokens", () => {
    const colorExport = generateExportPayload(["colors"]);
    assert.equal(colorExport.schemaVersion, "1.0.0");
    assert.deepEqual(colorExport.categories, ["colors"]);
    assert.ok(colorExport.tokens.colors);
    assert.equal(colorExport.tokens.typography, undefined);
    assert.equal(colorExport.tokens.spacing, undefined);
    assert.equal(colorExport.tokens.radius, undefined);
    assert.equal(colorExport.tokens.layout, undefined);
    assert.ok(colorExport.tokens.colors.primaryViolet);

    const typoExport = generateExportPayload(["typography"]);
    assert.deepEqual(typoExport.categories, ["typography"]);
    assert.ok(typoExport.tokens.typography);
    assert.equal(typoExport.tokens.colors, undefined);
    assert.ok(typoExport.tokens.typography.fontFamily);
  });

  await t.test("2. Exporting complete design system includes all 5 canonical categories", () => {
    const fullExport = generateExportPayload(["complete"]);
    assert.equal(fullExport.schemaVersion, "1.0.0");
    assert.deepEqual(fullExport.categories, ["colors", "typography", "spacing", "radius", "layout"]);
    assert.ok(fullExport.tokens.colors);
    assert.ok(fullExport.tokens.typography);
    assert.ok(fullExport.tokens.spacing);
    assert.ok(fullExport.tokens.radius);
    assert.ok(fullExport.tokens.layout);
  });

  await t.test("3. JSON serialization produces valid, safe JSON without sensitive fields", () => {
    const payload = generateExportPayload(["colors", "typography", "spacing", "radius"]);
    const serialized = JSON.stringify(payload);
    assert.doesNotThrow(() => JSON.parse(serialized));

    // Excludes secrets, passwords, or runtime env
    assert.equal(serialized.includes("password"), false);
    assert.equal(serialized.includes("secret"), false);
    assert.equal(serialized.includes("cookie"), false);
  });

  await t.test("4. Empty and malformed JSON files are rejected with informative errors", () => {
    const emptyResult = validateImportPayload("", "empty.json", 0);
    assert.equal(emptyResult.status, "invalid");
    assert.ok(emptyResult.errors.some((e) => e.includes("empty")));

    const malformedResult = validateImportPayload("{ bad json: 123", "bad.json", 15);
    assert.equal(malformedResult.status, "invalid");
    assert.ok(malformedResult.errors.some((e) => e.includes("Malformed JSON")));
  });

  await t.test("5. File size limits (2MB) are enforced strictly", () => {
    const oversizedBytes = MAX_IMPORT_FILE_SIZE + 1024;
    const oversizedResult = validateImportPayload("{}", "huge.json", oversizedBytes);
    assert.equal(oversizedResult.status, "invalid");
    assert.ok(oversizedResult.errors.some((e) => e.includes("exceeds the 2MB application limit")));
  });

  await t.test("6. Unsupported properties are recorded as warnings without crashing", () => {
    const jsonWithUnknown = JSON.stringify({
      schemaVersion: "1.0.0",
      unknownCustomField: "should_warn",
      tokens: {
        colors: {
          primaryViolet: "#7956C9",
        },
      },
    });

    const result = validateImportPayload(jsonWithUnknown, "tokens.json", 120);
    assert.equal(result.status, "valid_with_warnings");
    assert.ok(result.warnings.some((w) => w.includes("unknownCustomField")));
    assert.equal(result.invalidEntries, 0);
    assert.ok(result.tokensDetected > 0);
  });

  await t.test("7. Invalid token values (hex colors and spacing bounds) are detected and flagged", () => {
    const invalidJson = JSON.stringify({
      schemaVersion: "1.0.0",
      tokens: {
        colors: {
          primaryViolet: "invalid-not-a-hex",
        },
        spacing: {
          scale: [
            { id: "space-1", value: 9999, unit: "px" }, // out of bounds
          ],
        },
      },
    });

    const result = validateImportPayload(invalidJson, "invalid.json", 200);
    assert.equal(result.status, "invalid");
    assert.ok(result.invalidEntries >= 2);
    assert.ok(result.errors.some((e) => e.includes("Invalid color format")));
    assert.ok(result.errors.some((e) => e.includes("between 0 and 500 px")));
  });

  await t.test("8. Real token comparison accurately detects added, modified, and unchanged tokens", () => {
    const current = getDesignSystemConfig();
    const testJson = JSON.stringify({
      schemaVersion: "1.0.0",
      tokens: {
        colors: {
          primaryViolet: current.colorTokens.primaryViolet, // unchanged
          softLavender: "#FF00FF", // modified
        },
      },
    });

    const result = validateImportPayload(testJson, "test.json", 150);
    assert.equal(result.status, "valid");
    assert.equal(result.unchangedTokens, 1);
    assert.equal(result.modifiedTokens, 1);
    assert.equal(result.invalidEntries, 0);

    const softLavDiff = result.diffs.find((d) => d.token === "color.softLavender");
    assert.ok(softLavDiff);
    assert.equal(softLavDiff.changeType, "modified");
    assert.equal(softLavDiff.newValue, "#FF00FF");
  });

  await t.test("9. Draft import safely persists updates without publishing live configuration", () => {
    const current = getDesignSystemConfig();
    const testPayload = {
      schemaVersion: "1.0.0",
      source: "Test Import",
      exportedAt: new Date().toISOString(),
      categories: ["colors"],
      tokens: {
        colors: {
          ...current.colorTokens,
          primaryViolet: "#6A42C2",
        },
      },
    };

    const importResult = applyImportAsDraft(testPayload, current, saveDesignSystemDraft, "Automated Test Admin");
    assert.equal(importResult.success, true);
    assert.ok(importResult.config);

    // Verify draft status is maintained and not published
    assert.equal(importResult.config.status, "draft");
    assert.equal(importResult.config.colorTokens.primaryViolet, "#6A42C2");

    // Check directly from persistence reader
    const updated = getDesignSystemConfig();
    assert.equal(updated.colorTokens.primaryViolet, "#6A42C2");
    assert.equal(updated.status, "draft");
  });

  await t.test("10. Utility: formatBytes handles various sizes accurately", () => {
    assert.equal(formatBytes(0), "0 B");
    assert.equal(formatBytes(512), "512.0 B");
    assert.equal(formatBytes(2048), "2.0 KB");
    assert.equal(formatBytes(1048576), "1.0 MB");
  });
});
