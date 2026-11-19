import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getTemplateById,
  updateTemplate,
  publishTemplate,
  replaceTemplateAsset,
  deleteTemplate,
} from "@/lib/templates-storage";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    return NextResponse.json(
      { error: `Template with ID "${templateId}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ template });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { templateId } = await params;
  const existing = getTemplateById(templateId);
  if (!existing) {
    return NextResponse.json(
      { error: `Template with ID "${templateId}" was not found.` },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const res = updateTemplate(templateId, body);

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      template: res.template,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update template." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { templateId } = await params;
  const existing = getTemplateById(templateId);
  if (!existing) {
    return NextResponse.json(
      { error: `Template with ID "${templateId}" was not found.` },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "publish") {
      const res = publishTemplate(templateId);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, template: res.template });
    }

    if (action === "replace-asset") {
      if (!body.asset || !body.asset.fileName) {
        return NextResponse.json({ error: "Valid asset specification is required." }, { status: 400 });
      }
      const res = replaceTemplateAsset(templateId, body.asset);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, template: res.template });
    }

    if (action === "remove-asset") {
      const res = replaceTemplateAsset(templateId, {
        fileName: "unassigned-placeholder.jpg",
        fileSize: "0 KB",
      });
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, template: res.template });
    }

    return NextResponse.json({ error: `Unsupported action: "${action}"` }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { templateId } = await params;
  const res = deleteTemplate(templateId);
  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
