"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SettingsHeader } from "./SettingsHeader";
import { InternalSectionNav, type SettingsSectionKey } from "./InternalSectionNav";
import { GeneralConfigCard } from "./GeneralConfigCard";
import { TokenNamingCard } from "./TokenNamingCard";
import { ValidationRulesCard } from "./ValidationRulesCard";
import { SchemaCompatibilityCard } from "./SchemaCompatibilityCard";
import { ChangeProtectionCard } from "./ChangeProtectionCard";
import { SettingsFooter } from "./SettingsFooter";
import { ResetConfirmModal } from "./ResetConfirmModal";
import { CancelConfirmModal } from "./CancelConfirmModal";
import {
  type GovernanceSettingsConfig,
  DEFAULT_GOVERNANCE_SETTINGS,
} from "@/lib/governance-settings";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface GovernanceSettingsViewProps {
  initialSettings: GovernanceSettingsConfig;
}

export const GovernanceSettingsView: React.FC<GovernanceSettingsViewProps> = ({
  initialSettings,
}) => {
  const [settings, setSettings] = useState<GovernanceSettingsConfig>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<GovernanceSettingsConfig>(initialSettings);
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>("general");

  const [isSaving, setIsSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dirty state check
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  // Handle section navigation click with smooth scrolling
  const handleSelectSection = (section: SettingsSectionKey) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/design-system/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save governance settings.");
      }

      setSavedSettings(data.settings);
      setSettings(data.settings);
      setToast({
        type: "success",
        message: "Design System governance settings saved successfully as draft.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setToast({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleConfirmReset = () => {
    setSettings(JSON.parse(JSON.stringify(DEFAULT_GOVERNANCE_SETTINGS)));
    setResetModalOpen(false);
    setToast({
      type: "success",
      message: "Governance settings reset to canonical defaults in draft session.",
    });
  };

  // Cancel unsaved edits
  const handleConfirmCancel = () => {
    setSettings(JSON.parse(JSON.stringify(savedSettings)));
    setCancelModalOpen(false);
    setToast({
      type: "success",
      message: "Unsaved governance changes discarded.",
    });
  };

  return (
    <div style={{ maxWidth: "1380px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "24px",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor: toast.type === "success" ? "#EBF8F2" : "#FCE8E6",
            color: toast.type === "success" ? "#1E8E5A" : "#D93025",
            border: `1px solid ${toast.type === "success" ? "#A3E6C8" : "#F8B4AF"}`,
            boxShadow: "0 8px 24px rgba(36, 33, 58, 0.12)",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <SettingsHeader
        onReset={() => setResetModalOpen(true)}
        onSave={handleSaveDraft}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      {/* Main 3-Column Content Layout matching Reference Image */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Internal Navigation */}
        <div>
          <InternalSectionNav
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />
        </div>

        {/* Center Column: General Configuration & Validation Rules */}
        <div>
          <GeneralConfigCard
            general={settings.general}
            onChange={(updated) =>
              setSettings((prev) => ({
                ...prev,
                general: { ...prev.general, ...updated },
              }))
            }
          />

          <ValidationRulesCard
            rules={settings.validationRules}
            onChange={(updated) =>
              setSettings((prev) => ({
                ...prev,
                validationRules: { ...prev.validationRules, ...updated },
              }))
            }
          />
        </div>

        {/* Right Column: Token Naming, Schema & Compatibility, Change Protection */}
        <div>
          <TokenNamingCard
            naming={settings.naming}
            onChange={(updated) =>
              setSettings((prev) => ({
                ...prev,
                naming: { ...prev.naming, ...updated },
              }))
            }
          />

          <SchemaCompatibilityCard schema={settings.schemaCompatibility} />

          <ChangeProtectionCard
            protection={settings.changeProtection}
            onChange={(updated) =>
              setSettings((prev) => ({
                ...prev,
                changeProtection: { ...prev.changeProtection, ...updated },
              }))
            }
          />
        </div>
      </div>

      {/* Footer */}
      <SettingsFooter
        onCancel={() => {
          if (isDirty) setCancelModalOpen(true);
        }}
        onReset={() => setResetModalOpen(true)}
        onSave={handleSaveDraft}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      {/* Confirmation Modals */}
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <CancelConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

