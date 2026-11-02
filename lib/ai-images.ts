export type AiImageModerationStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "flagged";

export interface AiGeneratedImage {
  id: string; // e.g., "IMG-20261028-001"
  requestId: string; // e.g., "REQ-001247"
  userId: string;
  userName: string;
  userAvatar?: string;
  category: string; // e.g., "Festivals & Events", "Education", "Business", "Offers & Promotions", "Health & Wellness"
  prompt: string;
  presetName: string;
  thumbnailType:
    | "diwali"
    | "education"
    | "business"
    | "navratri"
    | "shoes"
    | "skyscrapers"
    | "dussehra"
    | "fitness"
    | "sale"
    | "newyear"
    | "product"
    | "corporate";
  provider: string; // e.g., "OpenAI / DALL-E 3"
  providerId: string;
  model: string;
  dimensions: string; // e.g., "1080 × 1350 px"
  aspectRatio: string; // "4:5", "1:1", "3:4"
  format: string; // "PNG", "JPG"
  fileSize: string; // e.g., "842 KB"
  storagePath: string;
  createdAt: string; // e.g., "Oct 28, 2026, 04:32 PM"
  createdTimestamp: number;
  moderationStatus: AiImageModerationStatus;
  moderationNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  flagReason?: string;
  isArchived?: boolean;
}

export interface AiImageMetrics {
  totalImages: number;
  totalChange: string;
  approvedCount: number;
  approvedChange: string;
  approvalRate: string;
  pendingCount: number;
  pendingRate: string;
  rejectedCount: number;
  rejectionRate: string;
}

export interface AiImageModerationSettings {
  autoApproveSafe: boolean;
  strictnessLevel: "high" | "standard" | "relaxed";
  flagNudity: boolean;
  flagHateSpeech: boolean;
  flagViolence: boolean;
  retentionDays: number;
}

export interface AiModerationHistoryItem {
  id: string;
  imageId: string;
  action: "approved" | "rejected" | "flagged" | "reopened";
  reviewer: string;
  timestamp: string;
  notes?: string;
  reason?: string;
}

export interface AiImageFilterOptions {
  query?: string;
  user?: string;
  category?: string;
  status?: string;
  timeRange?: string; // "7d" | "30d" | "90d" | "all"
  provider?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "newest" | "oldest";
}

export interface AiImagesPaginationResponse {
  images: AiGeneratedImage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  metrics: AiImageMetrics;
  settings: AiImageModerationSettings;
}

/**
 * Generate CSV export text for generated image library records
 */
export function generateImagesCsv(images: AiGeneratedImage[]): string {
  const headers = [
    "Image ID",
    "Request ID",
    "User",
    "Category",
    "Preset",
    "Provider / Model",
    "Dimensions",
    "Format",
    "File Size",
    "Moderation Status",
    "Created At",
    "Reviewed By",
    "Reviewed At",
    "Notes",
    "Prompt",
  ];

  const escapeCsv = (str: string | number | null | undefined): string => {
    if (str === null || str === undefined) return "";
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = images.map((img) => [
    escapeCsv(img.id),
    escapeCsv(img.requestId),
    escapeCsv(img.userName),
    escapeCsv(img.category),
    escapeCsv(img.presetName),
    escapeCsv(img.provider),
    escapeCsv(img.dimensions),
    escapeCsv(img.format),
    escapeCsv(img.fileSize),
    escapeCsv(img.moderationStatus),
    escapeCsv(img.createdAt),
    escapeCsv(img.reviewedBy || "—"),
    escapeCsv(img.reviewedAt || "—"),
    escapeCsv(img.moderationNotes || ""),
    escapeCsv(img.prompt),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

