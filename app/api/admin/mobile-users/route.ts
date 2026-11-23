import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMobileUsers } from "@/lib/mobile-users";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const users = getMobileUsers().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ users });
}
