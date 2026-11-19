export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: "Free" | "Pro" | "Team";
  role: "creator" | "designer" | "agency" | "guest";
  organization?: string;
  designsCount: number;
  joinedAt: string;
}

export const PRESET_DEMO_USERS: Record<string, AppUser> = {
  creator: {
    id: "usr_creator_01",
    name: "Sophia Martinez",
    email: "sophia@posthub.design",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    plan: "Pro",
    role: "creator",
    organization: "Sophia Creative Studio",
    designsCount: 34,
    joinedAt: "January 2025",
  },
  agency: {
    id: "usr_agency_02",
    name: "Alex Vance",
    email: "alex@canvasstudio.io",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    plan: "Team",
    role: "agency",
    organization: "Vance Media Co.",
    designsCount: 89,
    joinedAt: "March 2024",
  },
  guest: {
    id: "usr_guest_00",
    name: "Creative Explorer",
    email: "guest@posthub.io",
    avatarUrl: "",
    plan: "Free",
    role: "guest",
    organization: "Personal Workspace",
    designsCount: 0,
    joinedAt: "Today",
  },
};

const STORAGE_KEY = "posthub_app_user";

export function getAppUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function saveAppUser(user: AppUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // Set a lightweight cookie for client hydration if needed
    document.cookie = `posthub_app_user_id=${user.id}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (err) {
    console.error("Failed to save app user session", err);
  }
}

export function clearAppUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = "posthub_app_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (err) {
    console.error("Failed to clear app user session", err);
  }
}

export async function simulateLogin({
  email,
  isSignUp = false,
  fullName = "",
  plan = "Pro",
}: {
  email: string;
  password?: string;
  isSignUp?: boolean;
  fullName?: string;
  plan?: "Free" | "Pro" | "Team";
}): Promise<AppUser> {
  // Simulate network latency for genuine feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const trimmedEmail = email.trim().toLowerCase();

  // Check if matches known demo user email
  if (trimmedEmail === "sophia@posthub.design") {
    const user = PRESET_DEMO_USERS.creator;
    saveAppUser(user);
    return user;
  }

  if (trimmedEmail === "alex@canvasstudio.io") {
    const user = PRESET_DEMO_USERS.agency;
    saveAppUser(user);
    return user;
  }

  // Otherwise synthesize user profile from input without needing backend user API
  const derivedName = fullName.trim() || trimmedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Creative Designer";

  const newUser: AppUser = {
    id: `usr_${Date.now().toString(36)}`,
    name: derivedName,
    email: trimmedEmail,
    plan: isSignUp ? plan : "Pro",
    role: "creator",
    organization: `${derivedName}'s Studio`,
    designsCount: isSignUp ? 1 : 12,
    joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  };

  saveAppUser(newUser);
  return newUser;
}
