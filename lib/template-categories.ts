export type TemplateCategoryStatus = "Active" | "Archived";

export type CategoryIconType =
  | "briefcase"
  | "party-popper"
  | "graduation-cap"
  | "tag"
  | "layout-grid"
  | "snowflake";

export interface TemplateCategoryRecord {
  id: string;
  name: string;
  description: string;
  icon: CategoryIconType;
  status: TemplateCategoryStatus;
  templateCount: number;
  updatedAt: string;
  createdAt?: string;
}

export interface CategoryMetrics {
  total: number;
  active: number;
  unassigned: number;
}

export interface CategoryFilterOptions {
  search?: string;
  status?: "All Statuses" | "Active" | "Archived";
  sort?: "Name A–Z" | "Name Z–A" | "Most Templates" | "Recently Updated";
}

export const CANONICAL_CATEGORIES: TemplateCategoryRecord[] = [
  {
    id: "CAT-001",
    name: "Business",
    description: "Professional templates for business, corporate and work-related posts.",
    icon: "briefcase",
    status: "Active",
    templateCount: 12,
    updatedAt: "Oct 28, 2026 10:24 AM",
    createdAt: "Jan 10, 2026 09:00 AM",
  },
  {
    id: "CAT-002",
    name: "Festivals & Events",
    description: "Templates for festivals, cultural events and special occasions.",
    icon: "party-popper",
    status: "Active",
    templateCount: 24,
    updatedAt: "Oct 27, 2026 03:18 PM",
    createdAt: "Jan 12, 2026 10:30 AM",
  },
  {
    id: "CAT-003",
    name: "Education",
    description: "Educational templates for institutions, coaching and learning content.",
    icon: "graduation-cap",
    status: "Active",
    templateCount: 8,
    updatedAt: "Oct 26, 2026 11:42 AM",
    createdAt: "Jan 15, 2026 02:15 PM",
  },
  {
    id: "CAT-004",
    name: "Product Promotion",
    description: "Templates for product launches, offers and marketing campaigns.",
    icon: "tag",
    status: "Active",
    templateCount: 15,
    updatedAt: "Oct 25, 2026 04:36 PM",
    createdAt: "Jan 18, 2026 11:00 AM",
  },
  {
    id: "CAT-005",
    name: "Social Media",
    description: "Templates optimized for social media platforms and engagement.",
    icon: "layout-grid",
    status: "Archived",
    templateCount: 0,
    updatedAt: "Oct 20, 2026 09:12 AM",
    createdAt: "Jan 20, 2026 04:45 PM",
  },
  {
    id: "CAT-006",
    name: "Seasonal Greetings",
    description: "Templates for seasonal wishes, holidays and annual greetings.",
    icon: "snowflake",
    status: "Active",
    templateCount: 6,
    updatedAt: "Oct 18, 2026 02:45 PM",
    createdAt: "Feb 01, 2026 01:20 PM",
  },
];

/**
 * Calculate Summary Metrics
 */
export function calculateCategoryMetrics(
  categories: TemplateCategoryRecord[],
  unassignedTemplatesCount: number = 18
): CategoryMetrics {
  const total = categories.length;
  const active = categories.filter((c) => c.status === "Active").length;
  return {
    total,
    active,
    unassigned: unassignedTemplatesCount,
  };
}

/**
 * Filter and sort categories
 */
export function filterAndSortCategories(
  categories: TemplateCategoryRecord[],
  options: CategoryFilterOptions
): TemplateCategoryRecord[] {
  let result = [...categories];

  // Search filter (by name or ID)
  if (options.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (options.status && options.status !== "All Statuses") {
    result = result.filter((c) => c.status === options.status);
  }

  // Sorting
  const sort = options.sort || "Name A–Z";
  result.sort((a, b) => {
    switch (sort) {
      case "Name A–Z":
        return a.name.localeCompare(b.name);
      case "Name Z–A":
        return b.name.localeCompare(a.name);
      case "Most Templates":
        return b.templateCount - a.templateCount;
      case "Recently Updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  return result;
}

/**
 * Validate category input
 */
export function validateCategoryInput(
  data: Partial<TemplateCategoryRecord>,
  existingCategories: TemplateCategoryRecord[] = [],
  currentId?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Category name is required.");
  } else if (data.name.trim().length > 60) {
    errors.push("Category name cannot exceed 60 characters.");
  } else {
    // Uniqueness check (case-insensitive)
    const normalized = data.name.trim().toLowerCase();
    const isDuplicate = existingCategories.some(
      (c) => c.name.toLowerCase() === normalized && c.id !== currentId
    );
    if (isDuplicate) {
      errors.push(`A category with the name "${data.name.trim()}" already exists.`);
    }
  }

  if (data.description && data.description.length > 300) {
    errors.push("Description cannot exceed 300 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

