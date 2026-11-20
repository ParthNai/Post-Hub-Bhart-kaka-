"use client";

import { AiSubscreenNav } from "../AiSubscreenNav";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Smartphone,
  Palette,
  LayoutTemplate,
  Sparkles,
  PartyPopper,
  Users,
  CreditCard,
  Home,
  ShieldCheck,
  Activity,
  Settings as SettingsIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { QueuePriorityHeader } from "./QueuePriorityHeader";
import { QueueSummaryMetricsCards } from "./QueueSummaryMetricsCards";
import { QueueMonitorCard } from "./QueueMonitorCard";
import { RequestQueueTable } from "./RequestQueueTable";
import { BottomSchedulingSection } from "./BottomSchedulingSection";
import { QueueRequestDetailsDrawer } from "./QueueRequestDetailsDrawer";
import { ChangePriorityModal } from "./ChangePriorityModal";
import { SchedulingSettingsModal } from "./SchedulingSettingsModal";
import { CancelRequestModal } from "./CancelRequestModal";
import { FullRequestDetailsModal } from "./FullRequestDetailsModal";
import {
  type QueuePriorityDataset,
  type QueuePriorityItem,
  type QueuePriorityLevel,
  type QueueSchedulingSettings,
  type PriorityConfig,
  CANONICAL_QUEUE_PRIORITY_SEED,
} from "@/lib/ai-queue-priority";

