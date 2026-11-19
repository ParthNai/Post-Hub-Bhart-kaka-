import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCreditDataset } from "@/lib/ai-credits-storage";
import { CreditPlansView } from "@/components/admin/ai-generation/credits/CreditPlansView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Credit Plans & User Allocation | Post Hub Admin Panel",
  description:
    "Configure generation credits, manage user balances and review credit transactions.",
};

export default async function CreditPlansPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const dataset = getCreditDataset();

  return (
    <CreditPlansView
      initialDataset={dataset}
      adminName={session.name || "JD Admin"}
      adminRole={
        session.role === "superadmin" ? "Super Administrator" : "Administrator"
      }
    />
  );
}
