"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  DesignSystemConfig,
  BrandAsset,
  BrandGuidelines,
  ColorTokens,
  TypographyTokens,
  ComponentTokens,
  IconTokens,
  SpacingTokens,
} from "@/lib/design-system";
import { BrandAssetsCard } from "./BrandAssetsCard";
import { BrandGuidelinesCard } from "./BrandGuidelinesCard";
import { ComponentPreviewCard } from "./ComponentPreviewCard";
import { ColorTokensCard } from "./ColorTokensCard";
import { TypographyCard } from "./TypographyCard";
import { DesignSystemFooter } from "./DesignSystemFooter";
import {
  ColorsSection,
  TypographySection,
  IconsSection,
  ComponentsSection,
  SpacingSection,
} from "./OtherDesignSections";
import { AssetUploadModal } from "./AssetUploadModal";
import { TokenHistoryModal } from "./TokenHistoryModal";
import { TokenExportModal } from "./TokenExportModal";
import { DiscardConfirmModal } from "./DiscardConfirmModal";
import { LivePreviewModal } from "./LivePreviewModal";
import {
  Image as ImageIcon,
  Palette,
  Type,
  Star,
  Layers,
  Grid,
  Search,
  Eye,
  Bookmark,
  MoreHorizontal,
  RotateCcw,
  History,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DesignSystemViewProps {
  initialConfig: DesignSystemConfig;
  onMenuToggle?: () => void;
}

type TabKey =
  | "brand-identity"
  | "colors"
  | "typography"
  | "icons"
  | "components"
  | "spacing";

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({
  initialConfig,
}) => {
  const router = useRouter();
  const [config, setConfig] = useState<DesignSystemConfig>(initialConfig);
  const [draft, setDraft] = useState<DesignSystemConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabKey>("brand-identity");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [uploadAsset, setUploadAsset] = useState<BrandAsset | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Dirty state calculation
  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(config);
  }, [draft, config]);

  // Clear feedback timer
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleClick = () => setMoreMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [moreMenuOpen]);

  // Handlers for partial updates to draft
  const handleGuidelinesChange = (guidelines: BrandGuidelines) => {
    setDraft((prev) => ({ ...prev, guidelines }));
  };

  const handleColorTokensChange = (colorTokens: ColorTokens) => {
    setDraft((prev) => ({ ...prev, colorTokens }));
  };

  const handleTypographyChange = (typography: TypographyTokens) => {
    setDraft((prev) => ({ ...prev, typography }));
  };

  const handleIconsChange = (icons: IconTokens) => {
    setDraft((prev) => ({ ...prev, icons }));
  };

  const handleComponentsChange = (components: ComponentTokens) => {
    setDraft((prev) => ({ ...prev, components }));
  };

  const handleSpacingChange = (spacing: SpacingTokens) => {
    setDraft((prev) => ({ ...prev, spacing }));
  };

  const handleAssetUpdated = (updatedAsset: BrandAsset) => {
    const updatedAssets = draft.brandAssets.map((a) =>
      a.id === updatedAsset.id ? updatedAsset : a
    );
    setDraft((prev) => ({ ...prev, brandAssets: updatedAssets }));
    setConfig((prev) => ({ ...prev, brandAssets: updatedAssets }));
  };

  // Save Draft API request
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/design-system", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          draft: {
            guidelines: draft.guidelines,
            colorTokens: draft.colorTokens,
            typography: draft.typography,
            icons: draft.icons,
            components: draft.components,
            spacing: draft.spacing,
            brandAssets: draft.brandAssets,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details?.join(", ") || data.error || "Save draft failed");
      }

      setConfig(data.config);
      setDraft(data.config);
      setFeedback({ type: "success", text: "Design system draft saved successfully!" });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save draft",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Discard draft changes
  const handleConfirmDiscard = () => {
    setDraft(config);
    setDiscardOpen(false);
    setFeedback({ type: "success", text: "Unsaved changes discarded." });
  };

  // Reset to system defaults
  const handleResetDefaults = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/design-system", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Reset failed");

      setConfig(data.config);
      setDraft(data.config);
      setFeedback({ type: "success", text: "Reset design system to default tokens." });
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reset defaults",
      });
    } finally {
      setIsSaving(false);
      setMoreMenuOpen(false);
    }
  };

  const navTabs: { id: TabKey; label: string; icon: React.ComponentType<{ size: number }> }[] = [
    { id: "brand-identity", label: "Brand Identity", icon: ImageIcon },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "icons", label: "Icons", icon: Star },
    { id: "components", label: "Components", icon: Layers },
    { id: "spacing", label: "Spacing & Layout", icon: Grid },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
    >
      {/* Top Header matching reference */}
      <header
        style={{
          padding: "20px 32px 16px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderBottom: "1px solid var(--border, #EAE4EE)",
          backgroundColor: "var(--bg, #FAF7F2)",
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--text-muted, #777184)",
          }}
        >
          <Link href="/admin/dashboard" style={{ color: "inherit", textDecoration: "none" }}>
            Admin
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text, #24213A)", fontWeight: 500 }}>
            Design System
          </span>
        </nav>

        {/* Title, Subtitle, and Actions Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "var(--text, #24213A)",
                }}
              >
                Design System
              </h1>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  backgroundColor: "var(--secondary, #E8DFF5)",
                  color: "var(--primary, #7956C9)",
                }}
              >
                Draft
              </span>
            </div>
            <p
              style={{
                fontSize: "13.5px",
                color: "var(--text-muted, #777184)",
                marginTop: "2px",
              }}
            >
              Manage the visual foundations of your Post Hub experience.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted, #777184)",
                }}
              />
              <input
                type="text"
                placeholder="Search design tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid var(--border, #EAE4EE)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--text, #24213A)",
                  outline: "none",
                  width: "190px",
                }}
              />
            </div>

            {/* Preview Changes Button */}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                color: "var(--text, #24213A)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Eye size={15} style={{ color: "var(--text-muted, #777184)" }} />
              <span>Preview Changes</span>
            </button>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "var(--primary, #7956C9)",
                color: "#FFFFFF",
                border: "none",
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
              }}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>

            {/* More Options Menu */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreMenuOpen(!moreMenuOpen);
                }}
                aria-label="More options"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border, #EAE4EE)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--text-muted, #777184)",
                  cursor: "pointer",
                }}
              >
                <MoreHorizontal size={17} />
              </button>

              {moreMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "42px",
                    width: "220px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid var(--border, #EAE4EE)",
                    boxShadow: "0 10px 30px rgba(36, 33, 58, 0.12)",
                    zIndex: 40,
                    padding: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExportOpen(true);
                      setMoreMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      fontSize: "12.5px",
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    className="menu-dropdown-item"
                  >
                    <FileCode size={14} /> Export Tokens (JSON)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHistoryOpen(true);
                      setMoreMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      fontSize: "12.5px",
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    className="menu-dropdown-item"
                  >
                    <History size={14} /> View Token History
                  </button>

                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => {
                        setDiscardOpen(true);
                        setMoreMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        fontSize: "12.5px",
                        color: "var(--error, #D9383A)",
                        background: "none",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                      }}
                      className="menu-dropdown-item"
                    >
                      <RotateCcw size={14} /> Discard Unsaved Changes
                    </button>
                  )}

                  <div style={{ height: "1px", backgroundColor: "var(--border, #EAE4EE)", margin: "4px 0" }} />

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      fontSize: "12.5px",
                      color: "var(--text-muted)",
                      background: "none",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    className="menu-dropdown-item"
                  >
                    <RotateCcw size={14} /> Reset to Defaults
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "12px",
            overflowX: "auto",
            paddingBottom: "2px",
          }}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "colors") {
                    router.push("/admin/design-system/colors");
                  } else if (tab.id === "spacing") {
                    router.push("/admin/design-system/spacing");
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
                  backgroundColor: isActive ? "var(--secondary, #E8DFF5)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Floating Feedback Alert */}
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

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: "24px 32px 32px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {activeTab === "brand-identity" && (
          <>
            {/* Top Row: Left Brand Assets & Guidelines vs Right Component Preview */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.05fr 0.95fr",
                gap: "20px",
              }}
              className="brand-identity-top-grid"
            >
              {/* Left Column: Brand Assets & Guidelines */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <BrandAssetsCard
                  assets={draft.brandAssets}
                  onOpenUpload={(asset) => setUploadAsset(asset)}
                />

                <BrandGuidelinesCard
                  guidelines={draft.guidelines}
                  onChange={handleGuidelinesChange}
                />
              </div>

              {/* Right Column: Component Preview */}
              <div>
                <ComponentPreviewCard
                  colorTokens={draft.colorTokens}
                  componentTokens={draft.components}
                />
              </div>
            </div>

            {/* Bottom Row: Color Tokens vs Typography */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "20px",
              }}
              className="brand-identity-bottom-grid"
            >
              <ColorTokensCard
                colorTokens={draft.colorTokens}
                onChange={handleColorTokensChange}
              />

              <TypographyCard
                typography={draft.typography}
                colorTokens={draft.colorTokens}
              />
            </div>
          </>
        )}

        {/* Other Sections */}
        {activeTab === "colors" && (
          <ColorsSection
            colorTokens={draft.colorTokens}
            onChange={handleColorTokensChange}
          />
        )}

        {activeTab === "typography" && (
          <TypographySection
            typography={draft.typography}
            onChange={handleTypographyChange}
          />
        )}

        {activeTab === "icons" && (
          <IconsSection icons={draft.icons} onChange={handleIconsChange} />
        )}

        {activeTab === "components" && (
          <ComponentsSection
            components={draft.components}
            onChange={handleComponentsChange}
          />
        )}

        {activeTab === "spacing" && (
          <SpacingSection spacing={draft.spacing} onChange={handleSpacingChange} />
        )}

        {/* Bottom Disclaimer and Status Strip */}
        <DesignSystemFooter
          status={draft.status}
          lastSavedAt={draft.lastSavedAt}
          isDirty={isDirty}
        />
      </main>

      {/* Modals */}
      <AssetUploadModal
        asset={uploadAsset}
        onClose={() => setUploadAsset(null)}
        onUploadSuccess={handleAssetUpdated}
      />

      <TokenHistoryModal
        isOpen={historyOpen}
        history={draft.history}
        currentVersion={draft.version}
        onClose={() => setHistoryOpen(false)}
      />

      <TokenExportModal
        isOpen={exportOpen}
        config={draft}
        onClose={() => setExportOpen(false)}
      />

      <LivePreviewModal
        isOpen={previewOpen}
        config={draft}
        onClose={() => setPreviewOpen(false)}
      />

      <DiscardConfirmModal
        isOpen={discardOpen}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setDiscardOpen(false)}
      />

      <style jsx global>{`
        .menu-dropdown-item:hover {
          background-color: var(--primary-light, #F4F0FB) !important;
        }
        .color-swatch-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }
        .asset-action-btn:hover {
          border-color: var(--primary, #7956C9) !important;
          color: var(--primary, #7956C9) !important;
        }
        @media (max-width: 1100px) {
          .brand-identity-top-grid,
          .brand-identity-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
