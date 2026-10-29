import { NextRequest, NextResponse } from "next/server";
import { getAllScreens, createScreen, ScreenCategory, ScreenStatus } from "@/lib/screens";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get("category") as ScreenCategory | "All Screens" | null;
  const status = url.searchParams.get("status") as ScreenStatus | "All" | null;
  const query = (url.searchParams.get("q") || "").toLowerCase().trim();

  let screens = getAllScreens();

  // Filter category
  if (category && category !== "All Screens") {
    screens = screens.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  // Filter status
  if (status && status !== "All") {
    const normStatus = status.toLowerCase().replace(/\s+/g, "_");
    screens = screens.filter((s) => s.status.toLowerCase() === normStatus);
  }

  // Search filter
  if (query) {
    screens = screens.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.key.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.route.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    screens,
    total: screens.length,
    counts: {
      all: getAllScreens().length,
      configured: getAllScreens().filter((s) => s.status === "configured").length,
      needsSetup: getAllScreens().filter((s) => s.status === "needs_setup").length,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, key, description, category, route, iconName } = body;

    const result = createScreen({
      name,
      key,
      description,
      category,
      route,
      iconName,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, screen: result.screen }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}
