import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getVersionHistoryData } from "@/lib/version-history";
import { HistoryView } from "@/components/admin/design-system/history/HistoryView";

export const dynamic = "force-dynamic";

export default async function AdminChangeHistoryPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const { summary, records } = getVersionHistoryData();

  return <HistoryView initialRecords={records} initialSummary={summary} />;
}
