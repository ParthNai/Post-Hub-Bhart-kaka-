import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getGovernanceSettings } from "@/lib/governance-storage";
import { GovernanceSettingsView } from "@/components/admin/design-system/settings/GovernanceSettingsView";

export const dynamic = "force-dynamic";

export default async function AdminGovernanceSettingsPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const settings = getGovernanceSettings();

  return <GovernanceSettingsView initialSettings={settings} />;
}
