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
import { WorkerManagementHeader } from "./WorkerManagementHeader";
import { WorkerSummaryCards } from "./WorkerSummaryCards";
import { WorkerPoolOverviewCard } from "./WorkerPoolOverviewCard";
import { WorkerManagementTable } from "./WorkerManagementTable";
import { ProcessingControlsCard } from "./ProcessingControlsCard";
import { DrainWorkerModal } from "./DrainWorkerModal";
import { WorkerActivityHistoryCard } from "./WorkerActivityHistoryCard";
import { WorkerDetailsDrawer } from "./WorkerDetailsDrawer";
import { SchedulingConfigurationCard } from "./SchedulingConfigurationCard";
import { WorkerConfigurationModal } from "./WorkerConfigurationModal";
import { ActivityHistoryModal } from "./ActivityHistoryModal";
import {
  type WorkerManagementDataset,
  type WorkerItem,
  type WorkerSchedulingConfig,
  CANONICAL_WORKER_SEED,
} from "@/lib/ai-workers";

export const WorkerManagementView: React.FC = () => {
  const [dataset, setDataset] = useState<WorkerManagementDataset>(CANONICAL_WORKER_SEED);
  const [workers, setWorkers] = useState<WorkerItem[]>(CANONICAL_WORKER_SEED.workers);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>("WK-1001");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPool, setSelectedPool] = useState("All Pools");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Dialogs
  const [drainModalWorker, setDrainModalWorker] = useState<WorkerItem | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Loading & Toasts
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch worker dataset
  const fetchWorkerData = useCallback(
    async (query = searchQuery, pool = selectedPool, status = selectedStatus) => {
      try {
        setIsRefreshing(true);
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (pool !== "All Pools") params.set("pool", pool);
        if (status !== "All Status") params.set("status", status);

        const res = await fetch(`/api/admin/ai-generation/workers?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load worker data");
        const json = await res.json();

        setDataset({
          summary: json.summary,
          pools: json.pools,
          workers: json.workers,
          activityHistory: json.activityHistory,
          configuration: json.configuration,
          lastUpdated: json.lastUpdated,
        });
        setWorkers(json.workers);
      } catch (err) {
        console.error("Error fetching worker data:", err);
      } finally {
        setIsRefreshing(false);
      }
    },
    [searchQuery, selectedPool, selectedStatus]
  );

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const res = await fetch("/api/admin/ai-generation/workers");
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted) return;
        setDataset({
          summary: json.summary,
          pools: json.pools,
          workers: json.workers,
          activityHistory: json.activityHistory,
          configuration: json.configuration,
          lastUpdated: json.lastUpdated,
        });
        setWorkers(json.workers);
      } catch (err) {
        console.error("Initial worker load error:", err);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedWorker =
    workers.find((w) => w.id === selectedWorkerId) ||
    dataset.workers.find((w) => w.id === selectedWorkerId) ||
    dataset.workers[0] ||
    null;

  // Worker Actions
  const handlePauseWorker = async (target?: WorkerItem) => {
    const w = target || selectedWorker;
    if (!w) return;
    try {
      const res = await fetch("/api/admin/ai-generation/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pause", workerId: w.id, adminName: "parth" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to pause worker");
      showToast(`Worker ${w.id} paused.`);
      fetchWorkerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error pausing worker";
      showToast(msg, "error");
    }
  };

  const handleResumeWorker = async (target?: WorkerItem) => {
    const w = target || selectedWorker;
    if (!w) return;
    try {
      const res = await fetch("/api/admin/ai-generation/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", workerId: w.id, adminName: "parth" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resume worker");
      showToast(`Worker ${w.id} resumed.`);
      fetchWorkerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resuming worker";
      showToast(msg, "error");
    }
  };

  const handleDrainConfirm = async (w: WorkerItem, reason: string) => {
    try {
      const res = await fetch("/api/admin/ai-generation/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "drain", workerId: w.id, reason, adminName: "parth" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to drain worker");
      showToast(`Worker ${w.id} set to draining.`);
      fetchWorkerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error draining worker";
      showToast(msg, "error");
    }
  };

  const handleRestartWorker = async (target?: WorkerItem) => {
    const w = target || selectedWorker;
    if (!w) return;
    try {
      const res = await fetch("/api/admin/ai-generation/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restart", workerId: w.id, adminName: "parth" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to restart worker");
      showToast(`Worker ${w.id} restarted successfully.`);
      fetchWorkerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error restarting worker";
      showToast(msg, "error");
    }
  };

  const handleSaveSchedulingConfig = async (partial: Partial<WorkerSchedulingConfig>) => {
    try {
      const res = await fetch("/api/admin/ai-generation/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-config", configuration: partial }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");
      showToast("Worker scheduling configuration saved!");
      fetchWorkerData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving configuration";
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
      {/* Toast */}
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
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

        {/* Page Body */}
        <main style={{ padding: "24px 28px", flex: 1, overflowY: "auto" }}>
          {/* Header */}
          <WorkerManagementHeader
            onRefresh={() => fetchWorkerData()}
            onOpenConfig={() => setConfigModalOpen(true)}
            onOpenHistory={() => setHistoryModalOpen(true)}
            isRefreshing={isRefreshing}
          />

          {/* Top 4 KPI Summary Cards */}
          <WorkerSummaryCards summary={dataset.summary} />

          {/* Layout: Main Left (Pools + Table + Controls + History) | Right Column (Details + Config) */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* Left 70% column */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              {/* Worker Pool Overview */}
              <WorkerPoolOverviewCard pools={dataset.pools} />

              {/* Worker Management Table */}
              <WorkerManagementTable
                workers={workers}
                selectedWorkerId={selectedWorkerId}
                onSelectWorker={(w) => setSelectedWorkerId(w.id)}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  fetchWorkerData(q, selectedPool, selectedStatus);
                }}
                selectedPool={selectedPool}
                onPoolChange={(p) => {
                  setSelectedPool(p);
                  fetchWorkerData(searchQuery, p, selectedStatus);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(s) => {
                  setSelectedStatus(s);
                  fetchWorkerData(searchQuery, selectedPool, s);
                }}
                onPauseWorker={handlePauseWorker}
                onResumeWorker={handleResumeWorker}
                onDrainWorker={(w) => setDrainModalWorker(w)}
                onRestartWorker={handleRestartWorker}
              />

              {/* Split bottom row: Processing Controls on Left, Activity History on Right */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <ProcessingControlsCard
                    selectedWorker={selectedWorker}
                    onPause={() => handlePauseWorker()}
                    onResume={() => handleResumeWorker()}
                    onDrain={() => setDrainModalWorker(selectedWorker)}
                    onRestart={() => handleRestartWorker()}
                  />

                  {/* Inline Drain Confirmation Dialog matching screenshot */}
                  {drainModalWorker && (
                    <DrainWorkerModal
                      isOpen={Boolean(drainModalWorker)}
                      worker={drainModalWorker}
                      onClose={() => setDrainModalWorker(null)}
                      onConfirm={handleDrainConfirm}
                    />
                  )}
                </div>

                <WorkerActivityHistoryCard events={dataset.activityHistory} />
              </div>
            </div>

            {/* Right 30% column */}
            <div style={{ width: "360px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
              <WorkerDetailsDrawer
                worker={selectedWorker}
                onClose={() => setSelectedWorkerId(null)}
              />

              <SchedulingConfigurationCard
                configuration={dataset.configuration}
                onSave={handleSaveSchedulingConfig}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <WorkerConfigurationModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        configuration={dataset.configuration}
        onSave={handleSaveSchedulingConfig}
      />

      <ActivityHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        events={dataset.activityHistory}
      />
    </div>
  );
};
