import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTokenUsageData } from "@/lib/token-usage";
import { TokenUsageView } from "@/components/admin/design-system/usage/TokenUsageView";

export const dynamic = "force-dynamic";

export default async function AdminTokenUsagePage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const { summary, tokens } = getTokenUsageData();

  return <TokenUsageView initialTokens={tokens} initialSummary={summary} />;
}
