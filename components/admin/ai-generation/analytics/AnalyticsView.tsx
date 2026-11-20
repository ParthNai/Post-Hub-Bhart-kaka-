"use client";

import { AiSubscreenNav } from "../AiSubscreenNav";

import React, { useState } from "react";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsKpiCards } from "./AnalyticsKpiCards";
import { UsageTrendsChart } from "./UsageTrendsChart";
import { CreditConsumptionChart } from "./CreditConsumptionChart";
import { ProviderCostTable } from "./ProviderCostTable";
import { UserUsageTable } from "./UserUsageTable";
import { BreakdownDonuts } from "./BreakdownDonuts";
import { BudgetLimitsCard } from "./BudgetLimitsCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { BudgetSettingsModal } from "./BudgetSettingsModal";
import { BillingSummaryModal } from "./BillingSummaryModal";
import {
  generateAnalyticsUsageCsv,
  generateBillingSummaryCsv,
  type AiAnalyticsDataset,
} from "@/lib/ai-analytics";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface AnalyticsViewProps {
  initialDataset: AiAnalyticsDataset;
  adminName?: string;
  adminRole?: string;
}

export function AnalyticsView({
  initialDataset,
  adminName = "Parth Patel",
}: AnalyticsViewProps) {
  const [dataset, setDataset] = useState<AiAnalyticsDataset>(initialDataset);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  // Switch time range & reload data
  const handleTimeRangeChange = async (range: string) => {
    setTimeRange(range);
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/ai-generation/analytics?range=${range}`);
      if (!res.ok) throw new Error("Failed to load analytics data for the selected range");
      const json = await res.json();
      if (json.success && json.data) {
        setDataset(json.data);
        showToast(`Analytics updated for ${range.toUpperCase()} period.`, "info");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating range", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh Analytics
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/ai-generation/analytics?range=${timeRange}&refresh=true`);
      if (!res.ok) throw new Error("Failed to refresh analytics");
      const json = await res.json();
      if (json.success && json.data) {
        setDataset(json.data);
        showToast("Analytics data refreshed successfully.", "success");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error refreshing analytics", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      setIsExporting(true);
      const csvContent = generateAnalyticsUsageCsv(
        dataset.usageTrends,
        dataset.providerCosts,
        dataset.userUsage
      );
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `posthub-ai-usage-analytics-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("CSV analytics report downloaded successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to export CSV", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Export Detailed Usage Report
  const handleExportUsageReport = () => {
    try {
      setIsExporting(true);
      const reportData = {
        title: "Post Hub AI Generation Usage & Cost Comprehensive Report",
        generatedAt: new Date().toISOString(),
        timeRange,
        overview: dataset.overview,
        budget: dataset.budget,
        breakdown: dataset.breakdown,
        providers: dataset.providerCosts,
        topUsers: dataset.userUsage,
        trends: dataset.usageTrends,
        creditConsumption: dataset.creditConsumption,
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `posthub-ai-usage-full-report-${timeRange}-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Comprehensive usage report downloaded successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to export report", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Export Billing Summary CSV
  const handleDownloadBillingCsv = () => {
    try {
      const csv = generateBillingSummaryCsv(dataset.budget, dataset.providerCosts);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `posthub-ai-billing-summary-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Billing statement CSV downloaded successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to download billing CSV", "error");
    }
  };

  // Save budget configuration
  const handleSaveBudget = async (newBudget: number, newThreshold: number) => {
    const res = await fetch("/api/admin/ai-generation/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-budget",
        configuredBudget: newBudget,
        alertThreshold: newThreshold,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update budget settings");
    }

    if (json.data) {
      setDataset((prev) => ({
        ...prev,
        budget: json.data,
      }));
    }
    showToast("Budget & usage limits updated successfully.", "success");
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

      {/* Top Header */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExportCsv={handleExportCsv}
        onExportUsageReport={handleExportUsageReport}
        onExportBillingSummary={() => setIsBillingModalOpen(true)}
        userName={adminName}
      />

      {/* Sub-screens Navigation Ribbon */}
      <AiSubscreenNav />

      {/* 4 Top KPI Cards */}
      <AnalyticsKpiCards overview={dataset.overview} />

      {/* Row 1: Charts (Usage Trends & Credit Consumption) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageTrendsChart data={dataset.usageTrends} />
        <CreditConsumptionChart data={dataset.creditConsumption} />
      </div>

      {/* Row 2: Data Tables (Provider Cost Breakdown & User Usage Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProviderCostTable providers={dataset.providerCosts} />
        <UserUsageTable users={dataset.userUsage} />
      </div>

      {/* Row 3: Visual Breakdown & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Format & Category Breakdown (4 Donut Charts) */}
        <BreakdownDonuts breakdown={dataset.breakdown} />

        {/* Right: Budget Limits Card + Quick Actions Card stacked */}
        <div className="flex flex-col gap-6">
          <BudgetLimitsCard
            budget={dataset.budget}
            onConfigureBudget={() => setIsBudgetModalOpen(true)}
          />
          <QuickActionsCard
            onExportCsv={handleExportCsv}
            onExportUsageReport={handleExportUsageReport}
            onBillingSummary={() => setIsBillingModalOpen(true)}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Modals */}
      <BudgetSettingsModal
        budget={dataset.budget}
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
      />

      <BillingSummaryModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        budget={dataset.budget}
        providers={dataset.providerCosts}
        onDownloadCsv={handleDownloadBillingCsv}
      />
    </div>
  );
}
