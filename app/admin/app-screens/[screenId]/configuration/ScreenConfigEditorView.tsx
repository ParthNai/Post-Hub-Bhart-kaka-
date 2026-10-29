"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  LayoutGrid,
  CheckSquare,
  Palette,
  Compass,
  Cpu,
  Eye,
  MoreVertical,
  Clock,

  Code2,
  Send,
  Check,
} from "lucide-react";
import { TopHeader } from "@/components/admin/TopHeader";
import { AppScreen } from "@/lib/screens";
import { ScreenConfigHeader } from "@/components/admin/configuration/ScreenConfigHeader";
import { GeneralSection, GeneralFormData } from "@/components/admin/configuration/GeneralSection";
import {
  LayoutSection,
  SectionsSection,
  AppearanceSection,
  NavigationSection,
  AdvancedSection,
} from "@/components/admin/configuration/OtherSections";
import { LiveScreenPreview } from "@/components/admin/configuration/LiveScreenPreview";
import { ConfigurationSummaryCard } from "@/components/admin/configuration/ConfigurationSummaryCard";
import { VersionHistoryModal } from "@/components/admin/configuration/VersionHistoryModal";
import { PublishNoticeModal } from "@/components/admin/configuration/PublishNoticeModal";
import { EditScreenModal } from "@/components/admin/screens/EditScreenModal";
import { ConfirmModal } from "@/components/admin/screens/ConfirmModal";
import { JsonConfigModal } from "@/components/admin/screens/JsonConfigModal";

interface ScreenConfigEditorViewProps {
  initialScreen: AppScreen;
  adminName?: string;
  adminEmail?: string;
  onMenuToggle?: () => void;
}

type EditorTab = "general" | "layout" | "sections" | "appearance" | "navigation" | "advanced";

