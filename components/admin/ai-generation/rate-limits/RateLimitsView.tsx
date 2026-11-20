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
import { RateLimitsHeader } from "./RateLimitsHeader";
import { RateLimitsSummaryCards } from "./RateLimitsSummaryCards";
import { PolicyOverviewTable } from "./PolicyOverviewTable";
import { RateLimitConfigForm } from "./RateLimitConfigForm";
import { PlanLimitsAndProviderTable } from "./PlanLimitsAndProviderTable";
import { ThrottlingBehaviorCard } from "./ThrottlingBehaviorCard";
import { RateLimitEventHistoryTable } from "./RateLimitEventHistoryTable";
import { UpdateConfigConfirmModal } from "./UpdateConfigConfirmModal";
import { TestPolicyModal } from "./TestPolicyModal";
import { ChangeHistoryModal } from "./ChangeHistoryModal";
import {
  type RateLimitDataset,
  type RateLimitPolicy,
  type ThrottlingBehaviorConfig,
  CANONICAL_RATE_LIMIT_SEED,
} from "@/lib/ai-rate-limits";

export const RateLimitsView: React.FC = () => {
  const [dataset, setDataset] = useState<RateLimitDataset>(CANONICAL_RATE_LIMIT_SEED);
  const [selectedPolicy, setSelectedPolicy] = useState<RateLimitPolicy | null>(
    CANONICAL_RATE_LIMIT_SEED.policies[0]
  );

  // Modals
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  // Loading & Toasts
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPolicy, setIsUpdatingPolicy] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch dataset
  const fetchRateLimitsData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ai-generation/rate-limits");
      if (!res.ok) throw new Error("Failed to load rate limits");
      const json = await res.json();
      const loaded: RateLimitDataset = json.dataset || json;
      if (loaded?.policies) {
        setDataset(loaded);
        if (loaded.policies.length > 0) {
          setSelectedPolicy((prev) => prev ?? loaded.policies[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching rate limits:", err);
    }
  }, []);

  // Initial load with isMounted guard
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/ai-generation/rate-limits")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const loaded: RateLimitDataset = data.dataset || data;
          if (loaded?.policies) {
            setDataset(loaded);
            if (loaded.policies.length > 0) {
              setSelectedPolicy((prev) => prev ?? loaded.policies[0]);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Initial load error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Policy Form Update
  const handleUpdatePolicy = async (policyId: string, partial: Partial<RateLimitPolicy>) => {
    try {
      setIsUpdatingPolicy(true);
      const res = await fetch("/api/admin/ai-generation/rate-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-policy",
          policyId,
          partial,
          adminName: "Parth Admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update policy");

      if (data.dataset) {
        setDataset(data.dataset);
      }
      if (data.policy) {
        setSelectedPolicy(data.policy);
      }
      showToast(`Policy '${partial.name || policyId}' updated.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating policy";
      showToast(msg, "error");
    } finally {
      setIsUpdatingPolicy(false);
    }
  };

  // Toggle Policy status
  const handleToggleStatus = async (policyId: string) => {
    try {
      const res = await fetch("/api/admin/ai-generation/rate-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-policy",
          policyId,
          adminName: "Parth Admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle policy status");

      if (data.dataset) {
        setDataset(data.dataset);
      }
      showToast("Policy status updated.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error toggling status";
      showToast(msg, "error");
    }
  };

  // Behavior selection
  const handleSelectBehavior = async (behavior: ThrottlingBehaviorConfig["selectedBehavior"]) => {
    try {
      const res = await fetch("/api/admin/ai-generation/rate-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-behavior",
          behavior,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update behavior");

      if (data.dataset) {
        setDataset(data.dataset);
      }
      showToast(`Throttling behavior set to '${behavior}'.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating behavior";
      showToast(msg, "error");
    }
  };

  // Save Configuration confirmation
  const handleConfirmSaveConfiguration = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/ai-generation/rate-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-configuration",
          adminName: "Parth Admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");

      if (data.dataset) {
        setDataset(data.dataset);
      }
      setConfirmModalOpen(false);
      showToast("Rate limit configuration published to production.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving configuration";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Test Evaluation runner
  const handleRunTest = async (params: {
    endpoint: string;
    requestCount: number;
    userId?: string;
    plan?: string;
  }) => {
    const res = await fetch("/api/admin/ai-generation/rate-limits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test-policy",
        ...params,
      }),
    });
    const data = await res.json();
    return data.evaluation;
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

      {/* Confirmation Modal */}
      <UpdateConfigConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSaveConfiguration}
        isSubmitting={isSaving}
      />

      {/* Test Policy Modal */}
      <TestPolicyModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onRunTest={handleRunTest}
      />

      {/* Change History Modal */}
      <ChangeHistoryModal
        isOpen={historyModalOpen}
        history={dataset.auditHistory}
        onClose={() => setHistoryModalOpen(false)}
      />

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

        {/* Scrollable Page Body */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {/* Page Header */}
          <RateLimitsHeader
            onSaveConfiguration={() => setConfirmModalOpen(true)}
            onOpenHistory={() => setHistoryModalOpen(true)}
            onOpenTest={() => setTestModalOpen(true)}
            isSaving={isSaving}
          />

          {/* KPI Summary Cards */}
          <RateLimitsSummaryCards metrics={dataset.summary} />

          {/* Policy Overview Table */}
          <PolicyOverviewTable
            policies={dataset.policies}
            selectedPolicyId={selectedPolicy?.id || null}
            onSelectPolicy={(policy) => setSelectedPolicy(policy)}
            onToggleStatus={handleToggleStatus}
          />

          {/* Middle Split Grid: Configuration Form (Left) & Plan Limits + Provider Rate-Limits (Right) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.35fr",
              gap: "20px",
              marginBottom: "20px",
              alignItems: "stretch",
            }}
          >
            {/* Left: Rate-Limit Configuration Form */}
            <RateLimitConfigForm
              selectedPolicy={selectedPolicy}
              onUpdatePolicy={handleUpdatePolicy}
              onReset={() => {
                fetchRateLimitsData();
                showToast("Configuration reset to current active settings.");
              }}
              isUpdating={isUpdatingPolicy}
            />

            {/* Right: Plan Limits & Provider Table */}
            <PlanLimitsAndProviderTable
              planCards={dataset.planLimits}
              providerLimits={dataset.providerRateLimits}
            />
          </div>

          {/* Throttling Behavior Card */}
          <ThrottlingBehaviorCard
            config={dataset.throttlingBehavior}
            onSelectBehavior={handleSelectBehavior}
          />

          {/* Rate-Limit Event History */}
          <RateLimitEventHistoryTable events={dataset.eventHistory} />
        </main>
      </div>
    </div>
  );
};
