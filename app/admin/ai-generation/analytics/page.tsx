import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAiAnalytics } from "@/lib/ai-analytics-storage";
import { AnalyticsView } from "@/components/admin/ai-generation/analytics/AnalyticsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Generation Usage, Credits & Cost Analytics | Post Hub Admin Panel",
  description:
    "Monitor image-generation consumption, credit usage and actual AI provider costs.",
};

export default async function AiAnalyticsPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const dataset = getAiAnalytics("30d");

  return (
    <AnalyticsView
      initialDataset={dataset}
      adminName={session.name || "JD Admin"}
      adminRole={
        session.role === "superadmin" ? "Super Administrator" : "Administrator"
      }
    />
  );
}
