import fs from "fs";
import path from "path";

export type ScreenCategory = "Navigation" | "Content" | "Creation" | "Account";

export type ScreenStatus = "configured" | "needs_setup" | "not_linked" | "archived";

export interface ScreenVersionHistory {
  version: number;
  savedAt: string;
  author: string;
  changesSummary: string;
}

export interface AppScreen {
  id: string;
  key: string;
  name: string;
  description: string;
  category: ScreenCategory;
  route: string;
  iconName: "Home" | "FileText" | "Sparkles" | "Calendar" | "User" | "Settings";
  status: ScreenStatus;
  statusMessage?: string;
  visibilityEnabled?: boolean;
  minAppVersion?: string;
  supportedCapabilities: string[];
  configData: {
    bannerVisible?: boolean;
    headerTitle?: string;
    itemsPerPage?: number;
    defaultLayout?: string;
    gridColumns?: number;
    tagsFilterEnabled?: boolean;
    quickActionsEnabled?: boolean;
    activeTheme?: string;
    primaryAccent?: string;
    cardRadius?: string;
    showInBottomNav?: boolean;
    deepLinkRoute?: string;
    cacheTtlSeconds?: number;
    refreshOnFocus?: boolean;
    offlineFallback?: boolean;
    sections?: Array<{
      id: string;
      title: string;
      enabled: boolean;
      order: number;
    }>;
    customParams?: Record<string, unknown>;
  };
  draftConfigData?: Record<string, unknown>;
  hasUnpublishedChanges?: boolean;
  version: number;
  lastUpdated: string;
  lastSavedAt?: string;
  history?: ScreenVersionHistory[];
  createdAt: string;
  updatedAt: string;
  isSample: boolean;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const SCREENS_FILE = path.join(DATA_DIR, "screens.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export const SEED_SCREENS: AppScreen[] = [
  {
    id: "scr_home_001",
    key: "home",
    name: "Home",
    description: "Discover templates, create AI images, and explore festival designs.",
    category: "Navigation",
    route: "/home",
    iconName: "Home",
    status: "configured",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: [
      "hero_banner",
      "category_rail",
      "trending_templates",
      "recent_creations",
    ],
    configData: {
      bannerVisible: true,
      headerTitle: "Home",
      itemsPerPage: 12,
      defaultLayout: "grid",
      gridColumns: 3,
      tagsFilterEnabled: true,
      quickActionsEnabled: true,
      activeTheme: "default",
      primaryAccent: "#7956C9",
      cardRadius: "12px",
      showInBottomNav: true,
      deepLinkRoute: "posthub://screens/home",
      cacheTtlSeconds: 3600,
      refreshOnFocus: true,
      offlineFallback: true,
      sections: [
        { id: "hero", title: "Hero Banner", enabled: true, order: 1 },
        { id: "categories", title: "Category Rail", enabled: true, order: 2 },
        { id: "featured_templates", title: "Featured Templates", enabled: true, order: 3 },
        { id: "action_banner", title: "Explore All Templates Action", enabled: true, order: 4 },
      ],
    },
    version: 3,
    lastUpdated: "Oct 24, 2025",
    lastSavedAt: "Not saved yet",
    history: [
      {
        version: 2,
        savedAt: "Oct 22, 2025 at 11:30 AM",
        author: "Content Team",
        changesSummary: "Updated featured templates carousel and category rail tags",
      },
      {
        version: 1,
        savedAt: "Oct 15, 2025 at 09:10 AM",
        author: "Lead Administrator",
        changesSummary: "Initial layout and route mapping",
      },
    ],
    createdAt: "2025-10-01T00:00:00.000Z",
    updatedAt: "2025-10-24T14:30:00.000Z",
    isSample: true,
  },
  {
    id: "scr_templates_002",
    key: "templates",
    name: "Templates",
    description: "Control template browsing, categories, and discovery.",
    category: "Content",
    route: "/templates",
    iconName: "FileText",
    status: "configured",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: [
      "category_filter",
      "search_bar",
      "curated_collections",
      "template_grid",
    ],
    configData: {
      bannerVisible: false,
      headerTitle: "Poster Templates Library",
      itemsPerPage: 24,
      defaultLayout: "masonry",
      tagsFilterEnabled: true,
    },
    version: 2,
    lastUpdated: "Oct 22, 2025",
    lastSavedAt: "Not saved yet",
    createdAt: "2025-10-02T00:00:00.000Z",
    updatedAt: "2025-10-22T11:15:00.000Z",
    isSample: true,
  },
  {
    id: "scr_ai_gen_003",
    key: "ai-generator",
    name: "AI Image Generator",
    description: "Configure the image creation screen and its options.",
    category: "Creation",
    route: "/ai-generator",
    iconName: "Sparkles",
    status: "needs_setup",
    statusMessage: "AI generation models and aspect ratios require validation",
    visibilityEnabled: true,
    minAppVersion: "1.1.0",
    supportedCapabilities: [
      "prompt_input",
      "style_presets",
      "aspect_ratio_picker",
      "generation_queue",
    ],
    configData: {
      bannerVisible: false,
      headerTitle: "AI Studio",
      defaultLayout: "split_canvas",
      quickActionsEnabled: true,
    },
    version: 1,
    lastUpdated: "Oct 20, 2025",
    lastSavedAt: "Not saved yet",
    createdAt: "2025-10-05T00:00:00.000Z",
    updatedAt: "2025-10-20T09:45:00.000Z",
    isSample: true,
  },
  {
    id: "scr_festivals_004",
    key: "festivals",
    name: "Festivals",
    description: "Manage festival collections and seasonal content.",
    category: "Content",
    route: "/festivals",
    iconName: "Calendar",
    status: "configured",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: [
      "calendar_timeline",
      "featured_festivals",
      "regional_filters",
      "countdown_banner",
    ],
    configData: {
      bannerVisible: true,
      headerTitle: "Seasonal & Festival Posters",
      itemsPerPage: 18,
      defaultLayout: "carousel_grid",
      tagsFilterEnabled: true,
    },
    version: 4,
    lastUpdated: "Oct 18, 2025",
    lastSavedAt: "Not saved yet",
    createdAt: "2025-10-08T00:00:00.000Z",
    updatedAt: "2025-10-18T16:20:00.000Z",
    isSample: true,
  },
  {
    id: "scr_creations_005",
    key: "my-creations",
    name: "My Creations",
    description: "Manage how users access their saved creations.",
    category: "Account",
    route: "/my-creations",
    iconName: "User",
    status: "configured",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: [
      "folder_management",
      "export_actions",
      "cloud_sync",
      "trash_recovery",
    ],
    configData: {
      bannerVisible: false,
      headerTitle: "My Saved Designs",
      itemsPerPage: 20,
      defaultLayout: "grid",
    },
    version: 2,
    lastUpdated: "Oct 16, 2025",
    lastSavedAt: "Not saved yet",
    createdAt: "2025-10-10T00:00:00.000Z",
    updatedAt: "2025-10-16T12:00:00.000Z",
    isSample: true,
  },
  {
    id: "scr_profile_006",
    key: "profile-settings",
    name: "Profile & Settings",
    description: "Configure profile information and app preferences.",
    category: "Account",
    route: "/profile",
    iconName: "Settings",
    status: "needs_setup",
    statusMessage: "Subscription tier sync and profile avatar upload pending linkage",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: [
      "profile_avatar",
      "account_tiers",
      "theme_toggle",
      "notification_prefs",
    ],
    configData: {
      bannerVisible: false,
      headerTitle: "User Profile & Account",
      defaultLayout: "form_sections",
    },
    version: 1,
    lastUpdated: "Oct 14, 2025",
    lastSavedAt: "Not saved yet",
    createdAt: "2025-10-12T00:00:00.000Z",
    updatedAt: "2025-10-14T08:30:00.000Z",
    isSample: true,
  },
];

export function initScreensDb(): AppScreen[] {
  ensureDataDir();
  if (!fs.existsSync(SCREENS_FILE)) {
    fs.writeFileSync(SCREENS_FILE, JSON.stringify(SEED_SCREENS, null, 2), "utf-8");
    return SEED_SCREENS;
  }
  const current = getAllScreens();
  // Ensure default screens have the updated fields
  let modified = false;
  const merged = SEED_SCREENS.map((seed) => {
    const existing = current.find((c) => c.key === seed.key || c.id === seed.id);
    if (!existing) {
      modified = true;
      return seed;
    }
    // Enrich with new fields if missing
    if (existing.visibilityEnabled === undefined || !existing.minAppVersion || existing.key === "home") {
      modified = true;
      return {
        ...seed,
        ...existing,
        name: existing.name || seed.name,
        description: seed.key === "home" ? seed.description : (existing.description || seed.description),
        route: seed.key === "home" ? seed.route : (existing.route || seed.route),
        visibilityEnabled: existing.visibilityEnabled ?? true,
        minAppVersion: existing.minAppVersion || "1.0.0",
        configData: {
          ...seed.configData,
          ...existing.configData,
        },
        history: existing.history || seed.history,
      };
    }
    return existing;
  });

  // Keep any custom user-added screens
  current.forEach((c) => {
    if (!merged.some((m) => m.id === c.id || m.key === c.key)) {
      merged.push(c);
      modified = true;
    }
  });

  if (modified) {
    saveScreens(merged);
    return merged;
  }

  return current;
}

export function getAllScreens(): AppScreen[] {
  ensureDataDir();
  if (!fs.existsSync(SCREENS_FILE)) {
    return initScreensDb();
  }
  try {
    const raw = fs.readFileSync(SCREENS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read screens DB:", err);
    return SEED_SCREENS;
  }
}

export function saveScreens(screens: AppScreen[]): void {
  ensureDataDir();
  fs.writeFileSync(SCREENS_FILE, JSON.stringify(screens, null, 2), "utf-8");
}

export function findScreenById(id: string): AppScreen | null {
  const screens = getAllScreens();
  return screens.find((s) => s.id === id) || null;
}

export function findScreenByKey(key: string): AppScreen | null {
  const screens = getAllScreens();
  return screens.find((s) => s.key.toLowerCase() === key.toLowerCase().trim()) || null;
}

export function findScreenByIdOrKey(idOrKey: string): AppScreen | null {
  const screens = getAllScreens();
  const query = idOrKey.toLowerCase().trim();
  return screens.find((s) => s.id === idOrKey || s.key.toLowerCase() === query) || null;
}

export function saveScreenDraft(
  idOrKey: string,
  draft: {
    name?: string;
    description?: string;
    category?: ScreenCategory;
    route?: string;
    visibilityEnabled?: boolean;
    minAppVersion?: string;
    configData?: Partial<AppScreen["configData"]>;
  }
): { screen?: AppScreen; error?: string } {
  const screens = getAllScreens();
  const query = idOrKey.toLowerCase().trim();
  const index = screens.findIndex((s) => s.id === idOrKey || s.key.toLowerCase() === query);

  if (index === -1) {
    return { error: "Screen record not found." };
  }

  // Validate fields
  if (draft.name !== undefined && !draft.name.trim()) {
    return { error: "Screen display name is required." };
  }
  if (draft.description !== undefined && !draft.description.trim()) {
    return { error: "Screen description is required." };
  }
  if (draft.route !== undefined) {
    const r = draft.route.trim();
    if (!r.startsWith("/")) {
      return { error: "Route must begin with a forward slash (e.g. /home)." };
    }
  }
  if (draft.minAppVersion !== undefined) {
    const v = draft.minAppVersion.trim();
    if (!/^\d+(\.\d+)*$/.test(v)) {
      return { error: "Minimum app version must follow semantic format (e.g. 1.0.0)." };
    }
  }

  const dateNow = new Date();
  const formattedTime = dateNow.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = dateNow.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const current = screens[index];
  const newConfigData = draft.configData
    ? { ...current.configData, ...draft.configData }
    : current.configData;

  const history = current.history ? [...current.history] : [];
  history.unshift({
    version: current.version,
    savedAt: `${formattedDate} at ${formattedTime}`,
    author: "Admin Workspace",
    changesSummary: `Draft updated: ${draft.name || current.name}`,
  });

  const updated: AppScreen = {
    ...current,
    name: draft.name !== undefined ? draft.name.trim() : current.name,
    description: draft.description !== undefined ? draft.description.trim() : current.description,
    category: draft.category || current.category,
    route: draft.route !== undefined ? draft.route.trim() : current.route,
    visibilityEnabled: draft.visibilityEnabled !== undefined ? draft.visibilityEnabled : (current.visibilityEnabled ?? true),
    minAppVersion: draft.minAppVersion !== undefined ? draft.minAppVersion.trim() : (current.minAppVersion || "1.0.0"),
    configData: newConfigData,
    draftConfigData: newConfigData,
    hasUnpublishedChanges: true,
    lastSavedAt: `Today at ${formattedTime}`,
    lastUpdated: formattedDate,
    updatedAt: dateNow.toISOString(),
    history: history.slice(0, 10),
  };

  screens[index] = updated;
  saveScreens(screens);
  return { screen: updated };
}

export function createScreen(payload: {
  name: string;
  key: string;
  description: string;
  category: ScreenCategory;
  route?: string;
  iconName?: AppScreen["iconName"];
}): { screen?: AppScreen; error?: string } {
  const screens = getAllScreens();
  const normalizedKey = payload.key.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-");

  if (!payload.name?.trim()) {
    return { error: "Screen name is required." };
  }
  if (!normalizedKey) {
    return { error: "A valid screen key is required." };
  }
  if (!payload.description?.trim()) {
    return { error: "Description is required." };
  }

  // Prevent duplicate keys
  if (screens.some((s) => s.key.toLowerCase() === normalizedKey)) {
    return { error: `A screen with key "${normalizedKey}" already exists.` };
  }

  const dateNow = new Date();
  const formattedDate = dateNow.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newScreen: AppScreen = {
    id: `scr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    key: normalizedKey,
    name: payload.name.trim(),
    description: payload.description.trim(),
    category: payload.category || "Content",
    route: payload.route?.trim() || `/${normalizedKey}`,
    iconName: payload.iconName || "FileText",
    status: "needs_setup",
    statusMessage: "Newly created screen requires layout configuration and publish review",
    visibilityEnabled: true,
    minAppVersion: "1.0.0",
    supportedCapabilities: ["custom_components", "theme_tokens"],
    configData: {
      bannerVisible: false,
      headerTitle: payload.name.trim(),
      itemsPerPage: 10,
      defaultLayout: "grid",
    },
    version: 1,
    lastUpdated: formattedDate,
    lastSavedAt: "Not saved yet",
    createdAt: dateNow.toISOString(),
    updatedAt: dateNow.toISOString(),
    isSample: false,
  };

  screens.push(newScreen);
  saveScreens(screens);
  return { screen: newScreen };
}

export function updateScreen(
  id: string,
  updates: Partial<Omit<AppScreen, "id" | "createdAt">>
): { screen?: AppScreen; error?: string } {
  const screens = getAllScreens();
  const index = screens.findIndex((s) => s.id === id);

  if (index === -1) {
    return { error: "Screen record not found." };
  }

  if (updates.key) {
    const normKey = updates.key.toLowerCase().trim();
    const existing = screens.find((s) => s.key.toLowerCase() === normKey && s.id !== id);
    if (existing) {
      return { error: `Screen key "${normKey}" is already in use by another screen.` };
    }
    updates.key = normKey;
  }

  const dateNow = new Date();
  const formattedDate = dateNow.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const current = screens[index];
  const updated: AppScreen = {
    ...current,
    ...updates,
    version: updates.configData ? current.version + 1 : current.version,
    lastUpdated: formattedDate,
    updatedAt: dateNow.toISOString(),
  };

  screens[index] = updated;
  saveScreens(screens);
  return { screen: updated };
}

export function archiveScreen(id: string): { success: boolean; error?: string } {
  const screens = getAllScreens();
  const index = screens.findIndex((s) => s.id === id);

  if (index === -1) {
    return { success: false, error: "Screen record not found." };
  }

  screens[index].status = "archived";
  screens[index].statusMessage = "Screen archived by administrator";
  screens[index].updatedAt = new Date().toISOString();
  saveScreens(screens);
  return { success: true };
}

export function deleteScreen(id: string): { success: boolean; error?: string } {
  const screens = getAllScreens();
  const filtered = screens.filter((s) => s.id !== id);

  if (filtered.length === screens.length) {
    return { success: false, error: "Screen record not found." };
  }

  saveScreens(filtered);
  return { success: true };
}
