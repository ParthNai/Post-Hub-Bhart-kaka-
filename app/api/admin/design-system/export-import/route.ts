import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  generateExportPayload,
  validateImportPayload,
  applyImportAsDraft,
  type ExportCategory,
  type ExportTokenPayload,
} from "@/lib/export-import";
import { getDesignSystemConfig, saveDesignSystemDraft } from "@/lib/design-system";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoriesParam = searchParams.get("categories");
  const rawCategories = categoriesParam ? categoriesParam.split(",") : ["colors", "typography", "spacing", "radius"];

  const validCategories: ExportCategory[] = rawCategories.filter((c): c is ExportCategory =>
    ["colors", "typography", "spacing", "radius", "layout", "complete"].includes(c)
  );

  const payload = generateExportPayload(validCategories.length > 0 ? validCategories : ["colors"]);

  // If download query param is set, return file attachment header
  if (searchParams.get("download") === "true") {
    const filename = `posthub-design-tokens-${new Date().toISOString().slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    payload,
    currentConfig: getDesignSystemConfig(),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Action 1: Export Payload
    if (action === "export") {
      const categories: ExportCategory[] = Array.isArray(body.categories) ? body.categories : ["colors"];
      const payload = generateExportPayload(categories, undefined, session.name || "System Administrator");
      return NextResponse.json({
        success: true,
        payload,
      });
    }

    // Action 2: Validate Uploaded Content
    if (action === "validate") {
      const { content, fileName, fileSize } = body;
      if (typeof content !== "string") {
        return NextResponse.json({ error: "Content must be a string." }, { status: 400 });
      }

      const validation = validateImportPayload(content, fileName, fileSize);
      return NextResponse.json({
        success: true,
        validation,
      });
    }

    // Action 3: Import As Draft
    if (action === "import-draft") {
      const payload: ExportTokenPayload = body.payload;
      if (!payload || !payload.tokens) {
        return NextResponse.json({ error: "Invalid payload provided for import." }, { status: 400 });
      }

      const current = getDesignSystemConfig();
      const result = applyImportAsDraft(payload, current, saveDesignSystemDraft, session.name || "System Administrator");
      if (!result.success) {
        return NextResponse.json({ error: result.message, errors: result.errors }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: result.message,
        config: result.config,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("Export/Import API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred processing token export/import." },
      { status: 500 }
    );
  }
}
