import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  queryQueueItems,
  getQueueMetrics,
  getQueueOverview,
  getQueueSettings,
  saveQueueSettings,
  retryQueueRequest,
  cancelQueueRequest,
  getAllQueueItems,
  resetQueueData,
} from "@/lib/ai-queue-storage";
import { generateQueueCsv } from "@/lib/ai-queue";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const status = searchParams.get("status") || undefined;
    const sortBy = (searchParams.get("sortBy") as "newest" | "oldest" | "priority") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "4", 10);

    const result = queryQueueItems({ query, status, sortBy, page, pageSize });
    const metrics = getQueueMetrics();
    const overview = getQueueOverview();
    const settings = getQueueSettings();

    return NextResponse.json({
      items: result.items,
      failedItems: result.failedItems,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      metrics,
      overview,
      settings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to load queue data", details: message },
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
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "retry") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Request ID required" }, { status: 400 });
      }
      const result = retryQueueRequest(id, adminName);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Retry failed" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Request ${id} re-queued successfully`,
        item: result.item,
        metrics: getQueueMetrics(),
        overview: getQueueOverview(),
      });
    }

    if (action === "cancel") {
      const { id, reason } = body;
      if (!id) {
        return NextResponse.json({ error: "Request ID required" }, { status: 400 });
      }
      const result = cancelQueueRequest(id, adminName, reason);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Cancellation failed" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Request ${id} cancelled successfully`,
        item: result.item,
        metrics: getQueueMetrics(),
        overview: getQueueOverview(),
      });
    }

    if (action === "update-settings") {
      const { settings } = body;
      if (!settings) {
        return NextResponse.json({ error: "Settings required" }, { status: 400 });
      }
      const updated = saveQueueSettings(settings);
      return NextResponse.json({
        success: true,
        message: "Queue settings saved successfully",
        settings: updated,
      });
    }

    if (action === "export") {
      const all = getAllQueueItems();
      const csv = generateQueueCsv(all);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="post-hub-queue-records.csv"',
        },
      });
    }

    if (action === "reset") {
      const reset = resetQueueData();
      return NextResponse.json({
        success: true,
        message: "Queue reset to canonical state",
        items: reset.items.slice(0, 4),
        metrics: getQueueMetrics(),
        overview: getQueueOverview(),
        settings: reset.settings,
      });
    }

    return NextResponse.json({
      success: true,
      metrics: getQueueMetrics(),
      overview: getQueueOverview(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Operation failed", details: message },
      { status: 500 }
    );
  }
}

