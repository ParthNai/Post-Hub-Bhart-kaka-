import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDesignSystemConfig } from "@/lib/design-system";
import { ColorTokensEditorView } from "@/components/admin/design-system/colors/ColorTokensEditorView";

export const dynamic = "force-dynamic";

export default async function AdminColorTokensPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const config = getDesignSystemConfig();

  return <ColorTokensEditorView initialConfig={config} />;
}
