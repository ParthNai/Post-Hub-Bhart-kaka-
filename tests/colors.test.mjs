import test from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_COLOR_TOKENS,
  isValidHex,
  normalizeHex,
  hexToRgb,
  formatRgbString,
  calculateRelativeLuminance,
  calculateContrastRatio,
} from "../lib/color-tokens.ts";

test("Screen 06 — Color Tokens Editor Test Suite", async (t) => {
  await t.test("1. Initializes with 6 canonical reference color tokens and keys", () => {
    assert.equal(INITIAL_COLOR_TOKENS.length, 6);

    const keys = INITIAL_COLOR_TOKENS.map((t) => t.key);
    assert.deepEqual(keys, [
      "color.primary",
      "color.lavender",
      "color.ivory",
      "color.text.primary",
      "color.text.secondary",
      "color.border",
    ]);

    const primary = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.primary");
    assert.equal(primary.name, "Primary Violet");
    assert.equal(primary.hex, "#7956C9");
    assert.equal(primary.category, "Brand");

    const lavender = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.lavender");
    assert.equal(lavender.name, "Soft Lavender");
    assert.equal(lavender.hex, "#E8DFF5");
    assert.equal(lavender.category, "Brand");

    const ivory = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.ivory");
    assert.equal(ivory.name, "Warm Ivory");
    assert.equal(ivory.hex, "#FAF7F2");
    assert.equal(ivory.category, "Backgrounds");

    const textPrimary = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.text.primary");
    assert.equal(textPrimary.name, "Main Text");
    assert.equal(textPrimary.hex, "#24213A");
    assert.equal(textPrimary.category, "Text");

    const textSecondary = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.text.secondary");
    assert.equal(textSecondary.name, "Secondary Text");
    assert.equal(textSecondary.hex, "#777184");
    assert.equal(textSecondary.category, "Text");

    const border = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.border");
    assert.equal(border.name, "Border");
    assert.equal(border.hex, "#EAE4EE");
    assert.equal(border.category, "Borders");
  });

  await t.test("2. Hex validation and normalization", () => {
    assert.equal(isValidHex("#7956C9"), true);
    assert.equal(isValidHex("#fff"), true);
    assert.equal(isValidHex("#24213A"), true);
    assert.equal(isValidHex("7956C9"), false, "Missing '#' must be rejected");
    assert.equal(isValidHex("#12345"), false, "5-digit hex must be rejected");
    assert.equal(isValidHex("#GGGGGG"), false, "Non-hex characters rejected");
    assert.equal(isValidHex("<script>"), false, "Script injection rejected");

    assert.equal(normalizeHex("#fff"), "#FFFFFF");
    assert.equal(normalizeHex("#7956c9"), "#7956C9");
  });

  await t.test("3. Hex to RGB conversion with precision", () => {
    const primaryRgb = hexToRgb("#7956C9");
    assert.deepEqual(primaryRgb, { r: 121, g: 86, b: 201 });
    assert.equal(formatRgbString(primaryRgb.r, primaryRgb.g, primaryRgb.b), "121, 86, 201");

    const textRgb = hexToRgb("#24213A");
    assert.deepEqual(textRgb, { r: 36, g: 33, b: 58 });
    assert.equal(formatRgbString(textRgb.r, textRgb.g, textRgb.b), "36, 33, 58");

    const whiteRgb = hexToRgb("#FFFFFF");
    assert.deepEqual(whiteRgb, { r: 255, g: 255, b: 255 });
    assert.equal(formatRgbString(whiteRgb.r, whiteRgb.g, whiteRgb.b), "255, 255, 255");
  });

  await t.test("4. WCAG 2.1 relative luminance and contrast ratio calculations", () => {
    // Relative luminance test
    const lumPrimary = calculateRelativeLuminance(121, 86, 201);
    const lumText = calculateRelativeLuminance(36, 33, 58);
    const lumWhite = calculateRelativeLuminance(255, 255, 255);

    assert.ok(lumPrimary > lumText, "Primary violet must be lighter than main text");
    assert.ok(lumWhite > lumPrimary, "White must be lighter than primary violet");

    // Contrast check for reference pair: Main Text (#24213A) on Primary Violet (#7956C9)
    const resultRef = calculateContrastRatio("#7956C9", "#24213A");
    assert.equal(resultRef.ratioFormatted, "2.95 : 1");
    assert.equal(resultRef.meetsNormalAA, false, "2.95:1 does not meet WCAG AA for normal text (requires >= 4.5:1)");
    assert.equal(resultRef.statusText, "Does not meet WCAG AA");

    // Contrast check for accessible pair: White (#FFFFFF) on Primary Violet (#7956C9)
    const resultAccessible = calculateContrastRatio("#7956C9", "#FFFFFF");
    assert.ok(resultAccessible.ratio >= 4.5, "White on Primary Violet passes WCAG AA");
    assert.equal(resultAccessible.meetsNormalAA, true);
    assert.equal(resultAccessible.statusText, "Meets WCAG AA");

    // High contrast pair: Main Text (#24213A) on White (#FFFFFF)
    const resultHighContrast = calculateContrastRatio("#24213A", "#FFFFFF");
    assert.ok(resultHighContrast.ratio >= 7.0, "Main Text on White passes WCAG AAA");
    assert.equal(resultHighContrast.meetsAAA, true);
    assert.equal(resultHighContrast.statusText, "Passes WCAG AAA (Enhanced)");
  });

  await t.test("5. Primary Violet usage registry defines 4 supported component areas", () => {
    const primary = INITIAL_COLOR_TOKENS.find((t) => t.key === "color.primary");
    assert.ok(primary.usage, "Primary token must have usage definitions");
    assert.equal(primary.usage.length, 4);

    const titles = primary.usage.map((u) => u.title);
    assert.ok(titles.includes("Primary buttons"));
    assert.ok(titles.includes("Active navigation"));
    assert.ok(titles.includes("Interactive links"));
    assert.ok(titles.includes("Selected controls"));
  });

  await t.test("6. Category filtering logic partitions tokens accurately", () => {
    const brandTokens = INITIAL_COLOR_TOKENS.filter((t) => t.category === "Brand");
    assert.equal(brandTokens.length, 2);

    const bgTokens = INITIAL_COLOR_TOKENS.filter((t) => t.category === "Backgrounds");
    assert.equal(bgTokens.length, 1);

    const textTokens = INITIAL_COLOR_TOKENS.filter((t) => t.category === "Text");
    assert.equal(textTokens.length, 2);

    const borderTokens = INITIAL_COLOR_TOKENS.filter((t) => t.category === "Borders");
    assert.equal(borderTokens.length, 1);
  });
});
