import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  queryQueueItems,
  getQueueMetrics,
  getQueueOverview,
  getQueueSettings,
} from "@/lib/ai-queue-storage";
import { QueueMonitorView } from "@/components/admin/ai-generation/queue/QueueMonitorView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Generation Queue Monitor | Post Hub Admin Panel",
  description:
    "Monitor image-generation requests, processing activity and request failures.",
};

export default async function QueueMonitorPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const result = queryQueueItems({ page: 1, pageSize: 4, sortBy: "newest" });
  const metrics = getQueueMetrics();
  const overview = getQueueOverview();
  const settings = getQueueSettings();

  return (
    <QueueMonitorView
      initialItems={result.items}
      initialFailedItems={result.failedItems}
      initialMetrics={metrics}
      initialOverview={overview}
      initialSettings={settings}
      initialTotal={result.total}
      initialPage={result.page}
      initialPageSize={result.pageSize}
      initialTotalPages={result.totalPages}
      adminName={session.name || "Parth Patel"}
      adminRole={session.role === "superadmin" ? "Super Administrator" : "Administrator"}
    />
  );
}

