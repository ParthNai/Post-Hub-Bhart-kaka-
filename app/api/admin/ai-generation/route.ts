import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  queryAiRequests,
  retryAiRequest,
  cancelAiRequest,
  saveAiProviderConfig,
  testAiProviderConnection,
  saveAiGenerationSettings,
  resetAiRequests,
} from "@/lib/ai-generation-storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const provider = url.searchParams.get("provider") || undefined;
    const timeRange = url.searchParams.get("timeRange") || undefined;
    const format = url.searchParams.get("format") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);

    const result = queryAiRequests({
      query,
      status,
      provider,
      timeRange,
      format,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to fetch AI generation data", details: message },
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
    const action = body.action;

    if (action === "retry") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
      }
      const outcome = retryAiRequest(id, session.name);
      if (!outcome.success) {
        return NextResponse.json({ error: outcome.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, request: outcome.request });
    }

    if (action === "cancel") {
      const { id, reason } = body;
      if (!id) {
        return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
      }
      const outcome = cancelAiRequest(id, reason, session.name);
      if (!outcome.success) {
        return NextResponse.json({ error: outcome.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, request: outcome.request });
    }

    if (action === "configure-provider") {
      const { providerId, name, model, apiKey, defaultResolution, quality } = body;
      const updated = saveAiProviderConfig(
        {
          providerId,
          name,
          model,
          defaultResolution,
          quality,
        },
        apiKey
      );
      return NextResponse.json({ success: true, providerConfig: updated });
    }

    if (action === "test-connection") {
      const { providerId, apiKey } = body;
      const testResult = await testAiProviderConnection(providerId, apiKey);
      return NextResponse.json(testResult);
    }

    if (action === "save-settings") {
      const { settings } = body;
      const updated = saveAiGenerationSettings(settings || {});
      return NextResponse.json({ success: true, settings: updated });
    }

    if (action === "reset") {
      const resetList = resetAiRequests();
      return NextResponse.json({ success: true, count: resetList.length });
    }

    return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process AI generation request", details: message },
      { status: 500 }
    );
  }
}
