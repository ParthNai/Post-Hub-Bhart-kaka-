import { NextResponse } from "next/server";
import {
  getQueuePriorityDataset,
  changeRequestPriority,
  cancelQueuedRequest,
  toggleRequestPause,
  rescheduleQueuedRequest,
  updateSchedulingSettings,
  updatePriorityConfiguration,
  queryQueuePriorityItems,
  resetQueuePriorityData,
} from "@/lib/ai-queue-priority-storage";
import type { QueuePriorityLevel } from "@/lib/ai-queue-priority";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const pageSize = searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : undefined;

    const dataset = getQueuePriorityDataset();
    const queryResult = queryQueuePriorityItems({
      search,
      type,
      status,
      priority,
      page,
      pageSize,
    });

    return NextResponse.json({
      summary: dataset.summary,
      monitor: dataset.monitor,
      priorityConfig: dataset.priorityConfig,
      schedulingSettings: dataset.schedulingSettings,
      activityHistory: dataset.activityHistory,
      items: queryResult.items,
      pagination: {
        total: queryResult.total,
        page: queryResult.page,
        pageSize: queryResult.pageSize,
        totalPages: queryResult.totalPages,
      },
      lastUpdated: dataset.lastUpdated,
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
      return NextResponse.json({ error: "Missing required 'action' parameter." }, { status: 400 });
    }

    switch (action) {
      case "change-priority": {
        const { requestId, newPriority, reason, adminName } = body;
        if (!requestId || !newPriority) {
          return NextResponse.json(
            { error: "Missing required 'requestId' or 'newPriority'." },
            { status: 400 }
          );
        }
        const result = changeRequestPriority(
          requestId,
          newPriority as QueuePriorityLevel,
          reason || "Admin update",
          adminName || "parth"
        );
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, item: result.item, dataset });
      }

      case "cancel-request": {
        const { requestId, reason, adminName } = body;
        if (!requestId) {
          return NextResponse.json({ error: "Missing required 'requestId'." }, { status: 400 });
        }
        const result = cancelQueuedRequest(requestId, reason || "Cancelled by Admin", adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, item: result.item, dataset });
      }

      case "toggle-pause": {
        const { requestId, adminName } = body;
        if (!requestId) {
          return NextResponse.json({ error: "Missing required 'requestId'." }, { status: 400 });
        }
        const result = toggleRequestPause(requestId, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, item: result.item, dataset });
      }

      case "reschedule": {
        const { requestId, newScheduledTime, adminName } = body;
        if (!requestId || !newScheduledTime) {
          return NextResponse.json(
            { error: "Missing required 'requestId' or 'newScheduledTime'." },
            { status: 400 }
          );
        }
        const result = rescheduleQueuedRequest(requestId, newScheduledTime, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, item: result.item, dataset });
      }

      case "update-settings": {
        const { settings } = body;
        if (!settings) {
          return NextResponse.json({ error: "Missing 'settings' payload." }, { status: 400 });
        }
        const result = updateSchedulingSettings(settings);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, settings: result.settings, dataset });
      }

      case "update-config": {
        const { config } = body;
        if (!config) {
          return NextResponse.json({ error: "Missing 'config' payload." }, { status: 400 });
        }
        const result = updatePriorityConfiguration(config);
        const dataset = getQueuePriorityDataset();
        return NextResponse.json({ success: true, config: result.config, dataset });
      }

      case "reset": {
        const resetDataset = resetQueuePriorityData();
        return NextResponse.json({ success: true, dataset: resetDataset });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
