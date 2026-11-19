import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { verifyAppSessionToken } from "@/lib/app-session";
import { handleAppCorsOptions, withAppCors } from "@/lib/app-cors";

async function handleGet(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const session = await verifyAppSessionToken(match[1]);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }

  const user = findUserByEmail(session.email);
  if (
    !user ||
    user.id !== session.userId ||
    user.role !== "member" ||
    user.status !== "active"
  ) {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}

export async function GET(req: NextRequest) {
  return withAppCors(await handleGet(req), req);
}

export function OPTIONS(req: NextRequest) {
  return handleAppCorsOptions(req);
}
