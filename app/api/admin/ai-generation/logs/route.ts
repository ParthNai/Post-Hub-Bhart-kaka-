import { NextResponse } from "next/server";
import {
  getRequestLogsDataset,
  queryRequestLogs,
  getRequestLogDetails,
  updateLogRetentionConfig,
  triggerLogCleanup,
  resetRequestLogsData,
} from "@/lib/ai-request-logs-storage";
import { generateRequestLogsCsv, redactSensitiveLogData } from "@/lib/ai-request-logs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");
    const format = searchParams.get("format");

    // Single request detail lookup
    if (requestId) {
      const detail = getRequestLogDetails(requestId);
      if (!detail) {
        return NextResponse.json({ error: "Request log not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, log: detail });
    }

    const search = searchParams.get("search") || undefined;
    const endpoint = searchParams.get("endpoint") || undefined;
    const method = searchParams.get("method") || undefined;
    const status = searchParams.get("status") || undefined;
    const timeRange = searchParams.get("timeRange") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 5;

    const dataset = getRequestLogsDataset();
    const queryResult = queryRequestLogs({
      search,
      endpoint,
      method,
      status,
      timeRange,
      page,
      pageSize,
    });

    // File export
    if (format === "csv") {
      const csv = generateRequestLogsCsv(queryResult.logs);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="api-request-logs-${Date.now()}.csv"`,
        },
      });
    }

    if (format === "json") {
      const redactedLogs = queryResult.logs.map((l) => redactSensitiveLogData(l));
      return NextResponse.json(redactedLogs);
    }

    return NextResponse.json({
      success: true,
      dataset,
      ...dataset,
      pagedLogs: queryResult.logs,
      total: queryResult.total,
      page: queryResult.page,
      pageSize: queryResult.pageSize,
      totalPages: queryResult.totalPages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing required 'action' parameter." },
        { status: 400 }
      );
    }

    switch (action) {
      case "update-retention": {
        const { retentionDays, autoCleanupEnabled } = body;
        const res = updateLogRetentionConfig({
          ...(typeof retentionDays === "number" ? { retentionDays } : {}),
          ...(typeof autoCleanupEnabled === "boolean" ? { autoCleanupEnabled } : {}),
        });
        return NextResponse.json({ success: true, config: res.config });
      }

      case "cleanup": {
        const res = triggerLogCleanup();
        return NextResponse.json({
          success: true,
          message: "Log cleanup triggered successfully",
          config: res.config,
        });
      }

      case "reset": {
        resetRequestLogsData();
        const dataset = getRequestLogsDataset();
        return NextResponse.json({
          success: true,
          message: "Request logs reset to canonical seed",
          dataset,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported action: '${action}'` },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
