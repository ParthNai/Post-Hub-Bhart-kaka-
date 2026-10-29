export type TemplateStatus = "Published" | "Draft" | "Archived";
export type TemplateCategory = "Business" | "Festival" | "Education" | "Promotion" | "Custom";
export type TemplateFormat = "3:4" | "4:5" | "9:16" | "1:1";

export interface PosterTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  format: TemplateFormat;
  status: TemplateStatus;
  updatedAt: string;
  fileSize: string;
  description: string;
  theme: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  primaryColor?: string;
  accentColor?: string;
  tags?: string[];
  aspectRatio: string;
}

export interface TemplateCategoryInfo {
  name: TemplateCategory;
  label: string;
  description: string;
  badgeBg: string;
  badgeColor: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategoryInfo[] = [
  {
    name: "Business",
    label: "Business",
    description: "Corporate flyers, commercial announcements, and professional service posters.",
    badgeBg: "#EDE9FE",
    badgeColor: "#6D28D9",
  },
  {
    name: "Festival",
    label: "Festival",
    description: "Traditional festival greetings, celebratory banners, and seasonal occasion posters.",
    badgeBg: "#FEE2E2",
    badgeColor: "#B91C1C",
  },
  {
    name: "Education",
    label: "Education",
    description: "Academy admissions, educational seminars, coaching classes, and school programs.",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
  },
  {
    name: "Promotion",
    label: "Promotion",
    description: "Retail sale promotions, product discounts, special offers, and event advertisements.",
    badgeBg: "#F3E8FF",
    badgeColor: "#7E22CE",
  },
];

export const CANONICAL_TEMPLATES: PosterTemplate[] = [
  {
    id: "TPL-001",
    name: "Business Promotion Poster",
    category: "Business",
    format: "3:4",
    status: "Published",
    updatedAt: "Apr 12, 2025",
    fileSize: "245 KB",
    description: "Professional corporate poster template designed for modern business marketing, product showcases and B2B services.",
    theme: "corporate-blue",
    headline: "Grow Your Business",
    subheadline: "with Smart Solutions",
    ctaText: "Get Started",
    primaryColor: "#1E3A8A",
    accentColor: "#3B82F6",
    aspectRatio: "3:4",
    tags: ["Corporate", "Marketing", "Agency", "Growth"],
  },
  {
    id: "TPL-002",
    name: "Diwali Festival Greeting",
    category: "Festival",
    format: "4:5",
    status: "Draft",
    updatedAt: "Apr 10, 2025",
    fileSize: "310 KB",
    description: "Traditional illuminated celebration graphic with glowing diya oil lamps and golden festival light bokeh.",
    theme: "festive-gold",
    headline: "Happy Diwali",
    subheadline: "Festival of Lights",
    ctaText: "Best Wishes",
    primaryColor: "#78350F",
    accentColor: "#F59E0B",
    aspectRatio: "4:5",
    tags: ["Festival", "Diwali", "Celebration", "Holiday"],
  },
  {
    id: "TPL-003",
    name: "Education Admission Poster",
    category: "Education",
    format: "9:16",
    status: "Published",
    updatedAt: "Apr 08, 2025",
    fileSize: "290 KB",
    description: "High-conversion educational campaign poster for university admissions, coaching institutes, and career programs.",
    theme: "education-blue",
    headline: "ADMISSION OPEN",
    subheadline: "Build Your Future",
    ctaText: "Apply Now",
    primaryColor: "#0284C7",
    accentColor: "#38BDF8",
    aspectRatio: "9:16",
    tags: ["Admission", "College", "Learning", "Courses"],
  },
  {
    id: "TPL-004",
    name: "Product Promotion Poster",
    category: "Promotion",
    format: "3:4",
    status: "Archived",
    updatedAt: "Apr 05, 2025",
    fileSize: "412 KB",
    description: "Sleek hardware product promotional flyer with feature callouts, acoustic specs, and modern studio aesthetics.",
    theme: "product-dark",
    headline: "Premium Headphones",
    subheadline: "Sound That Moves You",
    ctaText: "Discover More",
    primaryColor: "#18181B",
    accentColor: "#A1A1AA",
    aspectRatio: "3:4",
    tags: ["Hardware", "Gadgets", "Audio", "Promotion"],
  },
  {
    id: "TPL-005",
    name: "Summer Sale Poster",
    category: "Promotion",
    format: "4:5",
    status: "Draft",
    updatedAt: "Apr 03, 2025",
    fileSize: "180 KB",
    description: "Vibrant summer clearance flyer with warm beach aesthetic, palm leaf accents, and discount promotion badge.",
    theme: "summer-warm",
    headline: "Summer Sale",
    subheadline: "UP TO 50% OFF",
    ctaText: "Shop Now",
    primaryColor: "#EA580C",
    accentColor: "#F97316",
    aspectRatio: "4:5",
    tags: ["Summer", "Sale", "Discount", "Shopping"],
  },
  {
    id: "TPL-006",
    name: "Real Estate Poster",
    category: "Business",
    format: "3:4",
    status: "Published",
    updatedAt: "Apr 01, 2025",
    fileSize: "520 KB",
    description: "Luxury real estate property listing showcase template with architectural layout highlights and property features.",
    theme: "real-estate",
    headline: "Find Your Dream Home",
    subheadline: "Modern Living Spaces",
    ctaText: "View Property",
    primaryColor: "#065F46",
    accentColor: "#10B981",
    aspectRatio: "3:4",
    tags: ["Real Estate", "Luxury", "Architecture", "Property"],
  },
  {
    id: "TPL-007",
    name: "Tech Conference Poster",
    category: "Business",
    format: "9:16",
    status: "Draft",
    updatedAt: "Mar 28, 2025",
    fileSize: "340 KB",
    description: "Futuristic tech summit and developer convention banner with abstract geometric polygons and keynote highlights.",
    theme: "tech-cyber",
    headline: "Innovate Build Grow",
    subheadline: "Technology for a connected future",
    ctaText: "Register Free",
    primaryColor: "#1E40AF",
    accentColor: "#60A5FA",
    aspectRatio: "9:16",
    tags: ["Conference", "Tech", "Keynote", "Innovation"],
  },
  {
    id: "TPL-008",
    name: "Home Decor Poster",
    category: "Promotion",
    format: "4:5",
    status: "Published",
    updatedAt: "Mar 25, 2025",
    fileSize: "275 KB",
    description: "Warm interior styling and furniture collection poster for home design showrooms, staging, and catalogues.",
    theme: "decor-warm",
    headline: "Modern Home Living",
    subheadline: "Style Meets Comfort",
    ctaText: "Explore Collection",
    primaryColor: "#7C2D12",
    accentColor: "#D97706",
    aspectRatio: "4:5",
    tags: ["Interior", "Living", "Furniture", "Home"],
  },
];

export interface TemplateFilterParams {
  query?: string;
  category?: string;
  status?: string;
  format?: string;
  sort?: string;
}

export function filterAndSortTemplates(
  templates: PosterTemplate[],
  filters: TemplateFilterParams
): PosterTemplate[] {
  let result = [...templates];

  // Search filter
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  }

