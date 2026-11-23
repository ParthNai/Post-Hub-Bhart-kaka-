import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findMobileUserByMobile, updateMobileUser } from "@/lib/mobile-users";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const pin = typeof body.otp === "string" ? body.otp : "";

    if (!mobile || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "Please enter a valid mobile number and PIN." }, { status: 400 });
    }

    const user = findMobileUserByMobile(mobile);
    const now = Date.now();
    if (!user) {
      return NextResponse.json({ error: "Account does not exist for this mobile number." }, { status: 404 });
    }
    if (user.lockedUntil && user.lockedUntil > now) {
      const minutes = Math.ceil((user.lockedUntil - now) / 60000);
      return NextResponse.json({ error: `Too many failed PIN attempts. Try again in ${minutes} minutes.` }, { status: 429 });
    }
    if (user.status !== "active") {
      return NextResponse.json({ error: "This account is inactive." }, { status: 403 });
    }

    if (!bcrypt.compareSync(pin, user.pinHash)) {
      const failedAttempts = (user.failedAttempts || 0) + 1;
      updateMobileUser(user.id, {
        failedAttempts,
        ...(failedAttempts >= MAX_FAILED_ATTEMPTS ? { lockedUntil: now + LOCKOUT_DURATION_MS } : {}),
      });
      return NextResponse.json({ error: "Invalid PIN." }, { status: 401 });
    }

    updateMobileUser(user.id, { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      token: `app_${user.id}_${now}_${Math.random().toString(36).slice(2)}`,
      tokenType: "Bearer",
      expiresIn: 60 * 60 * 24 * 30,
      user: {
        _id: user.id,
        name: user.name,
        mobile: user.mobile,
        occupation: user.occupation,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        profileImage: null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
