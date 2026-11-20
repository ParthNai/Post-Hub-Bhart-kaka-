import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getRoutingData,
  saveRoutingRule,
  deleteRoutingRule,
  updateProviderPriorities,
  toggleProviderRouting,
  updateFailoverConditions,
  evaluateFailoverRouting,
  resetRoutingData,
} from "@/lib/ai-failover-storage.ts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const data = getRoutingData();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to retrieve failover and routing data", details: message },
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
    const action = body.action || "save-rule";
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "save-rule") {
      const { rule } = body;
      const outcome = saveRoutingRule(rule, adminName);
      const data = getRoutingData();
      return NextResponse.json({ ...outcome, data });
    }

    if (action === "delete-rule") {
      const { ruleId } = body;
      const outcome = deleteRoutingRule(ruleId, adminName);
      const data = getRoutingData();
      return NextResponse.json({ ...outcome, data });
    }

    if (action === "update-priorities") {
      const { items } = body;
      const outcome = updateProviderPriorities(items, adminName);
      const data = getRoutingData();
      return NextResponse.json({ ...outcome, data });
    }

    if (action === "toggle-provider") {
      const { providerId, enabled } = body;
      const outcome = toggleProviderRouting(providerId, enabled, adminName);
      const data = getRoutingData();
      return NextResponse.json({ ...outcome, data });
    }

    if (action === "update-conditions") {
      const { conditions } = body;
      const outcome = updateFailoverConditions(conditions, adminName);
      const data = getRoutingData();
      return NextResponse.json({ ...outcome, data });
    }

    if (action === "evaluate") {
      const { requestType, modelRequirement } = body;
      const routingDecision = evaluateFailoverRouting(requestType, modelRequirement);
      return NextResponse.json(routingDecision);
    }

    if (action === "reset") {
      const canonical = resetRoutingData();
      return NextResponse.json({ success: true, data: canonical });
    }

    return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process routing configuration", details: message },
      { status: 500 }
    );
  }
}
