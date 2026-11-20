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
import { RequestLogsHeader } from "./RequestLogsHeader";
import { RequestLogsSummaryCards } from "./RequestLogsSummaryCards";
import { RequestActivityChart } from "./RequestActivityChart";
import { RequestLogsTable } from "./RequestLogsTable";
import { RequestDetailsDrawer } from "./RequestDetailsDrawer";
import { BottomAnalyticsCards } from "./BottomAnalyticsCards";
import { QuickLinksAndRetentionFooter } from "./QuickLinksAndRetentionFooter";
import { LogRetentionSettingsModal } from "./LogRetentionSettingsModal";
import {
  type RequestLogsDataset,
  type ApiRequestLog,
  CANONICAL_REQUEST_LOGS_SEED,
} from "@/lib/ai-request-logs";

export const RequestLogsView: React.FC = () => {
  const [dataset, setDataset] = useState<RequestLogsDataset>(CANONICAL_REQUEST_LOGS_SEED);
  const [pagedLogs, setPagedLogs] = useState<ApiRequestLog[]>(CANONICAL_REQUEST_LOGS_SEED.logs);
  const [selectedLog, setSelectedLog] = useState<ApiRequestLog | null>(CANONICAL_REQUEST_LOGS_SEED.logs[0]);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState("All Endpoints");
  const [selectedMethod, setSelectedMethod] = useState("All Methods");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 24 Hours");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  // Retention & Export State
  const [retentionPolicy, setRetentionPolicy] = useState(30);
  const [exportFormat, setExportFormat] = useState<"CSV" | "JSON">("CSV");
  const [isExporting, setIsExporting] = useState(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState(false);

  // Loading & Toasts
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch API logs
  const fetchLogsData = useCallback(
    async (
      q = searchQuery,
      ep = selectedEndpoint,
      meth = selectedMethod,
      stat = selectedStatus,
      tr = selectedTimeRange,
      page = currentPage
    ) => {
      try {
        setIsRefreshing(true);
        const params = new URLSearchParams();
        if (q) params.set("search", q);
        if (ep !== "All Endpoints") params.set("endpoint", ep);
        if (meth !== "All Methods") params.set("method", meth);
        if (stat !== "All Status") params.set("status", stat);
        if (tr) params.set("timeRange", tr);
        params.set("page", page.toString());
        params.set("pageSize", "5");

        const res = await fetch(`/api/admin/ai-generation/logs?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load request logs");
        const json = await res.json();

        const logsDataset: RequestLogsDataset = json.dataset || json;
        if (logsDataset?.logs) {
          setDataset(logsDataset);
        }
        if (json.pagedLogs) {
          setPagedLogs(json.pagedLogs);
        }
        if (json.totalPages) {
          setTotalPages(json.totalPages);
        }
      } catch (err) {
        console.error("Error fetching request logs:", err);
      } finally {
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedEndpoint, selectedMethod, selectedStatus, selectedTimeRange, currentPage]
  );

  // Mount effect with isMounted guard
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/admin/ai-generation/logs?page=1&pageSize=5`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const logsDataset: RequestLogsDataset = data.dataset || data;
          if (logsDataset?.logs) {
            setDataset(logsDataset);
          }
          if (data.pagedLogs) {
            setPagedLogs(data.pagedLogs);
            if (data.pagedLogs.length > 0) {
              setSelectedLog((prev) => prev ?? data.pagedLogs[0]);
            }
          }
          if (data.totalPages) {
            setTotalPages(data.totalPages);
          }
        }
      })
      .catch((err) => {
        console.error("Initial logs fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter handlers
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    fetchLogsData(q, selectedEndpoint, selectedMethod, selectedStatus, selectedTimeRange, 1);
  };

  const handleEndpointChange = (ep: string) => {
    setSelectedEndpoint(ep);
    setCurrentPage(1);
    fetchLogsData(searchQuery, ep, selectedMethod, selectedStatus, selectedTimeRange, 1);
  };

  const handleMethodChange = (m: string) => {
    setSelectedMethod(m);
    setCurrentPage(1);
    fetchLogsData(searchQuery, selectedEndpoint, m, selectedStatus, selectedTimeRange, 1);
  };

  const handleStatusChange = (s: string) => {
    setSelectedStatus(s);
    setCurrentPage(1);
    fetchLogsData(searchQuery, selectedEndpoint, selectedMethod, s, selectedTimeRange, 1);
  };

  const handleTimeRangeChange = (t: string) => {
    setSelectedTimeRange(t);
    setCurrentPage(1);
    fetchLogsData(searchQuery, selectedEndpoint, selectedMethod, selectedStatus, t, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLogsData(searchQuery, selectedEndpoint, selectedMethod, selectedStatus, selectedTimeRange, page);
  };

  // Export logs handler
  const handleExportLogs = async (fmt = exportFormat) => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      params.set("format", fmt.toLowerCase());
      if (searchQuery) params.set("search", searchQuery);
      if (selectedEndpoint !== "All Endpoints") params.set("endpoint", selectedEndpoint);
      if (selectedStatus !== "All Status") params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/ai-generation/logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to export logs");

      if (fmt === "CSV") {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `api_request_logs_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const json = await res.json();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `api_request_logs_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      showToast(`Exported logs in ${fmt} format successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error exporting logs";
      showToast(msg, "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Retention Settings handlers
  const handleSaveRetention = async (newDays: number, autoCleanup: boolean) => {
    try {
      const res = await fetch("/api/admin/ai-generation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-retention",
          retentionDays: newDays,
          autoCleanupEnabled: autoCleanup,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save retention settings");

      setRetentionPolicy(newDays);
      setRetentionModalOpen(false);
      showToast(`Log retention window updated to ${newDays} days.`);
      fetchLogsData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving retention";
      showToast(msg, "error");
    }
  };

  const handleTriggerCleanup = async () => {
    try {
      const res = await fetch("/api/admin/ai-generation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger cleanup");

      showToast("Manual log cleanup executed.");
      setRetentionModalOpen(false);
      fetchLogsData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error running cleanup";
      showToast(msg, "error");
    }
  };

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
      {/* Toast Notification */}
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

      {/* Retention Settings Modal */}
      <LogRetentionSettingsModal
        isOpen={retentionModalOpen}
        config={dataset.retentionConfig}
        onClose={() => setRetentionModalOpen(false)}
        onSave={handleSaveRetention}
        onTriggerCleanup={handleTriggerCleanup}
      />

      {/* Left Sidebar Navigation */}
      
          {/* Page Header */}
          <RequestLogsHeader
            onRefresh={() => {
              fetchLogsData();
              showToast("API request logs refreshed.");
            }}
            onExport={() => handleExportLogs(exportFormat)}
            onOpenRetentionSettings={() => setRetentionModalOpen(true)}
            isRefreshing={isRefreshing}
          />

          {/* Sub-screens Navigation Ribbon */}
          <AiSubscreenNav />

          {/* Main Grid: Left 1fr, Right 340px if Drawer is open or persistent */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedLog ? "1fr 340px" : "1fr",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* Left Content Area */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Summary Metric Cards */}
              <RequestLogsSummaryCards metrics={dataset.summary} />

              {/* Request Activity Multi-line Chart */}
              <RequestActivityChart activityData={dataset.activityTrends} />

              {/* API Request Logs Table */}
              <RequestLogsTable
                logs={pagedLogs}
                selectedLogId={selectedLog?.id || null}
                onSelectLog={(log) => setSelectedLog(log)}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedEndpoint={selectedEndpoint}
                onEndpointChange={handleEndpointChange}
                selectedMethod={selectedMethod}
                onMethodChange={handleMethodChange}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              {/* Bottom Analytics Cards */}
              <BottomAnalyticsCards
                httpStatusData={dataset.httpStatusDistribution}
                errorCategories={dataset.errorCategories}
                endpointActivity={dataset.endpointActivity}
                latencyDistribution={dataset.latencyDistribution}
              />

              {/* Quick Links & Retention Footer */}
              <QuickLinksAndRetentionFooter
                retentionPolicy={retentionPolicy}
                onRetentionPolicyChange={(days) => {
                  setRetentionPolicy(days);
                  handleSaveRetention(days, dataset.retentionConfig.autoCleanupEnabled);
                }}
                exportFormat={exportFormat}
                onExportFormatChange={(fmt) => setExportFormat(fmt)}
                onExportLogs={() => handleExportLogs(exportFormat)}
                isExporting={isExporting}
              />
            </div>

            {/* Right Side: Request Details Viewer */}
            {selectedLog && (
              <RequestDetailsDrawer
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
              />
            )}
          </div>
        
    </div>
  );
};
