"use client";

import { AiSubscreenNav } from "../AiSubscreenNav";

import React, { useState, useMemo } from "react";
import { AuditHeader } from "./AuditHeader";
import { AuditSummaryCards } from "./AuditSummaryCards";
import { AuditFiltersToolbar } from "./AuditFiltersToolbar";
import { TransactionLedgerTable } from "./TransactionLedgerTable";
import { AuditHistoryTable } from "./AuditHistoryTable";
import { TransactionDetailsDrawer } from "./TransactionDetailsDrawer";
import {
  generateAuditReportCsv,
  type AuditDataset,
  type DetailedCreditTransaction,
} from "@/lib/ai-audit";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface AuditViewProps {
  initialDataset: AuditDataset;
  adminName?: string;
  adminRole?: string;
}

export function AuditView({
  initialDataset,
  adminName = "Admin Panel",
}: AuditViewProps) {
  const [dataset, setDataset] = useState<AuditDataset>(initialDataset);

  // By default, select TXN-8F20 to match the reference photo layout
  const defaultSelectedTx =
    dataset.transactions.find((t) => t.id === "TXN-8F20") ||
    dataset.transactions[0] ||
    null;
  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedCreditTransaction | null>(defaultSelectedTx);

  // Filters state
  const [searchId, setSearchId] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");

  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    return dataset.transactions.filter((t) => {
      if (searchId.trim() && !t.id.toLowerCase().includes(searchId.toLowerCase().trim())) {
        return false;
      }
      if (
        searchUser.trim() &&
        !t.userName.toLowerCase().includes(searchUser.toLowerCase().trim()) &&
        !t.userId.toLowerCase().includes(searchUser.toLowerCase().trim())
      ) {
        return false;
      }
      if (selectedType !== "All Types" && t.transactionType !== selectedType) {
        return false;
      }
      if (
        selectedStatus !== "All Statuses" &&
        selectedStatus !== "All Status" &&
        t.status !== selectedStatus
      ) {
        return false;
      }
      if (selectedSource !== "All Sources" && t.source !== selectedSource) {
        return false;
      }
      return true;
    });
  }, [dataset.transactions, searchId, searchUser, selectedType, selectedStatus, selectedSource]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchId("");
    setSearchUser("");
    setSelectedType("All Types");
    setSelectedStatus("All Statuses");
    setSelectedSource("All Sources");
    setSelectedDateRange("All Time");
    showToast("Filters reset to default view.", "info");
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/ai-generation/audit");
      if (!res.ok) throw new Error("Failed to refresh audit data.");
      const json = await res.json();
      if (json.success && json.data) {
        setDataset(json.data);
        showToast("Credit transactions and audit trail refreshed.", "success");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error refreshing data.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export audit report CSV
  const handleExportReport = () => {
    try {
      setIsExporting(true);
      const csv = generateAuditReportCsv(dataset.auditEvents, dataset.transactions);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `posthub-credit-audit-report-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Audit report CSV exported successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to export report", "error");
    } finally {
      setIsExporting(false);
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
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
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
      <AuditHeader
        onExportReport={handleExportReport}
        onRefresh={handleRefresh}
        onToggleFilters={() => {
          const el = document.getElementById("audit-filters");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
        userName={adminName}
      />

      {/* Sub-screens Navigation Ribbon */}
      <AiSubscreenNav />

      {/* 4 Summary Cards */}
      <AuditSummaryCards summary={dataset.summary} />

      {/* Filters Toolbar */}
      <div id="audit-filters">
        <AuditFiltersToolbar
          searchId={searchId}
          onSearchIdChange={setSearchId}
          searchUser={searchUser}
          onSearchUserChange={setSearchUser}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Main Content: Left Tables + Right Details Panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Tables (Ledger + Administrative Audit) */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          <TransactionLedgerTable
            transactions={filteredTransactions}
            selectedTransactionId={selectedTransaction?.id}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          />

          <AuditHistoryTable events={dataset.auditEvents} />
        </div>

        {/* Right Details Drawer */}
        {selectedTransaction && (
          <TransactionDetailsDrawer
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </div>
    </div>
  );
}
