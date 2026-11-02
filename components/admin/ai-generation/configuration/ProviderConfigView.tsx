"use client";

import React, { useState, useMemo } from "react";
import type {
  AiProviderFullConfig,
  AiModelSpec,
  AiConfigHistoryItem,
} from "@/lib/ai-generation";
import { ConfigurationHeader } from "./ConfigurationHeader";
import { ProviderConfigCard } from "./ProviderConfigCard";
import { ModelSelectionCard } from "./ModelSelectionCard";
import { ImageParametersCard } from "./ImageParametersCard";
import { UsageControlsCard } from "./UsageControlsCard";
import { ConnectionTestCard } from "./ConnectionTestCard";
import { ConfigSummaryCard } from "./ConfigSummaryCard";
import { ConfigFooterBar } from "./ConfigFooterBar";
import { ConfigHistoryModal } from "./ConfigHistoryModal";
import { DisableConfirmModal } from "./DisableConfirmModal";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ProviderConfigViewProps {
  initialConfig: AiProviderFullConfig;
  models: AiModelSpec[];
  initialHistory: AiConfigHistoryItem[];
  adminName?: string;
  adminRole?: string;
}

export const ProviderConfigView: React.FC<ProviderConfigViewProps> = ({
  initialConfig,
  models,
  initialHistory,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}) => {
  const [config, setConfig] = useState<AiProviderFullConfig>(initialConfig);
  const [savedBaseline, setSavedBaseline] = useState<AiProviderFullConfig>(initialConfig);
  const [rawApiKey, setRawApiKey] = useState("");
  const [history, setHistory] = useState<AiConfigHistoryItem[]>(initialHistory);

  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const hasUnsavedChanges = useMemo(() => {
    if (rawApiKey.trim().length > 0) return true;
    return (
      config.providerId !== savedBaseline.providerId ||
      config.providerName !== savedBaseline.providerName ||
      config.apiEndpoint !== savedBaseline.apiEndpoint ||
      config.enabled !== savedBaseline.enabled ||
      config.selectedModel !== savedBaseline.selectedModel ||
      config.defaultAspectRatio !== savedBaseline.defaultAspectRatio ||
      config.defaultOutputFormat !== savedBaseline.defaultOutputFormat ||
      config.defaultDimensions !== savedBaseline.defaultDimensions ||
      config.imageQuality !== savedBaseline.imageQuality ||
      config.generationCountLimit !== savedBaseline.generationCountLimit ||
      config.promptInputLimit !== savedBaseline.promptInputLimit ||
      config.perUserRequestLimit !== savedBaseline.perUserRequestLimit ||
      config.globalRequestLimit !== savedBaseline.globalRequestLimit ||
      config.concurrentGenerationLimit !== savedBaseline.concurrentGenerationLimit ||
      config.rateLimit !== savedBaseline.rateLimit ||
      config.rateLimitUnit !== savedBaseline.rateLimitUnit ||
      config.maxRetryAttempts !== savedBaseline.maxRetryAttempts
    );
  }, [config, savedBaseline, rawApiKey]);

  const handleFieldChange = (fields: Partial<AiProviderFullConfig>) => {
    setConfig((prev) => ({ ...prev, ...fields }));
  };

  // Save Configuration
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-generation/configuration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          updates: config,
          rawApiKey: rawApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save configuration.");
      }

      setConfig(data.config);
      setSavedBaseline(data.config);
      setRawApiKey("");
      if (data.history) setHistory(data.history);

      showToast("Configuration saved successfully.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed.";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Discard Changes
  const handleDiscard = () => {
    setConfig(savedBaseline);
    setRawApiKey("");
    showToast("Unsaved changes discarded.", "info");
  };

  // Toggle Enable / Disable
  const handleToggleEnable = async () => {
    if (config.enabled) {
      setIsDisableModalOpen(true);
    } else {
      // Re-enable provider
      setIsSaving(true);
      try {
        const res = await fetch("/api/admin/ai-generation/configuration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggle-enable", enabled: true }),
        });
        const data = await res.json();
        if (data.success) {
          setConfig(data.config);
          setSavedBaseline(data.config);
          showToast(`${config.providerName} provider enabled.`, "success");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error enabling provider.";
        showToast(message, "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const confirmDisable = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-generation/configuration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-enable", enabled: false }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSavedBaseline(data.config);
        showToast(`${config.providerName} provider disabled.`, "info");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error disabling provider.";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Connection Test
  const handleTestConnection = async () => {
    const res = await fetch("/api/admin/ai-generation/configuration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test",
        providerId: config.providerId,
        endpoint: config.apiEndpoint,
        apiKey: rawApiKey.trim() || undefined,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setConfig((prev) => ({
        ...prev,
        credentialsVerified: true,
        lastVerifiedAt: data.verifiedAt,
      }));
    }
    return data;
  };

  // Restore Configuration from Revision History
  const handleRestoreHistory = async (historyId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-generation/configuration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", historyId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to restore version.");
      }

      setConfig(data.config);
      setSavedBaseline(data.config);
      setRawApiKey("");
      setIsHistoryOpen(false);
      showToast("Configuration restored from selected revision.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Restore failed.";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        padding: "24px 32px 48px 32px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "10px",
            backgroundColor:
              toast.type === "success"
                ? "#137333"
                : toast.type === "error"
                ? "#C5221F"
                : "#24213A",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <Info size={16} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Screen 19 Top Header */}
      <ConfigurationHeader
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        adminName={adminName}
        adminRole={adminRole}
      />

      {/* 2-Column Grid matching reference layout exactly */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {/* Card 1: Provider Configuration (Top Left) */}
        <ProviderConfigCard
          config={config}
          onChange={handleFieldChange}
          rawApiKey={rawApiKey}
          onApiKeyChange={setRawApiKey}
        />

        {/* Card 2: Model Selection (Top Right) */}
        <ModelSelectionCard
          config={config}
          onChange={handleFieldChange}
          availableModels={models}
        />

        {/* Card 3: Image Generation Parameters (Middle Left) */}
        <ImageParametersCard
          config={config}
          onChange={handleFieldChange}
        />

        {/* Card 4: Generation Limits & Usage Controls (Middle Right) */}
        <UsageControlsCard
          config={config}
          onChange={handleFieldChange}
        />

        {/* Card 5: Provider Connection Test (Bottom Left) */}
        <ConnectionTestCard
          config={config}
          onTest={handleTestConnection}
        />

        {/* Card 6: Configuration Summary (Bottom Right) */}
        <ConfigSummaryCard config={config} />
      </div>

      {/* Footer Info Banner & Action Buttons Bar */}
      <div style={{ marginTop: "20px" }}>
        <ConfigFooterBar
          onDiscard={handleDiscard}
          onToggleEnable={handleToggleEnable}
          onSave={handleSave}
          isSaving={isSaving}
          isEnabled={config.enabled}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      {/* Configuration History Modal */}
      <ConfigHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreHistory}
        isRestoring={isSaving}
      />

      {/* Disable Confirmation Modal */}
      <DisableConfirmModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        onConfirm={confirmDisable}
        providerName={config.providerName}
      />
    </div>
  );
};

