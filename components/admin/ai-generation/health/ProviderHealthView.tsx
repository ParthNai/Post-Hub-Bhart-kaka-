"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ProviderHealthDataset,
  CANONICAL_PROVIDER_HEALTH_SEED,
  MonitoringSettings,
} from "@/lib/ai-provider-health";
import { ProviderHealthHeader } from "./ProviderHealthHeader";
import { AiSubscreenNav } from "../AiSubscreenNav";
import { ProviderHealthSummaryCards } from "./ProviderHealthSummaryCards";
import { ProviderStatusOverview } from "./ProviderStatusOverview";
import { ModelPerformanceTable } from "./ModelPerformanceTable";
import { PerformanceAnalyticsCards } from "./PerformanceAnalyticsCards";
import { ProviderDetailsDrawer } from "./ProviderDetailsDrawer";
import { RunHealthCheckModal } from "./RunHealthCheckModal";
import { MonitoringSettingsModal } from "./MonitoringSettingsModal";

export const ProviderHealthView: React.FC = () => {
  const [data, setData] = useState<ProviderHealthDataset>(CANONICAL_PROVIDER_HEALTH_SEED);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("openai");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Filters for models table
  const [modelSearch, setModelSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All Providers");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Modals
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/ai-generation/health");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load provider health data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/ai-generation/health")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json) setData(json);
      })
      .catch((err) => console.error("Initial health fetch error:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Execute health check handler
  const handleExecuteHealthCheck = async (targetId: string) => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/admin/ai-generation/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", providerId: targetId }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData(result.data);
        showToast("Health checks finished and recorded.");
        return result;
      } else {
        throw new Error(result.error || result.message || "Execution error");
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Update settings handler
  const handleUpdateSettings = async (updates: Partial<MonitoringSettings>) => {
    try {
      const res = await fetch("/api/admin/ai-generation/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-settings", settings: updates }),
      });
      if (res.ok) {
        const result = await res.json();
        setData((prev) => ({
          ...prev,
          settings: result.settings,
        }));
        showToast("Monitoring settings saved successfully.");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Filter models locally for real-time responsiveness
  const filteredModels = data.models.filter((m) => {
    if (modelSearch.trim()) {
      const q = modelSearch.toLowerCase().trim();
      const matchName = m.name.toLowerCase().includes(q);
      const matchProvider = m.provider.toLowerCase().includes(q);
      if (!matchName && !matchProvider) return false;
    }
    if (providerFilter !== "All Providers") {
      const pf = providerFilter.toLowerCase();
      if (m.provider.toLowerCase() !== pf && m.providerId.toLowerCase() !== pf) {
        return false;
      }
    }
    if (statusFilter !== "All Status") {
      if (m.status !== statusFilter) return false;
    }
    return true;
  });

  const selectedProvider =
    data.providers.find((p) => p.id === selectedProviderId) || data.providers[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#24213A] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#10A37F]" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <ProviderHealthHeader
        onRunHealthCheck={() => setIsRunModalOpen(true)}
        onRefresh={fetchData}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isRefreshing={isRefreshing}
        isChecking={isChecking}
        adminName="Parth Admin"
      />

      {/* Sub-screens Navigation Ribbon */}
      <AiSubscreenNav />

      {/* 4 Summary Cards */}
      <ProviderHealthSummaryCards metrics={data.summary} />

      {/* Main Grid: Left side has Overview, Model table, Charts; Right side has Drawer */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* Provider Status Overview */}
          <ProviderStatusOverview
            providers={data.providers}
            selectedProviderId={selectedProviderId}
            onSelectProvider={(id) => {
              setSelectedProviderId(id);
              setIsDrawerOpen(true);
            }}
          />

          {/* Model Performance Table */}
          <ModelPerformanceTable
            models={filteredModels}
            search={modelSearch}
            onSearchChange={setModelSearch}
            providerFilter={providerFilter}
            onProviderFilterChange={setProviderFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onViewModel={(m) => {
              const matchedProvider = data.providers.find(
                (p) =>
                  p.id.toLowerCase() === m.providerId.toLowerCase() ||
                  p.name.toLowerCase() === m.provider.toLowerCase()
              );
              if (matchedProvider) {
                setSelectedProviderId(matchedProvider.id);
                setIsDrawerOpen(true);
              }
            }}
          />

          {/* Performance Analytics: Response Time Trend & Request Success/Failure */}
          <PerformanceAnalyticsCards
            trendData={data.responseTimeTrend}
            successFailureData={data.requestSuccessFailure}
          />
        </div>

        {/* Right Column: Docked Provider Details Drawer (matching screenshot) */}
        {isDrawerOpen && (
          <ProviderDetailsDrawer
            provider={selectedProvider}
            models={data.models}
            history={data.monitoringHistory}
            settings={data.settings}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </div>

      {/* Modals */}
      <RunHealthCheckModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        providers={data.providers}
        onExecute={handleExecuteHealthCheck}
      />

      <MonitoringSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={data.settings}
        onSave={handleUpdateSettings}
      />
    </div>
  );
};
