import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCreditDataset,
  allocateUserCredits,
  createCreditPlan,
  updateCreditPlan,
  duplicateCreditPlan,
  archiveCreditPlan,
  togglePlanStatus,
  updateCreditSettings,
  queryUsers,
  queryTransactions,
  resetCreditData,
} from "@/lib/ai-credits-storage";
import {
  generateTransactionsCsv,
  generateUserCreditsCsv,
} from "@/lib/ai-credits";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");
    const query = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;
    const plan = searchParams.get("plan") || undefined;

    if (view === "users") {
      const users = queryUsers(query, status, plan);
      return NextResponse.json({ success: true, data: users });
    }

    if (view === "transactions") {
      const type = searchParams.get("type") || undefined;
      const transactions = queryTransactions(query, type, status);
      return NextResponse.json({ success: true, data: transactions });
    }

    const data = getCreditDataset();
    return NextResponse.json({ success: true, data, ...data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to fetch credit information", details: message },
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

    // 1. Atomic Credit Allocation
    if (action === "allocate-credits") {
      const { userId, source, amount, expiryDate, reason, idempotencyKey } = body;
      const result = allocateUserCredits({
        userId,
        source,
        amount: Number(amount),
        expiryDate,
        reason,
        adminName: session.name || "JD Admin",
        idempotencyKey,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully allocated ${amount} credits to ${result.user.name}`,
        data: result,
      });
    }

    // 2. Create Plan
    if (action === "create-plan") {
      const { name, description, creditQuantity, validityDays, planType, status, visibility, price, currency } = body;
      const plan = createCreditPlan({
        name,
        description: description || "",
        creditQuantity: Number(creditQuantity),
        validityDays: Number(validityDays) || 30,
        planType: planType || "One-time",
        status: status || "Active",
        visibility: visibility || "Public",
        price: Number(price) || 0,
        currency: currency || "USD",
      });
      return NextResponse.json({ success: true, plan, dataset: getCreditDataset() });
    }

    // 3. Update Plan
    if (action === "update-plan") {
      const { id, updates } = body;
      const updated = updateCreditPlan(id, updates);
      return NextResponse.json({ success: true, plan: updated, dataset: getCreditDataset() });
    }

    // 4. Duplicate Plan
    if (action === "duplicate-plan") {
      const { id } = body;
      const duplicated = duplicateCreditPlan(id);
      return NextResponse.json({ success: true, plan: duplicated, dataset: getCreditDataset() });
    }

    // 5. Archive Plan
    if (action === "archive-plan") {
      const { id } = body;
      const archived = archiveCreditPlan(id);
      return NextResponse.json({ success: true, plan: archived, dataset: getCreditDataset() });
    }

    // 6. Toggle Plan Status
    if (action === "toggle-plan-status") {
      const { id } = body;
      const toggled = togglePlanStatus(id);
      return NextResponse.json({ success: true, plan: toggled, dataset: getCreditDataset() });
    }

    // 7. Update Settings
    if (action === "update-settings") {
      const { settings } = body;
      const updatedSettings = updateCreditSettings(settings);
      return NextResponse.json({ success: true, settings: updatedSettings, dataset: getCreditDataset() });
    }

    // 8. Export Transactions CSV
    if (action === "export-transactions") {
      const dataset = getCreditDataset();
      const csv = generateTransactionsCsv(dataset.transactions);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="credit-transactions-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // 9. Export Users CSV
    if (action === "export-users") {
      const dataset = getCreditDataset();
      const csv = generateUserCreditsCsv(dataset.users);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="user-credit-allocations-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // 10. Reset canonical state
    if (action === "reset") {
      const dataset = resetCreditData();
      return NextResponse.json({ success: true, dataset });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process credit request", details: message },
      { status: 500 }
    );
  }
}
