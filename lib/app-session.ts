import { SignJWT, jwtVerify } from "jose";
import type { User } from "./db";
import { SESSION_JWT_SECRET } from "./session-secret.ts";

export interface AppSessionPayload {
  userId: string;
  email: string;
  role: "member";
  name: string;
}

export async function createAppSessionToken(
  user: User,
  rememberMe: boolean = false
): Promise<string> {
  if (user.role !== "member" || user.status !== "active") {
    throw new Error("Only active members can receive an app session");
  }

  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: "member",
    name: user.name,
    tokenType: "app",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("post-hub")
    .setAudience("post-hub-app")
    .setIssuedAt()
    .setExpirationTime(rememberMe ? "30d" : "12h")
    .sign(SESSION_JWT_SECRET);
}

export async function verifyAppSessionToken(
  token: string
): Promise<AppSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_JWT_SECRET, {
      issuer: "post-hub",
      audience: "post-hub-app",
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      payload.role !== "member" ||
      payload.tokenType !== "app"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: "member",
    };
  } catch {
    return null;
  }
}
