import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAiProviderFullConfig,
  saveAiProviderFullConfig,
  getAiConfigHistory,
  restoreAiConfigHistory,
  toggleAiProviderEnabled,
  testAiProviderFullConnection,
  resetAiProviderFullConfig,
} from "@/lib/ai-generation-storage";
import { SUPPORTED_AI_MODELS } from "@/lib/ai-generation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const config = getAiProviderFullConfig();
    const history = getAiConfigHistory();

    return NextResponse.json({
      config,
      models: SUPPORTED_AI_MODELS,
      history,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to retrieve provider configuration", details: message },
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
    const action = body.action || "save";
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "save") {
      const { updates, rawApiKey } = body;
      const result = saveAiProviderFullConfig(updates || {}, rawApiKey, adminName);
      return NextResponse.json(result);
    }

    if (action === "test") {
      const { providerId, endpoint, apiKey } = body;
      const result = await testAiProviderFullConnection(providerId, endpoint, apiKey);
      return NextResponse.json(result);
    }

    if (action === "toggle-enable") {
      const { enabled } = body;
      const result = toggleAiProviderEnabled(Boolean(enabled), adminName);
      return NextResponse.json(result);
    }

    if (action === "history") {
      const history = getAiConfigHistory();
      return NextResponse.json({ history });
    }

    if (action === "restore") {
      const { historyId } = body;
      if (!historyId) {
        return NextResponse.json({ error: "historyId is required for restore" }, { status: 400 });
      }
      const outcome = restoreAiConfigHistory(historyId, adminName);
      if (!outcome.success) {
        return NextResponse.json({ error: outcome.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, config: outcome.config });
    }

    if (action === "reset") {
      const canonical = resetAiProviderFullConfig();
      return NextResponse.json({ success: true, config: canonical });
    }

    return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process configuration request", details: message },
      { status: 500 }
    );
  }
}

