import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAiAnalytics,
  updateBudgetConfig,
  resetAnalyticsData,
} from "@/lib/ai-analytics-storage";
import {
  generateAnalyticsUsageCsv,
  generateBillingSummaryCsv,
} from "@/lib/ai-analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("range") || searchParams.get("timeRange") || "30d";

    const data = getAiAnalytics(timeRange);
    return NextResponse.json({ success: true, data, ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to load AI analytics", details: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action || "refresh";

    if (action === "export-csv" || action === "export-usage-report") {
      const data = getAiAnalytics(body.timeRange || "30d");
      const csv = generateAnalyticsUsageCsv(
        data.usageTrends,
        data.providerCosts,
        data.userUsage
      );
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="ai-generation-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    if (action === "export-billing-summary") {
      const data = getAiAnalytics(body.timeRange || "30d");
      const csv = generateBillingSummaryCsv(data.budget, data.providerCosts);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="billing-period-summary-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    if (action === "update-budget") {
      const { configuredBudget, alertThreshold } = body;
      const updated = updateBudgetConfig({
        configuredBudget: Number(configuredBudget),
        alertThreshold: alertThreshold ? Number(alertThreshold) : undefined,
      });
      return NextResponse.json({
        success: true,
        data: updated,
        budget: updated,
        analytics: getAiAnalytics(body.timeRange || "30d"),
      });
    }

    if (action === "refresh") {
      const data = getAiAnalytics(body.timeRange || "30d");
      return NextResponse.json({
        success: true,
        analytics: data,
      });
    }

    if (action === "reset") {
      const data = resetAnalyticsData();
      return NextResponse.json({
        success: true,
        message: "Analytics reset to canonical reference state",
        analytics: data,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process analytics request", details: message },
      { status: 500 }
    );
  }
}
