import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { queryAiRequests, getAiGenerationSettings } from "@/lib/ai-generation-storage";
import { AiGenerationView } from "@/components/admin/ai-generation/AiGenerationView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Image Generation | Post Hub Admin Panel",
  description: "Monitor generation requests, manage AI services and review image-generation activity.",
};

export default async function AiGenerationPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const initialData = queryAiRequests({ page: 1, pageSize: 5 });
  const initialSettings = getAiGenerationSettings();

  return (
    <AiGenerationView
      initialData={initialData}
      initialSettings={initialSettings}
      adminName={session.name || "Parth Patel"}
    />
  );
}

