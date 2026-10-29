"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { TopHeader } from "@/components/admin/TopHeader";
import { MetricCards } from "@/components/admin/MetricCards";
import { PlatformActivityChart } from "@/components/admin/PlatformActivityChart";
import { AiGenerationChart } from "@/components/admin/AiGenerationChart";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { QuickActions } from "@/components/admin/QuickActions";
import { SystemStatus } from "@/components/admin/SystemStatus";
import { DashboardDataResponse, ChartDataPoint } from "@/app/api/admin/dashboard/route";

interface DashboardViewProps {
  initialData: DashboardDataResponse;
  adminName?: string;
  adminEmail?: string;
  onMenuToggle?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialData,
  adminName = "Admin Workspace",
  adminEmail = "admin@posthub.io",
  onMenuToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [chartPoints, setChartPoints] = useState<ChartDataPoint[]>(
    initialData.platformActivity.points
  );

  // Client-side search filtering of activity list
  const filteredActivities = searchQuery
    ? initialData.recentActivities.filter(
        (act) =>
          act.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          act.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          act.timeAgo.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : initialData.recentActivities;

  const handleRangeChange = async (range: "7d" | "30d" | "90d") => {
    setTimeRange(range);
    try {
      const res = await fetch(`/api/admin/dashboard?timeRange=${range}`);
      if (res.ok) {
        const data: DashboardDataResponse = await res.json();
        setChartPoints(data.platformActivity.points);
      }
    } catch {
      // Retain current points on fetch error
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Top Header */}
      <TopHeader
        title="Dashboard"
        subtitle="Your Post Hub workspace at a glance."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Dashboard", href: "/admin/dashboard" },
        ]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuToggle={onMenuToggle}
        adminName={adminName}
        adminEmail={adminEmail}
      />

      {/* Main Dashboard Workspace Body */}
      <main
        style={{
          flex: 1,
          padding: "8px 36px 40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
        }}
        className="dashboard-main-content"
      >
        {/* Welcome Banner Row */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            padding: "8px 0 4px 0",
          }}
          className="welcome-banner-section"
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.025em",
                margin: "0 0 6px 0",
              }}
            >
              Welcome to Post Hub
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Manage your creative platform, content, and AI services from one place.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {/* Date Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              <CalendarIcon size={15} style={{ color: "var(--text-muted)" }} />
              <span>{initialData.dateLabel || "Oct 25, 2025"}</span>
            </div>

            {/* View App Overview Button */}
            <Link
              href="/admin/app-screens"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--primary)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "9px 18px",
                fontSize: "13.5px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background-color 0.15s ease",
                boxShadow: "0 2px 8px rgba(121, 86, 201, 0.2)",
              }}
              className="overview-action-btn"
            >
              <span>View App Overview</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* 1. Metric Cards (4 cards) */}
        <section aria-label="Dashboard Overview Metrics">
          <MetricCards
            metrics={initialData.metrics}
            realDbUserCount={initialData.realDbUserCount}
          />
        </section>

        {/* 2. Middle Row: Platform Activity & AI Generation Overview */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "20px",
          }}
          className="charts-grid-row"
          aria-label="Platform Analytics Charts"
        >
          <div>
            <PlatformActivityChart
              initialRange={timeRange}
              onRangeChange={handleRangeChange}
              points={chartPoints}
            />
          </div>

          <div>
            <AiGenerationChart
              totalFormatted={initialData.aiGenerationOverview.totalFormatted}
              categories={initialData.aiGenerationOverview.categories}
            />
          </div>
        </section>

        {/* 3. Bottom Row: Recent Activity, Quick Actions, System Status */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: "20px",
          }}
          className="bottom-grid-row"
          aria-label="Recent Activity and Quick Actions"
        >
          <div>
            <RecentActivity
              activities={filteredActivities}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          </div>

          <div>
            <QuickActions />
          </div>

          <div>
            <SystemStatus />
          </div>
        </section>
      </main>

      <style jsx global>{`
        .overview-action-btn:hover {
          background-color: var(--primary-hover) !important;
        }
        @media (max-width: 1200px) {
          .charts-grid-row {
            grid-template-columns: 1fr !important;
          }
          .bottom-grid-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .dashboard-main-content {
            padding: 8px 20px 32px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};
