import { NextResponse } from "next/server";
import { getDesignSystemConfig } from "@/lib/design-system";

export const dynamic = "force-dynamic";

/**
 * Public Mobile / Client Application Design Tokens API Contract
 * Consumed by the Post Hub Mobile Client to dynamically apply theme, brand colors,
 * typography scales, and assets.
 */
export async function GET() {
  const config = getDesignSystemConfig();

  // Return token contract optimized for mobile clients
  return NextResponse.json({
    version: config.version,
    status: config.status,
    lastUpdated: config.lastSavedAt || new Date().toISOString(),
    theme: {
      mode: config.guidelines.theme,
      accentColor: config.guidelines.accentColor,
      visualStyle: config.guidelines.visualStyle,
      brandTone: config.guidelines.brandTone,
    },
    colors: {
      primary: config.colorTokens.primaryViolet,
      secondary: config.colorTokens.softLavender,
      background: config.colorTokens.warmIvory,
      surface: "#FFFFFF",
      text: config.colorTokens.mainText,
      textMuted: config.colorTokens.secondaryText,
      border: config.colorTokens.border,
    },
    typography: {
      fontFamily: config.typography.fontFamily,
      headline: {
        fontSize: config.typography.headlineSize,
        fontWeight: config.typography.headlineWeight,
      },
      body: {
        fontSize: config.typography.bodySize,
        lineHeight: config.typography.bodyLineHeight,
      },
      caption: {
        fontSize: config.typography.metadataSize,
      },
    },
    components: {
      borderRadius: config.components.borderRadius,
      cardBorderRadius: config.components.cardBorderRadius,
    },
    brandAssets: config.brandAssets.reduce((acc, asset) => {
      acc[asset.id] = {
        title: asset.title,
        status: asset.status,
        url: asset.url || null,
        dimensions: asset.dimensions,
      };
      return acc;
    }, {} as Record<string, unknown>),
  });
}

