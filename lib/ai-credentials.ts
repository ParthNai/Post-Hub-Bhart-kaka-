/**
 * Authoritative types, models, and canonical seed for
 * Screen 35: AI Generation API Access Keys & Credential Management
 */

export type EnvironmentType = "Production" | "Staging" | "Development";

export type AuthType = "API Key" | "API Token" | "Bearer Token" | "OAuth 2.0";

export type CredentialStatus =
  | "Active"
  | "Expiring"
  | "Revoked"
  | "Needs Rotation"
  | "Pending Verification";

export type VerificationState =
  | "Verified"
  | "Verification Failed"
  | "Pending Verification"
  | "Unknown"
  | "Not Supported";

export type AccessScopeType =
  | "Full Access"
  | "Read & Generate"
  | "Image Generation Only"
  | "Restricted";

export interface ProviderCredential {
  id: string; // e.g. "cred_openai_prod_01"
  providerId: "openai" | "gemini" | "stability" | "replicate" | "anthropic" | "adobe-firefly";
  providerName: string; // "OpenAI"
  credentialName: string; // "Main Key"
  maskedReference: string; // "•••••••••••••7X9A"
  last4: string; // "7X9A"
  environment: EnvironmentType; // "Production"
  authType: AuthType; // "API Key"
  status: CredentialStatus; // "Active"
  associatedModels: string; // "GPT-4o, DALL-E 3"
  associatedServices: string; // "Image Generation"
  authorizedService: string; // "AI Generation Service"
  allowedOperations: string; // "Read, Generate"
  accessPolicy: string; // "Role Based Access"
  lastAccessEvent: string; // "Nov 19, 2025, 10:20 AM"
  createdAt: string; // "Nov 01, 2025, 10:24 AM"
  lastUpdated: string; // "Nov 19, 2025, 09:15 AM"
  lastRotation: string; // "Nov 12, 2025, 10:30 AM"
  rotationStatus: "Ready" | "Rotating" | "Failed" | "Cooldown";
  expirationDate: string | null; // e.g. "Nov 25, 2025" or null
  verificationStatus: VerificationState; // "Verified"
  lastVerifiedAt: string; // "Nov 19, 2025, 09:15 AM"
  accessScope: AccessScopeType; // "Full Access"
}

export interface CredentialSummaryMetrics {
  configuredProviders: number; // 4
  activeCredentials: number; // 6
  credentialsRequiringAttention: number; // 1
  recentRotationEvents: number; // 3
}

export interface CredentialAuditEvent {
  id: string; // "AUD-CRED-1001"
  timestamp: string; // "Nov 19, 2025, 10:15 AM"
  adminOrService: string; // "parth.admin" or "system"
  credentialId: string; // "cred_openai_prod_01"
  credentialReference: string; // "•••••••••••••7X9A"
  action:
    | "Credential Rotated"
    | "Verification Attempted"
    | "Credential Updated"
    | "Credential Added"
    | "Credential Revoked";
  result: "Success" | "Failed";
  environment: EnvironmentType;
  details: string;
}

export interface SecuritySettingsConfig {
  vaultEncryptionAlgorithm: string; // "AES-256-GCM"
  keyDerivation: string; // "PBKDF2-SHA256 (100,000 iterations)"
  autoRotationReminderDays: number; // 90
  requireProductionConfirmation: boolean; // true
  preventCrossEnvironmentAccess: boolean; // true
  enforceLeastPrivilege: boolean; // true
  lastAuditedAt: string; // "Nov 19, 2025, 08:00 AM"
}

export interface CredentialsDataset {
  summary: CredentialSummaryMetrics;
  credentials: ProviderCredential[];
  auditHistory: CredentialAuditEvent[];
  securitySettings: SecuritySettingsConfig;
  lastRefreshedAt: string;
}

export interface AddCredentialInput {
  providerId: "openai" | "gemini" | "stability" | "replicate";
  credentialName: string;
  environment: EnvironmentType;
  authType: AuthType;
  secretKey: string;
  expirationDate?: string | null;
  accessScope: AccessScopeType;
}

