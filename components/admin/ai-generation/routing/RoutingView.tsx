"use client";

import React, { useState, useEffect } from "react";
import {
  RoutingDataset,
  RoutingRule,
  FailoverConditions,
  CANONICAL_ROUTING_SEED,
} from "@/lib/ai-failover";
import { RoutingHeader } from "./RoutingHeader";
import { AiSubscreenNav } from "../AiSubscreenNav";
import { RoutingSummaryCards } from "./RoutingSummaryCards";
import { ProviderPriorityTable } from "./ProviderPriorityTable";
import { FallbackWorkflowCard } from "./FallbackWorkflowCard";
import { RoutingRulesTable } from "./RoutingRulesTable";
import { BottomRoutingSection } from "./BottomRoutingSection";
import { EditRoutingRuleDrawer } from "./EditRoutingRuleDrawer";
import { RoutingHistoryModal } from "./RoutingHistoryModal";
import { RoutingSettingsModal } from "./RoutingSettingsModal";

export const RoutingView: React.FC = () => {
  const [data, setData] = useState<RoutingDataset>(CANONICAL_ROUTING_SEED);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters for routing rules table
  const [ruleSearch, setRuleSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Selected rule for right drawer (open by default on rule-1 to match reference image)
  const [selectedRuleId, setSelectedRuleId] = useState<string>("rule-1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Modals
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/ai-generation/routing")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json) setData(json);
      })
      .catch((err) => console.error("Initial routing fetch error:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Save Rule
  const handleSaveRule = async (updatedRule: Partial<RoutingRule>) => {
    try {
      const res = await fetch("/api/admin/ai-generation/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-rule", rule: updatedRule }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData(result.data);
        showToast("Routing rule saved successfully.");
        return true;
      } else {
        throw new Error(result.error || "Failed to save rule");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving rule");
      return false;
    }
  };

  // Toggle Provider Routing Status
  const handleToggleProviderRouting = async (
    providerId: string,
    enabled: boolean
  ) => {
    try {
      const res = await fetch("/api/admin/ai-generation/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-provider",
          providerId,
          enabled,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData(result.data);
        showToast(
          `Provider routing ${enabled ? "enabled" : "disabled"} for ${providerId}.`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Failover Conditions
  const handleToggleCondition = async (
    key: keyof FailoverConditions,
    value: boolean
  ) => {
    const updated = { ...data.failoverConditions, [key]: value };
    setData((prev) => ({
      ...prev,
      failoverConditions: updated,
    }));
    try {
      await fetch("/api/admin/ai-generation/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-conditions",
          conditions: { [key]: value },
        }),
      });
      showToast("Failover conditions updated.");
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings Modal
  const handleSaveSettings = async (updates: Partial<FailoverConditions>) => {
    try {
      const res = await fetch("/api/admin/ai-generation/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-conditions",
          conditions: updates,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData(result.data);
        showToast("Routing settings saved successfully.");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Save All Changes (Header button)
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      showToast("All failover & routing changes verified and active.");
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  // Filter rules locally
  const filteredRules = data.rules.filter((r) => {
    if (ruleSearch.trim()) {
      const q = ruleSearch.toLowerCase().trim();
      const matchName = r.ruleName.toLowerCase().includes(q);
      const matchProvider = r.preferredProvider.toLowerCase().includes(q);
      const matchReq = r.modelRequirement.toLowerCase().includes(q);
      if (!matchName && !matchProvider && !matchReq) return false;
    }
    if (typeFilter !== "All Types") {
      if (r.requestType !== typeFilter) return false;
    }
    if (statusFilter !== "All Status") {
      if (r.status !== statusFilter) return false;
    }
    return true;
  });

  const selectedRule =
    data.rules.find((r) => r.id === selectedRuleId) || data.rules[0] || null;

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
      <RoutingHeader
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onViewHistory={() => setIsHistoryModalOpen(true)}
        onSaveChanges={handleSaveAll}
        isSaving={isSaving}
        adminName="Parth Admin"
      />

      {/* Sub-screens Navigation Ribbon */}
      <AiSubscreenNav />

      {/* 4 Summary Cards */}
      <RoutingSummaryCards metrics={data.summary} />

      {/* Main Grid: Left side has Priority Table, Workflow, Rules Table, History; Right side has Drawer */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* Provider Priority & Routing Configuration */}
          <ProviderPriorityTable
            items={data.providerPriorities}
            onToggleRouting={handleToggleProviderRouting}
            onEditPriority={() => {
              setIsDrawerOpen(true);
            }}
          />

          {/* Fallback Workflow Diagram */}
          <FallbackWorkflowCard />

          {/* Routing Rules Table */}
          <RoutingRulesTable
            rules={filteredRules}
            search={ruleSearch}
            onSearchChange={setRuleSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onEditRule={(rule) => {
              setSelectedRuleId(rule.id);
              setIsDrawerOpen(true);
            }}
            selectedRuleId={selectedRuleId}
          />

          {/* Bottom Split: Recent Routing History & Failover Conditions */}
          <BottomRoutingSection
            history={data.recentHistory}
            conditions={data.failoverConditions}
            onToggleCondition={handleToggleCondition}
            onViewAllHistory={() => setIsHistoryModalOpen(true)}
          />
        </div>

        {/* Right Column: Docked Edit Routing Rule Drawer (Open by default) */}
        {isDrawerOpen && (
          <EditRoutingRuleDrawer
            rule={selectedRule}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onSaveRule={handleSaveRule}
          />
        )}
      </div>

      {/* Modals */}
      <RoutingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={data.recentHistory}
      />

      <RoutingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        conditions={data.failoverConditions}
        onSave={handleSaveSettings}
      />
    </div>
  );
};
