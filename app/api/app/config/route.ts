import { NextResponse } from "next/server";
import { initScreensDb } from "@/lib/screens.ts";
import { getDesignSystemConfig } from "@/lib/design-system.ts";
import { getTemplates } from "@/lib/templates-storage.ts";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const screens = initScreensDb().filter((s) => s.status !== "archived");
  const designSystem = getDesignSystemConfig();
  const templates = getTemplates().filter((t) => t.status !== "Archived");

  // Client mobile app schema contract
  const publishedConfig = {
    platform: "Post Hub Mobile Client",
    schemaVersion: "2.1.0",
    publishedAt: new Date().toISOString(),
    designSystem: {
      theme: designSystem.guidelines?.theme || "Light",
      colorTokens: designSystem.colorTokens,
      guidelines: designSystem.guidelines,
      components: designSystem.components,
    },
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
      layoutConfig: screen.configData,
    })),
    templates: templates.map((tpl) => ({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category,
      format: tpl.format,
      status: tpl.status,
      headline: tpl.headline || tpl.name,
      subheadline: tpl.subheadline || tpl.description || "",
      ctaText: tpl.ctaText || "Edit Template",
      primaryColor: tpl.primaryColor || "#7956C9",
      accentColor: tpl.accentColor || "#FF5722",
      aspectRatio: tpl.aspectRatio || tpl.format || "3:4",
      theme: tpl.theme,
      tags: tpl.tags || [],
      assetFileName: tpl.assetFileName || "",
      description: tpl.description || "",
    })),
  };

  return NextResponse.json(publishedConfig, {
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
