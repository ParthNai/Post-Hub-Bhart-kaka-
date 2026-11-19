import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cancelAiRequest } from "@/lib/ai-generation-storage";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    let reason = "Cancelled by administrator.";
    try {
      const body = await req.json();
      if (body.reason) reason = body.reason;
    } catch {
      // Body is optional
    }

    const outcome = cancelAiRequest(id, reason, session.name);
    if (!outcome.success) {
      return NextResponse.json({ error: outcome.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, request: outcome.request });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to cancel generation request", details: message },
      { status: 500 }
    );
  }
}
