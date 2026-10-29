import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTemplates } from "@/lib/templates-storage";
import { TemplatesView } from "@/components/admin/templates/TemplatesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Templates Management Dashboard | Post Hub Admin",
  description: "Browse, filter, create, and manage poster templates, categories, assets and publishing status.",
};

export default async function AdminTemplatesPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/admin/login");
  }

  const templates = getTemplates();

  return <TemplatesView initialTemplates={templates} />;
}
