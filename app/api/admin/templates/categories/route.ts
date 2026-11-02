import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleArchiveCategory,
  deleteCategory,
  resetCategories,
  getCategoriesWithMetrics,
} from "@/lib/template-categories-storage";
import { filterAndSortCategories } from "@/lib/template-categories";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "All Statuses";
  const sort = url.searchParams.get("sort") || "Name A–Z";

  const { categories: allCategories, metrics } = getCategoriesWithMetrics();

  const filtered = filterAndSortCategories(allCategories, {
    search,
    status: status as "All Statuses" | "Active" | "Archived",
    sort: sort as "Name A–Z" | "Name Z–A" | "Most Templates" | "Recently Updated",
  });

  return NextResponse.json({
    categories: filtered,
    total: filtered.length,
    allTotal: allCategories.length,
    metrics,
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

    switch (action) {
      case "create": {
        const result = createCategory(body.data || {});
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, category: result.category }, { status: 201 });
      }

      case "update": {
        if (!body.id) {
          return NextResponse.json({ error: "Category ID is required for update." }, { status: 400 });
        }
        const result = updateCategory(body.id, body.updates || {});
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, category: result.category });
      }

      case "archive":
      case "toggle-archive":
      case "restore": {
        if (!body.id) {
          return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
        }
        const result = toggleArchiveCategory(body.id);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, category: result.category });
      }

      case "delete": {
        if (!body.id) {
          return NextResponse.json({ error: "Category ID is required for deletion." }, { status: 400 });
        }
        const result = deleteCategory(body.id);
        if (!result.success) {
          return NextResponse.json(
            { error: result.error, conflict: result.conflict || false },
            { status: result.conflict ? 409 : 400 }
          );
        }
        return NextResponse.json({ success: true, message: "Category deleted successfully." });
      }

      case "reset": {
        resetCategories();
        const updated = getCategories();
        return NextResponse.json({ success: true, categories: updated });
      }

      default:
        return NextResponse.json({ error: `Unsupported action: "${action}"` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process category request." },
      { status: 500 }
    );
  }
}
