import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  INITIAL_VERSION_RECORDS,
  INITIAL_VERSION_SUMMARY,
  getVersionHistoryData,
  compareVersions,
  restoreVersionAsDraft,
} from "../lib/version-history.ts";
import { getDesignSystemConfig } from "../lib/design-system.ts";

test("Screen 10 — Design System Change History & Version Comparison Test Suite", async (t) => {
  const dataDir = path.join(process.cwd(), ".data");
  const historyFile = path.join(dataDir, "version-history.json");
  const tokensFile = path.join(dataDir, "design-tokens.json");
  let backupContent = null;
  let tokensBackup = null;

  if (fs.existsSync(historyFile)) {
    backupContent = fs.readFileSync(historyFile, "utf-8");
  }
  if (fs.existsSync(tokensFile)) {
    tokensBackup = fs.readFileSync(tokensFile, "utf-8");
  }

  t.after(() => {
    if (backupContent !== null) {
      fs.writeFileSync(historyFile, backupContent, "utf-8");
    } else if (fs.existsSync(historyFile)) {
      fs.unlinkSync(historyFile);
    }

    if (tokensBackup !== null) {
      fs.writeFileSync(tokensFile, tokensBackup, "utf-8");
    }
  });

  await t.test("1. Initializes with 4 reference versions matching approved reference specifications", () => {
    assert.equal(INITIAL_VERSION_RECORDS.length, 4);

    const ids = INITIAL_VERSION_RECORDS.map((r) => r.id);
    assert.deepEqual(ids, ["v1.0.4", "v1.0.3", "v1.0.2", "v1.0.1"]);

    const v4 = INITIAL_VERSION_RECORDS.find((r) => r.id === "v1.0.4");
    assert.equal(v4.summary, "Typography — Body font size updated");
    assert.equal(v4.author, "System");
    assert.equal(v4.status, "draft");
    assert.equal(v4.changedTokensCount, 12);

    const v3 = INITIAL_VERSION_RECORDS.find((r) => r.id === "v1.0.3");
    assert.equal(v3.summary, "Colors — Primary accent adjusted");
    assert.equal(v3.author, "System");
    assert.equal(v3.status, "published");
    assert.equal(v3.changedTokensCount, 8);

    const v2 = INITIAL_VERSION_RECORDS.find((r) => r.id === "v1.0.2");
    assert.equal(v2.summary, "Spacing — Card padding updated");
    assert.equal(v2.author, "System");
    assert.equal(v2.status, "archived");
    assert.equal(v2.changedTokensCount, 5);

    const v1 = INITIAL_VERSION_RECORDS.find((r) => r.id === "v1.0.1");
    assert.equal(v1.summary, "Layout — Content width updated");
    assert.equal(v1.author, "System");
    assert.equal(v1.status, "failed");
    assert.equal(v1.changedTokensCount, 7);
  });

  await t.test("2. Initial summary metrics truthfully report unconfigured state", () => {
    assert.equal(INITIAL_VERSION_SUMMARY.currentDraft, "No draft");
    assert.equal(INITIAL_VERSION_SUMMARY.lastPublishedVersion, "Not published");
    assert.equal(INITIAL_VERSION_SUMMARY.totalRecordedChanges, "Not available");
    assert.equal(INITIAL_VERSION_SUMMARY.historySource, "Not configured");
    assert.equal(INITIAL_VERSION_SUMMARY.latestConfirmedPublication, "Not available");
  });

  await t.test("3. Version comparison calculates token differences between distinct versions", () => {
    const compResult = compareVersions("v1.0.3", "v1.0.4");
    assert.equal(compResult.success, true);
    assert.ok(compResult.diffs.length >= 3);

    const primaryDiff = compResult.diffs.find((d) => d.tokenId === "color.primary");
    assert.ok(primaryDiff);
    assert.equal(primaryDiff.previousValue, "#7956C9");
    assert.equal(primaryDiff.newValue, "#6F4DB8");
    assert.equal(primaryDiff.changeType, "Modified");

    const spacingDiff = compResult.diffs.find((d) => d.tokenId === "spacing.4");
    assert.ok(spacingDiff);
    assert.equal(spacingDiff.changeType, "Modified");

    const typoDiff = compResult.diffs.find((d) => d.tokenId === "typography.body");
    assert.ok(typoDiff);
    assert.equal(typoDiff.changeType, "Added");
  });

  await t.test("4. Self-comparison produces zero differences", () => {
    const selfComp = compareVersions("v1.0.3", "v1.0.3");
    assert.equal(selfComp.success, true);
    assert.equal(selfComp.diffs.length, 0);
  });

  await t.test("5. Comparison with invalid version returns descriptive error", () => {
    const invalidComp = compareVersions("v9.9.9", "v1.0.4");
    assert.equal(invalidComp.success, false);
    assert.ok(invalidComp.error.includes("Could not locate version records"));
  });

  await t.test("6. Restore as draft safely updates working draft without publishing", () => {
    const restoreResult = restoreVersionAsDraft("v1.0.4", "Unit Test Admin");
    assert.equal(restoreResult.success, true);
    assert.ok(restoreResult.message.includes("v1.0.4"));

    // Verify current config was updated with the snapshot
    const currentConfig = getDesignSystemConfig();
    assert.equal(currentConfig.colorTokens.primaryViolet, "#6F4DB8");

    // Verify draft status is preserved, NOT published
    assert.equal(currentConfig.status, "draft");

    // Verify history data records the restored draft
    const updatedHistory = getVersionHistoryData();
    assert.equal(updatedHistory.summary.currentDraft, "v1.0.4 (Restored)");
  });

  await t.test("7. Restore rejects non-existent version record", () => {
    const badRestore = restoreVersionAsDraft("v99.99.99");
    assert.equal(badRestore.success, false);
    assert.equal(badRestore.error, "Version not found");
  });
});
