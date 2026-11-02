import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  queryImages,
  approveImage,
  rejectImage,
  flagImage,
  bulkModerateImages,
  getModerationHistory,
  getModerationSettings,
  saveModerationSettings,
  getImageMetrics,
  getAllImages,
  resetImageLibrary,
} from "@/lib/ai-images-storage";
import { generateImagesCsv } from "@/lib/ai-images";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession({ allowDevBypass: true });
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const user = searchParams.get("user") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const timeRange = searchParams.get("timeRange") || undefined;
    const provider = searchParams.get("provider") || undefined;
    const sortBy = (searchParams.get("sortBy") as "newest" | "oldest") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "8", 10);

    const result = queryImages({
      query,
      user,
      category,
      status,
      timeRange,
      provider,
      page,
      pageSize,
      sortBy,
    });
    const metrics = getImageMetrics();
    const settings = getModerationSettings();

    return NextResponse.json({
      images: result.images,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      metrics,
      settings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to load generated images", details: message },
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
    const action = body.action || "query";
    const adminName = `${session.name} (${session.role === "superadmin" ? "Super Administrator" : "Administrator"})`;

    if (action === "approve") {
      const { id, notes } = body;
      if (!id) {
        return NextResponse.json({ error: "Image ID required" }, { status: 400 });
      }
      const updated = approveImage(id, adminName, notes);
      if (!updated) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Image ${id} approved successfully`,
        image: updated,
        metrics: getImageMetrics(),
      });
    }

    if (action === "reject") {
      const { id, reason, notes } = body;
      if (!id) {
        return NextResponse.json({ error: "Image ID required" }, { status: 400 });
      }
      const updated = rejectImage(id, adminName, reason || "Does not meet community guidelines", notes);
      if (!updated) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Image ${id} rejected`,
        image: updated,
        metrics: getImageMetrics(),
      });
    }

    if (action === "flag") {
      const { id, reason } = body;
      if (!id) {
        return NextResponse.json({ error: "Image ID required" }, { status: 400 });
      }
      const updated = flagImage(id, adminName, reason || "Flagged for compliance review");
      if (!updated) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Image ${id} flagged for review`,
        image: updated,
        metrics: getImageMetrics(),
      });
    }

    if (action === "bulk-approve") {
      const { ids } = body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "Image IDs array required" }, { status: 400 });
      }
      const res = bulkModerateImages(ids, "approve", adminName);
      return NextResponse.json({
        success: true,
        message: `${res.successCount} images approved successfully`,
        ...res,
        metrics: getImageMetrics(),
      });
    }

    if (action === "bulk-reject") {
      const { ids, reason } = body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "Image IDs array required" }, { status: 400 });
      }
      const res = bulkModerateImages(ids, "reject", adminName, reason);
      return NextResponse.json({
        success: true,
        message: `${res.successCount} images rejected`,
        ...res,
        metrics: getImageMetrics(),
      });
    }

    if (action === "bulk-archive") {
      const { ids } = body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "Image IDs array required" }, { status: 400 });
      }
      const res = bulkModerateImages(ids, "archive", adminName);
      return NextResponse.json({
        success: true,
        message: `${res.successCount} images archived`,
        ...res,
        metrics: getImageMetrics(),
      });
    }

    if (action === "history") {
      const { imageId } = body;
      const history = getModerationHistory(imageId);
      return NextResponse.json({ success: true, history });
    }

    if (action === "update-settings") {
      const { settings } = body;
      if (!settings) {
        return NextResponse.json({ error: "Settings required" }, { status: 400 });
      }
      const updated = saveModerationSettings(settings);
      return NextResponse.json({
        success: true,
        message: "Moderation settings saved successfully",
        settings: updated,
      });
    }

    if (action === "export") {
      const all = getAllImages();
      const csv = generateImagesCsv(all);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="post-hub-generated-images.csv"',
        },
      });
    }

    if (action === "reset") {
      const reset = resetImageLibrary();
      return NextResponse.json({
        success: true,
        message: "Generated images library reset to canonical state",
        images: reset.images.slice(0, 8),
        metrics: reset.metrics,
        settings: reset.settings,
      });
    }

    return NextResponse.json({
      success: true,
      metrics: getImageMetrics(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Operation failed", details: message },
      { status: 500 }
    );
  }
}

