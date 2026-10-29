import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getDesignSystemConfig,
  saveDesignSystemDraft,
  resetDesignSystemToDefaults,
  updateBrandAsset,
  DesignSystemConfig,
} from "@/lib/design-system";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const config = getDesignSystemConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, draft, assetId, updates } = body;

    if (action === "reset_defaults") {
      const result = resetDesignSystemToDefaults(session.name || "System Administrator");
      return NextResponse.json({
        success: true,
        message: "Design system tokens reset to defaults",
        config: result.config,
      });
    }

    if (action === "update_asset") {
      if (!assetId || !updates) {
        return NextResponse.json(
          { error: "assetId and updates are required for update_asset" },
          { status: 400 }
        );
      }
      const result = updateBrandAsset(assetId, updates);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: "Brand asset updated successfully",
        config: result.config,
      });
    }

    // Default action: save_draft
    const result = saveDesignSystemDraft(
      (draft || {}) as Partial<DesignSystemConfig>,
      session.name || "System Administrator"
    );

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.errors },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Draft configuration saved successfully",
      config: result.config,
    });
  } catch (error) {
    console.error("Failed to update design system:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

