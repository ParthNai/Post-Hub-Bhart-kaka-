import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDesignSystemConfig } from "@/lib/design-system";
import { DesignSystemView } from "@/components/admin/design-system/DesignSystemView";

export const dynamic = "force-dynamic";

export default async function AdminDesignSystemPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const config = getDesignSystemConfig();

  return <DesignSystemView initialConfig={config} />;
}

