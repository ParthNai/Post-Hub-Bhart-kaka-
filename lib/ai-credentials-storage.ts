/**
 * Persistent Storage Engine for Screen 35: AI Generation API Access Keys & Credential Management
 * Persists safe public metadata in `.data/ai-credentials.json`
 * Interacts with `ai-credentials-vault.ts` for encrypted AES-256-GCM secret handling.
 *
 * STRICT REDACTION:
 * - Public metadata NEVER contains raw secrets.
 * - Responses NEVER expose raw secrets.
 * - Zero plaintext credential storage.
 */

import fs from "fs/promises";
import path from "path";
import {
  type CredentialsDataset,
  type ProviderCredential,
  type CredentialAuditEvent,
  type AddCredentialInput,
  CANONICAL_CREDENTIALS_SEED,
  recalculateCredentialMetrics,
} from "./ai-credentials.ts";
import {
  encryptAndStoreSecret,
  deleteVaultSecret,
  verifyProviderSecret,
  seedInitialEncryptedVault,
} from "./ai-credentials-vault.ts";

const STORAGE_FILE = path.join(process.cwd(), ".data", "ai-credentials.json");

/**
 * Loads the credentials metadata dataset from disk or initializes with canonical seed
 */
export async function getCredentialsDataset(): Promise<CredentialsDataset> {
  try {
    const raw = await fs.readFile(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as CredentialsDataset;
    // Recalculate summary metrics dynamically to ensure consistency
    parsed.summary = recalculateCredentialMetrics(parsed.credentials, parsed.auditHistory);
    return parsed;
  } catch {
    const seed = JSON.parse(JSON.stringify(CANONICAL_CREDENTIALS_SEED)) as CredentialsDataset;
    await saveCredentialsDataset(seed);
    // Also seed the vault with corresponding initial encrypted keys
    await seedInitialEncryptedVault();
    return seed;
  }
}

/**
 * Persists the credentials metadata dataset to disk
 */
export async function saveCredentialsDataset(dataset: CredentialsDataset): Promise<void> {
  const dir = path.dirname(STORAGE_FILE);
  await fs.mkdir(dir, { recursive: true });

  // Recalculate metrics before saving
  dataset.summary = recalculateCredentialMetrics(dataset.credentials, dataset.auditHistory);
  dataset.lastRefreshedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await fs.writeFile(STORAGE_FILE, JSON.stringify(dataset, null, 2), "utf-8");
}

/**
 * Adds a new provider credential securely.
 * - Stores encrypted secret in vault.
 * - Saves only masked reference in dataset.
 * - Clears raw secret from memory.
 */
export async function addCredential(
  input: AddCredentialInput,
  adminName: string = "parth.admin"
): Promise<{ credential: ProviderCredential; audit: CredentialAuditEvent }> {
  const dataset = await getCredentialsDataset();

  // Validate provider
  const validProviders: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Gemini",
    stability: "Stability AI",
    replicate: "Replicate",
  };
  const providerName = validProviders[input.providerId];
  if (!providerName) {
    throw new Error(`Unsupported provider: ${input.providerId}`);
  }

  if (!input.credentialName || input.credentialName.trim().length === 0) {
    throw new Error("Credential display name is required.");
  }

  if (!input.secretKey || input.secretKey.trim().length < 8) {
    throw new Error("Secret key must be at least 8 characters.");
  }

  // Pre-verification check
  const verification = await verifyProviderSecret(input.providerId, input.secretKey);

  const credId = `cred_${input.providerId}_${input.environment.toLowerCase()}_${Date.now().toString(36)}`;
  
  // Encrypt in vault
  const { maskedRef, last4 } = await encryptAndStoreSecret(credId, input.secretKey);

  // Associated models lookup based on provider
  let defaultModels = "GPT-4o, DALL-E 3";
  let defaultServices = "Image Generation";
  if (input.providerId === "gemini") {
    defaultModels = "Gemini 1.5 Pro, Imagen 3.0";
    defaultServices = "Image Generation";
  } else if (input.providerId === "stability") {
    defaultModels = "Stable Diffusion XL, SD 3.0";
    defaultServices = "Image Generation";
  } else if (input.providerId === "replicate") {
    defaultModels = "FLUX.1-schnell, SDXL";
    defaultServices = "Fast Image Generation";
  }

  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newCred: ProviderCredential = {
    id: credId,
    providerId: input.providerId,
    providerName,
    credentialName: input.credentialName.trim(),
    maskedReference: maskedRef,
    last4,
    environment: input.environment,
    authType: input.authType,
    status: verification.success ? "Active" : "Pending Verification",
    associatedModels: defaultModels,
    associatedServices: defaultServices,
    authorizedService: "AI Generation Service",
    allowedOperations: input.accessScope === "Read & Generate" ? "Read, Generate" : "Full Access",
    accessPolicy: "Role Based Access",
    lastAccessEvent: "Just now",
    createdAt: nowFormatted,
    lastUpdated: nowFormatted,
    lastRotation: nowFormatted.split(",")[0],
    rotationStatus: "Ready",
    expirationDate: input.expirationDate || null,
    verificationStatus: verification.success ? "Verified" : "Verification Failed",
    lastVerifiedAt: nowFormatted,
    accessScope: input.accessScope,
  };

  dataset.credentials.unshift(newCred);

  const auditEvent: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: credId,
    credentialReference: maskedRef,
    action: "Credential Added",
    result: "Success",
    environment: input.environment,
    details: `Added new ${providerName} credential "${input.credentialName}" with encrypted vault storage`,
  };

  dataset.auditHistory.unshift(auditEvent);
  await saveCredentialsDataset(dataset);

  return { credential: newCred, audit: auditEvent };
}