  // Category filter
  if (filters.category && filters.category !== "All Categories" && filters.category !== "All") {
    result = result.filter(
      (item) => item.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  // Status filter
  if (filters.status && filters.status !== "All Statuses" && filters.status !== "All") {
    result = result.filter(
      (item) => item.status.toLowerCase() === filters.status!.toLowerCase()
    );
  }

  // Format filter
  if (filters.format && filters.format !== "All Formats" && filters.format !== "All") {
    result = result.filter((item) => item.format === filters.format);
  }

  // Sort
  const sort = filters.sort || "Recently Updated";
  if (sort === "Recently Updated") {
    // Sort by id descending (TPL-001 ... TPL-008 or date string)
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime() || 0;
      const dateB = new Date(b.updatedAt).getTime() || 0;
      if (dateA !== dateB) return dateB - dateA;
      return b.id.localeCompare(a.id);
    });
  } else if (sort === "Oldest First") {
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime() || 0;
      const dateB = new Date(b.updatedAt).getTime() || 0;
      if (dateA !== dateB) return dateA - dateB;
      return a.id.localeCompare(b.id);
    });
  } else if (sort === "Name (A-Z)" || sort === "Alphabetical") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "Name (Z-A)") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  return result;
}

export function calculateTemplateMetrics(templates: PosterTemplate[]) {
  return {
    total: templates.length,
    published: templates.filter((t) => t.status === "Published").length,
    drafts: templates.filter((t) => t.status === "Draft").length,
    archived: templates.filter((t) => t.status === "Archived").length,
  };
}

export function validateTemplateInput(input: Partial<PosterTemplate>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.name || !input.name.trim()) {
    errors.push("Template name is required.");
  } else if (input.name.trim().length < 3) {
    errors.push("Template name must be at least 3 characters long.");
  }

  const validCategories: TemplateCategory[] = ["Business", "Festival", "Education", "Promotion", "Custom"];
  if (input.category && !validCategories.includes(input.category)) {
    errors.push(`Invalid category: ${input.category}`);
  }

  const validFormats: TemplateFormat[] = ["3:4", "4:5", "9:16", "1:1"];
  if (input.format && !validFormats.includes(input.format)) {
    errors.push(`Invalid format: ${input.format}`);
  }

  const validStatuses: TemplateStatus[] = ["Published", "Draft", "Archived"];
  if (input.status && !validStatuses.includes(input.status)) {
    errors.push(`Invalid status: ${input.status}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
