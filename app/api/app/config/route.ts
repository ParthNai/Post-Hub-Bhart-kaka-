import { NextResponse } from "next/server";
import { getAllScreens } from "@/lib/screens";

export const dynamic = "force-dynamic";

export async function GET() {
  const screens = getAllScreens().filter((s) => s.status !== "archived");

  // Client mobile app schema contract
  const publishedConfig = {
    platform: "Post Hub Mobile Client",
    schemaVersion: "2.1.0",
    publishedAt: new Date().toISOString(),
    navigation: screens.map((screen) => ({
      id: screen.id,
      key: screen.key,
      name: screen.name,
      description: screen.description,
      route: screen.route,
      icon: screen.iconName,
      category: screen.category,
      status: screen.status,
      version: screen.version,
      visibilityEnabled: screen.visibilityEnabled ?? true,
      minAppVersion: screen.minAppVersion || "1.0.0",
      capabilities: screen.supportedCapabilities,
      layoutConfig: {
        ...screen.configData,
        ...(screen.draftConfigData || {}),
      },
    })),
  };

  return NextResponse.json(publishedConfig);
}
