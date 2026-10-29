import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUser } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

const DUMMY_HASH = "$2a$10$wE4Q/lT1.8jK3JvY8Z8k4.a2r7M1TqWdYz9Yh6Bv1sK4N5g8H7u6e";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    // 1. Validation: Empty fields
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter your administrator email address.", field: "email" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { error: "Please enter your password.", field: "password" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(trimmedEmail);

    // 3. Check rate limit / lockout on existing user
    const now = Date.now();
    if (user && user.lockedUntil && user.lockedUntil > now) {
      const remainingMinutes = Math.ceil((user.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          error: `Too many failed attempts. Your account is temporarily locked for security. Try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 4. Timing-attack safe credential verification
    const passwordMatch = user
      ? bcrypt.compareSync(password, user.passwordHash)
      : bcrypt.compareSync(password, DUMMY_HASH);

    if (!user || !passwordMatch) {
      if (user) {
        const attempts = (user.failedAttempts || 0) + 1;
        const updates: Partial<typeof user> = { failedAttempts: attempts };
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          updates.lockedUntil = now + LOCKOUT_DURATION_MS;
        }
        updateUser(user.id, updates);
      }

      // Generic authentication error per security specification
      return NextResponse.json(
        { error: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // 5. Account disabled check
    if (user.status === "disabled") {
      return NextResponse.json(
        {
          error: "This administrator account has been deactivated. Please contact security.",
          code: "ACCOUNT_DISABLED",
        },
        { status: 403 }
      );
    }

    // 6. Role check: only admin and superadmin permitted
    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json(
        {
          error: "Access denied. Only authorised administrators are permitted to enter.",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // 7. Successful authentication: Reset failed counter, update last login
    updateUser(user.id, {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString(),
    });

    const token = await createSessionToken(user, !!rememberMe);
    await setSessionCookie(token, !!rememberMe);

    return NextResponse.json({
      success: true,
      redirectUrl: "/admin/dashboard",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "A server error occurred. Please try again shortly.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
