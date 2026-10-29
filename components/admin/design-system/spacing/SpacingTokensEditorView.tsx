"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { DesignSystemConfig } from "@/lib/design-system";
import type {
  SpacingAndLayoutConfig,
  ComponentSpacingTokens,
  BorderRadiusTokens,
  LayoutDimensionTokens,
} from "@/lib/spacing-tokens";
import { DEFAULT_SPACING_CONFIG } from "@/lib/spacing-tokens";
import { SpacingHeader } from "./SpacingHeader";
import { SpacingScaleCard } from "./SpacingScaleCard";
import { ComponentSpacingCard } from "./ComponentSpacingCard";
import { CornerRadiusCard } from "./CornerRadiusCard";
import { LayoutDimensionsCard } from "./LayoutDimensionsCard";
import { LiveLayoutPreviewPanel } from "./LiveLayoutPreviewPanel";
import { SpacingScalePreviewPanel } from "./SpacingScalePreviewPanel";
import { SpacingFooter } from "./SpacingFooter";
import { TokenUsageModal } from "./TokenUsageModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SpacingTokensEditorViewProps {
  initialConfig: DesignSystemConfig;
}

export const SpacingTokensEditorView: React.FC<SpacingTokensEditorViewProps> = ({
  initialConfig,
}) => {
  const initialSpacing = useMemo<SpacingAndLayoutConfig>(() => {
    return initialConfig.spacingAndLayout || DEFAULT_SPACING_CONFIG;
  }, [initialConfig]);

  const [, setConfig] = useState<DesignSystemConfig>(initialConfig);
  const [savedSpacing, setSavedSpacing] = useState<SpacingAndLayoutConfig>(initialSpacing);
  const [draftSpacing, setDraftSpacing] = useState<SpacingAndLayoutConfig>(initialSpacing);

  const [tokenUsageOpen, setTokenUsageOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear feedback timer
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Dirty detection
  const isDirty = useMemo(() => {
    return JSON.stringify(draftSpacing) !== JSON.stringify(savedSpacing);
  }, [draftSpacing, savedSpacing]);

  // Update spacing scale item
  const handleUpdateScale = (id: string, newValue: number) => {
    setDraftSpacing((prev) => ({
      ...prev,
      scale: prev.scale.map((item) => (item.id === id ? { ...item, value: newValue } : item)),
    }));
  };

  // Update component spacing
  const handleUpdateComponents = (updated: ComponentSpacingTokens) => {
    setDraftSpacing((prev) => ({
      ...prev,
      components: updated,
    }));
  };

  // Update corner radii
  const handleUpdateRadii = (updated: BorderRadiusTokens) => {
    setDraftSpacing((prev) => ({
      ...prev,
      radii: updated,
    }));
  };

  // Update layout dimensions
  const handleUpdateDimensions = (updated: LayoutDimensionTokens) => {
    setDraftSpacing((prev) => ({
      ...prev,
      dimensions: updated,
    }));
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/design-system", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: {
            spacingAndLayout: draftSpacing,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details?.[0] || data.error || "Failed to save spacing draft");
      }

      setConfig(data.config);
      if (data.config?.spacingAndLayout) {
        setSavedSpacing(data.config.spacingAndLayout);
        setDraftSpacing(data.config.spacingAndLayout);
      } else {
        setSavedSpacing(draftSpacing);
      }

      setFeedback({ type: "success", text: "Spacing & layout draft saved successfully." });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save spacing changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    setDraftSpacing(DEFAULT_SPACING_CONFIG);
    setFeedback({
      type: "success",
      text: "Draft reset to standard spacing & layout defaults.",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
    >
      {/* Top Header */}
      <SpacingHeader
        isDirty={isDirty}
        onResetToDefaults={handleResetToDefaults}
        onSaveDraft={handleSaveDraft}
        isSaving={isSaving}
      />

      {/* Floating Alert */}
      {feedback && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor: feedback.type === "success" ? "#EDF7F2" : "#FDF2F2",
            border: `1px solid ${feedback.type === "success" ? "#C8E8D7" : "#F8D7DA"}`,
            color: feedback.type === "success" ? "#12805C" : "#D9383A",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Two-Column Content Grid */}
      <main
        style={{
          flex: 1,
          padding: "24px 32px 32px 32px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            gap: "24px",
            alignItems: "start",
          }}
          className="spacing-layout-grid"
        >
          {/* Left Column: Form Cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* 1. Spacing Scale */}
            <SpacingScaleCard
              scale={draftSpacing.scale}
              onUpdateScale={handleUpdateScale}
            />

            {/* 2. Component Spacing */}
            <ComponentSpacingCard
              spacing={draftSpacing.components}
              onChange={handleUpdateComponents}
            />

            {/* 3. Corner Radius */}
            <CornerRadiusCard
              radii={draftSpacing.radii}
              onChangeRadii={handleUpdateRadii}
            />

            {/* 4. Layout Dimensions */}
            <LayoutDimensionsCard
              dimensions={draftSpacing.dimensions}
              onChange={handleUpdateDimensions}
            />
          </div>

          {/* Right Column: Previews */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "sticky",
              top: "24px",
            }}
          >
            {/* 1. Live Layout Preview */}
            <LiveLayoutPreviewPanel
              componentSpacing={draftSpacing.components}
              radii={draftSpacing.radii}
            />

            {/* 2. Spacing Scale Comparison Preview */}
            <SpacingScalePreviewPanel scale={draftSpacing.scale} />
          </div>
        </div>

        {/* Bottom Footer */}
        <SpacingFooter
          onOpenUsage={() => setTokenUsageOpen(true)}
          lastPublished="Not available"
        />
      </main>

      {/* Token Usage Reference Modal */}
      <TokenUsageModal
        isOpen={tokenUsageOpen}
        onClose={() => setTokenUsageOpen(false)}
      />
    </div>
  );
};

