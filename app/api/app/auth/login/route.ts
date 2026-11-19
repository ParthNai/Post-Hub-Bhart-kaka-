import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUser } from "@/lib/db";
import { createAppSessionToken } from "@/lib/app-session";
import { handleAppCorsOptions, withAppCors } from "@/lib/app-cors";

const DUMMY_HASH = "$2a$10$wE4Q/lT1.8jK3JvY8Z8k4.a2r7M1TqWdYz9Yh6Bv1sK4N5g8H7u6e";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

async function handlePost(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Please send a valid JSON request." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Please send a valid JSON request." },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = body as {
      email?: unknown;
      password?: unknown;
      rememberMe?: unknown;
    };

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter your email address.", field: "email" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { error: "Please enter your password.", field: "password" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(normalizedEmail);
    const member = user?.role === "member" ? user : null;
    const now = Date.now();

    if (member?.lockedUntil && member.lockedUntil > now) {
      const remainingMinutes = Math.ceil((member.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const passwordMatch = member
      ? bcrypt.compareSync(password, member.passwordHash)
      : bcrypt.compareSync(password, DUMMY_HASH);

    if (!member || !passwordMatch) {
      if (member) {
        const failedAttempts = (member.failedAttempts || 0) + 1;
        updateUser(member.id, {
          failedAttempts,
          ...(failedAttempts >= MAX_FAILED_ATTEMPTS
            ? { lockedUntil: now + LOCKOUT_DURATION_MS }
            : {}),
        });
      }

      return NextResponse.json(
        { error: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    if (member.status !== "active") {
      return NextResponse.json(
        { error: "This account has been deactivated.", code: "ACCOUNT_DISABLED" },
        { status: 403 }
      );
    }

    updateUser(member.id, {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString(),
    });

    const shouldRemember = rememberMe === true;
    const token = await createAppSessionToken(member, shouldRemember);

    return NextResponse.json({
      success: true,
      token,
      tokenType: "Bearer",
      expiresIn: shouldRemember ? 60 * 60 * 24 * 30 : 60 * 60 * 12,
      user: {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
      },
    });
  } catch (error) {
    console.error("App login API error:", error);
    return NextResponse.json(
      { error: "A server error occurred. Please try again shortly.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAppCors(await handlePost(req), req);
}

export function OPTIONS(req: NextRequest) {
  return handleAppCorsOptions(req);
}
