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

  const homeScreen = screens.find((s) => s.key === "home" || s.route === "/home");
  const primaryLogo = designSystem.brandAssets?.find((a) => a.id === "primary-logo" && a.status === "available");
  const appIcon = designSystem.brandAssets?.find((a) => a.id === "app-icon" && a.status === "available");
  const primaryAccent = homeScreen?.configData?.primaryAccent || designSystem.colorTokens?.primaryViolet || "#0055B8";

  const resolvedLogoUrl =
    primaryLogo?.url ||
    appIcon?.url ||
    (primaryLogo?.filename && !primaryLogo.filename.includes("brand") ? `/assets/uploads/${primaryLogo.filename}` : undefined) ||
    "/logo192.png";

  const resolvedIconUrl =
    appIcon?.url ||
    primaryLogo?.url ||
    "/logo192.png";

  // Client mobile app schema contract - tailored for the 4 core controls:
  // 1. App Icon / Logo
  // 2. Preloader (colors & animation)
  // 3. Theme & Primary Accent
  // 4. Hero Section of Home Screen
  const publishedConfig = {
    platform: "Post Hub Mobile Client",
    schemaVersion: "2.1.0",
    publishedAt: new Date().toISOString(),
    appBranding: {
      appIconUrl: resolvedIconUrl,
      logoUrl: resolvedLogoUrl,
      preset: "🇮🇳",
      shape: "rounded_square",
      bgColor: "blue",
    },
    preloader: {
      primaryColor: designSystem.colorTokens?.primaryViolet || "#FE8706",
      secondaryColor: primaryAccent,
      durationMs: 2200,
      mediaType: "animation",
      tagline: "તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર",
      title: "Panchayat Post",
      logoUrl: resolvedLogoUrl,
    },
    theme: {
      mode: designSystem.guidelines?.theme || "Light",
      primaryAccent: primaryAccent,
      backgroundColor: homeScreen?.configData?.backgroundColor || "#FFFFFF",
      cardRadius: homeScreen?.configData?.cardRadius || "14px",
    },
    heroSection: {
      visible: homeScreen?.configData?.bannerVisible ?? true,
      badge: homeScreen?.configData?.bannerBadge || "✨ MAGIC STUDIO",
      headline: homeScreen?.configData?.bannerHeadline || "What will you design today?",
      subtitle: homeScreen?.configData?.bannerSubtitle || "Choose a format below or start from templates.",
      enabled: homeScreen?.configData?.sections?.find((s) => s.id === "hero")?.enabled ?? true,
    },
    designSystem: {
      theme: designSystem.guidelines?.theme || "Light",
      colorTokens: designSystem.colorTokens,
      guidelines: designSystem.guidelines,
      components: designSystem.components,
      brandAssets: designSystem.brandAssets,
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
      backgroundImageUrl: tpl.backgroundImageUrl || (tpl.assetFileName ? `/templates/${tpl.assetFileName}` : undefined),
      thumbnailUrl: tpl.backgroundImageUrl || (tpl.assetFileName ? `/templates/${tpl.assetFileName}` : undefined),
      slotZones: tpl.slotZones || (tpl as any).zones || [],
      zones: tpl.slotZones || (tpl as any).zones || [],
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
