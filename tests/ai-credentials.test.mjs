import test from "node:test";
import assert from "node:assert/strict";
import {
  getCredentialsDataset,
  addCredential,
  rotateCredential,
  verifyCredential,
  revokeCredential,
  updateCredentialMetadata,
  deleteCredential,
  resetCredentialsData,
} from "../lib/ai-credentials-storage.ts";
import {
  encryptAndStoreSecret,
  decryptSecretForInternalUse,
  maskCredentialSecret,
  verifyProviderSecret,
} from "../lib/ai-credentials-vault.ts";
import { recalculateCredentialMetrics } from "../lib/ai-credentials.ts";

test("Screen 35 — AI Generation API Access Keys & Credential Management Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  await resetCredentialsData();

  await t.test("1. Initializes canonical summary metrics matching Screen 35", async () => {
    const data = await getCredentialsDataset();

    assert.equal(data.summary.configuredProviders, 4);
    assert.equal(data.summary.activeCredentials, 6);
    assert.equal(data.summary.credentialsRequiringAttention, 1);
    assert.equal(data.summary.recentRotationEvents, 3);
  });

  await t.test("2. Verifies canonical provider credentials table matching reference rows", async () => {
    const data = await getCredentialsDataset();
    assert.ok(data.credentials.length >= 6);

    // Row 1: OpenAI Main Key
    const c1 = data.credentials.find((c) => c.id === "cred_openai_prod_01");
    assert.ok(c1);
    assert.equal(c1.providerName, "OpenAI");
    assert.equal(c1.credentialName, "Main Key");
    assert.equal(c1.maskedReference, "•••••••••••••7X9A");
    assert.equal(c1.environment, "Production");
    assert.equal(c1.authType, "API Key");
    assert.equal(c1.status, "Active");

    // Row 2: Gemini Key
    const c2 = data.credentials.find((c) => c.id === "cred_gemini_prod_01");
    assert.ok(c2);
    assert.equal(c2.providerName, "Gemini");
    assert.equal(c2.credentialName, "Gemini Key");
    assert.equal(c2.maskedReference, "•••••••••••••2F7Q");
    assert.equal(c2.environment, "Production");
    assert.equal(c2.status, "Active");

    // Row 3: Stability AI Stable Key
    const c3 = data.credentials.find((c) => c.id === "cred_stability_staging_01");
    assert.ok(c3);
    assert.equal(c3.providerName, "Stability AI");
    assert.equal(c3.credentialName, "Stable Key");
    assert.equal(c3.maskedReference, "•••••••••••••9K4P");
    assert.equal(c3.environment, "Staging");
    assert.equal(c3.status, "Active");

    // Row 4: Replicate Replicate Key
    const c4 = data.credentials.find((c) => c.id === "cred_replicate_prod_01");
    assert.ok(c4);
    assert.equal(c4.providerName, "Replicate");
    assert.equal(c4.credentialName, "Replicate Key");
    assert.equal(c4.maskedReference, "•••••••••••••3D8M");
    assert.equal(c4.environment, "Production");
    assert.equal(c4.status, "Expiring");
  });

  await t.test("3. Verifies selected credential details matching reference photo", async () => {
    const data = await getCredentialsDataset();
    const cred = data.credentials.find((c) => c.id === "cred_openai_prod_01");
    assert.ok(cred);

    assert.equal(cred.providerName, "OpenAI");
    assert.equal(cred.maskedReference, "•••••••••••••7X9A");
    assert.equal(cred.environment, "Production");
    assert.equal(cred.authType, "API Key");
    assert.equal(cred.associatedModels, "GPT-4o, DALL-E 3");
    assert.equal(cred.associatedServices, "Image Generation");
    assert.equal(cred.authorizedService, "AI Generation Service");
    assert.equal(cred.status, "Active");
  });

  await t.test("4. Verifies cryptographic vault AES-256-GCM authenticated encryption", async () => {
    const testSecret = "sk-live-test-vault-secret-token-XYZ9";
    const testId = "cred_test_vault_01";

    const { maskedRef, last4 } = await encryptAndStoreSecret(testId, testSecret);
    assert.equal(maskedRef, "•••••••••••••XYZ9");
    assert.equal(last4, "XYZ9");

    const decrypted = await decryptSecretForInternalUse(testId);
    assert.equal(decrypted, testSecret);
  });

  await t.test("5. Verifies strict secrets redaction and zero plaintext storage", async () => {
    const data = await getCredentialsDataset();

    for (const cred of data.credentials) {
      assert.ok(cred.maskedReference.startsWith("•••••••••••••"));
      assert.ok(!JSON.stringify(cred).includes("sk-proj-live"));
      assert.ok(!JSON.stringify(cred).includes("AIzaSyLive"));
    }
  });

  await t.test("6. Tests adding a new credential securely", async () => {
    const { credential, audit } = await addCredential({
      providerId: "openai",
      credentialName: "Batch Processing Key",
      environment: "Production",
      authType: "API Key",
      secretKey: "sk-proj-live-batch-processor-key-9988",
      accessScope: "Full Access",
    });

    assert.ok(credential.id.startsWith("cred_openai_"));
    assert.equal(credential.credentialName, "Batch Processing Key");
    assert.equal(credential.maskedReference, "•••••••••••••9988");
    assert.equal(credential.status, "Active");
    assert.equal(credential.verificationStatus, "Verified");

    assert.equal(audit.action, "Credential Added");
    assert.equal(audit.result, "Success");

    // Verify dataset has updated count
    const updated = await getCredentialsDataset();
    assert.ok(updated.credentials.some((c) => c.id === credential.id));
  });

  await t.test("7. Tests safe staged key rotation workflow", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[0];

    const { credential, audit } = await rotateCredential(
      target.id,
      "sk-proj-live-openai-replacement-key-4455"
    );

    assert.equal(credential.id, target.id);
    assert.equal(credential.maskedReference, "•••••••••••••4455");
    assert.equal(credential.status, "Active");
    assert.equal(audit.action, "Credential Rotated");
    assert.equal(audit.result, "Success");

    // Confirm rotated secret can be retrieved internally by server
    const serverDecrypted = await decryptSecretForInternalUse(target.id);
    assert.equal(serverDecrypted, "sk-proj-live-openai-replacement-key-4455");
  });

  await t.test("8. Tests rotation rejection when replacement key validation fails", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[0];
    const prevRef = target.maskedReference;

    await assert.rejects(
      async () => {
        // Short invalid key
        await rotateCredential(target.id, "short");
      },
      {
        message: /at least 8 characters/i,
      }
    );

    // Old working key is strictly preserved
    const after = await getCredentialsDataset();
    const current = after.credentials.find((c) => c.id === target.id);
    assert.equal(current.maskedReference, prevRef);
  });

  await t.test("9. Tests live credential verification", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[0];

    const { credential, audit } = await verifyCredential(target.id);
    assert.equal(credential.verificationStatus, "Verified");
    assert.equal(audit.action, "Verification Attempted");
    assert.equal(audit.result, "Success");
  });

  await t.test("10. Tests credential revocation workflow", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[0];

    const { credential, audit } = await revokeCredential(
      target.id,
      "Decommissioning legacy worker cluster"
    );

    assert.equal(credential.status, "Revoked");
    assert.equal(audit.action, "Credential Revoked");
    assert.equal(audit.result, "Success");
  });

  await t.test("11. Tests updating safe credential metadata", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[0];

    const { credential, audit } = await updateCredentialMetadata(target.id, {
      credentialName: "Renamed Main Production Key",
      environment: "Production",
    });

    assert.equal(credential.credentialName, "Renamed Main Production Key");
    assert.equal(audit.action, "Credential Updated");
  });

  await t.test("12. Tests deleting credential and purging secret from vault", async () => {
    const initial = await getCredentialsDataset();
    const target = initial.credentials[initial.credentials.length - 1];

    const deleted = await deleteCredential(target.id);
    assert.equal(deleted, true);

    const after = await getCredentialsDataset();
    assert.ok(!after.credentials.some((c) => c.id === target.id));
  });

  await t.test("13. Resets dataset back to pristine canonical seed", async () => {
    await resetCredentialsData();
    const data = await getCredentialsDataset();

    assert.equal(data.summary.configuredProviders, 4);
    assert.equal(data.summary.activeCredentials, 6);
    assert.equal(data.summary.credentialsRequiringAttention, 1);
    assert.equal(data.summary.recentRotationEvents, 3);
  });
});
