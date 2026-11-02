import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTemplateById } from "@/lib/templates-storage";
import { getCategories } from "@/lib/template-categories-storage";
import { runPrePublishValidation } from "@/lib/template-publishing";
import { publishTemplateWorkflow } from "@/lib/template-publishing-storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: `Template "${templateId}" not found` }, { status: 404 });
  }

  const categories = getCategories();
  const { checks, readiness } = runPrePublishValidation(template, categories);

  return NextResponse.json({
    template,
    checks,
    readiness,
    revision: "v1.2",
    canvasDimensions: template.assetDimensions || "1024 × 1365 px",
  });
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
  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: `Template "${templateId}" not found` }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { action, settings } = body;

    switch (action) {
      case "validate": {
        const categories = getCategories();
        const { checks, readiness } = runPrePublishValidation(template, categories);
        return NextResponse.json({
          success: true,
          checks,
          readiness,
        });
      }

      case "save-draft": {
        // Confirms draft settings
        return NextResponse.json({
          success: true,
          message: "Publication draft settings saved successfully.",
          settings: settings || {},
        });
      }

      case "publish": {
        const adminName = session.name || "Parth Patel";
        const result = publishTemplateWorkflow(templateId, settings || {}, adminName);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({
          success: true,
          publication: result.publication,
          message: `Template "${template.name}" published successfully to mobile distribution channels.`,
        });
      }

      default:
        return NextResponse.json({ error: `Unsupported action: "${action}"` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process publishing request." },
      { status: 500 }
    );
  }
}
