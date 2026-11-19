"use client";

import React, { useState, useMemo } from "react";
import { ModerationHeader } from "./ModerationHeader";
import { ModerationKpiCards } from "./ModerationKpiCards";
import { GlobalSettingsCard } from "./GlobalSettingsCard";
import { ModerationCategoriesGrid } from "./ModerationCategoriesGrid";
import { AutomaticRulesCard } from "./AutomaticRulesCard";
import { ManualReviewCard } from "./ManualReviewCard";
import { RejectionReasonsCard } from "./RejectionReasonsCard";
import { UnknownErrorHandlingCard } from "./UnknownErrorHandlingCard";
import { PolicyPreviewCard } from "./PolicyPreviewCard";
import { BottomActionBar } from "./BottomActionBar";
import { AddEditRuleModal } from "./AddEditRuleModal";
import { AddEditReasonModal } from "./AddEditReasonModal";
import { PolicyHistoryModal } from "./PolicyHistoryModal";
import { RulePreviewModal } from "./RulePreviewModal";
import type {
  ModerationPolicyConfiguration,
  GlobalModerationSettings,
  ModerationCategory,
  AutomaticModerationRule,
  RejectionReason,
  ManualReviewConfiguration,
  UnknownErrorHandling,
  CategoryResultingAction,
  ModerationKpiMetrics,
  ModerationPolicyRevision,
} from "@/lib/ai-moderation";

interface ModerationViewProps {
  initialPolicy: ModerationPolicyConfiguration;
  adminName?: string;
  adminRole?: string;
}

