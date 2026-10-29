import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { findUserByEmail, User } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "post-hub-secure-admin-secret-key-must-be-at-least-32-chars-long"
);

export const COOKIE_NAME = "posthub_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "superadmin" | "admin" | "member";
  name: string;
}

export async function createSessionToken(
  user: User,
  rememberMe: boolean = false
): Promise<string> {
  const expiration = rememberMe ? "30d" : "12h";

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(JWT_SECRET);

  return token;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(options: { allowDevBypass?: boolean } = {}): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    // Development-only bypass: allow direct local dashboard opening/testing
    // Strictly disabled in production builds (NODE_ENV === 'production')
    if (options.allowDevBypass && process.env.NODE_ENV !== "production") {
      return {
        userId: "usr_admin_dev",
        email: "admin@posthub.io",
        role: "admin",
        name: "Admin Workspace",
      };
    }
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  // Strict server-side verification: recheck user existence, role, and active status
  const user = findUserByEmail(payload.email);
  if (!user || user.status !== "active") {
    return null;
  }

  // Authorize only admins and superadmins
  if (user.role !== "admin" && user.role !== "superadmin") {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

export async function setSessionCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 12; // 30 days vs 12 hours

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
