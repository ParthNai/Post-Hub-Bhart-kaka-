"use client";

import React, { useState } from "react";
import { CreditPlansHeader } from "./CreditPlansHeader";
import { CreditSummaryCards } from "./CreditSummaryCards";
import { CreditPlansTable } from "./CreditPlansTable";
import { UserCreditAllocationTable } from "./UserCreditAllocationTable";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { AllocateCreditsDrawer } from "./AllocateCreditsDrawer";
import { CreateEditPlanModal } from "./CreateEditPlanModal";
import { CreditSettingsModal } from "./CreditSettingsModal";
import { AllTransactionsModal } from "./AllTransactionsModal";
import {
  generateTransactionsCsv,
  type CreditDataset,
  type CreditPlan,
  type UserCreditAccount,
  type CreditSettings,
} from "@/lib/ai-credits";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface CreditPlansViewProps {
  initialDataset: CreditDataset;
  adminName?: string;
  adminRole?: string;
}

export function CreditPlansView({
  initialDataset,
  adminName = "Parth Patel",
}: CreditPlansViewProps) {
  const [dataset, setDataset] = useState<CreditDataset>(initialDataset);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserForAllocation, setSelectedUserForAllocation] =
    useState<UserCreditAccount | null>(null);

  // Modals state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<CreditPlan | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  // Open Drawer for a specific user
  const handleSelectUserForAllocation = (user: UserCreditAccount) => {
    setSelectedUserForAllocation(user);
    setIsDrawerOpen(true);
  };

  // 1. Allocate Credits Action
  const handleAllocateCredits = async (params: {
    userId: string;
    source: "Promotional Credits" | "Admin Granted";
    amount: number;
    expiryDate?: string;
    reason: string;
  }) => {
    const idempotencyKey = `alloc-${params.userId}-${Date.now()}`;
    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "allocate-credits",
        ...params,
        idempotencyKey,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to allocate credits.");
    }

    const { transaction, user: updatedUser, summary } = json.data;

    // Update local state atomically
    setDataset((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.userId === updatedUser.userId ? updatedUser : u)),
      transactions: [transaction, ...prev.transactions],
      summary,
    }));

    showToast(`Successfully allocated ${params.amount} credits to ${updatedUser.name}!`, "success");
  };

  // 2. Create / Edit Credit Plan
  const handleSavePlan = async (data: Omit<CreditPlan, "id" | "createdAt" | "updatedAt">) => {
    const action = planToEdit ? "update-plan" : "create-plan";
    const payload = planToEdit ? { action, id: planToEdit.id, updates: data } : { action, ...data };

    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to save credit plan.");
    }

    if (json.dataset) {
      setDataset(json.dataset);
    }
    showToast(`Credit plan "${data.name}" saved successfully!`, "success");
  };

  // 3. Duplicate Plan
  const handleDuplicatePlan = async (planId: string) => {
    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate-plan", id: planId }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      showToast(json.error || "Failed to duplicate plan.", "error");
      return;
    }

    if (json.dataset) {
      setDataset(json.dataset);
    }
    showToast("Credit plan duplicated as Draft.", "info");
  };

  // 4. Toggle Plan Status
  const handleTogglePlanStatus = async (planId: string) => {
    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-plan-status", id: planId }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      showToast(json.error || "Failed to toggle status.", "error");
      return;
    }

    if (json.dataset) {
      setDataset(json.dataset);
    }
    showToast("Credit plan status updated.", "info");
  };

  // 5. Archive Plan
  const handleArchivePlan = async (planId: string) => {
    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive-plan", id: planId }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      showToast(json.error || "Failed to archive plan.", "error");
      return;
    }

    if (json.dataset) {
      setDataset(json.dataset);
    }
    showToast("Credit plan archived.", "info");
  };

  // 6. Save Settings
  const handleSaveSettings = async (settings: Partial<CreditSettings>) => {
    const res = await fetch("/api/admin/ai-generation/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-settings", settings }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update credit settings.");
    }

    if (json.dataset) {
      setDataset(json.dataset);
    }
    showToast("Credit settings updated successfully.", "success");
  };

  // 7. Export Transactions CSV
  const handleExportTransactions = () => {
    try {
      setIsExporting(true);
      const csv = generateTransactionsCsv(dataset.transactions);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `posthub-credit-transactions-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Transaction ledger CSV exported successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to export CSV", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "success"
              ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
              : toast.type === "error"
              ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
              : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />}
          {toast.type === "info" && <Info className="w-4 h-4 shrink-0 text-[#3B82F6]" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded hover:bg-black/5 text-current/70 hover:text-current ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <CreditPlansHeader
        onExportTransactions={handleExportTransactions}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onCreatePlan={() => {
          setPlanToEdit(null);
          setIsPlanModalOpen(true);
        }}
        userName={adminName}
        isExporting={isExporting}
      />

      {/* 4 Summary Cards */}
      <CreditSummaryCards summary={dataset.summary} />

      {/* Credit Plans Table */}
      <CreditPlansTable
        plans={dataset.plans}
        onEditPlan={(plan) => {
          setPlanToEdit(plan);
          setIsPlanModalOpen(true);
        }}
        onDuplicatePlan={handleDuplicatePlan}
        onToggleStatus={handleTogglePlanStatus}
        onArchivePlan={handleArchivePlan}
      />

      {/* User Credit Allocation Table */}
      <UserCreditAllocationTable
        users={dataset.users}
        onSelectUserForAllocation={handleSelectUserForAllocation}
        onViewUserTransactions={() => setIsTransactionsModalOpen(true)}
      />

      {/* Recent Credit Transactions Table */}
      <RecentTransactionsTable
        transactions={dataset.transactions}
        onViewAll={() => setIsTransactionsModalOpen(true)}
      />

      {/* Slide-out Drawer: Allocate Credits */}
      <AllocateCreditsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        users={dataset.users}
        selectedUser={selectedUserForAllocation}
        onSelectUser={setSelectedUserForAllocation}
        onAllocateCredits={handleAllocateCredits}
      />

      {/* Modal 1: Create / Edit Credit Plan */}
      <CreateEditPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setPlanToEdit(null);
        }}
        plan={planToEdit}
        onSave={handleSavePlan}
      />

      {/* Modal 2: Credit Settings */}
      <CreditSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={dataset.settings}
        onSave={handleSaveSettings}
      />

      {/* Modal 3: All Transactions Ledger */}
      <AllTransactionsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        transactions={dataset.transactions}
        onExportCsv={handleExportTransactions}
      />
    </div>
  );
}