export const QueuePriorityView: React.FC = () => {
  const [dataset, setDataset] = useState<QueuePriorityDataset>(CANONICAL_QUEUE_PRIORITY_SEED);
  const [items, setItems] = useState<QueuePriorityItem[]>(CANONICAL_QUEUE_PRIORITY_SEED.items.slice(0, 5));
  const [totalItems, setTotalItems] = useState(CANONICAL_QUEUE_PRIORITY_SEED.items.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(CANONICAL_QUEUE_PRIORITY_SEED.items.length / 5));

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Selection
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>("REQ-4587");
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Modals
  const [changePriorityItem, setChangePriorityItem] = useState<QueuePriorityItem | null>(null);
  const [cancelRequestItem, setCancelRequestItem] = useState<QueuePriorityItem | null>(null);
  const [detailsModalItem, setDetailsModalItem] = useState<QueuePriorityItem | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Loading & Toasts
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch queue dataset on user interaction
  const fetchQueueData = useCallback(
    async (page = currentPage, query = searchQuery, type = selectedType, status = selectedStatus) => {
      try {
        setIsRefreshing(true);
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (type !== "All Types") params.set("type", type);
        if (status !== "All Status") params.set("status", status);
        params.set("page", String(page));
        params.set("pageSize", "5");

        const res = await fetch(`/api/admin/ai-generation/queue-priority?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load queue data");
        const json = await res.json();

        setDataset({
          summary: json.summary,
          monitor: json.monitor,
          priorityConfig: json.priorityConfig,
          schedulingSettings: json.schedulingSettings,
          activityHistory: json.activityHistory,
          items: json.items,
          lastUpdated: json.lastUpdated,
        });
        setItems(json.items);
        setTotalItems(json.pagination?.total || json.items.length);
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching queue data:", err);
      } finally {
        setIsRefreshing(false);
      }
    },
    [currentPage, searchQuery, selectedType, selectedStatus]
  );

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const res = await fetch("/api/admin/ai-generation/queue-priority?page=1&pageSize=5");
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted) return;
        setDataset({
          summary: json.summary,
          monitor: json.monitor,
          priorityConfig: json.priorityConfig,
          schedulingSettings: json.schedulingSettings,
          activityHistory: json.activityHistory,
          items: json.items,
          lastUpdated: json.lastUpdated,
        });
        setItems(json.items);
        setTotalItems(json.pagination?.total || json.items.length);
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Initial queue load error:", err);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle priority change
  const handleConfirmChangePriority = async (
    item: QueuePriorityItem,
    newPriority: QueuePriorityLevel,
    reason: string
  ) => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-priority",
          requestId: item.id,
          newPriority,
          reason,
          adminName: "parth",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update priority");

      showToast(`Priority for ${item.id} successfully changed to ${newPriority}`);
      fetchQueueData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating priority";
      showToast(msg, "error");
      throw err;
    }
  };

  // Handle request cancellation
  const handleConfirmCancelRequest = async (item: QueuePriorityItem, reason: string) => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel-request",
          requestId: item.id,
          reason,
          adminName: "parth",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel request");

      showToast(`Request ${item.id} has been cancelled.`);
      fetchQueueData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error cancelling request";
      showToast(msg, "error");
      throw err;
    }
  };

  // Handle toggle pause
  const handleTogglePause = async (item: QueuePriorityItem) => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-pause",
          requestId: item.id,
          adminName: "parth",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      const actionWord = item.status === "Paused" ? "resumed" : "paused";
      showToast(`Request ${item.id} ${actionWord}.`);
      fetchQueueData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error toggling pause";
      showToast(msg, "error");
    }
  };

  // Handle inline configuration edits
  const handlePriorityConfigChange = async (updated: Partial<PriorityConfig>) => {
    try {
      const newConfig = { ...dataset.priorityConfig, ...updated };
      setDataset((prev) => ({ ...prev, priorityConfig: newConfig }));

      await fetch("/api/admin/ai-generation/queue-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-config",
          config: newConfig,
        }),
      });
      showToast("Priority configuration updated.");
    } catch (err) {
      console.error("Failed to update config:", err);
    }
  };

  const handleSchedulingSettingsChange = async (updated: Partial<QueueSchedulingSettings>) => {
    try {
      const newSettings = { ...dataset.schedulingSettings, ...updated };
      setDataset((prev) => ({ ...prev, schedulingSettings: newSettings }));

      await fetch("/api/admin/ai-generation/queue-priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-settings",
          settings: newSettings,
        }),
      });
      showToast("Scheduling settings updated.");
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  // Save all configuration
  const handleSaveAllConfiguration = async () => {
    try {
      setIsSaving(true);
      await Promise.all([
        fetch("/api/admin/ai-generation/queue-priority", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-settings",
            settings: dataset.schedulingSettings,
          }),
        }),
        fetch("/api/admin/ai-generation/queue-priority", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-config",
            config: dataset.priorityConfig,
          }),
        }),
      ]);
      showToast("All Queue & Priority configurations saved successfully!");
      fetchQueueData();
    } catch (err) {
      console.error("Error saving configuration:", err);
      showToast("Failed to save configuration", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedItem =
    items.find((it) => it.id === selectedRequestId) ||
    dataset.items.find((it) => it.id === selectedRequestId) ||
    dataset.items[0] ||
    null;

  return (
    <div
      style={{
        padding: "24px 32px 60px",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#FAF7F2",
      }}>
      {/* Toast Banner */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toastMessage.type === "success" ? "#16A34A" : "#DC2626",
            color: "#FFFFFF",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 600,
            zIndex: 9999,
          }}
        >
          {toastMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      
          {/* Header */}
          <QueuePriorityHeader
            onRefresh={() => fetchQueueData()}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onSaveConfig={handleSaveAllConfiguration}
            isRefreshing={isRefreshing}
            isSaving={isSaving}
          />

          {/* Sub-screens Navigation Ribbon */}
          <AiSubscreenNav />

          {/* KPI Metrics Cards */}
          <QueueSummaryMetricsCards metrics={dataset.summary} />

          {/* Queue Monitor Strip */}
          <QueueMonitorCard monitor={dataset.monitor} />

          {/* Main Workspace: Table on left + Details Drawer on right */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "24px" }}>
            {/* Table */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <RequestQueueTable
                items={items}
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                selectedRequestId={selectedRequestId}
                onSelectRequest={(item) => {
                  setSelectedRequestId(item.id);
                  setDrawerOpen(true);
                }}
                onPageChange={(pg) => {
                  setCurrentPage(pg);
                  fetchQueueData(pg);
                }}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  fetchQueueData(1, q, selectedType, selectedStatus);
                }}
                selectedType={selectedType}
                onTypeChange={(t) => {
                  setSelectedType(t);
                  fetchQueueData(1, searchQuery, t, selectedStatus);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(s) => {
                  setSelectedStatus(s);
                  fetchQueueData(1, searchQuery, selectedType, s);
                }}
                onChangePriorityClick={(item) => setChangePriorityItem(item)}
                onViewDetailsClick={(item) => setDetailsModalItem(item)}
                onTogglePauseClick={(item) => handleTogglePause(item)}
                onCancelRequestClick={(item) => setCancelRequestItem(item)}
              />
            </div>

            {/* Right Drawer */}
            {drawerOpen && selectedItem && (
              <QueueRequestDetailsDrawer
                item={selectedItem}
                onClose={() => setDrawerOpen(false)}
                onChangePriority={(item) => setChangePriorityItem(item)}
                onViewDetails={(item) => setDetailsModalItem(item)}
                onCancelRequest={(item) => setCancelRequestItem(item)}
              />
            )}
          </div>

          {/* Bottom 3-Column Section */}
          <BottomSchedulingSection
            priorityConfig={dataset.priorityConfig}
            onPriorityConfigChange={handlePriorityConfigChange}
            schedulingSettings={dataset.schedulingSettings}
            onSchedulingSettingsChange={handleSchedulingSettingsChange}
            activityHistory={dataset.activityHistory}
          />
        

      {/* Modals */}
      <ChangePriorityModal
        isOpen={Boolean(changePriorityItem)}
        item={changePriorityItem}
        onClose={() => setChangePriorityItem(null)}
        onConfirm={handleConfirmChangePriority}
      />

      <CancelRequestModal
        isOpen={Boolean(cancelRequestItem)}
        item={cancelRequestItem}
        onClose={() => setCancelRequestItem(null)}
        onConfirm={handleConfirmCancelRequest}
      />

      <FullRequestDetailsModal
        isOpen={Boolean(detailsModalItem)}
        item={detailsModalItem}
        onClose={() => setDetailsModalItem(null)}
        onChangePriority={(item) => setChangePriorityItem(item)}
        onCancelRequest={(item) => setCancelRequestItem(item)}
      />

      <SchedulingSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={dataset.schedulingSettings}
        config={dataset.priorityConfig}
        onSave={async (newSettings, newConfig) => {
          await handleSchedulingSettingsChange(newSettings);
          await handlePriorityConfigChange(newConfig);
          showToast("Settings applied!");
        }}
      />
    </div>
  );
};
