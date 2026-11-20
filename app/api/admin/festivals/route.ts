import { NextResponse } from "next/server";
import {
  getFestivalsDataset,
  createFestivalEvent,
  updateFestivalEvent,
  deleteFestivalEvent,
  duplicateFestivalEvent,
  importFestivalEvents,
  resetFestivalsData,
} from "@/lib/festivals-storage";
import type { FestivalEvent } from "@/lib/festivals";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataset = await getFestivalsDataset();
    return NextResponse.json({ success: true, dataset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load festivals dataset";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;

    switch (action) {
      case "create": {
        const eventInput = body.event as Partial<FestivalEvent>;
        if (!eventInput) {
          return NextResponse.json({ success: false, error: "Missing event payload" }, { status: 400 });
        }
        const created = await createFestivalEvent(eventInput);
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, event: created, dataset });
      }

      case "update": {
        const { id, updates } = body;
        if (!id || !updates) {
          return NextResponse.json({ success: false, error: "Missing id or updates" }, { status: 400 });
        }
        const updated = await updateFestivalEvent(id, updates);
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, event: updated, dataset });
      }

      case "delete": {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
        }
        const deleted = await deleteFestivalEvent(id);
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, deleted, dataset });
      }

      case "duplicate": {
        const { id } = body;
        if (!id) {
          return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
        }
        const duplicated = await duplicateFestivalEvent(id);
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, event: duplicated, dataset });
      }

      case "import": {
        const items = body.items as Partial<FestivalEvent>[];
        if (!Array.isArray(items)) {
          return NextResponse.json({ success: false, error: "Invalid items array" }, { status: 400 });
        }
        const result = await importFestivalEvents(items);
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "reset": {
        await resetFestivalsData();
        const dataset = await getFestivalsDataset();
        return NextResponse.json({ success: true, dataset });
      }

      default:
        return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
