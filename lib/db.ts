import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "superadmin" | "admin" | "member";
  status: "active" | "disabled";
  failedAttempts: number;
  lockedUntil?: number | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  createdAt: string;
  lastLoginAt?: string | null;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Seed default users if store doesn't exist
export function initDb() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const defaultUsers: User[] = [
      {
        id: "usr_admin_001",
        email: "admin@yourdomain.com",
        passwordHash: bcrypt.hashSync("AdminPassword123!", salt),
        name: "Post Hub Lead Administrator",
        role: "admin",
        status: "active",
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_admin_002",
        email: "admin@posthub.io",
        passwordHash: bcrypt.hashSync("AdminPassword123!", salt),
        name: "Security Administrator",
        role: "superadmin",
        status: "active",
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_disabled_003",
        email: "disabled@yourdomain.com",
        passwordHash: bcrypt.hashSync("AdminPassword123!", salt),
        name: "Deactivated Manager",
        role: "admin",
        status: "disabled",
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_member_004",
        email: "member@yourdomain.com",
        passwordHash: bcrypt.hashSync("MemberPassword123!", salt),
        name: "Public Platform Member",
        role: "member", // Not authorized to access admin portal
        status: "active",
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf-8");
  }
}

export function getAllUsers(): User[] {
  initDb();
  try {
    const content = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to read users database:", err);
    return [];
  }
}

export function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}
