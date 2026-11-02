export type AiGenerationStatus =
  | "completed"
  | "processing"
  | "failed"
  | "pending"
  | "cancelled";

export type AiProviderId = "openai" | "google" | "stability";

export type AiFormat = "PNG" | "JPG" | "WEBP";

export type AiStyle =
  | "Traditional"
  | "Corporate Minimal"
  | "Academic Modern"
  | "Bold Retail"
  | "Festive Night"
  | "Abstract 3D";

export type AiAspectRatio = "3:4" | "4:5" | "9:16" | "1:1";

export interface AiModelSpec {
  id: string;
  label: string;
  providerId: AiProviderId;
  capability: string;
  supportedRatios: string;
  maxDimensions: string;
  outputFormats: string;
}

export const SUPPORTED_AI_MODELS: AiModelSpec[] = [
  {
    id: "dall-e-3",
    label: "DALL·E 3",
    providerId: "openai",
    capability: "High-quality image generation",
    supportedRatios: "1:1, 3:4, 4:3, 16:9",
    maxDimensions: "1024 x 1024",
    outputFormats: "PNG, JPEG, WEBP",
  },
  {
    id: "dall-e-2",
    label: "DALL·E 2",
    providerId: "openai",
    capability: "Fast generation and lightweight editing",
    supportedRatios: "1:1",
    maxDimensions: "1024 x 1024",
    outputFormats: "PNG, JPEG",
  },
  {
    id: "imagen-3.0",
    label: "Google Imagen 3.0",
    providerId: "google",
    capability: "Photorealistic graphic design",
    supportedRatios: "1:1, 3:4, 4:5, 16:9",
    maxDimensions: "1536 x 1536",
    outputFormats: "PNG, JPEG, WEBP",
  },
  {
    id: "sd3-medium",
    label: "Stable Diffusion 3 Medium",
    providerId: "stability",
    capability: "Multi-subject text-to-image",
    supportedRatios: "1:1, 4:5, 16:9",
    maxDimensions: "1024 x 1024",
    outputFormats: "PNG, WEBP",
  },
];

export interface AiProviderFullConfig {
  providerId: AiProviderId;
  providerName: string;
  apiEndpoint: string;
  apiKeyMasked: string;
  hasApiKey: boolean;
  credentialsVerified: boolean;
  lastVerifiedAt: string;
  enabled: boolean;
  selectedModel: string;
  defaultAspectRatio: string;
  defaultOutputFormat: string;
  defaultDimensions: string;
  imageQuality: string;
  generationCountLimit: number;
  promptInputLimit: number;
  perUserRequestLimit: number;
  globalRequestLimit: number;
  concurrentGenerationLimit: number;
  rateLimit: number;
  rateLimitUnit: string;
  maxRetryAttempts: number;
  lastSavedAt: string;
  status: "Configured" | "Disabled" | "Not Configured";
}

export interface AiConfigHistoryItem {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changesSummary: string;
  configSnapshot: Partial<AiProviderFullConfig>;
}

export interface AiProviderConfig {
  providerId: AiProviderId;
  name: string;
  model: string;
  status: "not_configured" | "connected" | "verification_failed";
  hasApiKey: boolean;
  apiKeyMasked: string;
  lastVerifiedAt: string | null;
  defaultResolution: string;
  quality: "standard" | "hd";
  supportedCapabilities: string[];
  latencyMs?: number;
}

export interface AiGenerationRequest {
  id: string; // e.g., "REQ-001247"
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  prompt: string;
  promptPreview: string;
  format: AiFormat;
  dimensions: string; // e.g., "1080 × 1350 px"
  aspectRatio: AiAspectRatio;
  style: AiStyle;
  provider: string; // e.g., "OpenAI (DALL-E 3)"
  providerId: AiProviderId;
  model: string; // e.g., "dall-e-3"
  submittedAt: string; // e.g., "Oct 28, 2026 04:32 PM"
  submittedTimestamp: number;
  completedAt: string | null;
  status: AiGenerationStatus;
  errorMessage?: string | null;
  cancellationReason?: string | null;
  headline: string;
  subheadline: string;
  ctaText?: string;
  themeColor: string;
  retryCount: number;
  seed?: number;
  costUsd?: number;
  imageUrl?: string;
}

export interface AiGenerationMetrics {
  totalRequests: number;
  totalChange: string;
  completedCount: number;
  completedChange: string;
  successRate: string;
  failedCount: number;
  failedChange: string;
  failureRate: string;
  pendingCount: number;
  pendingChange: string;
  pendingLabel: string;
}

export interface AiGenerationSettings {
  maxConcurrentGenerations: number;
  defaultAspectRatio: AiAspectRatio;
  safetyFilter: "strict" | "standard" | "permissive";
  autoRetryFailed: boolean;
  webhookUrl?: string;
}

export interface AiRequestFilterOptions {
  query?: string;
  status?: string;
  provider?: string;
  timeRange?: string; // "7d" | "30d" | "90d" | "all"
  format?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "submittedAt" | "id" | "status";
  sortOrder?: "asc" | "desc";
}

export interface AiRequestsPaginationResponse {
  requests: AiGenerationRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  metrics: AiGenerationMetrics;
  providerConfig: AiProviderConfig;
}

/**
 * Masks an API key for safe presentation to administrators (e.g. "sk-...****4a9b")
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.trim().length === 0) return "";
  const clean = apiKey.trim();
  if (clean.length <= 8) return "••••••••";
  const prefix = clean.substring(0, 3);
  const suffix = clean.substring(clean.length - 4);
  return `${prefix}...****${suffix}`;
}

/**
 * Filter requests in memory with multiple criteria
 */
export function filterAiRequests(
  requests: AiGenerationRequest[],
  options: AiRequestFilterOptions
): { filtered: AiGenerationRequest[]; total: number } {
  let list = [...requests];

  // 1. Text search (Request ID, User Name, Prompt)
  if (options.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.prompt.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q)
    );
  }

  // 2. Status filter
  if (options.status && options.status !== "all" && options.status !== "All Statuses") {
    const s = options.status.toLowerCase();
    list = list.filter((r) => r.status.toLowerCase() === s);
  }

  // 3. Provider filter
  if (options.provider && options.provider !== "all" && options.provider !== "All Providers") {
    const p = options.provider.toLowerCase();
    list = list.filter(
      (r) =>
        r.provider.toLowerCase().includes(p) ||
        r.providerId.toLowerCase() === p
    );
  }

  // 4. Format filter
  if (options.format && options.format !== "all" && options.format !== "All Formats") {
    const f = options.format.toUpperCase();
    list = list.filter((r) => r.format.toUpperCase() === f);
  }

  // 5. Time range filter
  if (options.timeRange && options.timeRange !== "all" && options.timeRange !== "All Time") {
    const now = Date.now();
    let cutoff = 0;
    if (options.timeRange === "7d" || options.timeRange === "Last 7 Days") {
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
    } else if (options.timeRange === "30d" || options.timeRange === "Last 30 Days") {
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
    } else if (options.timeRange === "90d" || options.timeRange === "Last 90 Days") {
      cutoff = now - 90 * 24 * 60 * 60 * 1000;
    }
    if (cutoff > 0) {
      list = list.filter((r) => r.submittedTimestamp >= cutoff);
    }
  }

  // Sort by submitted timestamp descending by default
  list.sort((a, b) => b.submittedTimestamp - a.submittedTimestamp);

  return { filtered: list, total: list.length };
}

