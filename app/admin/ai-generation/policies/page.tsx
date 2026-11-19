import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getModerationPolicy } from "@/lib/ai-moderation-storage";
import { ModerationView } from "@/components/admin/ai-generation/moderation/ModerationView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Image Moderation Rules & Policy Configuration | Post Hub Admin Panel",
  description:
    "Configure image safety checks, moderation decisions and manual review requirements.",
};

export default async function ModerationPoliciesPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const policy = getModerationPolicy();

  return (
    <ModerationView
      initialPolicy={policy}
      adminName={session.name || "Parth Patel"}
      adminRole={
        session.role === "superadmin" ? "Super Administrator" : "Administrator"
      }
    />
  );
}
