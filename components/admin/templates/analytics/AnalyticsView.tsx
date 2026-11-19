"use client";

import React, { useState } from "react";
import {
  TemplateAnalyticsData,
  AnalyticsDateRange,
} from "@/lib/template-analytics";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsKpiCards } from "./AnalyticsKpiCards";
import { UsageOverTimeChart } from "./UsageOverTimeChart";
import { CategoryDistributionChart } from "./CategoryDistributionChart";
import { TopTemplatesTable } from "./TopTemplatesTable";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AnalyticsViewProps {
  initialData: TemplateAnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ initialData }) => {
  const [data, setData] = useState<TemplateAnalyticsData>(initialData);
  const [range, setRange] = useState<AnalyticsDateRange>(initialData.range);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleRangeChange = async (newRange: AnalyticsDateRange) => {
    setRange(newRange);
    try {
      const res = await fetch(`/api/admin/templates/analytics?range=${newRange}`);
      if (!res.ok) {
        showToast("Failed to refresh analytics for selected date range.", "error");
        return;
      }
      const updated = await res.json();
      setData(updated);
      showToast(`Analytics refreshed for ${newRange.toUpperCase()}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Network error.", "error");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/templates/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export", range }),
      });
      if (!res.ok) {
        showToast("Failed to generate analytics export report.", "error");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `posthub-template-analytics-${range}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast("Report exported successfully as CSV.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Export failed.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px 32px",
        minHeight: "100vh",
        backgroundColor: "var(--bg, #FAF7F2)",
      }}
      className="analytics-view-container"
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#FEF2F2" : "#F0FDF4",
            color: toast.type === "error" ? "#991B1B" : "#166534",
            border: `1px solid ${toast.type === "error" ? "#FCA5A5" : "#BBF7D0"}`,
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 150,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13.5px",
            fontWeight: 500,
          }}
        >
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <AnalyticsHeader
        range={range}
        onRangeChange={handleRangeChange}
        onExport={handleExport}
        isExporting={isExporting}
        adminName="Parth Patel"
        adminRole="Administrator"
      />

      {/* Summary KPI Cards */}
      <AnalyticsKpiCards kpis={data.kpis} />

      {/* Charts Middle Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "20px",
          alignItems: "stretch",
        }}
        className="analytics-charts-grid"
      >
        <UsageOverTimeChart data={data.timeSeries} />
        <CategoryDistributionChart distribution={data.categoryDistribution} />
      </div>

      {/* Top Performing Templates Table */}
      <TopTemplatesTable
        templates={data.topTemplates}
        totalTemplates={data.kpis.activeTemplates}
      />

      <style jsx global>{`
        @media (max-width: 1024px) {
          .analytics-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .analytics-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .analytics-kpi-grid {
            grid-template-columns: 1fr !important;
          }
          .analytics-view-container {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