export const ScreenConfigEditorView: React.FC<ScreenConfigEditorViewProps> = ({
  initialScreen,
  adminName = "Admin Workspace",
  adminEmail = "admin@posthub.io",
  onMenuToggle,
}) => {
  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [activeTab, setActiveTab] = useState<EditorTab>("general");

  // Baseline state (for discard & dirty tracking)
  const [baselineGeneral, setBaselineGeneral] = useState<GeneralFormData>({
    name: initialScreen.name,
    description: initialScreen.description,
    category: initialScreen.category,
    route: initialScreen.route,
    visibilityEnabled: initialScreen.visibilityEnabled ?? true,
    minAppVersion: initialScreen.minAppVersion || "1.0.0",
  });

  const [baselineConfig, setBaselineConfig] = useState<AppScreen["configData"]>({
    ...initialScreen.configData,
  });

  // Current working form state
  const [generalData, setGeneralData] = useState<GeneralFormData>({ ...baselineGeneral });
  const [configData, setConfigData] = useState<AppScreen["configData"]>({ ...baselineConfig });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>(initialScreen.lastSavedAt || "Not saved yet");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GeneralFormData, string>>>({});

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Field modification calculation
  const modifiedFieldsCount = useMemo(() => {
    let count = 0;
    if (generalData.name !== baselineGeneral.name) count++;
    if (generalData.description !== baselineGeneral.description) count++;
    if (generalData.category !== baselineGeneral.category) count++;
    if (generalData.route !== baselineGeneral.route) count++;
    if (generalData.visibilityEnabled !== baselineGeneral.visibilityEnabled) count++;
    if (generalData.minAppVersion !== baselineGeneral.minAppVersion) count++;

    if (configData.defaultLayout !== baselineConfig.defaultLayout) count++;
    if (configData.itemsPerPage !== baselineConfig.itemsPerPage) count++;
    if (configData.gridColumns !== baselineConfig.gridColumns) count++;
    if (configData.bannerVisible !== baselineConfig.bannerVisible) count++;
    if (configData.activeTheme !== baselineConfig.activeTheme) count++;
    if (configData.primaryAccent !== baselineConfig.primaryAccent) count++;
    if (configData.cardRadius !== baselineConfig.cardRadius) count++;
    if (configData.showInBottomNav !== baselineConfig.showInBottomNav) count++;
    if (configData.deepLinkRoute !== baselineConfig.deepLinkRoute) count++;
    if (configData.cacheTtlSeconds !== baselineConfig.cacheTtlSeconds) count++;

    return count;
  }, [generalData, baselineGeneral, configData, baselineConfig]);

  const hasUnsavedChanges = modifiedFieldsCount > 0;

  // Validation
  const isValid = useMemo(() => {
    return Boolean(
      generalData.name.trim() &&
        generalData.description.trim() &&
        generalData.route.trim().startsWith("/") &&
        /^\d+(\.\d+)*$/.test(generalData.minAppVersion.trim())
    );
  }, [generalData]);

  // Save Draft operation (shared by top and bottom Save Draft buttons)
  const handleSaveDraft = async () => {
    // Validate
    const errors: Partial<Record<keyof GeneralFormData, string>> = {};
    if (!generalData.name.trim()) errors.name = "Screen name is required.";
    if (!generalData.description.trim()) errors.description = "Screen description is required.";
    if (!generalData.route.trim().startsWith("/")) errors.route = "Route must begin with / (e.g. /home).";
    if (!/^\d+(\.\d+)*$/.test(generalData.minAppVersion.trim())) {
      errors.minAppVersion = "Version must be in format 1.0.0.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/screens/${screen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          isDraft: true,
          name: generalData.name,
          description: generalData.description,
          category: generalData.category,
          route: generalData.route,
          visibilityEnabled: generalData.visibilityEnabled,
          minAppVersion: generalData.minAppVersion,
          configData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.screen) {
        setScreen(data.screen);
        setBaselineGeneral({ ...generalData });
        setBaselineConfig({ ...configData });
        const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        setLastSavedTime(`Today at ${timeStr}`);
        setToastMessage("✓ Draft configuration saved successfully.");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage(`Error: ${data.error || "Failed to save draft."}`);
      }
    } catch {
      setToastMessage("Network error while saving draft.");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish operation (commits draft into production and notifies app clients)
  const handlePublish = async () => {
    const errors: Partial<Record<keyof GeneralFormData, string>> = {};
    if (!generalData.name.trim()) errors.name = "Screen name is required.";
    if (!generalData.description.trim()) errors.description = "Screen description is required.";
    if (!generalData.route.trim().startsWith("/")) errors.route = "Route must begin with / (e.g. /home).";
    if (!/^\d+(\.\d+)*$/.test(generalData.minAppVersion.trim())) {
      errors.minAppVersion = "Version must be in format 1.0.0.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsPublishing(true);
    try {
      const res = await fetch(`/api/admin/screens/${screen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          name: generalData.name,
          description: generalData.description,
          category: generalData.category,
          route: generalData.route,
          visibilityEnabled: generalData.visibilityEnabled,
          minAppVersion: generalData.minAppVersion,
          configData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.screen) {
        setScreen(data.screen);
        setBaselineGeneral({ ...generalData });
        setBaselineConfig({ ...configData });
        const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        setLastSavedTime(`Published today at ${timeStr}`);
        setShowPublishModal(false);
        setToastMessage(`✓ "${data.screen.name}" published successfully to mobile app (v${data.screen.version}.0)!`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setToastMessage(`Error: ${data.error || "Failed to publish screen."}`);
      }
    } catch {
      setToastMessage("Network error while publishing screen.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard changes
  const handleDiscardConfirm = () => {
    setGeneralData({ ...baselineGeneral });
    setConfigData({ ...baselineConfig });
    setFieldErrors({});
    setShowDiscardConfirm(false);
    setToastMessage("Changes discarded. Restored last saved baseline.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Warn on beforeunload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Toast notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "36px",
            backgroundColor: toastMessage.startsWith("Error") ? "var(--error)" : "var(--primary)",
            color: "#FFFFFF",
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(36, 33, 58, 0.2)",
            zIndex: 100,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <TopHeader
        title="Screen Configuration"
        subtitle="Review and customize supported settings for this app screen."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "App Screens", href: "/admin/app-screens" },
          { label: screen.name, href: `/admin/app-screens/${screen.key}/configuration` },
          { label: "Configuration" },
        ]}
        onMenuToggle={onMenuToggle}
        adminName={adminName}
        adminEmail={adminEmail}
      />

      {/* Main Workspace Body */}
      <main
        style={{
          flex: 1,
          padding: "4px 36px 40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
        className="screen-config-content"
      >
        {/* Title & Action Controls Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            padding: "2px 0",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                margin: "0 0 4px 0",
              }}
            >
              Screen Configuration
            </h1>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0 }}>
              Review and customize supported settings for this app screen.
            </p>
          </div>

          {/* Top-Right Action Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Status pill: Unsaved Draft vs Draft vs Published */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                backgroundColor: hasUnsavedChanges
                  ? "#FEF6EE"
                  : screen.hasUnpublishedChanges
                  ? "var(--primary-light)"
                  : "#EDF7F2",
                color: hasUnsavedChanges
                  ? "#D97706"
                  : screen.hasUnpublishedChanges
                  ? "var(--primary)"
                  : "#12805C",
                fontSize: "12.5px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: hasUnsavedChanges
                    ? "#D97706"
                    : screen.hasUnpublishedChanges
                    ? "var(--primary)"
                    : "#12805C",
                }}
              />
              <span>
                {hasUnsavedChanges
                  ? "Unsaved Draft"
                  : screen.hasUnpublishedChanges
                  ? "Draft"
                  : `Published v${screen.version}.0`}
              </span>
            </span>

            {/* Preview Button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("screen-preview-container");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text)",
                cursor: "pointer",
              }}
              className="top-action-btn"
            >
              <Eye size={15} />
              <span>Preview</span>
            </button>

            {/* Top Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSaving ? "wait" : "pointer",
              }}
              className="save-draft-btn"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            {/* Top Publish Button */}
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              disabled={isPublishing}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: !screen.hasUnpublishedChanges && !hasUnsavedChanges ? "#12805C" : "var(--primary)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isPublishing ? "wait" : "pointer",
                boxShadow: !screen.hasUnpublishedChanges && !hasUnsavedChanges
                  ? "0 2px 8px rgba(18, 128, 92, 0.2)"
                  : "0 2px 8px rgba(121, 86, 201, 0.2)",
              }}
              className="top-publish-btn"
            >
              {!screen.hasUnpublishedChanges && !hasUnsavedChanges ? (
                <>
                  <Check size={14} />
                  <span>Published</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>{isPublishing ? "Publishing..." : "Publish"}</span>
                </>
              )}
            </button>

            {/* Overflow Options Button */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                aria-label="More screen configuration options"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                <MoreVertical size={16} />
              </button>

              {showMoreMenu && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "42px",
                    width: "200px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 24px rgba(36, 33, 58, 0.12)",
                    padding: "6px",
                    zIndex: 40,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowJsonModal(true);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    className="dropdown-menu-item"
                  >
                    <Code2 size={14} />
                    <span>View Raw Schema</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowHistoryModal(true);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    className="dropdown-menu-item"
                  >
                    <Clock size={14} />
                    <span>Version History</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1. Screen Identity Header Banner */}
        <section aria-label="Screen identity and metadata">
          <ScreenConfigHeader
            screen={{
              ...screen,
              name: generalData.name,
              category: generalData.category,
              route: generalData.route,
            }}
            onEditDetails={() => setShowEditModal(true)}
          />
        </section>

        {/* 2. Main Two-Column Work Area */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.65fr 1fr",
            gap: "20px",
          }}
          className="editor-grid-container"
          aria-label="Configuration editor sections and preview"
        >
          {/* Left Column: Editor Sections Sub-Sidebar & Form */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
              display: "flex",
              overflow: "hidden",
            }}
            className="editor-sections-card"
          >
            {/* Sub-Sidebar Navigation */}
            <div
              style={{
                width: "180px",
                borderRight: "1px solid var(--border)",
                backgroundColor: "#FAF9FC",
                padding: "16px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                flexShrink: 0,
                position: "sticky",
                top: "80px",
                alignSelf: "flex-start",
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
              }}
            >
              {[
                { id: "general", label: "General", icon: SlidersHorizontal },
                { id: "layout", label: "Layout", icon: LayoutGrid },
                { id: "sections", label: "Sections", icon: CheckSquare },
                { id: "appearance", label: "Appearance", icon: Palette },
                { id: "navigation", label: "Navigation", icon: Compass },
                { id: "advanced", label: "Advanced", icon: Cpu },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as EditorTab)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: isActive ? "var(--secondary)" : "transparent",
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    className={`sub-nav-item ${isActive ? "active" : ""}`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.9} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Content Form Pane */}
            <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
              {activeTab === "general" && (
                <GeneralSection
                  data={generalData}
                  onChange={(patch) => setGeneralData((prev) => ({ ...prev, ...patch }))}
                  errors={fieldErrors}
                />
              )}

              {activeTab === "layout" && (
                <LayoutSection
                  config={configData}
                  onChange={(patch) => setConfigData((prev) => ({ ...prev, ...patch }))}
                />
              )}

              {activeTab === "sections" && (
                <SectionsSection
                  config={configData}
                  onChange={(patch) => setConfigData((prev) => ({ ...prev, ...patch }))}
                />
              )}

              {activeTab === "appearance" && (
                <AppearanceSection
                  config={configData}
                  onChange={(patch) => setConfigData((prev) => ({ ...prev, ...patch }))}
                />
              )}

              {activeTab === "navigation" && (
                <NavigationSection
                  config={configData}
                  onChange={(patch) => setConfigData((prev) => ({ ...prev, ...patch }))}
                />
              )}

              {activeTab === "advanced" && (
                <AdvancedSection
                  config={configData}
                  onChange={(patch) => setConfigData((prev) => ({ ...prev, ...patch }))}
                />
              )}
            </div>
          </div>

          {/* Right Column: Screen Preview & Configuration Summary */}
          <div
            id="screen-preview-container"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Live Screen Preview */}
            <LiveScreenPreview
              generalData={generalData}
              configData={configData}
            />

            {/* Configuration Summary Card */}
            <ConfigurationSummaryCard
              modifiedCount={modifiedFieldsCount}
              isValid={isValid}
              lastSavedAt={lastSavedTime}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>
        </section>

        {/* 3. Bottom Action Footer Bar */}
        <section
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "14px",
            border: "1px solid var(--border)",
            padding: "16px 24px",
            boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
          aria-label="Screen configuration bottom actions and version bar"
        >
          {/* Left: Version History bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={16} />
              </div>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text)" }}>
                  Version History
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  Track changes and view previous versions of this screen configuration.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  backgroundColor: screen.hasUnpublishedChanges ? "var(--primary-light)" : "#EDF7F2",
                  color: screen.hasUnpublishedChanges ? "var(--primary)" : "#12805C",
                  fontSize: "11.5px",
                  fontWeight: 600,
                }}
              >
                {screen.hasUnpublishedChanges ? "Current draft" : `Published v${screen.version}.0`}
              </span>

              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  backgroundColor: "#FAF9FC",
                  border: "1px solid var(--border)",
                  color: "var(--text-light)",
                  fontSize: "11.5px",
                }}
              >
                Previous version {screen.history && screen.history.length > 1 ? `v${screen.history[1].version}.0` : "Not available"}
              </span>

              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                View history ↗
              </button>
            </div>
          </div>

          {/* Right: Discard Changes, Save Draft, Publish buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Discard Changes Button */}
            <button
              type="button"
              onClick={() => {
                if (hasUnsavedChanges) {
                  setShowDiscardConfirm(true);
                }
              }}
              disabled={!hasUnsavedChanges}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                fontSize: "13px",
                fontWeight: 500,
                color: hasUnsavedChanges ? "var(--text)" : "var(--text-light)",
                cursor: hasUnsavedChanges ? "pointer" : "not-allowed",
                opacity: hasUnsavedChanges ? 1 : 0.6,
              }}
              className="discard-btn"
            >
              Discard Changes
            </button>

            {/* Bottom Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSaving ? "wait" : "pointer",
              }}
              className="save-draft-btn"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              disabled={isPublishing}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: !screen.hasUnpublishedChanges && !hasUnsavedChanges ? "#12805C" : "var(--primary)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isPublishing ? "wait" : "pointer",
                boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              }}
              title="Publish configuration changes directly to mobile app clients"
            >
              {!screen.hasUnpublishedChanges && !hasUnsavedChanges ? (
                <>
                  <Check size={14} />
                  <span>Published (v{screen.version}.0)</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>{isPublishing ? "Publishing..." : "Publish to App"}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Modals */}
      <VersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={screen.history}
        currentVersion={screen.version}
      />

      <PublishNoticeModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        screenName={generalData.name}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />

      <JsonConfigModal
        screen={screen}
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
      />

      <EditScreenModal
        screen={screen}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdated={(updated) => {
          setScreen(updated);
          setGeneralData({
            name: updated.name,
            description: updated.description,
            category: updated.category,
            route: updated.route,
            visibilityEnabled: updated.visibilityEnabled ?? true,
            minAppVersion: updated.minAppVersion || "1.0.0",
          });
        }}
      />

      <ConfirmModal
        isOpen={showDiscardConfirm}
        title="Discard Unsaved Changes"
        message="Are you sure you want to discard your changes? All unsaved modifications will be reverted to the last saved draft."
        confirmLabel="Discard Changes"
        isDestructive
        onConfirm={handleDiscardConfirm}
        onCancel={() => setShowDiscardConfirm(false)}
      />

      <style jsx global>{`
        .top-action-btn:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
        }
        .save-draft-btn:hover:not(:disabled) {
          background-color: var(--primary-hover) !important;
        }
        .sub-nav-item:hover:not(.active) {
          background-color: var(--primary-light) !important;
          color: var(--text) !important;
        }
        .discard-btn:hover:not(:disabled) {
          background-color: #FAF9FC !important;
          border-color: var(--text-light) !important;
        }
        @media (max-width: 1200px) {
          .editor-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .editor-sections-card {
            flex-direction: column !important;
          }
          .editor-sections-card > div:first-child {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
            flex-direction: row !important;
            overflow-x: auto !important;
          }
          .screen-config-content {
            padding: 4px 18px 32px 18px !important;
          }
        }
      `}</style>
    </div>
  );
};
