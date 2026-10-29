import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDesignSystemConfig } from "@/lib/design-system";
import { SpacingTokensEditorView } from "@/components/admin/design-system/spacing/SpacingTokensEditorView";

export const dynamic = "force-dynamic";

export default async function AdminSpacingTokensPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const config = getDesignSystemConfig();

  return <SpacingTokensEditorView initialConfig={config} />;
}

