import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAuditDataset,
  getTransactionById,
  queryAuditTransactions,
  queryAuditEvents,
  recordAuditEvent,
  resetAuditData,
} from "@/lib/ai-audit-storage";
import { generateAuditReportCsv } from "@/lib/ai-audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");

    // Single transaction detail view
    if (view === "detail") {
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
      }
      const tx = getTransactionById(id);
      if (!tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: tx });
    }

    // Filtered transactions query
    if (view === "transactions") {
      const searchId = searchParams.get("searchId") || undefined;
      const searchUser = searchParams.get("searchUser") || undefined;
      const type = searchParams.get("type") || undefined;
      const status = searchParams.get("status") || undefined;
      const source = searchParams.get("source") || undefined;

      const transactions = queryAuditTransactions({
        searchId,
        searchUser,
        type,
        status,
        source,
      });
      return NextResponse.json({ success: true, data: transactions });
    }

    // Audit events query
    if (view === "audit-events") {
      const admin = searchParams.get("admin") || undefined;
      const action = searchParams.get("action") || undefined;
      const target = searchParams.get("target") || undefined;

      const events = queryAuditEvents({ admin, action, target });
      return NextResponse.json({ success: true, data: events });
    }

    // Default full dataset
    const dataset = getAuditDataset();
    return NextResponse.json({ success: true, data: dataset, ...dataset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to fetch audit data", details: message },
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

    // Export CSV
    if (action === "export-csv") {
      const dataset = getAuditDataset();
      const csv = generateAuditReportCsv(dataset.auditEvents, dataset.transactions);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="credit-audit-report-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Record an administrative audit action
    if (action === "record-audit-event") {
      const { actionPerformed, targetEntity, previousValue, newValue, reason, relatedTransactionId } = body;
      const newEvent = recordAuditEvent({
        administrator: session.name || session.email || "admin.ops@posthub",
        actionPerformed,
        targetEntity,
        previousValue: previousValue ?? "—",
        newValue: newValue ?? "—",
        reason: reason || "Administrative update",
        relatedTransactionId,
      });
      return NextResponse.json({ success: true, event: newEvent, dataset: getAuditDataset() });
    }

    // Reset canonical state
    if (action === "reset") {
      const dataset = resetAuditData();
      return NextResponse.json({ success: true, dataset });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process audit action", details: message },
      { status: 500 }
    );
  }
}
