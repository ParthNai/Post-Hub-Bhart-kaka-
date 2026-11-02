import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getAllPresets,
  getGlobalRules,
  getPresetMetrics,
} from "@/lib/ai-presets-storage";
import { PresetsView } from "@/components/admin/ai-generation/presets/PresetsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Prompt Rules & Preset Management | Post Hub Admin Panel",
  description:
    "Manage reusable AI poster styles, prompt instructions and generation presets.",
};

export default async function PresetsManagementPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const initialPresets = getAllPresets();
  const initialRules = getGlobalRules();
  const initialMetrics = getPresetMetrics(initialPresets);

  return (
    <PresetsView
      initialPresets={initialPresets}
      initialRules={initialRules}
      initialMetrics={initialMetrics}
      adminName={session.name || "Parth Patel"}
      adminRole={session.role === "superadmin" ? "Super Administrator" : "Administrator"}
    />
  );
}
