import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getProviderHealthData,
  queryModels,
  getProviderById,
  executeHealthCheck,
  updateMonitoringSettings,
  resetProviderHealthData,
} from "@/lib/ai-provider-health-storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const providerFilter = searchParams.get("provider") || undefined;
    const statusFilter = searchParams.get("status") || undefined;
    const providerId = searchParams.get("providerId") || undefined;

    if (providerId) {
      const providerDetails = getProviderById(providerId);
      return NextResponse.json(providerDetails);
    }

    const data = getProviderHealthData();
    const filteredModels = queryModels(search, providerFilter, statusFilter);

    return NextResponse.json({
      summary: data.summary,
      providers: data.providers,
      models: filteredModels,
      monitoringHistory: data.monitoringHistory,
      settings: data.settings,
      responseTimeTrend: data.responseTimeTrend,
      requestSuccessFailure: data.requestSuccessFailure,
      lastUpdated: data.lastUpdated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to retrieve provider health data", details: message },
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
    const action = body.action || "check";
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "check") {
      const { providerId } = body;
      const result = await executeHealthCheck(providerId, adminName);
      return NextResponse.json(result);
    }

    if (action === "update-settings") {
      const { settings } = body;
      if (!settings || typeof settings !== "object") {
        return NextResponse.json({ error: "Invalid settings object provided" }, { status: 400 });
      }
      const outcome = updateMonitoringSettings(settings, adminName);
      return NextResponse.json(outcome);
    }

    if (action === "reset") {
      const canonical = resetProviderHealthData();
      return NextResponse.json({ success: true, data: canonical });
    }

    if (action === "refresh") {
      const data = getProviderHealthData();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process health check request", details: message },
      { status: 500 }
    );
  }
}
