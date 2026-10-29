import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getTokenUsageData,
  runTokenUsageScan,
  resetTokenUsageScan,
} from "@/lib/token-usage";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const data = getTokenUsageData();
  return NextResponse.json({
    success: true,
    ...data,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    let action = "scan";
    try {
      const body = await req.json();
      if (body?.action) action = body.action;
    } catch {
      // Empty body defaults to action = "scan"
    }

    if (action === "reset") {
      const resetResult = resetTokenUsageScan();
      return NextResponse.json({
        success: true,
        message: "Scan state reset to initial unscanned state.",
        ...resetResult,
      });
    }

    const scanResult = runTokenUsageScan();
    if (!scanResult.success) {
      return NextResponse.json(
        { error: scanResult.error || "Usage scan failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token usage and dependencies successfully scanned.",
      summary: scanResult.summary,
      tokens: scanResult.tokens,
    });
  } catch (error) {
    console.error("Token usage scan request failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

