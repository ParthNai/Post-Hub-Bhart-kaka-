"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  AiGenerationRequest,
  AiGenerationMetrics,
  AiProviderConfig,
  AiGenerationSettings,
  AiRequestsPaginationResponse,
} from "@/lib/ai-generation";
import { AiGenerationHeader } from "./AiGenerationHeader";
import { AiGenerationMetricsCards } from "./AiGenerationMetricsCards";
import { AiProviderBanner } from "./AiProviderBanner";
import { AiRequestsToolbar } from "./AiRequestsToolbar";
import { AiRequestsTable } from "./AiRequestsTable";
import { AiRequestDetailsPanel } from "./AiRequestDetailsPanel";
import { ConfigureProviderModal } from "./ConfigureProviderModal";
import { GenerationSettingsModal } from "./GenerationSettingsModal";
import { DocumentationModal } from "./DocumentationModal";
import { FullRequestModal } from "./FullRequestModal";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface AiGenerationViewProps {
  initialData: AiRequestsPaginationResponse;
  initialSettings?: AiGenerationSettings;
  adminName?: string;
}

export const AiGenerationView: React.FC<AiGenerationViewProps> = ({
  initialData,
  initialSettings = {
    maxConcurrentGenerations: 5,
    defaultAspectRatio: "4:5",
    safetyFilter: "standard",
    autoRetryFailed: false,
  },
  adminName = "Parth Patel",
}) => {
  const router = useRouter();
  // Main data state
  const [requests, setRequests] = useState<AiGenerationRequest[]>(initialData.requests);
  const [selectedRequest, setSelectedRequest] = useState<AiGenerationRequest | null>(
    initialData.requests[0] || null
  );
  const [metrics, setMetrics] = useState<AiGenerationMetrics>(initialData.metrics);
  const [providerConfig, setProviderConfig] = useState<AiProviderConfig>(initialData.providerConfig);
  const [settings, setSettings] = useState<AiGenerationSettings>(initialSettings);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [providerFilter, setProviderFilter] = useState("All Providers");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [formatFilter, setFormatFilter] = useState("All Formats");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [pageSize, setPageSize] = useState(initialData.pageSize || 5);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [totalCount, setTotalCount] = useState(initialData.total || 0);

  // Status flags
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Modals state
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [fullViewRequest, setFullViewRequest] = useState<AiGenerationRequest | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch updated data from backend API
  const fetchData = useCallback(
    async (
      overrideParams: {
        page?: number;
        pageSize?: number;
        q?: string;
        status?: string;
        provider?: string;
        timeRange?: string;
        format?: string;
      } = {}
    ) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const q = overrideParams.q !== undefined ? overrideParams.q : searchQuery;
        const s = overrideParams.status !== undefined ? overrideParams.status : statusFilter;
        const p = overrideParams.provider !== undefined ? overrideParams.provider : providerFilter;
        const tr = overrideParams.timeRange !== undefined ? overrideParams.timeRange : timeRange;
        const f = overrideParams.format !== undefined ? overrideParams.format : formatFilter;
        const pg = overrideParams.page !== undefined ? overrideParams.page : currentPage;
        const ps = overrideParams.pageSize !== undefined ? overrideParams.pageSize : pageSize;

        if (q.trim()) queryParams.set("q", q.trim());
        if (s && s !== "All Statuses") queryParams.set("status", s);
        if (p && p !== "All Providers") queryParams.set("provider", p);
        if (tr && tr !== "Last 30 Days") queryParams.set("timeRange", tr);
        if (f && f !== "All Formats") queryParams.set("format", f);
        queryParams.set("page", pg.toString());
        queryParams.set("pageSize", ps.toString());

        const res = await fetch(`/api/admin/ai-generation?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to load requests");
        const data: AiRequestsPaginationResponse = await res.json();

        setRequests(data.requests);
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
        setMetrics(data.metrics);
        setProviderConfig(data.providerConfig);

        // Keep selected request in sync if updated
        if (selectedRequest) {
          const freshSelected = data.requests.find((r) => r.id === selectedRequest.id);
          if (freshSelected) {
            setSelectedRequest(freshSelected);
          } else if (data.requests.length > 0 && overrideParams.page !== undefined) {
            setSelectedRequest(data.requests[0]);
          }
        } else if (data.requests.length > 0) {
          setSelectedRequest(data.requests[0]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to fetch data.";
        showToast(message, "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [searchQuery, statusFilter, providerFilter, timeRange, formatFilter, currentPage, pageSize, selectedRequest]
  );

  // Search input debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData({ page: 1, q: searchQuery });
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchData]);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    showToast("Generation requests refreshed.", "info");
  };

  // Filter change handlers
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    fetchData({ page: 1, status: val });
  };

  const handleProviderChange = (val: string) => {
    setProviderFilter(val);
    fetchData({ page: 1, provider: val });
  };

  const handleTimeRangeChange = (val: string) => {
    setTimeRange(val);
    fetchData({ page: 1, timeRange: val });
  };

  const handleFormatChange = (val: string) => {
    setFormatFilter(val);
    fetchData({ page: 1, format: val });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Statuses");
    setProviderFilter("All Providers");
    setTimeRange("Last 30 Days");
    setFormatFilter("All Formats");
    fetchData({
      page: 1,
      q: "",
      status: "All Statuses",
      provider: "All Providers",
      timeRange: "Last 30 Days",
      format: "All Formats",
    });
    showToast("Filters reset to default.", "info");
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "All Statuses" ||
    providerFilter !== "All Providers" ||
    timeRange !== "Last 30 Days" ||
    formatFilter !== "All Formats";

  // Handle Retry Action
  const handleRetryRequest = async (id: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/ai-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to retry generation.");
      }

      showToast(`Request ${id} retried successfully and marked completed.`, "success");
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Retry failed.";
      showToast(message, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Cancel Action
  const handleCancelRequest = async (id: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/ai-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          id,
          reason: "Cancelled by administrator.",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel request.");
      }

      showToast(`Request ${id} has been cancelled.`, "info");
      await fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Cancellation failed.";
      showToast(message, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Save Provider Configuration
  const handleSaveProviderConfig = async (
    updated: Partial<AiProviderConfig>,
    rawApiKey?: string
  ) => {
    try {
      const res = await fetch("/api/admin/ai-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "configure-provider",
          ...updated,
          apiKey: rawApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to save provider configuration." };
      }

      setProviderConfig(data.providerConfig);
      showToast("AI Provider configuration saved successfully.", "success");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save error occurred.";
      return { success: false, error: message };
    }
  };

  // Handle Test Connection
  const handleTestConnection = async (providerId: string, apiKey?: string) => {
    const res = await fetch("/api/admin/ai-generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test-connection",
        providerId,
        apiKey,
      }),
    });
    return res.json();
  };

  // Handle Save Settings
  const handleSaveSettings = async (newSettings: Partial<AiGenerationSettings>) => {
    const res = await fetch("/api/admin/ai-generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save-settings",
        settings: newSettings,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setSettings(data.settings);
      showToast("AI Generation settings saved successfully.", "success");
      return { success: true };
    }
    return { success: false, error: data.error || "Settings save failed." };
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

      {/* Screen 18 Header */}
      <AiGenerationHeader
        onRefresh={handleRefresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isRefreshing={isRefreshing}
        adminName={adminName}
      />

      {/* 4 KPI Metric Cards */}
      <AiGenerationMetricsCards metrics={metrics} isLoading={isLoading} />

      {/* AI Provider Integration Banner */}
      <AiProviderBanner
        config={providerConfig}
        onConfigure={() => router.push("/admin/ai-generation/configuration")}
      />

      {/* Search and Filters Toolbar */}
      <AiRequestsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        providerFilter={providerFilter}
        onProviderChange={handleProviderChange}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        formatFilter={formatFilter}
        onFormatChange={handleFormatChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Two-Column Content Grid: Left Table (~68%) + Right Details Panel (~32%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedRequest ? "minmax(0, 1fr) 380px" : "1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Requests Table */}
        <div style={{ minWidth: 0 }}>
          <AiRequestsTable
            requests={requests}
            selectedRequest={selectedRequest}
            onSelectRequest={setSelectedRequest}
            onRetryRequest={handleRetryRequest}
            onCancelRequest={handleCancelRequest}
            onViewFullRequest={setFullViewRequest}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(pg) => fetchData({ page: pg })}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              fetchData({ page: 1, pageSize: sz });
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Request Details Panel */}
        {selectedRequest && (
          <div style={{ position: "sticky", top: "24px" }}>
            <AiRequestDetailsPanel
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              onRetry={handleRetryRequest}
              onCancel={handleCancelRequest}
              onViewFull={setFullViewRequest}
              isActionLoading={isActionLoading}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfigureProviderModal
        isOpen={isConfigureOpen}
        onClose={() => setIsConfigureOpen(false)}
        config={providerConfig}
        onSave={handleSaveProviderConfig}
        onTestConnection={handleTestConnection}
      />

      <GenerationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <FullRequestModal
        isOpen={Boolean(fullViewRequest)}
        onClose={() => setFullViewRequest(null)}
        request={fullViewRequest}
      />
    </div>
  );
};

