import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAuditDataset } from "@/lib/ai-audit-storage";
import { AuditView } from "@/components/admin/ai-generation/audit/AuditView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Credit Transactions & Audit Trail | Post Hub Admin Panel",
  description:
    "Inspect credit movements, verify transaction history and review administrative actions.",
};

export default async function CreditAuditTrailPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const dataset = getAuditDataset();

  return (
    <AuditView
      initialDataset={dataset}
      adminName={session.name || "Admin Panel"}
      adminRole={
        session.role === "superadmin" ? "Super Administrator" : "Administrator"
      }
    />
  );
}
