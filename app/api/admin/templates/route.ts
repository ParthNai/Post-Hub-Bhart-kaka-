import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  filterAndSortTemplates,
  calculateTemplateMetrics,
  TEMPLATE_CATEGORIES,
} from "@/lib/templates";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  duplicateTemplate,
  toggleArchiveTemplate,
  deleteTemplate,
  resetTemplates,
} from "@/lib/templates-storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const status = url.searchParams.get("status") || "";
  const format = url.searchParams.get("format") || "";
  const sort = url.searchParams.get("sort") || "";

  const allTemplates = getTemplates();
  const filtered = filterAndSortTemplates(allTemplates, {
    query: q,
    category,
    status,
    format,
    sort,
  });

  const metrics = calculateTemplateMetrics(allTemplates);

  const categoriesWithCounts = TEMPLATE_CATEGORIES.map((cat) => ({
    ...cat,
    count: allTemplates.filter((t) => t.category.toLowerCase() === cat.name.toLowerCase()).length,
  }));

  return NextResponse.json({
    templates: filtered,
    total: filtered.length,
    allTotal: allTemplates.length,
    metrics,
    categories: categoriesWithCounts,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "create") {
      const res = createTemplate(body.template || {});
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        template: res.template,
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    if (action === "update") {
      if (!body.id) {
        return NextResponse.json({ error: "Template ID is required." }, { status: 400 });
      }
      const res = updateTemplate(body.id, body.updates || {});
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        template: res.template,
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    if (action === "duplicate") {
      if (!body.id) {
        return NextResponse.json({ error: "Template ID is required." }, { status: 400 });
      }
      const res = duplicateTemplate(body.id);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        template: res.template,
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    if (action === "archive") {
      if (!body.id) {
        return NextResponse.json({ error: "Template ID is required." }, { status: 400 });
      }
      const res = toggleArchiveTemplate(body.id);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        template: res.template,
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    if (action === "delete") {
      if (!body.id) {
        return NextResponse.json({ error: "Template ID is required." }, { status: 400 });
      }
      const res = deleteTemplate(body.id);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    if (action === "reset") {
      resetTemplates();
      return NextResponse.json({
        success: true,
        templates: getTemplates(),
        metrics: calculateTemplateMetrics(getTemplates()),
      });
    }

    return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 });
  } catch (error) {
    console.error("Templates API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