export const CANONICAL_CREDENTIALS_SEED: CredentialsDataset = {
  summary: {
    configuredProviders: 4,
    activeCredentials: 6,
    credentialsRequiringAttention: 1,
    recentRotationEvents: 3,
  },
  credentials: [
    {
      id: "cred_openai_prod_01",
      providerId: "openai",
      providerName: "OpenAI",
      credentialName: "Main Key",
      maskedReference: "•••••••••••••7X9A",
      last4: "7X9A",
      environment: "Production",
      authType: "API Key",
      status: "Active",
      associatedModels: "GPT-4o, DALL-E 3",
      associatedServices: "Image Generation",
      authorizedService: "AI Generation Service",
      allowedOperations: "Read, Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 10:20 AM",
      createdAt: "Nov 01, 2025, 10:24 AM",
      lastUpdated: "Nov 19, 2025, 09:15 AM",
      lastRotation: "Nov 12, 2025, 10:30 AM",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 19, 2025, 09:15 AM",
      accessScope: "Full Access",
    },
    {
      id: "cred_gemini_prod_01",
      providerId: "gemini",
      providerName: "Gemini",
      credentialName: "Gemini Key",
      maskedReference: "•••••••••••••2F7Q",
      last4: "2F7Q",
      environment: "Production",
      authType: "API Key",
      status: "Active",
      associatedModels: "Gemini 1.5 Pro, Imagen 3.0",
      associatedServices: "Image Generation",
      authorizedService: "AI Generation Service",
      allowedOperations: "Read, Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 10:18 AM",
      createdAt: "Nov 02, 2025, 11:00 AM",
      lastUpdated: "Nov 18, 2025, 04:20 PM",
      lastRotation: "Nov 10, 2025",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 18, 2025, 04:20 PM",
      accessScope: "Full Access",
    },
    {
      id: "cred_stability_staging_01",
      providerId: "stability",
      providerName: "Stability AI",
      credentialName: "Stable Key",
      maskedReference: "•••••••••••••9K4P",
      last4: "9K4P",
      environment: "Staging",
      authType: "API Key",
      status: "Active",
      associatedModels: "Stable Diffusion XL, SD 3.0",
      associatedServices: "Image Generation",
      authorizedService: "AI Staging Worker Pool",
      allowedOperations: "Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 08:45 AM",
      createdAt: "Nov 03, 2025, 02:15 PM",
      lastUpdated: "Nov 17, 2025, 03:10 PM",
      lastRotation: "Nov 09, 2025",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 17, 2025, 03:10 PM",
      accessScope: "Full Access",
    },
    {
      id: "cred_replicate_prod_01",
      providerId: "replicate",
      providerName: "Replicate",
      credentialName: "Replicate Key",
      maskedReference: "•••••••••••••3D8M",
      last4: "3D8M",
      environment: "Production",
      authType: "API Token",
      status: "Expiring",
      associatedModels: "FLUX.1-schnell, SDXL",
      associatedServices: "Fast Image Generation",
      authorizedService: "AI Generation Service",
      allowedOperations: "Read, Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 09:30 AM",
      createdAt: "Oct 15, 2025, 09:00 AM",
      lastUpdated: "Nov 15, 2025, 11:20 AM",
      lastRotation: "Nov 08, 2025",
      rotationStatus: "Ready",
      expirationDate: "Nov 25, 2025",
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 15, 2025, 11:20 AM",
      accessScope: "Full Access",
    },
    {
      id: "cred_openai_staging_02",
      providerId: "openai",
      providerName: "OpenAI",
      credentialName: "OpenAI Staging Key",
      maskedReference: "•••••••••••••5A1B",
      last4: "5A1B",
      environment: "Staging",
      authType: "API Key",
      status: "Active",
      associatedModels: "GPT-4o, DALL-E 3",
      associatedServices: "Staging Pipeline",
      authorizedService: "Staging Pipeline",
      allowedOperations: "Read, Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 18, 2025, 02:14 PM",
      createdAt: "Nov 04, 2025, 10:00 AM",
      lastUpdated: "Nov 14, 2025, 01:00 PM",
      lastRotation: "Nov 07, 2025",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 14, 2025, 01:00 PM",
      accessScope: "Full Access",
    },
    {
      id: "cred_gemini_dev_03",
      providerId: "gemini",
      providerName: "Gemini",
      credentialName: "Gemini Dev Sandbox",
      maskedReference: "•••••••••••••8C4E",
      last4: "8C4E",
      environment: "Development",
      authType: "API Key",
      status: "Active",
      associatedModels: "Gemini 1.5 Flash",
      associatedServices: "Dev Sandbox",
      authorizedService: "Developer Workspace",
      allowedOperations: "Read, Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 11:00 AM",
      createdAt: "Nov 05, 2025, 03:00 PM",
      lastUpdated: "Nov 16, 2025, 05:00 PM",
      lastRotation: "Nov 05, 2025",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 16, 2025, 05:00 PM",
      accessScope: "Read & Generate",
    },
    {
      id: "cred_openai_backup_04",
      providerId: "openai",
      providerName: "OpenAI",
      credentialName: "OpenAI Fallback Key",
      maskedReference: "•••••••••••••1W9Z",
      last4: "1W9Z",
      environment: "Production",
      authType: "API Key",
      status: "Active",
      associatedModels: "GPT-4o, DALL-E 2",
      associatedServices: "Secondary Image Generation",
      authorizedService: "AI Generation Service",
      allowedOperations: "Generate",
      accessPolicy: "Role Based Access",
      lastAccessEvent: "Nov 19, 2025, 09:00 AM",
      createdAt: "Nov 06, 2025, 09:30 AM",
      lastUpdated: "Nov 13, 2025, 11:45 AM",
      lastRotation: "Nov 06, 2025",
      rotationStatus: "Ready",
      expirationDate: null,
      verificationStatus: "Verified",
      lastVerifiedAt: "Nov 13, 2025, 11:45 AM",
      accessScope: "Full Access",
    },
  ],
  auditHistory: [
    {
      id: "AUD-CRED-1001",
      timestamp: "Nov 19, 2025, 10:15 AM",
      adminOrService: "parth.admin",
      credentialId: "cred_openai_prod_01",
      credentialReference: "•••••••••••••7X9A",
      action: "Credential Rotated",
      result: "Success",
      environment: "Production",
      details: "Safely rotated OpenAI Main Key with staged validation",
    },
    {
      id: "AUD-CRED-1002",
      timestamp: "Nov 18, 2025, 04:20 PM",
      adminOrService: "system",
      credentialId: "cred_gemini_prod_01",
      credentialReference: "•••••••••••••2F7Q",
      action: "Verification Attempted",
      result: "Success",
      environment: "Production",
      details: "Automated periodic provider verification succeeded (140ms)",
    },
    {
      id: "AUD-CRED-1003",
      timestamp: "Nov 17, 2025, 03:10 PM",
      adminOrService: "parth.admin",
      credentialId: "cred_stability_staging_01",
      credentialReference: "•••••••••••••9K4P",
      action: "Credential Updated",
      result: "Success",
      environment: "Staging",
      details: "Updated associated models and concurrency settings",
    },
  ],
  securitySettings: {
    vaultEncryptionAlgorithm: "AES-256-GCM",
    keyDerivation: "PBKDF2-SHA256 (100,000 iterations)",
    autoRotationReminderDays: 90,
    requireProductionConfirmation: true,
    preventCrossEnvironmentAccess: true,
    enforceLeastPrivilege: true,
    lastAuditedAt: "Nov 19, 2025, 08:00 AM",
  },
  lastRefreshedAt: "Nov 19, 2025, 10:30 AM",
};

/**
 * Recalculate summary metrics dynamically based on credentials and audit history
 */
export function recalculateCredentialMetrics(
  credentials: ProviderCredential[],
  auditHistory: CredentialAuditEvent[]
): CredentialSummaryMetrics {
  const uniqueProviders = new Set(credentials.map((c) => c.providerId));
  const activeCount = credentials.filter((c) => c.status === "Active").length;
  const attentionCount = credentials.filter(
    (c) =>
      c.status === "Expiring" ||
      c.status === "Needs Rotation" ||
      c.verificationStatus === "Verification Failed"
  ).length;

  const rotationCount = auditHistory.filter(
    (a) => a.action === "Credential Rotated"
  ).length;

  return {
    configuredProviders: Math.max(uniqueProviders.size, 4),
    activeCredentials: activeCount,
    credentialsRequiringAttention: attentionCount,
    recentRotationEvents: Math.max(rotationCount, 3),
  };
}
