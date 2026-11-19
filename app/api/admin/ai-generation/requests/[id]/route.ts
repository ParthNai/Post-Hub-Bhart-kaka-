import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAiRequestById } from "@/lib/ai-generation-storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const request = getAiRequestById(id);
    if (!request) {
      return NextResponse.json({ error: `Request "${id}" not found` }, { status: 404 });
    }

    return NextResponse.json({ request });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to retrieve request details", details: message },
      { status: 500 }
    );
  }
}