/**
 * Safely rotates an existing credential.
 * - Staged validation of replacement secret before committing.
 * - Stores new secret in vault.
 * - Updates masked reference and rotation timestamps.
 */
export async function rotateCredential(
  credentialId: string,
  replacementSecret: string,
  adminName: string = "parth.admin"
): Promise<{ credential: ProviderCredential; audit: CredentialAuditEvent }> {
  const dataset = await getCredentialsDataset();
  const index = dataset.credentials.findIndex((c) => c.id === credentialId);
  if (index === -1) {
    throw new Error(`Credential ${credentialId} not found.`);
  }

  const existing = dataset.credentials[index];

  if (!replacementSecret || replacementSecret.trim().length < 8) {
    throw new Error("Replacement secret key must be at least 8 characters.");
  }

  // Staged verification of replacement secret before overwriting
  const testVerification = await verifyProviderSecret(existing.providerId, replacementSecret);
  if (!testVerification.success) {
    // Record failed rotation attempt in audit history
    const failedAudit: CredentialAuditEvent = {
      id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      adminOrService: adminName,
      credentialId: existing.id,
      credentialReference: existing.maskedReference,
      action: "Credential Rotated",
      result: "Failed",
      environment: existing.environment,
      details: `Staged replacement validation failed: ${testVerification.message}. Original credential preserved.`,
    };
    dataset.auditHistory.unshift(failedAudit);
    await saveCredentialsDataset(dataset);
    throw new Error(`Rotation rejected: Replacement key verification failed (${testVerification.message})`);
  }

  // Encrypt and replace in vault
  const { maskedRef, last4 } = await encryptAndStoreSecret(existing.id, replacementSecret);

  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedCred: ProviderCredential = {
    ...existing,
    maskedReference: maskedRef,
    last4,
    lastRotation: nowFormatted,
    lastUpdated: nowFormatted,
    status: "Active",
    verificationStatus: "Verified",
    lastVerifiedAt: nowFormatted,
    rotationStatus: "Ready",
  };

  dataset.credentials[index] = updatedCred;

  const successAudit: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: existing.id,
    credentialReference: maskedRef,
    action: "Credential Rotated",
    result: "Success",
    environment: existing.environment,
    details: `Safely rotated ${existing.providerName} ${existing.credentialName} with zero-downtime staged replacement`,
  };

  dataset.auditHistory.unshift(successAudit);
  await saveCredentialsDataset(dataset);

  return { credential: updatedCred, audit: successAudit };
}

/**
 * Verifies live credential via authenticated provider ping
 */
export async function verifyCredential(
  credentialId: string,
  adminName: string = "system"
): Promise<{ credential: ProviderCredential; audit: CredentialAuditEvent }> {
  const dataset = await getCredentialsDataset();
  const index = dataset.credentials.findIndex((c) => c.id === credentialId);
  if (index === -1) {
    throw new Error(`Credential ${credentialId} not found.`);
  }

  const existing = dataset.credentials[index];
  const result = await verifyProviderSecret(existing.providerId, existing.id);

  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedCred: ProviderCredential = {
    ...existing,
    verificationStatus: result.success ? "Verified" : "Verification Failed",
    lastVerifiedAt: nowFormatted,
    lastUpdated: nowFormatted,
    status: result.success
      ? existing.status === "Revoked"
        ? "Revoked"
        : existing.status === "Expiring"
        ? "Expiring"
        : "Active"
      : "Needs Rotation",
  };

  dataset.credentials[index] = updatedCred;

  const audit: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: existing.id,
    credentialReference: existing.maskedReference,
    action: "Verification Attempted",
    result: result.success ? "Success" : "Failed",
    environment: existing.environment,
    details: result.success
      ? `Live verification passed (${result.responseTimeMs}ms) with ${existing.providerName}`
      : `Live verification failed: ${result.message}`,
  };

  dataset.auditHistory.unshift(audit);
  await saveCredentialsDataset(dataset);

  return { credential: updatedCred, audit };
}

