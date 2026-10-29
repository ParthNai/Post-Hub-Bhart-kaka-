import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  INITIAL_TOKEN_INVENTORY,
  INITIAL_USAGE_SUMMARY,
  getTokenUsageData,
  runTokenUsageScan,
  resetTokenUsageScan,
} from "../lib/token-usage.ts";

test("Screen 09 — Design Token Usage & Dependencies Test Suite", async (t) => {
  const dataDir = path.join(process.cwd(), ".data");
  const scanFile = path.join(dataDir, "token-usage-scan.json");
  let backupContent = null;

  if (fs.existsSync(scanFile)) {
    backupContent = fs.readFileSync(scanFile, "utf-8");
  }

  t.after(() => {
    // Restore backup
    if (backupContent !== null) {
      fs.writeFileSync(scanFile, backupContent, "utf-8");
    } else if (fs.existsSync(scanFile)) {
      fs.unlinkSync(scanFile);
    }
  });

  await t.test("1. Initializes with 8 canonical reference tokens matching reference image", () => {
    assert.equal(INITIAL_TOKEN_INVENTORY.length, 8);

    const ids = INITIAL_TOKEN_INVENTORY.map((t) => t.id);
    assert.deepEqual(ids, [
      "color.primary",
      "color.text.primary",
      "typography.body",
      "typography.heading 1",
      "spacing.4",
      "spacing.6",
      "radius.medium",
      "layout.content.maxWidth",
    ]);

    const colorPrimary = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "color.primary");
    assert.equal(colorPrimary.category, "Colors");
    assert.equal(colorPrimary.value, "#7956C9");
    assert.equal(colorPrimary.status, "indexed");

    const colorText = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "color.text.primary");
    assert.equal(colorText.category, "Colors");
    assert.equal(colorText.value, "#24213A");
    assert.equal(colorText.status, "indexed");

    const typoBody = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "typography.body");
    assert.equal(typoBody.category, "Typography");
    assert.equal(typoBody.value, "16 px");
    assert.equal(typoBody.status, "indexed");

    const typoHeading = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "typography.heading 1");
    assert.equal(typoHeading.category, "Typography");
    assert.equal(typoHeading.value, "32 px");
    assert.equal(typoHeading.status, "indexed");

    const spacing4 = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "spacing.4");
    assert.equal(spacing4.category, "Spacing");
    assert.equal(spacing4.value, "16 px");
    assert.equal(spacing4.status, "no_references");

    const spacing6 = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "spacing.6");
    assert.equal(spacing6.category, "Spacing");
    assert.equal(spacing6.value, "32 px");
    assert.equal(spacing6.status, "indexed");

    const radiusMedium = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "radius.medium");
    assert.equal(radiusMedium.category, "Radius");
    assert.equal(radiusMedium.value, "8 px");
    assert.equal(radiusMedium.status, "not_scanned");

    const layoutMax = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "layout.content.maxWidth");
    assert.equal(layoutMax.category, "Layout");
    assert.equal(layoutMax.value, "1200 px");
    assert.equal(layoutMax.status, "unavailable");
  });

  await t.test("2. Initial summary metrics truthfully report unconfigured state", () => {
    assert.equal(INITIAL_USAGE_SUMMARY.tokensIndexed, null);
    assert.equal(INITIAL_USAGE_SUMMARY.componentsLinked, null);
    assert.equal(INITIAL_USAGE_SUMMARY.screensReferenced, null);
    assert.equal(INITIAL_USAGE_SUMMARY.lastScan, null);
    assert.equal(INITIAL_USAGE_SUMMARY.scanStatus, "not_checked");
    assert.equal(INITIAL_USAGE_SUMMARY.dataSource, "Not configured");
    assert.equal(INITIAL_USAGE_SUMMARY.lastVerified, "Not available");
  });

  await t.test("3. Category partitioning partitions inventory accurately", () => {
    const colors = INITIAL_TOKEN_INVENTORY.filter((t) => t.category === "Colors");
    const typography = INITIAL_TOKEN_INVENTORY.filter((t) => t.category === "Typography");
    const spacing = INITIAL_TOKEN_INVENTORY.filter((t) => t.category === "Spacing");
    const radius = INITIAL_TOKEN_INVENTORY.filter((t) => t.category === "Radius");
    const layout = INITIAL_TOKEN_INVENTORY.filter((t) => t.category === "Layout");

    assert.equal(colors.length, 2);
    assert.equal(typography.length, 2);
    assert.equal(spacing.length, 2);
    assert.equal(radius.length, 1);
    assert.equal(layout.length, 1);
    assert.equal(colors.length + typography.length + spacing.length + radius.length + layout.length, 8);
  });

  await t.test("4. Verified token references contain file paths and components", () => {
    const colorPrimary = INITIAL_TOKEN_INVENTORY.find((t) => t.id === "color.primary");
    assert.ok(colorPrimary.references.components.length >= 3);
    assert.ok(colorPrimary.references.screens.length >= 2);
    assert.ok(colorPrimary.references.stylesheets.length >= 1);

    const buttonRef = colorPrimary.references.components.find((c) => c.name === "Button");
    assert.ok(buttonRef);
    assert.equal(buttonRef.file, "components/Button.tsx");
  });

  await t.test("5. Scanner execution discovers references, increments metrics and updates status", () => {
    const scanResult = runTokenUsageScan();
    assert.equal(scanResult.success, true);
    assert.ok(scanResult.summary.tokensIndexed >= 5);
    assert.ok(scanResult.summary.componentsLinked >= 4);
    assert.ok(scanResult.summary.screensReferenced >= 2);
    assert.equal(scanResult.summary.scanStatus, "completed");
    assert.equal(scanResult.summary.dataSource, "Project source code scanner");
    assert.ok(scanResult.summary.lastScan.length > 0);

    // Verify radius.medium transitioned to indexed
    const radiusItem = scanResult.tokens.find((t) => t.id === "radius.medium");
    assert.equal(radiusItem.status, "indexed");
    assert.ok(radiusItem.references.components.length > 0);

    // Verify disk persistence
    const reloaded = getTokenUsageData();
    assert.equal(reloaded.summary.scanStatus, "completed");
    assert.equal(reloaded.summary.tokensIndexed, scanResult.summary.tokensIndexed);
  });

  await t.test("6. Reset scanner restores canonical unscanned initial state", () => {
    const resetResult = resetTokenUsageScan();
    assert.equal(resetResult.summary.scanStatus, "not_checked");
    assert.equal(resetResult.summary.tokensIndexed, null);

    const reloaded = getTokenUsageData();
    assert.equal(reloaded.summary.scanStatus, "not_checked");
  });
});
