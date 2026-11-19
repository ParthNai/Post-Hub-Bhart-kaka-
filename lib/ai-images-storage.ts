import fs from "fs";
import path from "path";
import type {
  AiGeneratedImage,
  AiImageMetrics,
  AiImageModerationSettings,
  AiModerationHistoryItem,
  AiImageFilterOptions,
} from "./ai-images";

const DATA_DIR = path.join(process.cwd(), ".data");
const IMAGES_FILE = path.join(DATA_DIR, "ai-generated-images.json");
const SETTINGS_FILE = path.join(DATA_DIR, "ai-moderation-settings.json");
const HISTORY_FILE = path.join(DATA_DIR, "ai-moderation-history.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Canonical 8 images displayed on Page 1 matching Screen 22 reference photo exactly
export const CANONICAL_PAGE1_IMAGES: AiGeneratedImage[] = [
  {
    id: "IMG-20261028-001",
    requestId: "REQ-001247",
    userId: "USR-001",
    userName: "Parth Patel",
    userAvatar: "/avatars/parth.jpg",
    category: "Festivals & Events",
    prompt: "Diwali festival poster with diyas, traditional design and warm colors.",
    presetName: "Diwali Festival",
    thumbnailType: "diwali",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1080 × 1350 px",
    aspectRatio: "4:5",
    format: "PNG",
    fileSize: "842 KB",
    storagePath: "/storage/generated/IMG-20261028-001.png",
    createdAt: "Oct 28, 2026, 04:32 PM",
    createdTimestamp: 1793284320000,
    moderationStatus: "approved",
    moderationNotes: "Beautiful design. Approved.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 28, 2026, 04:35 PM",
  },
  {
    id: "IMG-20261028-002",
    requestId: "REQ-001246",
    userId: "USR-004",
    userName: "Priya Shah",
    userAvatar: "/avatars/priya.jpg",
    category: "Education",
    prompt: "Education admission poster for 2026-27 with modern campus and smiling student.",
    presetName: "Education Admission",
    thumbnailType: "education",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1024 × 1365 px",
    aspectRatio: "3:4",
    format: "PNG",
    fileSize: "720 KB",
    storagePath: "/storage/generated/IMG-20261028-002.png",
    createdAt: "Oct 28, 2026, 04:28 PM",
    createdTimestamp: 1793284080000,
    moderationStatus: "pending",
  },
  {
    id: "IMG-20261028-003",
    requestId: "REQ-001245",
    userId: "USR-005",
    userName: "Amit Desai",
    userAvatar: "/avatars/amit.jpg",
    category: "Business",
    prompt: "Business growth poster with upward trend bar charts and professional business executive.",
    presetName: "Business Growth",
    thumbnailType: "business",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    dimensions: "1200 × 630 px",
    aspectRatio: "4:5",
    format: "JPG",
    fileSize: "910 KB",
    storagePath: "/storage/generated/IMG-20261028-003.jpg",
    createdAt: "Oct 28, 2026, 04:25 PM",
    createdTimestamp: 1793283900000,
    moderationStatus: "approved",
    moderationNotes: "Complies with business guidelines.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 28, 2026, 04:27 PM",
  },
  {
    id: "IMG-20261028-004",
    requestId: "REQ-001244",
    userId: "USR-006",
    userName: "Neha Patel",
    userAvatar: "/avatars/neha.jpg",
    category: "Festivals & Events",
    prompt: "Happy Navratri festive greeting poster with traditional garba dandiya dancers.",
    presetName: "Festivals & Events",
    thumbnailType: "navratri",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1080 × 1350 px",
    aspectRatio: "4:5",
    format: "PNG",
    fileSize: "680 KB",
    storagePath: "/storage/generated/IMG-20261028-004.png",
    createdAt: "Oct 28, 2026, 04:20 PM",
    createdTimestamp: 1793283600000,
    moderationStatus: "rejected",
    rejectionReason: "Text distortion in traditional arch border",
    moderationNotes: "Ornamental text illegible. Please regenerate.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 28, 2026, 04:22 PM",
  },
  {
    id: "IMG-20261027-001",
    requestId: "REQ-001243",
    userId: "USR-009",
    userName: "Rohan Mehta",
    userAvatar: "/avatars/rohan-m.jpg",
    category: "Offers & Promotions",
    prompt: "Flat 50% off seasonal sneaker sports sale poster with modern shoes on orange background.",
    presetName: "Summer Sale",
    thumbnailType: "shoes",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1080 × 1080 px",
    aspectRatio: "1:1",
    format: "PNG",
    fileSize: "540 KB",
    storagePath: "/storage/generated/IMG-20261027-001.png",
    createdAt: "Oct 27, 2026, 03:40 PM",
    createdTimestamp: 1793197200000,
    moderationStatus: "approved",
    moderationNotes: "Commercial offer verified.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 27, 2026, 03:45 PM",
  },
  {
    id: "IMG-20261027-002",
    requestId: "REQ-001242",
    userId: "USR-010",
    userName: "Jigna Shah",
    userAvatar: "/avatars/jigna.jpg",
    category: "Business",
    prompt: "Dream Big Achieve More motivational corporate poster with soaring blue skyscrapers into sunny sky.",
    presetName: "Corporate Design",
    thumbnailType: "skyscrapers",
    provider: "Google / Imagen",
    providerId: "google",
    model: "Imagen 3.0",
    dimensions: "1080 × 1350 px",
    aspectRatio: "4:5",
    format: "PNG",
    fileSize: "895 KB",
    storagePath: "/storage/generated/IMG-20261027-002.png",
    createdAt: "Oct 27, 2026, 02:15 PM",
    createdTimestamp: 1793192100000,
    moderationStatus: "approved",
    moderationNotes: "High visual quality.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 27, 2026, 02:18 PM",
  },
  {
    id: "IMG-20261027-003",
    requestId: "REQ-001241",
    userId: "USR-011",
    userName: "Karan Patel",
    userAvatar: "/avatars/karan.jpg",
    category: "Festivals & Events",
    prompt: "Happy Dussehra celebration poster with Lord Rama silhouette, golden bow and Ravana effigy background.",
    presetName: "Festivals & Events",
    thumbnailType: "dussehra",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1080 × 1350 px",
    aspectRatio: "4:5",
    format: "JPG",
    fileSize: "765 KB",
    storagePath: "/storage/generated/IMG-20261027-003.jpg",
    createdAt: "Oct 27, 2026, 11:30 AM",
    createdTimestamp: 1793189400000,
    moderationStatus: "pending",
  },
  {
    id: "IMG-20261027-004",
    requestId: "REQ-001240",
    userId: "USR-012",
    userName: "Meera Shah",
    userAvatar: "/avatars/meera.jpg",
    category: "Health & Wellness",
    prompt: "Stay Healthy Stay Fit morning wellness poster with female jogger in green sunlit park.",
    presetName: "Healthcare Clinic",
    thumbnailType: "fitness",
    provider: "OpenAI / DALL-E 3",
    providerId: "openai",
    model: "DALL·E 3",
    dimensions: "1080 × 1350 px",
    aspectRatio: "4:5",
    format: "PNG",
    fileSize: "620 KB",
    storagePath: "/storage/generated/IMG-20261027-004.png",
    createdAt: "Oct 27, 2026, 09:10 AM",
    createdTimestamp: 1793181000000,
    moderationStatus: "approved",
    moderationNotes: "Approved for health campaign.",
    reviewedBy: "Parth Patel",
    reviewedAt: "Oct 27, 2026, 09:15 AM",
  },
];

// Seed generator to produce exactly 1,248 total images:
// Approved: 1,102 (5 from page 1 + 1097 generated)
// Pending: 67 (2 from page 1 + 65 generated)
// Rejected: 79 (1 from page 1 + 78 generated)
// Total = 1,102 + 67 + 79 = 1,248!
function generateSeedImages(): AiGeneratedImage[] {
  const images = [...CANONICAL_PAGE1_IMAGES];
  const baseTime = 1793100000000;

  // 1. Generate 65 additional Pending images (total 67)
  for (let i = 1; i <= 65; i++) {
    const idNum = String(1000 + i);
    const time = baseTime - i * 1800000;
    const date = new Date(time);
    images.push({
      id: `IMG-PND-${idNum}`,
      requestId: `REQ-PND-${idNum}`,
      userId: `USR-${(i % 10) + 1}`,
      userName: i % 2 === 0 ? "Vikram Joshi" : "Ananya Roy",
      category: i % 3 === 0 ? "Education" : i % 2 === 0 ? "Business" : "Festivals & Events",
      prompt: `Creative poster campaign design #${i} for local enterprise branding`,
      presetName: i % 2 === 0 ? "Business Growth" : "Summer Sale",
      thumbnailType: i % 3 === 0 ? "business" : i % 2 === 0 ? "education" : "sale",
      provider: i % 2 === 0 ? "OpenAI / DALL-E 3" : "Google / Imagen",
      providerId: i % 2 === 0 ? "openai" : "google",
      model: i % 2 === 0 ? "DALL·E 3" : "Imagen 3.0",
      dimensions: "1080 × 1350 px",
      aspectRatio: "4:5",
      format: "PNG",
      fileSize: `${600 + (i % 200)} KB`,
      storagePath: `/storage/generated/IMG-PND-${idNum}.png`,
      createdAt: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdTimestamp: time,
      moderationStatus: "pending",
    });
  }

  // 2. Generate 78 additional Rejected images (total 79)
  for (let i = 1; i <= 78; i++) {
    const idNum = String(2000 + i);
    const time = baseTime - i * 3600000;
    const date = new Date(time);
    images.push({
      id: `IMG-REJ-${idNum}`,
      requestId: `REQ-REJ-${idNum}`,
      userId: `USR-${(i % 10) + 1}`,
      userName: i % 2 === 0 ? "Karan Patel" : "Suresh Kumar",
      category: i % 3 === 0 ? "Offers & Promotions" : "Business",
      prompt: `Discount poster concept #${i} with headline text and visual elements`,
      presetName: "Summer Sale",
      thumbnailType: i % 2 === 0 ? "shoes" : "navratri",
      provider: "OpenAI / DALL-E 3",
      providerId: "openai",
      model: "DALL·E 3",
      dimensions: "1080 × 1350 px",
      aspectRatio: "4:5",
      format: "PNG",
      fileSize: `${500 + (i % 300)} KB`,
      storagePath: `/storage/generated/IMG-REJ-${idNum}.png`,
      createdAt: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdTimestamp: time,
      moderationStatus: "rejected",
      rejectionReason: i % 2 === 0 ? "Text distortion" : "Inappropriate content",
      reviewedBy: "Parth Patel",
      reviewedAt: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  // 3. Generate 1097 additional Approved images (total 1,102)
  for (let i = 1; i <= 1097; i++) {
    const idNum = String(3000 + i);
    const time = baseTime - i * 720000;
    const date = new Date(time);
    images.push({
      id: `IMG-APP-${idNum}`,
      requestId: `REQ-APP-${idNum}`,
      userId: `USR-${(i % 10) + 1}`,
      userName: i % 3 === 0 ? "Parth Patel" : i % 2 === 0 ? "Priya Shah" : "Amit Desai",
      category:
        i % 4 === 0
          ? "Festivals & Events"
          : i % 3 === 0
          ? "Business"
          : i % 2 === 0
          ? "Education"
          : "Health & Wellness",
      prompt: `High-quality poster illustration #${i} for commercial distribution`,
      presetName: i % 3 === 0 ? "Diwali Festival" : "Business Growth",
      thumbnailType:
        i % 4 === 0
          ? "diwali"
          : i % 3 === 0
          ? "business"
          : i % 2 === 0
          ? "skyscrapers"
          : "fitness",
      provider: i % 2 === 0 ? "OpenAI / DALL-E 3" : "Google / Imagen",
      providerId: i % 2 === 0 ? "openai" : "google",
      model: i % 2 === 0 ? "DALL·E 3" : "Imagen 3.0",
      dimensions: "1080 × 1350 px",
      aspectRatio: "4:5",
      format: "PNG",
      fileSize: `${700 + (i % 250)} KB`,
      storagePath: `/storage/generated/IMG-APP-${idNum}.png`,
      createdAt: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdTimestamp: time,
      moderationStatus: "approved",
      reviewedBy: "Parth Patel",
      reviewedAt: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  return images;
}

export const CANONICAL_MODERATION_SETTINGS: AiImageModerationSettings = {
  autoApproveSafe: false,
  strictnessLevel: "standard",
  flagNudity: true,
  flagHateSpeech: true,
  flagViolence: true,
  retentionDays: 90,
};

/**
 * Load all images from JSON storage
 */
export function getAllImages(): AiGeneratedImage[] {
  ensureDataDir();
  if (!fs.existsSync(IMAGES_FILE)) {
    const initial = generateSeedImages();
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(IMAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = generateSeedImages();
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  } catch (err) {
    console.error("Error reading images file, falling back to canonical:", err);
    const initial = generateSeedImages();
    return initial;
  }
}

/**
 * Save images to JSON storage
 */
export function saveAllImages(images: AiGeneratedImage[]): void {
  ensureDataDir();
  fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2), "utf-8");
}

/**
 * Compute KPI metrics matching Screen 22 exactly:
 * Total: 1,248 (↑ 12%)
 * Approved: 1,102 (↑ 14%, 88.3% approval rate)
 * Pending: 67 (5.4% pending review)
 * Rejected: 79 (6.3% rejection rate)
 */
export function getImageMetrics(images?: AiGeneratedImage[]): AiImageMetrics {
  const list = images || getAllImages();
  const total = list.length;
  const approved = list.filter((img) => img.moderationStatus === "approved").length;
  const pending = list.filter((img) => img.moderationStatus === "pending").length;
  const rejected = list.filter((img) => img.moderationStatus === "rejected").length;

  const approvalRate = total > 0 ? (approved / total) * 100 : 0;
  const pendingRate = total > 0 ? (pending / total) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;

  return {
    totalImages: total,
    totalChange: "↑ 12%",
    approvedCount: approved,
    approvedChange: "↑ 14%",
    approvalRate: `${approvalRate.toFixed(1)}% approval rate`,
    pendingCount: pending,
    pendingRate: `${pendingRate.toFixed(1)}% pending review`,
    rejectedCount: rejected,
    rejectionRate: `${rejectionRate.toFixed(1)}% rejection rate`,
  };
}

/**
 * Filter, sort, and paginate generated images
 */
export function queryImages(
  options: AiImageFilterOptions = {}
): {
  images: AiGeneratedImage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const all = getAllImages();
  let filtered = [...all];

  // Query search (Image ID or Request ID)
  if (options.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    filtered = filtered.filter(
      (img) =>
        img.id.toLowerCase().includes(q) ||
        img.requestId.toLowerCase().includes(q) ||
        img.userName.toLowerCase().includes(q) ||
        img.prompt.toLowerCase().includes(q)
    );
  }

  // User filter
  if (options.user && options.user !== "All Users" && options.user !== "All") {
    filtered = filtered.filter(
      (img) => img.userName.toLowerCase() === options.user?.toLowerCase()
    );
  }

  // Category filter
  if (options.category && options.category !== "All Categories" && options.category !== "All") {
    filtered = filtered.filter(
      (img) => img.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  // Moderation Status filter
  if (options.status && options.status !== "All Statuses" && options.status !== "All") {
    filtered = filtered.filter(
      (img) => img.moderationStatus.toLowerCase() === options.status?.toLowerCase()
    );
  }

  // Provider filter
  if (options.provider && options.provider !== "All Providers" && options.provider !== "All") {
    filtered = filtered.filter((img) =>
      img.provider.toLowerCase().includes(options.provider?.toLowerCase() || "")
    );
  }

  // Sorting
  if (options.sortBy === "oldest") {
    filtered.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
  } else {
    // Newest first default (keep Page 1 canonical order on initial load)
    filtered.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  }

  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 8;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const images = filtered.slice(startIndex, startIndex + pageSize);

  return {
    images,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Convenient aliases
 */
export function getAllGeneratedImages(): AiGeneratedImage[] {
  return getAllImages();
}

export function queryGeneratedImages(
  options: AiImageFilterOptions = {}
): {
  images: AiGeneratedImage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  return queryImages(options);
}

/**
 * Get image by ID
 */
export function getImageById(id: string): AiGeneratedImage | undefined {
  const all = getAllImages();
  return all.find((img) => img.id === id);
}

/**
 * Moderate single image: Approve
 */
export function approveImage(
  id: string,
  adminName: string = "Parth Patel",
  notes: string = "Approved by Administrator."
): AiGeneratedImage | null {
  const all = getAllImages();
  const index = all.findIndex((img) => img.id === id);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const updated: AiGeneratedImage = {
    ...all[index],
    moderationStatus: "approved",
    moderationNotes: notes,
    reviewedBy: adminName,
    reviewedAt: `${dateStr}, ${timeStr}`,
    rejectionReason: undefined,
  };

  all[index] = updated;
  saveAllImages(all);
  recordModerationHistory(id, "approved", adminName, notes);
  return updated;
}

/**
 * Moderate single image: Reject
 */
export function rejectImage(
  id: string,
  adminName: string = "Parth Patel",
  reason: string = "Does not comply with community guidelines",
  notes?: string
): AiGeneratedImage | null {
  const all = getAllImages();
  const index = all.findIndex((img) => img.id === id);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const updated: AiGeneratedImage = {
    ...all[index],
    moderationStatus: "rejected",
    rejectionReason: reason,
    moderationNotes: notes || reason,
    reviewedBy: adminName,
    reviewedAt: `${dateStr}, ${timeStr}`,
  };

  all[index] = updated;
  saveAllImages(all);
  recordModerationHistory(id, "rejected", adminName, notes, reason);
  return updated;
}

/**
 * Moderate single image: Flag for review
 */
export function flagImage(
  id: string,
  adminName: string = "Parth Patel",
  reason: string = "Flagged for elevated compliance review"
): AiGeneratedImage | null {
  const all = getAllImages();
  const index = all.findIndex((img) => img.id === id);
  if (index === -1) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const updated: AiGeneratedImage = {
    ...all[index],
    moderationStatus: "flagged",
    flagReason: reason,
    moderationNotes: reason,
    reviewedBy: adminName,
    reviewedAt: `${dateStr}, ${timeStr}`,
  };

  all[index] = updated;
  saveAllImages(all);
  recordModerationHistory(id, "flagged", adminName, reason);
  return updated;
}

/**
 * Bulk action on selected image IDs
 */
export function bulkModerateImages(
  ids: string[],
  action: "approve" | "reject" | "archive",
  adminName: string = "Parth Patel",
  reason?: string
): { successCount: number; failedCount: number; count: number } {
  const all = getAllImages();
  let successCount = 0;
  let failedCount = 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const timestampStr = `${dateStr}, ${timeStr}`;

  ids.forEach((id) => {
    const idx = all.findIndex((img) => img.id === id);
    if (idx === -1) {
      failedCount++;
      return;
    }

    if (action === "approve") {
      all[idx] = {
        ...all[idx],
        moderationStatus: "approved",
        reviewedBy: adminName,
        reviewedAt: timestampStr,
        moderationNotes: "Bulk approved by Administrator.",
      };
      recordModerationHistory(id, "approved", adminName, "Bulk approved");
      successCount++;
    } else if (action === "reject") {
      all[idx] = {
        ...all[idx],
        moderationStatus: "rejected",
        rejectionReason: reason || "Bulk rejected",
        reviewedBy: adminName,
        reviewedAt: timestampStr,
        moderationNotes: reason || "Bulk rejected by Administrator.",
      };
      recordModerationHistory(id, "rejected", adminName, reason || "Bulk rejected");
      successCount++;
    } else if (action === "archive") {
      all[idx] = {
        ...all[idx],
        isArchived: true,
      };
      successCount++;
    }
  });

  saveAllImages(all);
  return { successCount, failedCount, count: successCount };
}

/**
 * Audit log recording
 */
function recordModerationHistory(
  imageId: string,
  action: "approved" | "rejected" | "flagged" | "reopened",
  reviewer: string,
  notes?: string,
  reason?: string
): void {
  ensureDataDir();
  let history: AiModerationHistoryItem[] = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    } catch {
      history = [];
    }
  }

  const now = new Date();
  const item: AiModerationHistoryItem = {
    id: `HIST-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    imageId,
    action,
    reviewer,
    timestamp: now.toLocaleString("en-US"),
    notes,
    reason,
  };

  history.unshift(item);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 500), null, 2), "utf-8");
}

export function getModerationHistory(imageId?: string): AiModerationHistoryItem[] {
  ensureDataDir();
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    const list: AiModerationHistoryItem[] = JSON.parse(raw);
    if (imageId) {
      return list.filter((h) => h.imageId === imageId);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Moderation Settings
 */
export function getModerationSettings(): AiImageModerationSettings {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(CANONICAL_MODERATION_SETTINGS, null, 2), "utf-8");
    return { ...CANONICAL_MODERATION_SETTINGS };
  }
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch {
    return { ...CANONICAL_MODERATION_SETTINGS };
  }
}

export function saveModerationSettings(settings: Partial<AiImageModerationSettings>): AiImageModerationSettings {
  ensureDataDir();
  const current = getModerationSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/**
 * Reset Library to canonical dataset
 */
export function resetImageLibrary(): {
  images: AiGeneratedImage[];
  metrics: AiImageMetrics;
  settings: AiImageModerationSettings;
} {
  const canonical = generateSeedImages();
  saveAllImages(canonical);
  saveModerationSettings(CANONICAL_MODERATION_SETTINGS);
  return {
    images: canonical,
    metrics: getImageMetrics(canonical),
    settings: { ...CANONICAL_MODERATION_SETTINGS },
  };
}

