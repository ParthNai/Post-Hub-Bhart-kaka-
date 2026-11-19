import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAllPresets,
  getPresetById,
  createPreset,
  updatePreset,
  duplicatePreset,
  togglePresetStatus,
  archivePreset,
  deletePreset,
  getGlobalRules,
  saveGlobalRules,
  getPresetMetrics,
  filterPresets,
  resetAiPresets,
} from "@/lib/ai-presets-storage";
import { composeAiPrompt } from "@/lib/ai-presets";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const sortBy = (searchParams.get("sortBy") as "updatedAt" | "name" | "category") || undefined;

    const allPresets = getAllPresets();
    const filtered = filterPresets(allPresets, { query, category, status, sortBy });
    const metrics = getPresetMetrics(allPresets);
    const globalRules = getGlobalRules();

    return NextResponse.json({
      presets: filtered,
      allPresetsCount: allPresets.length,
      metrics,
      globalRules,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to load presets", details: message },
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
    const action = body.action || "create";
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "create") {
      const { preset } = body;
      if (!preset || !preset.name || !preset.category) {
        return NextResponse.json(
          { error: "Missing required preset fields" },
          { status: 400 }
        );
      }
      const created = createPreset(preset, adminName);
      return NextResponse.json({
        success: true,
        message: `Preset "${created.name}" created successfully`,
        preset: created,
        metrics: getPresetMetrics(),
      });
    }

    if (action === "update") {
      const { id, updates } = body;
      if (!id || !updates) {
        return NextResponse.json(
          { error: "Preset ID and update payload are required" },
          { status: 400 }
        );
      }
      const updated = updatePreset(id, updates);
      if (!updated) {
        return NextResponse.json({ error: "Preset not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Preset "${updated.name}" updated successfully`,
        preset: updated,
        metrics: getPresetMetrics(),
      });
    }

    if (action === "duplicate") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Preset ID required" }, { status: 400 });
      }
      const duplicated = duplicatePreset(id, adminName);
      if (!duplicated) {
        return NextResponse.json({ error: "Preset not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Preset duplicated as "${duplicated.name}"`,
        preset: duplicated,
        metrics: getPresetMetrics(),
      });
    }

    if (action === "toggle-status") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Preset ID required" }, { status: 400 });
      }
      const updated = togglePresetStatus(id);
      if (!updated) {
        return NextResponse.json({ error: "Preset not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Preset status changed to ${updated.status}`,
        preset: updated,
        metrics: getPresetMetrics(),
      });
    }

    if (action === "archive") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Preset ID required" }, { status: 400 });
      }
      const updated = archivePreset(id);
      if (!updated) {
        return NextResponse.json({ error: "Preset not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Preset "${updated.name}" archived`,
        preset: updated,
        metrics: getPresetMetrics(),
      });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "Preset ID required" }, { status: 400 });
      }
      const ok = deletePreset(id);
      if (!ok) {
        return NextResponse.json({ error: "Preset not found or could not be deleted" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Preset deleted successfully",
        metrics: getPresetMetrics(),
      });
    }

    if (action === "save-rules") {
      const { rules } = body;
      if (!rules) {
        return NextResponse.json({ error: "Rules payload required" }, { status: 400 });
      }
      const updatedRules = saveGlobalRules(rules, adminName);
      return NextResponse.json({
        success: true,
        message: "Global prompt rules saved successfully",
        globalRules: updatedRules,
      });
    }

    if (action === "compose") {
      const { userPrompt, presetId } = body;
      const preset = presetId ? getPresetById(presetId) : null;
      const globalRules = getGlobalRules();
      const composition = composeAiPrompt(userPrompt || "", preset, globalRules);
      return NextResponse.json({
        success: true,
        ...composition,
      });
    }

    if (action === "reset") {
      const resetResult = resetAiPresets();
      return NextResponse.json({
        success: true,
        message: "Presets and global rules reset to default canonical state",
        presets: resetResult.presets,
        globalRules: resetResult.globalRules,
        metrics: getPresetMetrics(resetResult.presets),
      });
    }

    return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Operation failed", details: message },
      { status: 500 }
    );
  }
}
