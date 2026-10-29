import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDesignSystemConfig } from "@/lib/design-system";
import { ExportImportView } from "@/components/admin/design-system/export-import/ExportImportView";

export const dynamic = "force-dynamic";

export default async function AdminExportImportPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const config = getDesignSystemConfig();

  return <ExportImportView initialConfig={config} />;
}
