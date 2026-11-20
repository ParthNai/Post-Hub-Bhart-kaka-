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
  X,
  Image as ImageIcon,
} from "lucide-react";
import { JobTraceHeader } from "./JobTraceHeader";
import { JobOverviewCard } from "./JobOverviewCard";
import { JobLifecycleTimelineCard } from "./JobLifecycleTimelineCard";
import { ExecutionTraceTable } from "./ExecutionTraceTable";
import { RetryErrorHistoryCard } from "./RetryErrorHistoryCard";
import { GeneratedOutputCard } from "./GeneratedOutputCard";
import { JobWorkerDetailsCard } from "./JobWorkerDetailsCard";
import { JobProviderDetailsCard } from "./JobProviderDetailsCard";
import { JobActionButtonsCard } from "./JobActionButtonsCard";
import { JobRelatedInfoCard } from "./JobRelatedInfoCard";
import { CancelJobModal } from "./CancelJobModal";
import {
  type JobTraceDataset,
  CANONICAL_JOB_TRACE_SEED,
} from "@/lib/ai-job-trace";

export const JobTraceView: React.FC = () => {
  const [dataset, setDataset] = useState<JobTraceDataset>(CANONICAL_JOB_TRACE_SEED);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch job trace data from API
  const fetchTraceData = useCallback(async (jobId = "JOB-7845") => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/admin/ai-generation/trace?jobId=${encodeURIComponent(jobId)}`);
      if (!res.ok) throw new Error("Failed to load trace data");
      const json = await res.json();
      const traceData: JobTraceDataset = json.dataset || json;
      if (traceData?.overview) {
        setDataset(traceData);
      }
    } catch (err) {
      console.error("Error fetching trace dataset:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Mount effect with isMounted guard
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/admin/ai-generation/trace?jobId=JOB-7845`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const traceData: JobTraceDataset = data.dataset || data;
          if (traceData?.overview) {
            setDataset(traceData);
          }
        }
      })
      .catch((err) => {
        console.error("Initial trace fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Header Handlers
  const handleRefresh = () => {
    fetchTraceData(dataset.overview.jobId);
    showToast("Job trace and lifecycle refreshed.");
  };

  const handleExportTrace = async () => {
    try {
      const res = await fetch(`/api/admin/ai-generation/trace?jobId=${encodeURIComponent(dataset.overview.jobId)}&format=csv`);
      if (!res.ok) throw new Error("Failed to export trace CSV");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `execution_trace_${dataset.overview.jobId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`Exported CSV for job ${dataset.overview.jobId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error exporting trace";
      showToast(msg, "error");
    }
  };

  // Action Button Handlers
  const handleRetryJob = async () => {
    try {
      setIsRetrying(true);
      const res = await fetch("/api/admin/ai-generation/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "retry",
          jobId: dataset.overview.jobId,
          adminName: "parth",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to retry job");
      if (data.dataset) {
        setDataset(data.dataset);
      }
      showToast(data.message || `Job ${dataset.overview.jobId} retried successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrying job";
      showToast(msg, "error");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    try {
      setIsCancelling(true);
      const res = await fetch("/api/admin/ai-generation/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          jobId: dataset.overview.jobId,
          reason,
          adminName: "parth",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel job");
      if (data.dataset) {
        setDataset(data.dataset);
      }
      setCancelModalOpen(false);
      showToast(data.message || `Job ${dataset.overview.jobId} cancelled.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error cancelling job";
      showToast(msg, "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCopyJobId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(dataset.overview.jobId);
      showToast(`Job ID ${dataset.overview.jobId} copied to clipboard!`);
    } else {
      showToast(`Job ID: ${dataset.overview.jobId}`);
    }
  };

  const handleViewAsset = () => {
    setAssetModalOpen(true);
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

      {/* Cancel Modal */}
      <CancelJobModal
        isOpen={cancelModalOpen}
        jobId={dataset.overview.jobId}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isSubmitting={isCancelling}
      />

      {/* Asset Preview Modal */}
      {assetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 12, 30, 0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #EAE4EE",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #EAE4EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ImageIcon size={18} color="#7956C9" />
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#24213A" }}>
                  Generated Asset Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssetModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#777184" }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "24px 20px", textAlign: "center" }}>
              {dataset.generatedOutput.isAvailable && dataset.generatedOutput.previewUrl ? (
                <img
                  src={dataset.generatedOutput.previewUrl}
                  alt="Generated Output Asset"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
              ) : (
                <div
                  style={{
                    padding: "32px 16px",
                    backgroundColor: "#FAF9FD",
                    borderRadius: "10px",
                    border: "1.5px dashed #DDD7EE",
                  }}
                >
                  <ImageIcon size={40} color="#B7ADCF" style={{ margin: "0 auto 12px" }} />
                  <p style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 600, color: "#24213A" }}>
                    No output asset available
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#777184" }}>
                    Job is currently in <strong>{dataset.overview.status}</strong> status. The asset will be accessible once the &quot;Result Storage&quot; lifecycle stage completes.
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "12px 20px",
                backgroundColor: "#FAF9FD",
                borderTop: "1px solid #EAE4EE",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setAssetModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
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

        {/* Scrollable Page Workspace */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {/* Page Header with Action Buttons */}
          <JobTraceHeader
            onRefresh={handleRefresh}
            onExportTrace={handleExportTrace}
            isRefreshing={isRefreshing}
          />

          {/* Main 2-Column Grid matching 4K Reference Design */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* Left 70% Column */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* 1. Job Overview Card */}
              <JobOverviewCard
                overview={dataset.overview}
                onCopyRequestId={() => {
                  navigator.clipboard?.writeText(dataset.overview.requestId);
                  showToast(`Request ID ${dataset.overview.requestId} copied`);
                }}
                onViewUser={() => {
                  showToast(`User: ${dataset.overview.userReference}`);
                }}
              />

              {/* 2. Job Lifecycle Timeline */}
              <JobLifecycleTimelineCard stages={dataset.lifecycleStages} />

              {/* 3. Execution Trace Table */}
              <ExecutionTraceTable events={dataset.executionTrace} />

              {/* 4. Bottom Row: Retry History (50%) + Generated Output (50%) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  alignItems: "stretch",
                }}
              >
                <RetryErrorHistoryCard retryHistory={dataset.retryHistory} />
                <GeneratedOutputCard
                  output={dataset.generatedOutput}
                  onViewAsset={handleViewAsset}
                />
              </div>
            </div>

            {/* Right 30% Column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Worker Details Card */}
              <JobWorkerDetailsCard worker={dataset.workerDetails} />

              {/* Provider Details Card */}
              <JobProviderDetailsCard provider={dataset.providerDetails} />

              {/* Action Buttons Card */}
              <JobActionButtonsCard
                onRetry={handleRetryJob}
                onCancel={() => setCancelModalOpen(true)}
                onViewAsset={handleViewAsset}
                onCopyJobId={handleCopyJobId}
                isRetrying={isRetrying}
                isCancelling={isCancelling}
                isJobCancelled={dataset.overview.status === "Cancelled"}
                isJobCompleted={dataset.overview.status === "Completed"}
              />

              {/* Related Information Card */}
              <JobRelatedInfoCard
                relatedQueue={dataset.related.relatedQueue}
                relatedJob={dataset.related.relatedJob}
                relatedRequest={dataset.related.relatedRequest}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
