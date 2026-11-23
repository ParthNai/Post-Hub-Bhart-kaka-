import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface MobileUser {
  id: string;
  name: string;
  mobile: string;
  pin: string;
  pinHash: string;
  occupation: string;
  village?: string;
  taluka?: string;
  district?: string;
  status: "active" | "disabled";
  failedAttempts: number;
  lockedUntil?: number | null;
  createdAt: string;
  lastLoginAt?: string | null;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "mobile-users.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getMobileUsers(): MobileUser[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")) as MobileUser[];
  } catch {
    return [];
  }
}

function saveMobileUsers(users: MobileUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function findMobileUserByMobile(mobile: string): MobileUser | null {
  const normalized = mobile.trim();
  return getMobileUsers().find((user) => user.mobile === normalized) || null;
}

export function registerMobileUser(input: {
  name: string;
  mobile: string;
  pin: string;
  occupation: string;
  village?: string;
  taluka?: string;
  district?: string;
}) {
  const users = getMobileUsers();
  if (users.some((user) => user.mobile === input.mobile)) {
    return { error: "A mobile number is already registered.", code: "MOBILE_EXISTS" };
  }

  const user: MobileUser = {
    id: `mobile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    mobile: input.mobile,
    pin: input.pin,
    pinHash: bcrypt.hashSync(input.pin, 10),
    occupation: input.occupation,
    village: input.village,
    taluka: input.taluka,
    district: input.district,
    status: "active",
    failedAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveMobileUsers(users);
  return { user };
}

export function updateMobileUser(id: string, updates: Partial<MobileUser>) {
  const users = getMobileUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveMobileUsers(users);
  return users[index];
}
