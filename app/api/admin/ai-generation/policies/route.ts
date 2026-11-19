import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getModerationPolicy,
  saveModerationPolicy,
  toggleRule,
  addRule,
  updateRule,
  deleteRule,
  toggleCategory,
  updateCategory,
  addRejectionReason,
  updateRejectionReason,
  toggleRejectionReason,
  deleteRejectionReason,
  restorePolicyRevision,
  resetModerationPolicy,
} from "@/lib/ai-moderation-storage";
import { evaluatePolicyRules } from "@/lib/ai-moderation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const policy = getModerationPolicy();
    return NextResponse.json(policy);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to load moderation policy", details: message },
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
    const action = body.action || "save-policy";
    const author = `${session.name || "Administrator"} (${
      session.role === "superadmin" ? "Super Administrator" : "Administrator"
    })`;

    // Action: Save Policy
    if (action === "save-policy") {
      const { globals, categories, rules, reasons, manualReview, errorHandling, summary } = body;
      const updated = saveModerationPolicy(
        { globals, categories, rules, reasons, manualReview, errorHandling },
        author,
        summary
      );
      return NextResponse.json({
        success: true,
        message: "Moderation policy saved and published successfully.",
        policy: updated,
      });
    }

    // Action: Toggle Rule
    if (action === "toggle-rule") {
      const { ruleId, enabled } = body;
      if (!ruleId) {
        return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
      }
      const updated = toggleRule(ruleId, enabled);
      if (!updated) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        rule: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Add Rule
    if (action === "add-rule") {
      const { name, triggerCondition, detectionSource, severity, resultingAction, enabled, description } = body;
      if (!name || !triggerCondition) {
        return NextResponse.json({ error: "Name and trigger condition required" }, { status: 400 });
      }
      const created = addRule({
        name,
        triggerCondition,
        detectionSource: detectionSource || "Vision AI",
        severity: severity || "Medium",
        resultingAction: resultingAction || "Flag for Review",
        enabled: enabled ?? true,
        description,
      });
      return NextResponse.json({
        success: true,
        rule: created,
        policy: getModerationPolicy(),
      });
    }

    // Action: Update Rule
    if (action === "update-rule") {
      const { ruleId, updates } = body;
      if (!ruleId || !updates) {
        return NextResponse.json({ error: "Rule ID and updates required" }, { status: 400 });
      }
      const updated = updateRule(ruleId, updates);
      if (!updated) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        rule: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Delete Rule
    if (action === "delete-rule") {
      const { ruleId } = body;
      if (!ruleId) {
        return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
      }
      const ok = deleteRule(ruleId);
      return NextResponse.json({
        success: ok,
        policy: getModerationPolicy(),
      });
    }

    // Action: Toggle Category
    if (action === "toggle-category") {
      const { categoryId, enabled } = body;
      if (!categoryId) {
        return NextResponse.json({ error: "Category ID required" }, { status: 400 });
      }
      const updated = toggleCategory(categoryId, enabled);
      if (!updated) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        category: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Update Category
    if (action === "update-category") {
      const { categoryId, updates } = body;
      if (!categoryId || !updates) {
        return NextResponse.json({ error: "Category ID and updates required" }, { status: 400 });
      }
      const updated = updateCategory(categoryId, updates);
      if (!updated) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        category: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Add Rejection Reason
    if (action === "add-reason") {
      const { category, description, status } = body;
      if (!category || !description) {
        return NextResponse.json({ error: "Category and description required" }, { status: 400 });
      }
      const created = addRejectionReason({
        category,
        description,
        status: status || "Active",
      });
      return NextResponse.json({
        success: true,
        reason: created,
        policy: getModerationPolicy(),
      });
    }

    // Action: Update Rejection Reason
    if (action === "update-reason") {
      const { reasonId, updates } = body;
      if (!reasonId || !updates) {
        return NextResponse.json({ error: "Reason ID and updates required" }, { status: 400 });
      }
      const updated = updateRejectionReason(reasonId, updates);
      if (!updated) {
        return NextResponse.json({ error: "Reason not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        reason: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Toggle Rejection Reason
    if (action === "toggle-reason") {
      const { reasonId } = body;
      if (!reasonId) {
        return NextResponse.json({ error: "Reason ID required" }, { status: 400 });
      }
      const updated = toggleRejectionReason(reasonId);
      if (!updated) {
        return NextResponse.json({ error: "Reason not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        reason: updated,
        policy: getModerationPolicy(),
      });
    }

    // Action: Delete Rejection Reason
    if (action === "delete-reason") {
      const { reasonId } = body;
      if (!reasonId) {
        return NextResponse.json({ error: "Reason ID required" }, { status: 400 });
      }
      const ok = deleteRejectionReason(reasonId);
      return NextResponse.json({
        success: ok,
        policy: getModerationPolicy(),
      });
    }

    // Action: Restore History Revision
    if (action === "restore-history") {
      const { revisionId } = body;
      if (!revisionId) {
        return NextResponse.json({ error: "Revision ID required" }, { status: 400 });
      }
      const restored = restorePolicyRevision(revisionId, author);
      if (!restored) {
        return NextResponse.json({ error: "Revision not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Policy restored to selected revision.",
        policy: restored,
      });
    }

    // Action: Evaluate Test Prompt
    if (action === "evaluate-test") {
      const { prompt } = body;
      if (!prompt) {
        return NextResponse.json({ error: "Prompt string required" }, { status: 400 });
      }
      const current = getModerationPolicy();
      const evalResult = evaluatePolicyRules(prompt, current.categories, current.rules);
      return NextResponse.json({
        success: true,
        result: evalResult,
      });
    }

    // Action: Reset Policy to Canonical
    if (action === "reset") {
      const reset = resetModerationPolicy();
      return NextResponse.json({
        success: true,
        message: "Moderation policy reset to reference defaults.",
        policy: reset,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process moderation policy request", details: message },
      { status: 500 }
    );
  }
}
