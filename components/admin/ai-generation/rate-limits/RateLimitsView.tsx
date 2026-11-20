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
        padding: "24px 32px 60px",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#FAF7F2",
      }}>
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
      
          {/* Page Header */}
          <RateLimitsHeader
            onSaveConfiguration={() => setConfirmModalOpen(true)}
            onOpenHistory={() => setHistoryModalOpen(true)}
            onOpenTest={() => setTestModalOpen(true)}
            isSaving={isSaving}
          />

          {/* Sub-screens Navigation Ribbon */}
          <AiSubscreenNav />

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
        
    </div>
  );
};
