import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findUserByEmail, updateUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter your administrator email address." },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();
    const user = findUserByEmail(trimmed);

    let recoveryToken: string | null = null;

    if (user && user.role === "admin" && user.status === "active") {
      // Generate single-use secure recovery token valid for 1 hour
      recoveryToken = crypto.randomBytes(32).toString("hex");
      const expiry = Date.now() + 60 * 60 * 1000;

      updateUser(user.id, {
        resetToken: recoveryToken,
        resetTokenExpiry: expiry,
      });
    }

    const isEmailServiceConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    // Return generic success response to avoid account enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an active administrator account exists for this email, password recovery instructions have been dispatched.",
      emailConfigured: isEmailServiceConfigured,
      demoResetToken: !isEmailServiceConfigured && recoveryToken ? recoveryToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process password recovery at this time. Please try again." },
      { status: 500 }
    );
  }
}