export function ModerationView({
  initialPolicy,
  adminName = "Parth Patel",
}: ModerationViewProps) {
  // Saved server snapshot
  const [savedSnapshot, setSavedSnapshot] = useState<ModerationPolicyConfiguration>(initialPolicy);

  // Live editable working copy
  const [globals, setGlobals] = useState<GlobalModerationSettings>(initialPolicy.globals);
  const [categories, setCategories] = useState<ModerationCategory[]>(initialPolicy.categories);
  const [rules, setRules] = useState<AutomaticModerationRule[]>(initialPolicy.rules);
  const [reasons, setReasons] = useState<RejectionReason[]>(initialPolicy.reasons);
  const [manualReview, setManualReview] = useState<ManualReviewConfiguration>(initialPolicy.manualReview);
  const [errorHandling, setErrorHandling] = useState<UnknownErrorHandling>(initialPolicy.errorHandling);
  const [metrics, setMetrics] = useState<ModerationKpiMetrics>(initialPolicy.metrics);
  const [versionHistory, setVersionHistory] = useState<ModerationPolicyRevision[]>(initialPolicy.versionHistory);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [ruleModal, setRuleModal] = useState<{
    isOpen: boolean;
    rule: AutomaticModerationRule | null;
  }>({ isOpen: false, rule: null });
  const [reasonModal, setReasonModal] = useState<{
    isOpen: boolean;
    reason: RejectionReason | null;
  }>({ isOpen: false, reason: null });

  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    return (
      JSON.stringify(globals) !== JSON.stringify(savedSnapshot.globals) ||
      JSON.stringify(categories) !== JSON.stringify(savedSnapshot.categories) ||
      JSON.stringify(rules) !== JSON.stringify(savedSnapshot.rules) ||
      JSON.stringify(reasons) !== JSON.stringify(savedSnapshot.reasons) ||
      JSON.stringify(manualReview) !== JSON.stringify(savedSnapshot.manualReview) ||
      JSON.stringify(errorHandling) !== JSON.stringify(savedSnapshot.errorHandling)
    );
  }, [globals, categories, rules, reasons, manualReview, errorHandling, savedSnapshot]);

  // Discard all changes
  const handleDiscard = () => {
    setGlobals(savedSnapshot.globals);
    setCategories(savedSnapshot.categories);
    setRules(savedSnapshot.rules);
    setReasons(savedSnapshot.reasons);
    setManualReview(savedSnapshot.manualReview);
    setErrorHandling(savedSnapshot.errorHandling);
    setToast({ type: "info", message: "Discarded unsaved policy changes." });
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ai-generation/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-policy",
          globals,
          categories,
          rules,
          reasons,
          manualReview,
          errorHandling,
          summary: `Updated policy rules and configuration by ${adminName}.`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.policy) {
        setSavedSnapshot(data.policy);
        setGlobals(data.policy.globals);
        setCategories(data.policy.categories);
        setRules(data.policy.rules);
        setReasons(data.policy.reasons);
        setManualReview(data.policy.manualReview);
        setErrorHandling(data.policy.errorHandling);
        setMetrics(data.policy.metrics);
        setVersionHistory(data.policy.versionHistory);
        setToast({
          type: "success",
          message: `Policy ${data.policy.globals.policyVersion} saved and published successfully!`,
        });
      } else {
        setToast({
          type: "error",
          message: data.error || "Failed to save policy configuration.",
        });
      }
    } catch {
      setToast({ type: "error", message: "Failed to connect to moderation server." });
    } finally {
      setIsSaving(false);
    }
  };

  // Rule Handlers
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSaveRuleModal = (
    ruleData: Omit<AutomaticModerationRule, "id">,
    ruleId?: string
  ) => {
    if (ruleId) {
      // Editing
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, ...ruleData } : r))
      );
      setToast({ type: "info", message: `Updated rule: ${ruleData.name}` });
    } else {
      // Adding new
      const newRule: AutomaticModerationRule = {
        ...ruleData,
        id: `rule-${Date.now()}`,
        order: rules.length + 1,
      };
      setRules((prev) => [...prev, newRule]);
      setToast({ type: "success", message: `Added rule: ${ruleData.name}` });
    }
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      setRules((prev) => prev.filter((r) => r.id !== id));
      setToast({ type: "info", message: "Rule removed from configuration." });
    }
  };

  // Category Handlers
  const handleToggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleUpdateCategoryAction = (
    id: string,
    action: CategoryResultingAction
  ) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resultingAction: action } : c))
    );
  };

  // Reason Handlers
  const handleSaveReasonModal = (
    data: Omit<RejectionReason, "id">,
    reasonId?: string
  ) => {
    if (reasonId) {
      setReasons((prev) =>
        prev.map((r) => (r.id === reasonId ? { ...r, ...data } : r))
      );
      setToast({ type: "info", message: `Updated reason: ${data.category}` });
    } else {
      const newReason: RejectionReason = {
        ...data,
        id: `rej-${Date.now()}`,
        usageCount: 0,
      };
      setReasons((prev) => [...prev, newReason]);
      setToast({ type: "success", message: `Added reason: ${data.category}` });
    }
  };

  const handleToggleReasonStatus = (id: string) => {
    setReasons((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Active" ? "Disabled" : "Active" }
          : r
      )
    );
  };

  // Restore history revision
  const handleRestoreRevision = async (revisionId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/ai-generation/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore-history",
          revisionId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.policy) {
        setSavedSnapshot(data.policy);
        setGlobals(data.policy.globals);
        setCategories(data.policy.categories);
        setRules(data.policy.rules);
        setReasons(data.policy.reasons);
        setManualReview(data.policy.manualReview);
        setErrorHandling(data.policy.errorHandling);
        setMetrics(data.policy.metrics);
        setVersionHistory(data.policy.versionHistory);
        setToast({
          type: "success",
          message: "Policy restored successfully to selected revision.",
        });
        return true;
      }
      return false;
    } catch {
      setToast({ type: "error", message: "Failed to restore policy revision." });
      return false;
    }
  };

  // Filter rules or categories if searchQuery is entered
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const filteredRules = useMemo(() => {
    if (!searchQuery.trim()) return rules;
    const q = searchQuery.toLowerCase().trim();
    return rules.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.triggerCondition.toLowerCase().includes(q) ||
        r.detectionSource.toLowerCase().includes(q)
    );
  }, [rules, searchQuery]);

  const filteredReasons = useMemo(() => {
    if (!searchQuery.trim()) return reasons;
    const q = searchQuery.toLowerCase().trim();
    return reasons.filter(
      (r) =>
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [reasons, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8 font-sans">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xl transition-all animate-in slide-in-from-bottom-2 ${
            toast.type === "success"
              ? "bg-[#10B981]"
              : toast.type === "error"
              ? "bg-[#EF4444]"
              : "bg-[#7956C9]"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Main Header Bar */}
      <ModerationHeader
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        userName={adminName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 4 KPI Cards */}
      <ModerationKpiCards metrics={metrics} />

      {/* Row 1: Left Global Moderation Settings + Right Moderation Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-5">
          <GlobalSettingsCard
            settings={globals}
            onChange={(updates) => setGlobals((prev) => ({ ...prev, ...updates }))}
          />
        </div>
        <div className="lg:col-span-7">
          <ModerationCategoriesGrid
            categories={filteredCategories}
            onToggleCategory={handleToggleCategory}
            onUpdateAction={handleUpdateCategoryAction}
          />
        </div>
      </div>

      {/* Row 2: Left Automatic Moderation Rules + Right Manual Review Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <AutomaticRulesCard
            rules={filteredRules}
            onToggleRule={handleToggleRule}
            onEditRule={(r) => setRuleModal({ isOpen: true, rule: r })}
            onDeleteRule={handleDeleteRule}
            onAddRule={() => setRuleModal({ isOpen: true, rule: null })}
          />
        </div>
        <div className="lg:col-span-4">
          <ManualReviewCard
            config={manualReview}
            onChange={(updates) => setManualReview((prev) => ({ ...prev, ...updates }))}
          />
        </div>
      </div>

      {/* Row 3: Left Rejection Reasons + Middle Unknown & Error Handling + Right Policy Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4">
          <RejectionReasonsCard
            reasons={filteredReasons}
            onAddReason={() => setReasonModal({ isOpen: true, reason: null })}
            onEditReason={(r) => setReasonModal({ isOpen: true, reason: r })}
            onToggleStatus={handleToggleReasonStatus}
          />
        </div>
        <div className="lg:col-span-4">
          <UnknownErrorHandlingCard
            config={errorHandling}
            onChange={(updates) =>
              setErrorHandling((prev) => ({ ...prev, ...updates }))
            }
          />
        </div>
        <div className="lg:col-span-4 md:col-span-2">
          <PolicyPreviewCard
            onOpenSimulator={() => setIsPreviewOpen(true)}
          />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <BottomActionBar
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onDiscard={handleDiscard}
        onViewHistory={() => setIsHistoryOpen(true)}
        onSave={handleSave}
      />

      {/* Modal 1: Add / Edit Rule */}
      <AddEditRuleModal
        isOpen={ruleModal.isOpen}
        onClose={() => setRuleModal({ isOpen: false, rule: null })}
        rule={ruleModal.rule}
        onSave={handleSaveRuleModal}
      />

      {/* Modal 2: Add / Edit Reason */}
      <AddEditReasonModal
        isOpen={reasonModal.isOpen}
        onClose={() => setReasonModal({ isOpen: false, reason: null })}
        reason={reasonModal.reason}
        onSave={handleSaveReasonModal}
      />

      {/* Modal 3: Policy Version History & Rollback */}
      <PolicyHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={versionHistory}
        currentVersion={globals.policyVersion}
        onRestore={handleRestoreRevision}
      />

      {/* Modal 4: Rule Flow Simulator & Policy Preview */}
      <RulePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        categories={categories}
        rules={rules}
      />
    </div>
  );
}
