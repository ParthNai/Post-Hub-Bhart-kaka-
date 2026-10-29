import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getGovernanceSettings, saveGovernanceSettingsDraft } from "@/lib/governance-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const settings = getGovernanceSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = saveGovernanceSettingsDraft(body, session.name || "System Administrator");

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to save governance settings.", errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Governance settings saved as draft.",
      settings: result.settings,
    });
  } catch (error) {
    console.error("Governance settings API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred processing governance settings." },
      { status: 500 }
    );
  }
}

