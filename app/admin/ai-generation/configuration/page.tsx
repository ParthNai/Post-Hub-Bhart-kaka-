import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getAiProviderFullConfig,
  getAiConfigHistory,
} from "@/lib/ai-generation-storage";
import { SUPPORTED_AI_MODELS } from "@/lib/ai-generation";
import { ProviderConfigView } from "@/components/admin/ai-generation/configuration/ProviderConfigView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Provider & Model Configuration | Post Hub Admin Panel",
  description: "Configure AI image-generation services, manage model settings and verify provider connectivity.",
};

export default async function ProviderConfigurationPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const initialConfig = getAiProviderFullConfig();
  const initialHistory = getAiConfigHistory();

  return (
    <ProviderConfigView
      initialConfig={initialConfig}
      models={SUPPORTED_AI_MODELS}
      initialHistory={initialHistory}
      adminName={session.name || "Parth Patel"}
      adminRole={session.role === "superadmin" ? "Super Administrator" : "Administrator"}
    />
  );
}

