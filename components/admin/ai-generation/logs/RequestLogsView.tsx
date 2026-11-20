"use client";

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
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        color: "#24213A",
        fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
      }}
    >
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
      <aside
        style={{
          width: "240px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #EAE4EE",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderBottom: "1px solid #F1EDF5",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#7956C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "18px",
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#24213A", lineHeight: 1.1 }}>
              Post Hub
            </div>
            <div style={{ fontSize: "11px", color: "#777184" }}>Admin Panel</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav
          style={{
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {[
            { label: "Dashboard", icon: <LayoutDashboard size={16} />, href: "/admin/dashboard" },
            { label: "App Screens", icon: <Smartphone size={16} />, href: "/admin/screens" },
            { label: "Design System", icon: <Palette size={16} />, href: "/admin/design-system" },
            { label: "Templates", icon: <LayoutTemplate size={16} />, href: "/admin/templates" },
            {
              label: "AI Image Generation",
              icon: <Sparkles size={16} />,
              href: "/admin/ai-generation",
              active: true,
            },
            { label: "Festivals & Events", icon: <PartyPopper size={16} />, href: "/admin/festivals" },
            { label: "Users", icon: <Users size={16} />, href: "/admin/users" },
            { label: "Subscriptions & Payments", icon: <CreditCard size={16} />, href: "/admin/subscriptions" },
            { label: "Home Content", icon: <Home size={16} />, href: "/admin/home-content" },
            { label: "Notifications", icon: <Bell size={16} />, href: "/admin/notifications" },
            { label: "Roles & Permissions", icon: <ShieldCheck size={16} />, href: "/admin/roles" },
            { label: "System Health", icon: <Activity size={16} />, href: "/admin/system-health" },
            { label: "Support & Settings", icon: <SettingsIcon size={16} />, href: "/admin/settings" },
          ].map((nav) => (
            <Link
              key={nav.label}
              href={nav.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: nav.active ? 600 : 500,
                color: nav.active ? "#7956C9" : "#544E61",
                backgroundColor: nav.active ? "#F3EFFC" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ color: nav.active ? "#7956C9" : "#777184" }}>{nav.icon}</span>
              <span>{nav.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer info */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #F1EDF5", fontSize: "11px", color: "#A09BAA" }}>
          <div>Post Hub v1.0.0</div>
          <div>© 2025 KnowledgePark</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Global Top Header */}
        <header
          style={{
            height: "56px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #EAE4EE",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "400px" }}>
            <Menu size={18} color="#777184" style={{ cursor: "pointer" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FAF7F2",
                border: "1px solid #EAE4EE",
                borderRadius: "8px",
                padding: "6px 12px",
                width: "100%",
              }}
            >
              <Search size={14} color="#777184" />
              <input
                type="text"
                placeholder="Search anything..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "13px",
                  color: "#24213A",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Right: Notifications & Admin avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Bell size={18} color="#544E61" />
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "9px",
                  fontWeight: 700,
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                3
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                P
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>
                Parth Admin
              </span>
              <ChevronDown size={14} color="#777184" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
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
        </main>
      </div>
    </div>
  );
};
