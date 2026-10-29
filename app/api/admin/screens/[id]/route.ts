import { NextRequest, NextResponse } from "next/server";
import { findScreenByIdOrKey, saveScreenDraft, publishScreen, updateScreen, archiveScreen, deleteScreen } from "@/lib/screens";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const screen = findScreenByIdOrKey(id);

  if (!screen) {
    return NextResponse.json({ error: "Screen not found" }, { status: 404 });
  }

  return NextResponse.json({ screen });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const target = findScreenByIdOrKey(id);
  if (!target) {
    return NextResponse.json({ error: "Screen not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    if (body.action === "publish" || body.isPublish) {
      const result = publishScreen(target.id, body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, screen: result.screen, message: "Screen published successfully to mobile clients." });
    }

    if (body.action === "save_draft" || body.isDraft) {
      const result = saveScreenDraft(target.id, body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, screen: result.screen, message: "Draft saved successfully." });
    }

    const result = updateScreen(target.id, body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, screen: result.screen });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const target = findScreenByIdOrKey(id);
  if (!target) {
    return NextResponse.json({ error: "Screen not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const hardDelete = url.searchParams.get("hard") === "true";

  if (hardDelete) {
    const result = deleteScreen(target.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Screen permanently deleted." });
  } else {
    const result = archiveScreen(target.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Screen archived." });
  }
}
