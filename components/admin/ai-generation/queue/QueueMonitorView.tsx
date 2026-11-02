"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import type {
  AiQueueItem,
  AiQueueMetrics,
  AiQueueOverview,
  AiQueueSettings,
} from "@/lib/ai-queue";
import { QueueHeader } from "./QueueHeader";
import { QueueKpiCards } from "./QueueKpiCards";
import { ProcessingOverviewStrip } from "./ProcessingOverviewStrip";
import { RequestQueueTable } from "./RequestQueueTable";
import { FailedRequestsCard } from "./FailedRequestsCard";
import { ProcessingDetailsCard } from "./ProcessingDetailsCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { ViewRequestModal } from "./ViewRequestModal";
import { RetryConfirmModal } from "./RetryConfirmModal";
import { CancelConfirmModal } from "./CancelConfirmModal";
import { QueueSettingsModal } from "./QueueSettingsModal";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface QueueMonitorViewProps {
  initialItems: AiQueueItem[];
  initialFailedItems: AiQueueItem[];
  initialMetrics: AiQueueMetrics;
  initialOverview: AiQueueOverview;
  initialSettings: AiQueueSettings;
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  initialTotalPages: number;
  adminName?: string;
  adminRole?: string;
}

export function QueueMonitorView({
  initialItems,
  initialFailedItems,
  initialMetrics,
  initialOverview,
  initialSettings,
  initialTotal,
  initialPage,
  initialPageSize,
  initialTotalPages,
  adminName = "Parth Patel",
  adminRole = "Administrator",
}: QueueMonitorViewProps) {
  const [items, setItems] = useState<AiQueueItem[]>(initialItems);
  const [failedItems, setFailedItems] = useState<AiQueueItem[]>(initialFailedItems);
  const [metrics, setMetrics] = useState<AiQueueMetrics>(initialMetrics);
  const [overview, setOverview] = useState<AiQueueOverview>(initialOverview);
  const [settings, setSettings] = useState<AiQueueSettings>(initialSettings);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Selected Item (defaults to REQ-001247 as shown in Screen 21 reference photo)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    initialItems.find((r) => r.id === "REQ-001247")?.id || initialItems[0]?.id || null
  );

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortFilter, setSortFilter] = useState("Newest First");

  // Modals
  const [viewModalItem, setViewModalItem] = useState<AiQueueItem | null>(null);
  const [retryModalItem, setRetryModalItem] = useState<AiQueueItem | null>(null);
  const [cancelModalItem, setCancelModalItem] = useState<AiQueueItem | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Loading & refresh states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, startTransition] = useTransition();

  // Toast feedback
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((curr) => (curr?.message === message ? null : curr));
      }, 4000);
    },
    []
  );

  // Fetch queue data from server
  const fetchQueueData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);
      if (sortFilter === "Oldest First") params.set("sortBy", "oldest");
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/admin/ai-generation/queue?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setFailedItems(data.failedItems || []);
        setMetrics(data.metrics);
        setOverview(data.overview);
        setSettings(data.settings);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Queue fetch error:", err);
    }
  }, [searchQuery, statusFilter, sortFilter, page, pageSize]);

  // Controlled polling interval
  useEffect(() => {
    const intervalSec = settings.pollingIntervalSec || 15;
    const interval = setInterval(() => {
      startTransition(() => {
        fetchQueueData();
      });
    }, intervalSec * 1000);

    return () => clearInterval(interval);
  }, [settings.pollingIntervalSec, fetchQueueData]);

  // Trigger manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueueData();
    setIsRefreshing(false);
    showToast("Queue status refreshed", "info");
  };

  // Selected Queue Item
  const selectedItem =
    items.find((r) => r.id === selectedItemId) ||
    failedItems.find((r) => r.id === selectedItemId) ||
    items[0] ||
    null;

  // Handle Retry
  const handleConfirmRetry = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed");

      await fetchQueueData();
      showToast(data.message || `Request ${id} re-queued successfully`, "success");
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error retrying request", "error");
      return false;
    }
  };

  // Handle Cancel
  const handleConfirmCancel = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", id, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancellation failed");

      await fetchQueueData();
      showToast(data.message || `Request ${id} cancelled`, "info");
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error cancelling request", "error");
      return false;
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (
    newSettings: Partial<AiQueueSettings>
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-settings", settings: newSettings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Saving settings failed");

      setSettings(data.settings);
      showToast("Queue settings saved successfully", "success");
      return true;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating settings", "error");
      return false;
    }
  };

  // Handle Export CSV
  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/admin/ai-generation/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export" }),
      });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `post-hub-queue-records-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Queue records exported as CSV", "success");
    } catch {
      showToast("Failed to export queue records", "error");
    }
  };

  // Filter KPI card click
  const handleKpiFilter = (status: string) => {
    setStatusFilter(
      status === "pending"
        ? "Pending"
        : status === "processing"
        ? "Processing"
        : status === "completed"
        ? "Completed"
        : status === "failed"
        ? "Failed"
        : "All Statuses"
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24213A] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium transition-all transform animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
              : toast.type === "error"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-[#E8DFF5] text-[#7956C9] border-[#D8C7F0]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <Info className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <QueueHeader
        onRefresh={handleManualRefresh}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onExport={handleExportCsv}
        isRefreshing={isRefreshing}
        userName={adminName}
        userRole={adminRole}
      />

      {/* Top 4 KPI Metrics */}
      <QueueKpiCards metrics={metrics} onFilterClick={handleKpiFilter} />

      {/* Processing Overview Strip */}
      <ProcessingOverviewStrip overview={overview} />

      {/* Main Content: Left Column (70%) + Right Column (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Request Queue Table */}
          <RequestQueueTable
            items={items}
            selectedItem={selectedItem}
            onSelectItem={(item) => setSelectedItemId(item.id)}
            onViewItem={(item) => setViewModalItem(item)}
            onRetryItem={(item) => setRetryModalItem(item)}
            onCancelItem={(item) => setCancelModalItem(item)}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            statusFilter={statusFilter}
            setStatusFilter={(s) => {
              setStatusFilter(s);
              setPage(1);
            }}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={(p) => setPage(p)}
          />

          {/* 2. Failed Requests Section */}
          <FailedRequestsCard
            failedItems={failedItems}
            onViewItem={(item) => setViewModalItem(item)}
            onRetryItem={(item) => setRetryModalItem(item)}
            onViewAllClick={() => setStatusFilter("Failed")}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Processing Details Card */}
          <ProcessingDetailsCard selectedItem={selectedItem} />

          {/* 2. Quick Actions Card */}
          <QuickActionsCard
            selectedItem={selectedItem}
            onViewClick={() => selectedItem && setViewModalItem(selectedItem)}
            onRetryClick={() => selectedItem && setRetryModalItem(selectedItem)}
            onCancelClick={() => selectedItem && setCancelModalItem(selectedItem)}
            onRefreshStatusClick={handleManualRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {/* Modals */}
      <ViewRequestModal
        isOpen={Boolean(viewModalItem)}
        onClose={() => setViewModalItem(null)}
        item={viewModalItem}
      />

      <RetryConfirmModal
        isOpen={Boolean(retryModalItem)}
        onClose={() => setRetryModalItem(null)}
        item={retryModalItem}
        onConfirm={handleConfirmRetry}
      />

      <CancelConfirmModal
        isOpen={Boolean(cancelModalItem)}
        onClose={() => setCancelModalItem(null)}
        item={cancelModalItem}
        onConfirm={handleConfirmCancel}
      />

      <QueueSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

