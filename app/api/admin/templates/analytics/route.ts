import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTemplateAnalytics } from "@/lib/template-analytics-storage";
import { generateAnalyticsCsvReport, AnalyticsDateRange } from "@/lib/template-analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(req.url);
  const range = (url.searchParams.get("range") || "30d") as AnalyticsDateRange;

  const data = getTemplateAnalytics(range);

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, range = "30d" } = body;

    if (action === "export") {
      const data = getTemplateAnalytics(range as AnalyticsDateRange);
      const csv = generateAnalyticsCsvReport(data.kpis, data.topTemplates, range);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="posthub-template-analytics-${range}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: `Unsupported action: "${action}"` }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process export." },
      { status: 500 }
    );
  }
}

