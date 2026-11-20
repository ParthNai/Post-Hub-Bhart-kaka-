import { NextResponse } from "next/server";
import {
  getRateLimitsDataset,
  saveRateLimitsDataset,
  updateRateLimitPolicy,
  togglePolicyStatus,
  createRateLimitPolicy,
  deleteRateLimitPolicy,
  updateThrottlingBehavior,
  testPolicyEvaluation,
  resetRateLimitsData,
} from "@/lib/ai-rate-limits-storage";

export async function GET() {
  try {
    const dataset = getRateLimitsDataset();
    return NextResponse.json({
      success: true,
      dataset,
      ...dataset,
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
      case "update-policy": {
        const { policyId, partial, adminName } = body;
        if (!policyId || !partial) {
          return NextResponse.json({ error: "Missing policyId or partial data." }, { status: 400 });
        }
        const res = updateRateLimitPolicy(policyId, partial, adminName || "Parth Admin");
        if (!res.success) {
          return NextResponse.json({ error: res.error }, { status: 400 });
        }
        const dataset = getRateLimitsDataset();
        return NextResponse.json({ success: true, policy: res.policy, dataset });
      }

      case "toggle-policy": {
        const { policyId, adminName } = body;
        if (!policyId) {
          return NextResponse.json({ error: "Missing policyId." }, { status: 400 });
        }
        const res = togglePolicyStatus(policyId, adminName || "Parth Admin");
        if (!res.success) {
          return NextResponse.json({ error: res.error }, { status: 400 });
        }
        const dataset = getRateLimitsDataset();
        return NextResponse.json({ success: true, policy: res.policy, dataset });
      }

      case "create-policy": {
        const { policy, adminName } = body;
        if (!policy) {
          return NextResponse.json({ error: "Missing policy data." }, { status: 400 });
        }
        const res = createRateLimitPolicy(policy, adminName || "Parth Admin");
        if (!res.success) {
          return NextResponse.json({ error: res.error }, { status: 400 });
        }
        const dataset = getRateLimitsDataset();
        return NextResponse.json({ success: true, policy: res.policy, dataset });
      }

      case "delete-policy": {
        const { policyId, adminName } = body;
        if (!policyId) {
          return NextResponse.json({ error: "Missing policyId." }, { status: 400 });
        }
        const res = deleteRateLimitPolicy(policyId, adminName || "Parth Admin");
        if (!res.success) {
          return NextResponse.json({ error: res.error }, { status: 400 });
        }
        const dataset = getRateLimitsDataset();
        return NextResponse.json({ success: true, dataset });
      }

      case "update-behavior": {
        const { behavior } = body;
        if (!behavior) {
          return NextResponse.json({ error: "Missing behavior parameter." }, { status: 400 });
        }
        const res = updateThrottlingBehavior(behavior);
        const dataset = getRateLimitsDataset();
        return NextResponse.json({ success: true, config: res.config, dataset });
      }

      case "test-policy": {
        const { endpoint = "/api/generate-image", requestCount = 1050, userId, plan } = body;
        const testRes = testPolicyEvaluation({ endpoint, requestCount, userId, plan });
        return NextResponse.json({ success: true, evaluation: testRes });
      }

      case "save-configuration": {
        const { adminName = "Parth Admin" } = body;
        const dataset = getRateLimitsDataset();
        const now = new Date();
        dataset.lastUpdated = now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        dataset.auditHistory.unshift({
          id: `AUD-POL-${Date.now().toString().slice(-4)}`,
          timestamp: dataset.lastUpdated,
          adminName,
          action: "Applied Rate-Limit Configuration",
          details: "Configuration published to production rate-limiting middleware",
        });
        saveRateLimitsDataset(dataset);
        return NextResponse.json({
          success: true,
          message: "Rate limit configuration published successfully.",
          dataset,
        });
      }

      case "reset": {
        resetRateLimitsData();
        const dataset = getRateLimitsDataset();
        return NextResponse.json({
          success: true,
          message: "Rate limit configuration reset to canonical seed.",
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