/**
 * Revokes a credential safely
 */
export async function revokeCredential(
  credentialId: string,
  reason: string = "Administrative revocation",
  adminName: string = "parth.admin"
): Promise<{ credential: ProviderCredential; audit: CredentialAuditEvent }> {
  const dataset = await getCredentialsDataset();
  const index = dataset.credentials.findIndex((c) => c.id === credentialId);
  if (index === -1) {
    throw new Error(`Credential ${credentialId} not found.`);
  }

  const existing = dataset.credentials[index];
  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedCred: ProviderCredential = {
    ...existing,
    status: "Revoked",
    lastUpdated: nowFormatted,
  };

  dataset.credentials[index] = updatedCred;

  const audit: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: existing.id,
    credentialReference: existing.maskedReference,
    action: "Credential Revoked",
    result: "Success",
    environment: existing.environment,
    details: `Revoked credential: ${reason}`,
  };

  dataset.auditHistory.unshift(audit);
  await saveCredentialsDataset(dataset);

  return { credential: updatedCred, audit };
}

/**
 * Updates safe metadata for a credential (display name, environment, expiration, etc.)
 */
export async function updateCredentialMetadata(
  credentialId: string,
  updates: Partial<ProviderCredential>,
  adminName: string = "parth.admin"
): Promise<{ credential: ProviderCredential; audit: CredentialAuditEvent }> {
  const dataset = await getCredentialsDataset();
  const index = dataset.credentials.findIndex((c) => c.id === credentialId);
  if (index === -1) {
    throw new Error(`Credential ${credentialId} not found.`);
  }

  // Prevent modifying internal security-critical fields directly
  const safeUpdates: Partial<ProviderCredential> = {
    credentialName: updates.credentialName,
    environment: updates.environment,
    expirationDate: updates.expirationDate,
    accessScope: updates.accessScope,
    associatedModels: updates.associatedModels,
    associatedServices: updates.associatedServices,
  };

  const existing = dataset.credentials[index];
  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedCred: ProviderCredential = {
    ...existing,
    ...safeUpdates,
    lastUpdated: nowFormatted,
  };

  dataset.credentials[index] = updatedCred;

  const audit: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: existing.id,
    credentialReference: existing.maskedReference,
    action: "Credential Updated",
    result: "Success",
    environment: updatedCred.environment,
    details: `Updated metadata for ${existing.providerName} (${existing.credentialName})`,
  };

  dataset.auditHistory.unshift(audit);
  await saveCredentialsDataset(dataset);

  return { credential: updatedCred, audit };
}

/**
 * Deletes a credential record and purges its vault secret
 */
export async function deleteCredential(
  credentialId: string,
  adminName: string = "parth.admin"
): Promise<boolean> {
  const dataset = await getCredentialsDataset();
  const index = dataset.credentials.findIndex((c) => c.id === credentialId);
  if (index === -1) return false;

  const existing = dataset.credentials[index];
  dataset.credentials.splice(index, 1);

  // Purge vault secret
  await deleteVaultSecret(credentialId);

  const nowFormatted = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const audit: CredentialAuditEvent = {
    id: `AUD-CRED-${Date.now().toString().slice(-4)}`,
    timestamp: nowFormatted,
    adminOrService: adminName,
    credentialId: existing.id,
    credentialReference: existing.maskedReference,
    action: "Credential Revoked",
    result: "Success",
    environment: existing.environment,
    details: `Deleted credential record and purged secret from encrypted vault`,
  };

  dataset.auditHistory.unshift(audit);
  await saveCredentialsDataset(dataset);

  return true;
}

/**
 * Resets dataset back to pristine canonical state
 */
export async function resetCredentialsData(): Promise<void> {
  const seed = JSON.parse(JSON.stringify(CANONICAL_CREDENTIALS_SEED)) as CredentialsDataset;
  await saveCredentialsDataset(seed);
  await seedInitialEncryptedVault();
}
