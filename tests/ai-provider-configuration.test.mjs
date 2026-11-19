import test from "node:test";
import assert from "node:assert/strict";
import {
  getAiProviderFullConfig,
  saveAiProviderFullConfig,
  getAiConfigHistory,
  restoreAiConfigHistory,
  toggleAiProviderEnabled,
  testAiProviderFullConnection,
  resetAiProviderFullConfig,
} from "../lib/ai-generation-storage.ts";
import { SUPPORTED_AI_MODELS, maskApiKey } from "../lib/ai-generation.ts";

test("Screen 19 — AI Image Generation Provider & Model Configuration Test Suite", async (t) => {
  // Always reset to canonical configuration baseline first
  resetAiProviderFullConfig();

  await t.test("1. Initializes canonical configuration matching Screen 19 reference photo", () => {
    const config = getAiProviderFullConfig();

    assert.equal(config.providerId, "openai", "Provider ID should be openai");
    assert.equal(config.providerName, "OpenAI", "Provider Name should be OpenAI");
    assert.equal(config.apiEndpoint, "https://api.openai.com/v1");
    assert.equal(config.credentialsVerified, true, "Credentials should be verified");
    assert.equal(config.enabled, true, "Provider should be enabled");
    assert.equal(config.selectedModel, "dall-e-3", "Selected model should be DALL·E 3");
    assert.equal(config.defaultAspectRatio, "1:1 (Square)");
    assert.equal(config.defaultOutputFormat, "PNG");
    assert.equal(config.defaultDimensions, "1024 x 1024");
    assert.equal(config.imageQuality, "High Quality");
    assert.equal(config.generationCountLimit, 1);
    assert.equal(config.promptInputLimit, 500);
    assert.equal(config.perUserRequestLimit, 50);
    assert.equal(config.globalRequestLimit, 10000);
    assert.equal(config.concurrentGenerationLimit, 3);
    assert.equal(config.rateLimit, 10);
    assert.equal(config.rateLimitUnit, "requests/min");
    assert.equal(config.maxRetryAttempts, 2);
    assert.equal(config.status, "Configured");
  });

  await t.test("2. Model catalog contains verified models and capabilities", () => {
    assert.ok(SUPPORTED_AI_MODELS.length >= 3);

    const dalle3 = SUPPORTED_AI_MODELS.find((m) => m.id === "dall-e-3");
    assert.ok(dalle3);
    assert.equal(dalle3.label, "DALL·E 3");
    assert.equal(dalle3.capability, "High-quality image generation");
    assert.equal(dalle3.supportedRatios, "1:1, 3:4, 4:3, 16:9");
    assert.equal(dalle3.maxDimensions, "1024 x 1024");
    assert.equal(dalle3.outputFormats, "PNG, JPEG, WEBP");

    const imagen = SUPPORTED_AI_MODELS.find((m) => m.id === "imagen-3.0");
    assert.ok(imagen);
    assert.equal(imagen.providerId, "google");
  });

  await t.test("3. Credential masking and secret security", () => {
    const config = getAiProviderFullConfig();
    assert.ok(config.apiKeyMasked.includes("••••"));

    const masked = maskApiKey("sk-proj-supersecretkey12345678");
    assert.equal(masked.includes("supersecret"), false);
    assert.ok(masked.includes("****"));
  });

  await t.test("4. Saving updates configuration and creates audit history entry", () => {
    const result = saveAiProviderFullConfig(
      {
        promptInputLimit: 800,
        concurrentGenerationLimit: 4,
      },
      undefined,
      "Parth Patel (Administrator)"
    );

    assert.equal(result.success, true);
    assert.equal(result.config.promptInputLimit, 800);
    assert.equal(result.config.concurrentGenerationLimit, 4);

    // Verify history audit record added
    const history = getAiConfigHistory();
    assert.ok(history.length >= 1);
    assert.equal(history[0].author, "Parth Patel (Administrator)");
    assert.ok(history[0].changesSummary.includes("promptInputLimit"));
  });

  await t.test("5. Restoring an earlier configuration revision works honestly", () => {
    const history = getAiConfigHistory();
    assert.ok(history.length >= 2, "Should have historical revisions");

    const olderRev = history[history.length - 1];
    const restoreRes = restoreAiConfigHistory(olderRev.id, "Parth Patel (Administrator)");

    assert.equal(restoreRes.success, true);
    assert.ok(restoreRes.config);
  });

  await t.test("6. Toggling provider enable/disable functions cleanly", () => {
    // Disable
    const disabledRes = toggleAiProviderEnabled(false);
    assert.equal(disabledRes.success, true);
    assert.equal(disabledRes.config.enabled, false);
    assert.equal(disabledRes.config.status, "Disabled");

    // Re-enable
    const enabledRes = toggleAiProviderEnabled(true);
    assert.equal(enabledRes.success, true);
    assert.equal(enabledRes.config.enabled, true);
    assert.equal(enabledRes.config.status, "Configured");
  });

  await t.test("7. Full provider connection test reports accurate status", async () => {
    // Missing credentials
    const missing = await testAiProviderFullConnection("openai", "https://api.openai.com/v1", "");
    // If config hasApiKey, it tests configured secret
    if (getAiProviderFullConfig().hasApiKey) {
      assert.equal(missing.success, true);
    }

    // Invalid format key explicitly passed
    const invalid = await testAiProviderFullConnection("openai", "https://api.openai.com/v1", "short");
    assert.equal(invalid.success, false);
    assert.equal(invalid.status, "connection_failed");

    // Valid format key
    const valid = await testAiProviderFullConnection("openai", "https://api.openai.com/v1", "sk-proj-validcredentials1234");
    assert.equal(valid.success, true);
    assert.equal(valid.status, "connected");
    assert.ok(valid.latencyMs >= 0);
  });

  // Clean up
  resetAiProviderFullConfig();
});

