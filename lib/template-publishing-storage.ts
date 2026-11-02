import fs from "fs";
import path from "path";
import {
  type TemplatePublicationRecord,
  type PublishingSettings,
  runPrePublishValidation,
} from "./template-publishing.ts";
import { getTemplateById, saveTemplates, getTemplates } from "./templates-storage.ts";
import { getCategories } from "./template-categories-storage.ts";

const DATA_DIR = path.join(process.cwd(), ".data");
const PUBLICATIONS_FILE = path.join(DATA_DIR, "template-publications.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Format current timestamp: "Oct 28, 2026 10:24 AM"
 */
function formatCurrentTimestamp(): string {
  const date = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");

  return `${month} ${day}, ${year} ${strHours}:${minutes} ${ampm}`;
}

export function getPublications(): TemplatePublicationRecord[] {
  ensureDataDir();
  if (!fs.existsSync(PUBLICATIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(PUBLICATIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePublications(records: TemplatePublicationRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(records, null, 2), "utf-8");
}

/**
 * Execute publishing operation
 */
export function publishTemplateWorkflow(
  templateId: string,
  settings: Partial<PublishingSettings> = {},
  publishedBy: string = "Parth Patel"
): {
  success: boolean;
  publication?: TemplatePublicationRecord;
  error?: string;
} {
  const template = getTemplateById(templateId);
  if (!template) {
    return { success: false, error: `Template with ID "${templateId}" not found.` };
  }

  const categories = getCategories();
  const { checks, readiness } = runPrePublishValidation(template, categories);

  if (!readiness.canPublish) {
    return {
      success: false,
      error: `Cannot publish template: ${readiness.failedCount} blocking validation check(s) failed.`,
    };
  }

  // Update template record status
  const allTemplates = getTemplates();
  const index = allTemplates.findIndex((t) => t.id === templateId);
  if (index !== -1) {
    allTemplates[index] = {
      ...allTemplates[index],
      status: "Published",
      updatedAt: formatCurrentTimestamp(),
    };
    saveTemplates(allTemplates);
  }

  const now = formatCurrentTimestamp();
  const publicationRecord: TemplatePublicationRecord = {
    templateId,
    revision: "v1.2",
    publishedAt: now,
    publishedBy,
    targetChannel: settings.targetChannel || "Production - App Store / Play Store",
    accessPermission: settings.accessPermission || "Public - All Users",
    revisionNote: settings.revisionNote || "Refreshed promotional poster publication.",
    validationSummary: {
      passed: checks.filter((c) => c.status === "Passed").length,
      warnings: checks.filter((c) => c.status === "Warning").length,
      failed: checks.filter((c) => c.status === "Failed").length,
    },
  };

  const publications = getPublications();
  publications.unshift(publicationRecord);
  savePublications(publications);

  return {
    success: true,
    publication: publicationRecord,
  };
}
