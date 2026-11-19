import { NextRequest, NextResponse } from "next/server";
import { getTemplates } from "@/lib/templates-storage.ts";
import { filterAndSortTemplates } from "@/lib/templates.ts";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";
  const status = url.searchParams.get("status") || "";
  const format = url.searchParams.get("format") || "";
  const sort = url.searchParams.get("sort") || "";

  const all = getTemplates().filter((t) => t.status !== "Archived");
  const filtered = filterAndSortTemplates(all, {
    query: q,
    category,
    status,
    format,
    sort,
  });

  return NextResponse.json(
    {
      success: true,
      count: filtered.length,
      templates: filtered,
    },
    {
      headers: CORS_HEADERS,
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
