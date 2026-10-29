import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getVersionHistoryData,
  compareVersions,
  restoreVersionAsDraft,
} from "@/lib/version-history";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const data = getVersionHistoryData();
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
    const body = await req.json();
    const { action, baseVersion, compareVersion, versionId } = body;

    if (action === "compare") {
      if (!baseVersion || !compareVersion) {
        return NextResponse.json(
          { error: "baseVersion and compareVersion are required for comparison." },
          { status: 400 }
        );
      }
      const result = compareVersions(baseVersion, compareVersion);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        diffs: result.diffs,
      });
    }

    if (action === "restore") {
      if (!versionId) {
        return NextResponse.json(
          { error: "versionId is required to restore a version." },
          { status: 400 }
        );
      }
      const result = restoreVersionAsDraft(versionId, session.name || "System Administrator");
      if (!result.success) {
        return NextResponse.json({ error: result.error || result.message }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: result.message,
        version: result.version,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("Version history API failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

